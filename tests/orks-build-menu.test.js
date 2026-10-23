import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';

register('./node-esm-hooks.mjs', import.meta.url);
globalThis.document = { getElementById: () => null };
const { default: orks } = await import('../src/factions/orks.js');
const { COSTS } = await import('../src/scene.js');

const EXPECTED_GRID = [
  'settlement', 'da_boyz_hut', 'listening_post', 'generator',
  'waagh_banner', 'pile_o_guns', 'mek_shop', 'bigger_generator',
  'land_mine',
];

describe('grot build grid', () => {
  it('buildOrder matches the r1c1..r3c1 layout', () => {
    assert.deepEqual(orks.buildOrder, EXPECTED_GRID);
  });

  it('every grid cell resolves to a buildable structure, icon and cost', () => {
    for (const type of orks.buildOrder) {
      if (!type) {
        continue;
      }
      const cfg = orks.structures.find((s) => s.type === type);
      assert.ok(cfg, `${type} config exists`);
      assert.ok(cfg.model, `${type} has a model`);
      assert.ok(cfg.name, `${type} has a label`);
      assert.ok(orks.icons[type], `${type} has a menu icon`);
      assert.ok(Number.isFinite(COSTS[type]) && COSTS[type] > 0, `${type} has a COSTS entry`);
    }
  });

  it('uses the requested display names', () => {
    const byType = (type) => orks.structures.find((s) => s.type === type).name;
    assert.equal(byType('settlement'), 'Settlement');
    assert.equal(byType('da_boyz_hut'), 'Da Boyz Hut');
    assert.equal(byType('listening_post'), "Da Listenin' Post");
    assert.equal(byType('generator'), 'Generator');
    assert.equal(byType('waagh_banner'), 'Waaagh! Banner');
    assert.equal(byType('pile_o_guns'), 'Pile O Gunz!');
    assert.equal(byType('mek_shop'), 'Da Mek Shop');
    assert.equal(byType('bigger_generator'), 'Bigga Generator');
    assert.equal(byType('land_mine'), 'Mine Field');
  });
});
