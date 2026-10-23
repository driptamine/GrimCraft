import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';

register('./node-esm-hooks.mjs', import.meta.url);
const { default: chaos } = await import('../src/factions/chaos.js');

describe('chaos faction config', () => {
  it('chaos space marine hides banner, rod and alternate weapons', () => {
    const marine = chaos.infantry.find((u) => u.model === 'models/chaos/infantry/chaos_space_marine.glb');
    assert.ok(marine, 'marine entry exists');
    for (const name of [
      'chaos_banner',
      'marine_sergeant_banner_rod',
      'chaos_rocket_launcher',
      'chaos_heavy_bolter',
      'chaos_heavy_bolter_belt',
      'chaos_missiles',
      'chaos_knife',
      'chaos_plasma_rifle',
      'chaos_flamer',
    ]) {
      assert.ok(marine.hiddenNodes.includes(name), `${name} is hidden`);
    }
    // Default bolter stays visible.
    assert.ok(!marine.hiddenNodes.includes('chaos_bolter'));
  });
});
