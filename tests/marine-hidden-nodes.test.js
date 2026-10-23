import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';

register('./node-esm-hooks.mjs', import.meta.url);
const { default: marines } = await import('../src/factions/space-marines.js');

describe('space marines faction config', () => {
  it('space marine hides banner and alternate weapons', () => {
    const marine = marines.infantry.find((u) => u.model === 'models/space marines/troops/space_marine.glb');
    assert.ok(marine, 'marine entry exists');
    for (const name of [
      'marine_missile_launcher',
      'marine_missile',
      'marine_knife',
      'marine_heavy_bolter_wheel',
      'marine_heavy_bolter_belt',
      'marine_heavy_bolter_backpack',
      'marine_heavy_bolter',
      'marine_grenade',
      'marine_flamer',
      'marine_banner_rod',
      'marine_banner',
      'marine_backpack_missiles',
    ]) {
      assert.ok(marine.hiddenNodes.includes(name), `${name} is hidden`);
    }
  });
});
