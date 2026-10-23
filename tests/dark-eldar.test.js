import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

register('./node-esm-hooks.mjs', import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const { default: config } = await import('../src/factions/dark-eldar.js');
const { FACTIONS, getFactionAnimations } = await import('../src/factions.js');

function glbJson(relPath) {
  const buf = readFileSync(join(root, relPath));
  return JSON.parse(buf.subarray(20, 20 + buf.readUInt32LE(12)).toString('utf8'));
}

describe('dark eldar faction', () => {
  it('is registered with hq, worker and soldier models on disk', () => {
    assert.equal(FACTIONS['dark eldar'], config);
    assert.equal(config.name, 'Dark Eldar');
    assert.ok(existsSync(join(root, config.hq)), 'hq model exists');
    assert.equal(config.infantry.length, 2);
    for (const slot of config.infantry) {
      assert.ok(existsSync(join(root, slot.model)), `${slot.model} exists`);
    }
  });

  it('animation maps resolve to clips inside the models', () => {
    const checks = [
      [config.infantry[1], 'soldier'],
      [config.infantry[0], 'worker'],
    ];
    for (const [slot, role] of checks) {
      const clips = (glbJson(slot.model).animations || []).map((a) => (a.name || '').toLowerCase());
      assert.ok(clips.length > 0, `${slot.model} ships clips`);
      for (const [action, wanted] of Object.entries(slot.animations)) {
        if (!wanted) {
          continue;
        }
        assert.ok(
          clips.some((c) => c.startsWith(wanted.toLowerCase())),
          `${role}.${action}=${wanted} matches a ${slot.model} clip`,
        );
      }
    }
    assert.equal(getFactionAnimations('dark eldar', 'soldier'), config.infantry[1].animations);
    assert.equal(getFactionAnimations('dark eldar', 'worker'), config.infantry[0].animations);
  });

  it('hides only nodes present in the warrior model', () => {
    const names = new Set(glbJson(config.infantry[1].model).nodes.map((n) => n.name));
    for (const node of config.infantry[1].hiddenNodes) {
      assert.ok(names.has(node), `${node} exists in warrior.glb`);
    }
  });
});
