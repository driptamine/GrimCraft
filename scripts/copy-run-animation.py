#!/usr/bin/env python3
"""Copy an animation from space_marine.glb into chaos marine GLB file(s).

Defaults to run_1; pass --clip to copy another clip (for example melee_1,
melee_damage_l or melee_damage_r).
Retargets channels by bone name. Rotation/scale tracks are copied verbatim;
translation tracks are transferred as per-key deltas from the source rest pose
onto the target rest pose, so the chaos bulk keeps its own proportions while
the bobbing/swing of the run is preserved. Channels that target bones missing
in the destination (weapon markers, attachments) are skipped and reported.

Idempotent: refuses to run when the destination already has the clip unless
--force is given (which replaces the animation entry).

Usage:
    python3 scripts/copy-run-animation.py [--clip NAME] [--force]
"""

import json
import struct
import sys

SRC = 'models/space marines/troops/space_marine.glb'
DSTS = [
    'models/chaos/infantry/chaos_space_marine.glb',
    'models/chaos/infantry/chaos_space_marine_run.glb',
]
CLIP = 'run_1'
COMPONENT_SIZES = {5120: 1, 5121: 1, 5122: 2, 5123: 2, 5125: 4, 5126: 4}
TYPE_COUNTS = {'SCALAR': 1, 'VEC2': 2, 'VEC3': 3, 'VEC4': 4, 'MAT4': 16}


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
    assert len(doc.get('buffers', [])) == 1, f'{path}: expected exactly one buffer'
    return doc, bins[0]


def save_glb(path, doc, binary):
    json_bytes = json.dumps(doc, ensure_ascii=False, separators=(',', ':')).encode('utf-8')
    json_bytes += b' ' * (-len(json_bytes) % 4)
    binary += b'\x00' * (-len(binary) % 4)
    doc['buffers'][0]['byteLength'] = len(binary)
    json_bytes = json.dumps(doc, ensure_ascii=False, separators=(',', ':')).encode('utf-8')
    json_bytes += b' ' * (-len(json_bytes) % 4)
    total = 12 + 8 + len(json_bytes) + 8 + len(binary)
    with open(path, 'wb') as f:
        f.write(struct.pack('<III', 0x46546C67, 2, total))
        f.write(struct.pack('<II', len(json_bytes), 0x4E4F534A))
        f.write(json_bytes)
        f.write(struct.pack('<II', len(binary), 0x004E4942))
        f.write(binary)


def read_accessor(doc, binary, index):
    acc = doc['accessors'][index]
    assert acc['componentType'] == 5126, f'accessor {index}: only FLOAT supported'
    view = doc['bufferViews'][acc['bufferView']]
    assert view.get('byteStride') is None, f'accessor {index}: interleaved data unsupported'
    start = view.get('byteOffset', 0) + acc.get('byteOffset', 0)
    count = acc['count'] * TYPE_COUNTS[acc['type']]
    return list(struct.unpack(f'<{count}f', binary[start:start + count * 4]))


def append_data(doc, binary, floats):
    raw = struct.pack(f'<{len(floats)}f', *floats)
    offset = len(binary)
    binary += raw
    view_index = len(doc['bufferViews'])
    doc['bufferViews'].append({'buffer': 0, 'byteOffset': offset, 'byteLength': len(raw)})
    return view_index, binary


def add_accessor(doc, view_index, component_type, count, type_, values):
    comps = TYPE_COUNTS[type_]
    flat = [min(values[i::comps]) for i in range(comps)]
    fmax = [max(values[i::comps]) for i in range(comps)]
    doc['accessors'].append({
        'bufferView': view_index,
        'byteOffset': 0,
        'componentType': component_type,
        'count': count,
        'type': type_,
        'min': flat,
        'max': fmax,
    })
    return len(doc['accessors']) - 1


def copy_clip(src_path, dst_path, clip, force):
    src_doc, src_bin = load_glb(src_path)
    dst_doc, dst_bin = load_glb(dst_path)

    src_anim = next((a for a in src_doc.get('animations', []) if a.get('name') == clip), None)
    assert src_anim is not None, f'{src_path}: no {clip} animation'

    existing = next((a for a in dst_doc.get('animations', []) if a.get('name') == clip), None)
    if existing is not None and not force:
        print(f'{dst_path}: already has {clip}, skipping (use --force to replace)')
        return
    if existing is not None:
        dst_doc['animations'].remove(existing)
        print(f'{dst_path}: WARNING: replaced {clip}; previous clip data left orphaned')

    src_nodes = {n.get('name'): (i, n) for i, n in enumerate(src_doc['nodes'])}
    dst_nodes = {n.get('name'): (i, n) for i, n in enumerate(dst_doc['nodes'])}

    channels, samplers = [], []
    skipped = []
    for ch in src_anim['channels']:
        sampler = src_anim['samplers'][ch['sampler']]
        src_idx, src_node = src_nodes[src_doc['nodes'][ch['target']['node']].get('name')]
        name = src_node.get('name')
        if name not in dst_nodes:
            skipped.append(name)
            continue
        dst_idx, dst_node = dst_nodes[name]
        path = ch['target']['path']

        times = read_accessor(src_doc, src_bin, sampler['input'])
        values = read_accessor(src_doc, src_bin, sampler['output'])
        assert len(times) * TYPE_COUNTS[src_doc['accessors'][sampler['output']]['type']] == len(values)

        if path == 'translation':
            src_rest = src_node.get('translation', [0, 0, 0])
            dst_rest = dst_node.get('translation', [0, 0, 0])
            shifted = []
            for k in range(len(times)):
                base = [values[3 * k + c] - src_rest[c] + dst_rest[c] for c in range(3)]
                shifted.extend(base)
            values = shifted

        in_view, dst_bin = append_data(dst_doc, dst_bin, times)
        in_acc = add_accessor(dst_doc, in_view, 5126, len(times), 'SCALAR', times)
        out_type = src_doc['accessors'][sampler['output']]['type']
        out_view, dst_bin = append_data(dst_doc, dst_bin, values)
        out_acc = add_accessor(dst_doc, out_view, 5126, len(times), out_type, values)

        samplers.append({'input': in_acc, 'output': out_acc,
                         'interpolation': sampler.get('interpolation', 'LINEAR')})
        channels.append({'sampler': len(samplers) - 1,
                         'target': {'node': dst_idx, 'path': path}})

    dst_doc.setdefault('animations', []).append(
        {'name': clip, 'channels': channels, 'samplers': samplers})
    save_glb(dst_path, dst_doc, dst_bin)
    print(f'{dst_path}: copied {clip} ({len(channels)} channels, '
          f'skipped {len(skipped)} attachment targets)')


def main():
    force = '--force' in sys.argv
    clip = CLIP
    for i, arg in enumerate(sys.argv):
        if arg == '--clip' and i + 1 < len(sys.argv):
            clip = sys.argv[i + 1]
    for dst in DSTS:
        copy_clip(SRC, dst, clip, force)


if __name__ == '__main__':
    main()
