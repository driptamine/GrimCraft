import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';

register('./node-esm-hooks.mjs', import.meta.url);
globalThis.document = { getElementById: () => null };
const { default: eldar } = await import('../src/factions/eldar.js');
const { COSTS } = await import('../src/scene.js');

const EXPECTED_GRID = [
  'webway_assembly', 'aspect_portal', 'listening_post', 'warp_generator',
  'webway_gate', 'soul_shrine', 'support_portal', 'advanced_warp_generator',
  'support_platform', 'land_mine',
];

describe('bonesinger build grid', () => {
  it('buildOrder matches the r1c1..r3c2 layout', () => {
    assert.deepEqual(eldar.buildOrder, EXPECTED_GRID);
  });

  it('every grid cell resolves to a buildable structure, icon and cost', () => {
    for (const type of eldar.buildOrder) {
      if (!type) {
        continue;
      }
      const cfg = eldar.structures.find((s) => s.type === type);
      assert.ok(cfg, `${type} config exists`);
      assert.ok(cfg.model, `${type} has a model`);
      assert.ok(cfg.name, `${type} has a label`);
      assert.ok(eldar.icons[type], `${type} has a menu icon`);
      assert.ok(Number.isFinite(COSTS[type]) && COSTS[type] > 0, `${type} has a COSTS entry`);
    }
  });

  it('uses the requested display names', () => {
    const byType = (type) => eldar.structures.find((s) => s.type === type).name;
    assert.equal(byType('webway_assembly'), 'Webway Assembly');
    assert.equal(byType('aspect_portal'), 'Aspect Portal');
    assert.equal(byType('listening_post'), 'Listening Shrine');
    assert.equal(byType('warp_generator'), 'Plasma Generator');
    assert.equal(byType('webway_gate'), 'Webway Gate');
    assert.equal(byType('soul_shrine'), 'Soul Shrine');
    assert.equal(byType('support_portal'), 'Support Portal');
    assert.equal(byType('advanced_warp_generator'), 'Thermo Plasma Generator');
    assert.equal(byType('support_platform'), 'Support Platform');
    assert.equal(byType('land_mine'), 'Mine Field');
  });
});
