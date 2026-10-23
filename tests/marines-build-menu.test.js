import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';

register('./node-esm-hooks.mjs', import.meta.url);
globalThis.document = { getElementById: () => null };
const { default: marines } = await import('../src/factions/space-marines.js');
const { COSTS } = await import('../src/scene.js');

const EXPECTED_GRID = [
  'command_hq', 'barracks', 'listening_post', 'plasma_generator',
  'armoury', 'machine_cult', 'progenitor_temple', 'thermo_plasma_generator',
  null, 'land_mine', 'orbital_relay',
];

describe('servitor build grid', () => {
  it('buildOrder matches the r1c1..r3c3 layout with the turret slot reserved', () => {
    assert.deepEqual(marines.buildOrder, EXPECTED_GRID);
  });

  it('every grid cell resolves to a buildable structure, icon and cost', () => {
    for (const type of marines.buildOrder) {
      if (!type) {
        continue;
      }
      const cfg = marines.structures.find((s) => s.type === type);
      assert.ok(cfg, `${type} config exists`);
      assert.ok(cfg.model, `${type} has a model`);
      assert.ok(cfg.name, `${type} has a label`);
      assert.ok(marines.icons[type], `${type} has a menu icon`);
      assert.ok(Number.isFinite(COSTS[type]) && COSTS[type] > 0, `${type} has a COSTS entry`);
    }
  });

  it('uses the requested display names', () => {
    const byType = (type) => marines.structures.find((s) => s.type === type).name;
    assert.equal(byType('command_hq'), 'Stronghold');
    assert.equal(byType('barracks'), 'Chapel-Barracks');
    assert.equal(byType('machine_cult'), 'Machine Cult');
    assert.equal(byType('progenitor_temple'), 'Sacred Artifact');
    assert.equal(byType('land_mine'), 'Mine Field');
    assert.equal(byType('orbital_relay'), 'Orbital Relay');
  });
});
