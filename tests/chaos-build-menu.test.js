import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { register } from 'node:module';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

register('./node-esm-hooks.mjs', import.meta.url);
globalThis.document = { getElementById: () => null };
const { default: chaos } = await import('../src/factions/chaos.js');
const { COSTS } = await import('../src/scene.js');

const EXPECTED_GRID = [
  'desecrated_stronghold', 'chaos_temple', 'listening_post', 'plasma_generator',
  'armoury', 'machine_pit', 'sacrificial_circle', 'thermo_plasma_generator',
  null, 'land_mine', 'greater_sacrificial_circle',
];

describe('heretic build grid', () => {
  it('buildOrder matches the r1c1..r3c3 layout with reserved slots', () => {
    assert.deepEqual(chaos.buildOrder, EXPECTED_GRID);
  });

  it('every grid cell resolves to a buildable structure, icon and cost', () => {
    for (const type of chaos.buildOrder) {
      if (!type) {
        continue;
      }
      const cfg = chaos.structures.find((s) => s.type === type);
      assert.ok(cfg, `${type} config exists`);
      assert.ok(cfg.model, `${type} has a model`);
      assert.ok(cfg.name, `${type} has a label`);
      assert.ok(chaos.icons[type], `${type} has a menu icon`);
      assert.ok(Number.isFinite(COSTS[type]) && COSTS[type] > 0, `${type} has a COSTS entry`);
    }
  });

  it('greater circle icon is a real 242x242 PNG from the TGA', () => {
    const icon = chaos.icons.greater_sacrificial_circle;
    assert.ok(icon.endsWith('greater_sacrifice_icon.png'));
    assert.ok(fs.existsSync(path.join(ROOT, 'models/ingame/chaos_icons/greater_sacrifice_icon.tga')), 'TGA source exists');
    const buf = fs.readFileSync(path.join(ROOT, icon));
    assert.equal(buf.subarray(1, 4).toString(), 'PNG');
    assert.equal(buf.readUInt32BE(16), 242);
    assert.equal(buf.readUInt32BE(20), 242);
  });

  it('uses the requested display names', () => {
    const byType = (type) => chaos.structures.find((s) => s.type === type).name;
    assert.equal(byType('armoury'), 'Chaos Armoury');
    assert.equal(byType('land_mine'), 'Mine Field');
  });
});
