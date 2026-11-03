import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

function glbJson(rel) {
  const buf = fs.readFileSync(path.join(root, rel));
  const jsonLen = buf.readUInt32LE(12);
  assert.equal(buf.readUInt32LE(16), 0x4e4f534a, 'JSON chunk tag');
  return JSON.parse(buf.subarray(20, 20 + jsonLen).toString('utf8'));
}

const MODEL = 'models/orks/infantry/boyz.glb';

describe('boyz run_1 skin binding', () => {
  it('boyz.glb carries a skin so run_1 can deform the body', () => {
    const json = glbJson(MODEL);
    assert.ok((json.skins || []).length > 0, 'skins[] present');
    const skin = json.skins[0];
    assert.ok(skin.joints.length > 20, 'skin drives the body, not a stub');
    const names = new Set((json.nodes || []).map((n) => n.name));
    for (const joint of skin.joints) {
      assert.ok(json.nodes[joint], `joint node ${joint} exists`);
      assert.ok(names.has(json.nodes[joint].name), `joint ${json.nodes[joint].name} resolves`);
    }
    for (const node of json.nodes) {
      if (node.mesh !== undefined) {
        assert.equal(node.skin, 0, `mesh node ${node.name} bound to skin 0`);
      }
    }
  });

  it('run_1 channels target skinned joints', () => {
    const json = glbJson(MODEL);
    const run = (json.animations || []).find((a) => a.name === 'run_1');
    assert.ok(run, 'run_1 clip exists');
    const joints = new Set(json.skins[0].joints);
    let driven = 0;
    for (const ch of run.channels) {
      if (joints.has(ch.target.node)) driven += 1;
    }
    assert.ok(driven > 30, `run_1 drives skinned joints (got ${driven})`);
  });

  it('variant meshes stay in the file but flagged hidden', () => {
    const json = glbJson(MODEL);
    const expected = [
      'ork_flag', 'ork_flag_pole', 'boyz_helmet', 'boyz_rokkit_launcha',
      'boyz_rokkit', 'boyz_legs_burna', 'boyz_helmet_spiked', 'boyz_helmet_cage',
      'boyz_big_shoota', 'boyz_big_shoota_ammo', 'boyz_burna',
      'boyz_burna_goggles', 'boyz_burna_bakpak',
    ];
    const byName = new Map();
    for (const n of json.nodes || []) {
      if (!byName.has(n.name)) byName.set(n.name, []);
      byName.get(n.name).push(n);
    }
    for (const name of expected) {
      const group = byName.get(name) || [];
      assert.ok(group.length, `${name} still in the file`);
      // Name doubles exist (ork_flag_pole is both a mesh and an empty
      // marker parent); every same-named node is flagged, meshes are kept.
      for (const node of group) {
        assert.equal(node.extras && node.extras.hidden, true, `${name} flagged hidden`);
        assert.equal(
          node.extensions && node.extensions.KHR_node_visibility &&
            node.extensions.KHR_node_visibility.visible,
          false,
          `${name} KHR_node_visibility=false (Babylon sandbox)`,
        );
      }
      assert.ok(group.some((n) => n.mesh !== undefined), `${name} mesh kept`);
    }
  });

  it('faction animation mapping points run at run_1', () => {
    const mapping = JSON.parse(
      fs.readFileSync(path.join(root, 'animations/orks/soldier.json'), 'utf8'),
    );
    assert.equal(mapping.run, 'run_1');
  });
});
