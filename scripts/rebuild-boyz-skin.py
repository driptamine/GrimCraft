#!/usr/bin/env python3
"""Rebuild destroyed skinning in models/orks/infantry/boyz.glb.

The file ships geometry with JOINTS_0/WEIGHTS_0 attributes, but every vertex
is pinned 100% to a single joint slot and the skins[] block (plus node skin
bindings) is missing, so no clip (run_1 included) can deform the body.

The fix rebinds every vertex to its two nearest bone segments with
distance-blended weights, writes fresh JOINTS_0/WEIGHTS_0 data, appends one
skins[] entry (inverse bind matrices from the rest pose) and points every
mesh node at it.

Bone set: bip01* hierarchy bones plus bone_ear_*/bone_ork_plume_* helpers,
in depth-first order from 'bip01 pelvis'. Attachment markers are excluded.

Idempotent: refuses to run when the file already has skins[] unless
--force is given.

Usage:
    python3 scripts/rebuild-boyz-skin.py [--force]
"""

import json
import struct
import sys

PATH = 'models/orks/infantry/boyz.glb'
# Variant meshes stay in the file but hidden: the loader (loadGltf) turns
# nodes with extras.hidden into visible=false, and no clip carries visibility
# tracks that would switch them back on. Nothing is deleted.
HIDDEN_MESHES = {
    'ork_flag', 'ork_flag_pole',
    'boyz_helmet',
    'boyz_rokkit_launcha', 'boyz_rokkit',
    'boyz_legs_burna',
    'boyz_helmet_spiked', 'boyz_helmet_cage',
    'boyz_big_shoota', 'boyz_big_shoota_ammo',
    'boyz_burna', 'boyz_burna_goggles', 'boyz_burna_bakpak',
}
# Attachments stay 100% rigid like the original nobz/grot skins (weapons are
# single-bone there); body meshes get a 2-bone blend snapped to rigid when
# one bone clearly wins, mirroring the ~70% rigid split of Grot_Body.
RIGID_MESHES = {
    'boyz_big_shoota', 'boyz_big_shoota_ammo', 'boyz_burna',
    'boyz_burna_bakpak', 'boyz_burna_goggles', 'boyz_choppa_axe',
    'boyz_rokkit', 'boyz_rokkit_launcha', 'boyz_slugga', 'boyz_stick_bom',
    'ork_flag', 'ork_flag_pole',
    'boyz_head', 'boyz_helmet', 'boyz_helmet_cage', 'boyz_helmet_spiked',
    'boyz_plume', 'boyz_shoulderarmour_spiked_l', 'boyz_backplate',
    'boyz_backarmour_flat', 'boyz_skullbeltbuckle',
}
RIGID_SNAP = 0.8
TYPE_COUNTS = {'SCALAR': 1, 'VEC2': 2, 'VEC3': 3, 'VEC4': 4, 'MAT4': 16}
FMT = {5121: 'B', 5122: 'h', 5123: 'H', 5125: 'I', 5126: 'f'}


def load_glb(path):
    with open(path, 'rb') as f:
        data = f.read()
    assert data[:4] == b'glTF', f'{path}: not a GLB'
    json_len, json_type = struct.unpack('<II', data[12:20])
    assert json_type == 0x4E4F534A, f'{path}: first chunk is not JSON'
    doc = json.loads(data[20:20 + json_len].decode('utf-8'))
    offset = 20 + json_len
    chunks = []
    while offset < len(data):
        clen, ctype = struct.unpack('<II', data[offset:offset + 8])
        chunks.append((ctype, data[offset + 8:offset + 8 + clen]))
        offset += 8 + clen
    bins = [c for t, c in chunks if t == 0x004E4942]
    assert len(bins) == 1, f'{path}: expected exactly one BIN chunk'
    return doc, bins[0]


def save_glb(path, doc, binary):
    json_bytes = json.dumps(doc, ensure_ascii=False, separators=(',', ':')).encode('utf-8')
    json_bytes += b' ' * (-len(json_bytes) % 4)
    binary += b'\x00' * (-len(binary) % 4)
    total = 12 + 8 + len(json_bytes) + 8 + len(binary)
    with open(path, 'wb') as f:
        f.write(struct.pack('<III', 0x46546C67, 2, total))
        f.write(struct.pack('<II', len(json_bytes), 0x4E4F534A))
        f.write(json_bytes)
        f.write(struct.pack('<II', len(binary), 0x004E4942))
        f.write(binary)


def read_accessor(doc, binary, index):
    acc = doc['accessors'][index]
    view = doc['bufferViews'][acc['bufferView']]
    assert view.get('byteStride') is None, f'accessor {index}: interleaved data unsupported'
    start = view.get('byteOffset', 0) + acc.get('byteOffset', 0)
    count = acc['count'] * TYPE_COUNTS[acc['type']]
    f = FMT[acc['componentType']]
    size = struct.calcsize(f)
    return list(struct.unpack(f'<{count}{f}', binary[start:start + count * size]))


def write_accessor_in_place(doc, binary, index, values):
    acc = doc['accessors'][index]
    view = doc['bufferViews'][acc['bufferView']]
    assert view.get('byteStride') is None
    start = view.get('byteOffset', 0) + acc.get('byteOffset', 0)
    count = acc['count'] * TYPE_COUNTS[acc['type']]
    assert len(values) == count, f'accessor {index}: count mismatch'
    f = FMT[acc['componentType']]
    raw = struct.pack(f'<{count}{f}', *values)
    return binary[:start] + raw + binary[start + len(raw):]


def append_floats(doc, binary, floats, type_):
    raw = struct.pack(f'<{len(floats)}f', *floats)
    offset = len(binary)
    binary += raw
    view_index = len(doc['bufferViews'])
    doc['bufferViews'].append({'buffer': 0, 'byteOffset': offset, 'byteLength': len(raw)})
    count = len(floats) // TYPE_COUNTS[type_]
    comps = TYPE_COUNTS[type_]
    flat = [min(floats[i::comps]) for i in range(comps)]
    fmax = [max(floats[i::comps]) for i in range(comps)]
    doc['accessors'].append({
        'bufferView': view_index, 'byteOffset': 0, 'componentType': 5126,
        'count': count, 'type': type_, 'min': flat, 'max': fmax,
    })
    return len(doc['accessors']) - 1, binary


def quat_to_mat(t, r, s):
    x, y, z, w = r
    m = [[0.0] * 4 for _ in range(4)]
    m[0][0] = 1 - 2 * (y * y + z * z)
    m[0][1] = 2 * (x * y - z * w)
    m[0][2] = 2 * (x * z + y * w)
    m[1][0] = 2 * (x * y + z * w)
    m[1][1] = 1 - 2 * (x * x + z * z)
    m[1][2] = 2 * (y * z - x * w)
    m[2][0] = 2 * (x * z - y * w)
    m[2][1] = 2 * (y * z + x * w)
    m[2][2] = 1 - 2 * (x * x + y * y)
    for i in range(3):
        for j in range(3):
            m[i][j] *= s[j]
    m[0][3], m[1][3], m[2][3] = t
    m[3][3] = 1.0
    return m


def mat_mul(a, b):
    return [[sum(a[i][k] * b[k][j] for k in range(4)) for j in range(4)] for i in range(4)]


def mat_inv(m):
    n = 4
    a = [row[:] + [1.0 if i == j else 0.0 for j in range(n)] for i, row in enumerate(m)]
    for col in range(n):
        piv = max(range(col, n), key=lambda r: abs(a[r][col]))
        assert abs(a[piv][col]) > 1e-12, 'singular matrix'
        a[col], a[piv] = a[piv], a[col]
        div = a[col][col]
        a[col] = [v / div for v in a[col]]
        for r in range(n):
            if r != col:
                f = a[r][col]
                a[r] = [rv - f * cv for rv, cv in zip(a[r], a[col])]
    return [row[n:] for row in a]


def is_bone(name):
    return bool(name) and (name.startswith('bip01') or name.startswith('bone_'))


def main():
    force = '--force' in sys.argv
    doc, binary = load_glb(PATH)
    if doc.get('skins') and not force:
        print(f'{PATH}: already has skins[], skipping (use --force to rebuild)')
        return

    nodes = doc['nodes']
    children_of = {i: n.get('children', []) for i, n in enumerate(nodes)}
    parent = {}
    for i, chs in children_of.items():
        for c in chs:
            parent[c] = i

    def world(i):
        n = nodes[i]
        m = quat_to_mat(
            n.get('translation', [0, 0, 0]),
            n.get('rotation', [0, 0, 0, 1]),
            n.get('scale', [1, 1, 1]),
        )
        if i in parent:
            return mat_mul(world(parent[i]), m)
        return m

    worlds = {i: world(i) for i in range(len(nodes))}
    heads = {i: (worlds[i][0][3], worlds[i][1][3], worlds[i][2][3]) for i in worlds}

    # Bone order: depth-first from the pelvis, then leftovers by node order.
    bones = []

    def dfs(i):
        if is_bone(nodes[i].get('name')) and i not in bones:
            bones.append(i)
        for c in children_of.get(i, []):
            dfs(c)

    pelvis = next(i for i, n in enumerate(nodes) if n.get('name') == 'bip01 pelvis')
    dfs(pelvis)
    for i, n in enumerate(nodes):
        if is_bone(n.get('name')) and i not in bones:
            bones.append(i)
    print(f'bones: {len(bones)}')
    assert len(bones) >= 20, 'expected the full bip01 rig'

    bone_kids = {}
    for bi, i in enumerate(bones):
        kids = [c for c in children_of.get(i, []) if c in bones]
        bone_kids[bi] = kids
    bone_set = set(bones)

    def sub(a, b):
        return [a[k] - b[k] for k in range(3)]

    def seg_tail(bi):
        # The segment must continue the chain (pelvis points up toward the
        # spine, not sideways into the first listed child), otherwise hip
        # verts bind to the wrong bone and the lower back jellies.
        h = heads[bones[bi]]
        kids = bone_kids[bi]
        p = parent.get(bones[bi])
        if p is not None and p in bone_set:
            d = sub(h, heads[p])
        else:
            spine_kids = [c for c in kids
                          if 'spine' in (nodes[c].get('name') or '')]
            nxt = spine_kids[0] if spine_kids else (kids[0] if kids else None)
            d = sub(heads[nxt], h) if nxt is not None else [0, 1, 0]
        norm = sum(v * v for v in d) ** 0.5 or 1.0
        d = [v / norm for v in d]
        best, best_dot = None, -2.0
        for c in kids:
            cd = sub(heads[c], h)
            cn = sum(v * v for v in cd) ** 0.5 or 1.0
            dot = sum(cd[k] / cn * d[k] for k in range(3))
            if dot > best_dot:
                best, best_dot = c, dot
        if best is not None:
            dist = sum((heads[best][k] - h[k]) ** 2 for k in range(3)) ** 0.5
            return [h[k] + d[k] * dist for k in range(3)]
        return [h[k] + d[k] * 0.25 for k in range(3)]

    tails = {bi: seg_tail(bi) for bi in range(len(bones))}

    def dist_point_seg(p, a, b):
        ab = sub(b, a)
        denom = sum(v * v for v in ab) or 1e-12
        t = max(0.0, min(1.0, sum((p[k] - a[k]) * ab[k] for k in range(3)) / denom))
        c = [a[k] + ab[k] * t for k in range(3)]
        return sum((p[k] - c[k]) ** 2 for k in range(3)) ** 0.5

    # Rebind every vertex to its two nearest bone segments (world space).
    # Attachments go 100% rigid to the winning bone; body verts snap to
    # rigid when one bone clearly wins, else keep the 2-bone blend.
    # Rebind every vertex to its two nearest bone segments (world space).
    # Attachments go 100% rigid to a SINGLE winning bone for the whole mesh
    # (like nobz weapons); body verts snap to rigid when one bone clearly
    # wins, else keep the 2-bone blend.
    from collections import Counter
    # Rigid attachments follow the hand/back that holds them. Each weapon has
    # a marker parented under the holding bone (e.g. the choppa blade marker
    # hangs off 'bip01 l hand'), so the mesh inherits the marker's bone.
    def holder_bone(mesh_name):
        prefix = 'marker_' + mesh_name
        for i, n in enumerate(nodes):
            nm = n.get('name') or ''
            if nm == prefix or nm.startswith(prefix + '_'):
                a = parent.get(i)
                while a is not None:
                    if a in bone_index:
                        return bone_index[a]
                    a = parent.get(a)
        return None
    bone_index = {node: bi for bi, node in enumerate(bones)}
    rigid_bone = {}
    for m in doc['meshes']:
        if m.get('name') in RIGID_MESHES:
            hb = holder_bone(m['name'])
            if hb is not None:
                rigid_bone[m['name']] = hb
    # Head plates and headgear ride the head rigidly (nobz_head is 1.0 on
    # the head bone); shoulder/back plates hang off spine2 like the nobz
    # shoulder pads; the belt buckle sits on the pelvis. Only the leg meshes
    # keep a blend so knees can bend.
    for name, bone_name in {
        'ork_flag': 'bip01 spine2', 'ork_flag_pole': 'bip01 spine2',
        'boyz_burna_bakpak': 'bip01 spine2', 'boyz_burna_goggles': 'bip01 head',
        'boyz_head': 'bip01 head', 'boyz_helmet': 'bip01 head',
        'boyz_helmet_cage': 'bip01 head', 'boyz_helmet_spiked': 'bip01 head',
        'boyz_plume': 'bip01 head',
        'boyz_shoulderarmour_spiked_l': 'bip01 spine2',
        'boyz_backplate': 'bip01 spine2', 'boyz_backarmour_flat': 'bip01 spine2',
        'boyz_skullbeltbuckle': 'bip01 pelvis',
    }.items():
        bi = next((bi for bi, node in enumerate(bones) if nodes[node].get('name') == bone_name), None)
        if name in RIGID_MESHES and bi is not None:
            rigid_bone.setdefault(name, bi)
    rebound = 0
    for m in doc['meshes']:
        rigid_only = m.get('name') in RIGID_MESHES
        for pr in m['primitives']:
            at = pr['attributes']
            assert 'JOINTS_0' in at and 'WEIGHTS_0' in at and 'POSITION' in at
            mesh_node = next(i for i, n in enumerate(nodes) if n.get('mesh') == doc['meshes'].index(m))
            mw = worlds[mesh_node]
            pos = read_accessor(doc, binary, at['POSITION'])
            nv = len(pos) // 3
            first_pick = [0] * nv
            new_j = [0] * (nv * 4)
            new_w = [0.0] * (nv * 4)
            for k in range(nv):
                p = [pos[3 * k], pos[3 * k + 1], pos[3 * k + 2]]
                pw = [mw[0][0] * p[0] + mw[0][1] * p[1] + mw[0][2] * p[2] + mw[0][3],
                      mw[1][0] * p[0] + mw[1][1] * p[1] + mw[1][2] * p[2] + mw[1][3],
                      mw[2][0] * p[0] + mw[2][1] * p[1] + mw[2][2] * p[2] + mw[2][3]]
                dists = sorted(
                    ((dist_point_seg(pw, heads[bones[bi]], tails[bi]), bi) for bi in range(len(bones))),
                    key=lambda t: t[0],
                )
                (d1, b1), (d2, b2) = dists[0], dists[1]
                s = d1 + d2
                w1 = d2 / s if s > 1e-12 else 1.0
                first_pick[k] = b1
                if w1 >= RIGID_SNAP:
                    new_j[4 * k:4 * k + 4] = [b1, 0, 0, 0]
                    new_w[4 * k:4 * k + 4] = [1.0, 0.0, 0.0, 0.0]
                else:
                    new_j[4 * k:4 * k + 4] = [b1, b2, 0, 0]
                    new_w[4 * k:4 * k + 4] = [w1, 1.0 - w1, 0.0, 0.0]
            if rigid_only:
                winner = rigid_bone.get(m['name'])
                if winner is None:
                    winner = Counter(first_pick).most_common(1)[0][0]
                print(f'  rigid {m.get("name")}: -> {nodes[bones[winner]].get("name")}')
                for k in range(nv):
                    new_j[4 * k:4 * k + 4] = [winner, 0, 0, 0]
                    new_w[4 * k:4 * k + 4] = [1.0, 0.0, 0.0, 0.0]
            binary = write_accessor_in_place(doc, binary, at['JOINTS_0'], new_j)
            binary = write_accessor_in_place(doc, binary, at['WEIGHTS_0'], new_w)
            rebound += nv
    print(f'rebound vertices: {rebound}')

    ibms = []
    for bi in range(len(bones)):
        # glTF matrices are column-major: flatten column by column.
        inv = mat_inv(worlds[bones[bi]])
        for c in range(4):
            for r in range(4):
                ibms.append(inv[r][c])
    ibm_acc, binary = append_floats(doc, binary, ibms, 'MAT4')

    doc['skins'] = [{'inverseBindMatrices': ibm_acc, 'joints': bones}]
    for n in nodes:
        if 'mesh' in n:
            n['skin'] = 0
        if n.get('name') in HIDDEN_MESHES:
            # Our loader hides extras.hidden; Babylon viewers (e.g. the
            # sandbox) honor the standard KHR_node_visibility instead.
            n['extras'] = {'hidden': True}
            ext = n.setdefault('extensions', {})
            ext['KHR_node_visibility'] = {'visible': False}
    used = doc.setdefault('extensionsUsed', [])
    if 'KHR_node_visibility' not in used:
        used.append('KHR_node_visibility')
    save_glb(PATH, doc, binary)
    print(f'{PATH}: wrote skins[0] with {len(bones)} joints')


if __name__ == '__main__':
    main()
