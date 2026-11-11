import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Guards Dark Reapers' melee: the clips are copied from eldar/Guardian.glb
// (see tools/copy-melee-clips.mjs), the game picks them up by name via
// animations/eldar/soldier.json (melee: MELEE_1) plus the melee_2/3, block
// and damage conventions in src/meshes/soldiers.ts. Pure binary check on
// the GLB JSON chunk — no renderer needed.
function readGlbJson(path) {
  const buf = readFileSync(new URL(path, import.meta.url));
  assert.equal(buf.readUInt32LE(0), 0x46546c67, `${path} is not a GLB`);
  return JSON.parse(buf.slice(20, 20 + buf.readUInt32LE(12)).toString('utf8'));
}

const MELEE_CLIPS = ['MELEE_1', 'MELEE_2', 'MELEE_3', 'MELEE_BLOCK', 'MELEE_DAMAGE_L', 'MELEE_DAMAGE_R'];

describe('dark reaper melee', () => {
  it('dark_reaper.glb carries the guardian melee family with valid targets', () => {
    const json = readGlbJson('../models/eldar/infantry/dark_reaper.glb');
    const byName = new Map((json.animations || []).map((a) => [a.name, a]));
    for (const name of MELEE_CLIPS) {
      const anim = byName.get(name);
      assert.ok(anim, `${name} must exist in dark_reaper.glb`);
      assert.ok(anim.channels.length > 0, `${name} must have channels`);
      for (const ch of anim.channels) {
        assert.ok(ch.target.node < json.nodes.length, `${name}: channel targets a real node`);
        assert.ok(anim.samplers[ch.sampler], `${name}: channel sampler resolves`);
      }
    }
  });

  it('the configured melee clip name resolves in the model', () => {
    const mapping = JSON.parse(readFileSync(new URL('../animations/eldar/soldier.json', import.meta.url), 'utf8'));
    const json = readGlbJson('../models/eldar/infantry/dark_reaper.glb');
    const names = new Set((json.animations || []).map((a) => a.name));
    assert.ok(names.has(mapping.melee), `soldier.json melee (${mapping.melee}) must exist in dark_reaper.glb`);
  });

  it('the clip registry lists the copied melee clips', () => {
    const registry = JSON.parse(readFileSync(new URL('../animations/eldar/eldar_infantries.json', import.meta.url), 'utf8'));
    for (const name of MELEE_CLIPS) {
      assert.ok(registry['dark_reaper.glb'].includes(name), `registry must list ${name}`);
    }
  });
});
