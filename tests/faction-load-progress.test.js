import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';

register('./node-esm-hooks.mjs', import.meta.url);
const { FACTIONS, countFactionModels, loadFactionModels, factionContainers } = await import('../src/factions.js');

describe('faction load progress', () => {
  it('counts loadable models per config', () => {
    const config = {
      hq: 'hq.glb',
      infantry: [{ model: 'worker.glb' }, {}],
      units: [{ model: 'unit.glb' }, { model: null }, {}],
      structures: [
        { model: 's1.glb', production: [{ model: 'v1.glb' }] },
        { model: 's2.glb', production: [{ model: 'v2.glb' }, { model: 'v1.glb' }, {}] },
      ],
    };
    // hq + worker + 0 soldier + 1 unit + 2 structures + 2 unique vehicles
    assert.equal(countFactionModels(config), 7);
    assert.equal(countFactionModels(null), 0);
    assert.equal(countFactionModels({}), 0);
  });

  it('reports monotonic progress while loading with an injected loader', async () => {
    const events = [];
    const seen = [];
    await loadFactionModels(undefined, ['orks'], {
      loadModel: async (url) => { seen.push(url); return { stub: url }; },
      onProgress: (event) => events.push(event),
    });
    const total = countFactionModels(FACTIONS.orks);
    assert.ok(total > 0);
    assert.equal(events.length, total);
    assert.equal(seen.length, total);
    events.forEach((event, index) => {
      assert.equal(event.loaded, index + 1);
      assert.equal(event.total, total);
      assert.equal(typeof event.label, 'string');
    });
    assert.ok(factionContainers.orks.hq?.stub);
    assert.ok(factionContainers.orks.soldier?.stub);
  });

  it('failed loads still advance progress and leave null containers', async () => {
    let calls = 0;
    const events = [];
    await loadFactionModels(undefined, ['ig'], {
      loadModel: async (url) => {
        calls += 1;
        if (calls === 2) throw new Error('boom');
        return { stub: url };
      },
      onProgress: (event) => events.push(event),
    });
    const total = countFactionModels(FACTIONS.ig);
    assert.equal(events.length, total);
    assert.equal(events[events.length - 1].loaded, total);
    assert.equal(factionContainers.ig.worker, null);
    assert.ok(factionContainers.ig.hq?.stub);
  });
});
