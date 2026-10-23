import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';

register('./node-esm-hooks.mjs', import.meta.url);
globalThis.document = { getElementById: () => null };
const { default: necrons } = await import('../src/factions/necrons.js');
const { COSTS } = await import('../src/scene.js');

const EXPECTED_GRID = [
  'monolith', 'obelisk', 'plasma_generator', 'thermoplasma_generator',
  'summoning_core', 'forbidden_archive', 'greater_summoning_core', 'energy_core',
  'turret',
];

describe('builder scarab build grid', () => {
  it('buildOrder matches the r1c1..r3c1 layout', () => {
    assert.deepEqual(necrons.buildOrder, EXPECTED_GRID);
  });

  it('every grid cell resolves to a buildable structure, icon and cost', () => {
    for (const type of necrons.buildOrder) {
      if (!type) {
        continue;
      }
      const cfg = necrons.structures.find((s) => s.type === type);
      assert.ok(cfg, `${type} config exists`);
      assert.ok(cfg.model, `${type} has a model`);
      assert.ok(cfg.name, `${type} has a label`);
      assert.ok(necrons.icons[type], `${type} has a menu icon`);
      assert.ok(Number.isFinite(COSTS[type]) && COSTS[type] > 0, `${type} has a COSTS entry`);
    }
  });

  it('uses the requested display names', () => {
    const byType = (type) => necrons.structures.find((s) => s.type === type).name;
    assert.equal(byType('monolith'), 'Dormant Monolith');
    assert.equal(byType('obelisk'), 'Obelisk');
    assert.equal(byType('thermoplasma_generator'), 'Thermo Plasma Generator');
    assert.equal(byType('turret'), 'Gauss Turret');
  });
});
