import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';

register('./node-esm-hooks.mjs', import.meta.url);

const { collectFactionR2Urls, collectBootR2Urls } = await import('../src/r2-manifest.js');
const { ARENA_POSITION_FACTIONS } = await import('../src/factions.js');

describe('r2 boot manifest', () => {
  it('collects faction models in load order, deduplicated', () => {
    const urls = collectFactionR2Urls(['ig']);
    assert.ok(urls.length > 5, 'ig has more than a handful of models');
    assert.deepEqual([...new Set(urls)], urls, 'no duplicates');
    for (const url of urls) {
      assert.ok(url.endsWith('.glb') || url.endsWith('.fbx'), `model file: ${url}`);
    }
    // hq, worker, soldier first — same order loadFactionModels uses.
    assert.ok(urls[0].includes('hq.glb'), 'hq first');
    assert.ok(urls[1].includes('tech_priest'), 'worker second');
    assert.ok(urls[2].includes('guardsmen'), 'soldier third');
  });

  it('skips unknown factions and empty paths', () => {
    assert.deepEqual(collectFactionR2Urls(['nope']), []);
    assert.deepEqual(collectFactionR2Urls([]), []);
  });

  it('appends extras after factions without duplicates', () => {
    const factionOnly = collectFactionR2Urls(['ig']);
    const extra = 'models/points/strategic_point.glb';
    const withExtra = collectBootR2Urls(['ig'], [extra, factionOnly[0], null, '']);
    assert.equal(withExtra.length, factionOnly.length + 1, 'one extra, faction dup ignored');
    assert.equal(withExtra[withExtra.length - 1], extra, 'extras go last');
  });

  it('covers every arena faction by default', () => {
    const urls = collectBootR2Urls();
    assert.ok(urls.length > 20, `arena manifest is large (${urls.length})`);
    for (const key of ARENA_POSITION_FACTIONS) {
      assert.ok(key, 'faction key present');
    }
  });
});
