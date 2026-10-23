import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';

register('./node-esm-hooks.mjs', import.meta.url);
const {
  FACTIONS, POSITION_FACTIONS, factionContainers, resolveFactionKey, getFactionAnimations,
} = await import('../src/factions.js');

describe('position factions', () => {
  it('assigns Orks/IG/Necrons/Chaos/Marines/Eldar to positions 1-6', () => {
    assert.deepEqual(POSITION_FACTIONS, ['orks', 'ig', 'necrons', 'chaos', 'space marines', 'eldar']);
    for (const key of POSITION_FACTIONS) {
      assert.ok(FACTIONS[key], `${key} config exists`);
      assert.ok(FACTIONS[key].hq, `${key} has an HQ model`);
      assert.ok(FACTIONS[key].infantry?.[0]?.model, `${key} has a worker model`);
      assert.ok(FACTIONS[key].infantry?.[1]?.model, `${key} has a soldier model`);
    }
  });

  it('pre-creates a container bucket per position faction', () => {
    for (const key of POSITION_FACTIONS) {
      const bucket = factionContainers[key];
      assert.ok(bucket, `${key} bucket exists`);
      assert.deepEqual(Object.keys(bucket).sort(), ['hq', 'soldier', 'structures', 'teamcolor', 'units', 'vehicles', 'worker']);
    }
    assert.equal(factionContainers.player, undefined);
    assert.equal(factionContainers.enemy, undefined);
  });

  it('resolveFactionKey prefers entity faction with team fallback', () => {
    assert.equal(resolveFactionKey('orks', 'ig'), 'orks');
    assert.equal(resolveFactionKey('bogus', 'ig'), 'ig');
    assert.equal(resolveFactionKey(null, 'chaos'), 'chaos');
    assert.equal(resolveFactionKey(undefined), 'ig');
    assert.equal(resolveFactionKey('bogus', 'bogus'), POSITION_FACTIONS[0]);
  });

  it('getFactionAnimations accepts real keys and legacy side keys', () => {
    assert.equal(getFactionAnimations('orks'), FACTIONS.orks.infantry[1].animations);
    assert.equal(getFactionAnimations('player'), FACTIONS.ig.infantry[1].animations);
    assert.equal(getFactionAnimations('enemy'), FACTIONS.chaos.infantry[1].animations);
    assert.equal(getFactionAnimations('orks', 'worker'), FACTIONS.orks.infantry[0].animations);
  });
});
