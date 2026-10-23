import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';

register('./node-esm-hooks.mjs', import.meta.url);
globalThis.document = { getElementById: () => null };
const { default: tau } = await import('../src/factions/tau.js');
const { COSTS } = await import('../src/scene.js');

const EXPECTED_GRID = [
  'tau_hq', 'tau_barracks', 'tau_listening_post', 'tau_plasma_generator',
  'tau_kroot_nest', 'tau_research', 'tau_vehicle_building', 'tau_thermoplasma_generator',
  'tau_shrine_of_mont_ka', 'tau_shrine_of_kauyon', 'tau_shrine_of_purpose',
];

describe('earth caste builder grid', () => {
  it('buildOrder matches the r1c1..r3c3 layout', () => {
    assert.deepEqual(tau.buildOrder, EXPECTED_GRID);
  });

  it('every grid cell resolves to a buildable structure, icon and cost', () => {
    for (const type of tau.buildOrder) {
      if (!type) {
        continue;
      }
      const cfg = tau.structures.find((s) => s.type === type);
      assert.ok(cfg, `${type} config exists`);
      assert.ok(cfg.model, `${type} has a model`);
      assert.ok(cfg.name, `${type} has a label`);
      assert.ok(tau.icons[type], `${type} has a menu icon`);
      assert.ok(Number.isFinite(COSTS[type]) && COSTS[type] > 0, `${type} has a COSTS entry`);
    }
  });

  it('uses the requested display names', () => {
    const byType = (type) => tau.structures.find((s) => s.type === type).name;
    assert.equal(byType('tau_hq'), 'Cadre Headquarters');
    assert.equal(byType('tau_barracks'), 'Tau Barracks');
    assert.equal(byType('tau_listening_post'), 'Listening Post');
    assert.equal(byType('tau_plasma_generator'), 'Plasma Generator');
    assert.equal(byType('tau_kroot_nest'), 'Kroot Shaping Center');
    assert.equal(byType('tau_research'), 'Path to Enlightenment');
    assert.equal(byType('tau_vehicle_building'), 'Vehicle Beacon');
    assert.equal(byType('tau_thermoplasma_generator'), 'Thermo Plasma Generator');
    assert.equal(byType('tau_shrine_of_mont_ka'), "Mont'ka Command Post");
    assert.equal(byType('tau_shrine_of_kauyon'), 'Kauyon Command Post');
    assert.equal(byType('tau_shrine_of_purpose'), 'Coalition Center');
  });
});
