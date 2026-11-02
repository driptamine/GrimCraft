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

const CHAOS_MODELS = [
  'models/chaos/infantry/chaos_space_marine.glb',
  'models/chaos/infantry/chaos_space_marine_run.glb',
];

describe('chaos space marine run animation', () => {
  for (const model of CHAOS_MODELS) {
    it(`${path.basename(model)} contains a run_1 clip with resolvable channels`, () => {
      const json = glbJson(model);
      const run = (json.animations || []).find((a) => a.name === 'run_1');
      assert.ok(run, 'run_1 clip exists');
      assert.ok(run.channels.length > 30, 'run_1 drives the body, not a stub');
      const nodeNames = new Set((json.nodes || []).map((n) => n.name));
      for (const ch of run.channels) {
        const target = json.nodes[ch.target.node];
        assert.ok(target, 'channel target node exists');
        assert.ok(nodeNames.has(target.name), `channel target ${target.name} resolves`);
      }
      const inputs = run.samplers.map((s) => json.accessors[s.input]);
      for (const acc of inputs) {
        assert.ok(acc.count > 1, 'time track has keyframes');
      }
    });
  }

  it('faction animation mapping points run at the copied clip', () => {
    const mapping = JSON.parse(
      fs.readFileSync(path.join(root, 'animations/chaos/chaos_space_marine.json'), 'utf8'),
    );
    assert.equal(mapping.run, 'run_1');
  });
});

describe('chaos space marine move-firing animation', () => {
  const CLIP = 'marine_heavy_bolter_run_1';

  for (const model of CHAOS_MODELS) {
    it(`${path.basename(model)} contains a ${CLIP} clip with resolvable channels`, () => {
      const json = glbJson(model);
      const clip = (json.animations || []).find((a) => a.name === CLIP);
      assert.ok(clip, `${CLIP} clip exists`);
      assert.ok(clip.channels.length > 30, `${CLIP} drives the body, not a stub`);
      const nodeNames = new Set((json.nodes || []).map((n) => n.name));
      for (const ch of clip.channels) {
        const target = json.nodes[ch.target.node];
        assert.ok(target, 'channel target node exists');
        assert.ok(nodeNames.has(target.name), `channel target ${target.name} resolves`);
      }
    });
  }

  it('faction animation mapping points moveFiring at the copied clip', () => {
    const mapping = JSON.parse(
      fs.readFileSync(path.join(root, 'animations/chaos/chaos_space_marine.json'), 'utf8'),
    );
    assert.equal(mapping.moveFiring, 'marine_heavy_bolter_run_1');
  });
});
