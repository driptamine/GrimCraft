import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';

register('./node-esm-hooks.mjs', import.meta.url);
globalThis.document = { getElementById: () => null, querySelector: () => null };
const { cameraAlphaForMap, cameraRadiusForMap, cameraFarForRadius, cameraTargetForMap } = await import('../src/sgb-upload.js');

describe('sgb camera yaw per map', () => {
  it('keeps alvarus on the tuned 315° alpha', () => {
    assert.equal(cameraAlphaForMap('/maps/6p_alvarus/6p_alvarus.sgb'), (7 * Math.PI) / 4);
    assert.equal(cameraAlphaForMap('6p alvarus.sgb'), (7 * Math.PI) / 4);
  });

  it('uses the tuned fixed radius on alvarus, fit elsewhere', () => {
    assert.equal(cameraRadiusForMap('/maps/6p_alvarus/6p_alvarus.sgb', 1320), 55);
    assert.equal(cameraRadiusForMap('6p alvarus.sgb', 1320), 55);
    assert.equal(cameraRadiusForMap('/maps/6p_mortalis/6p_mortalis.sgb', 1320), 1320);
    assert.equal(cameraRadiusForMap('', 1320), 1320);
  });

  it('pushes the far plane past the camera on big maps', () => {
    assert.ok(Math.abs(cameraFarForRadius(3000, 5160) - 6192) < 1e-6);
    assert.ok(Math.abs(cameraFarForRadius(3000, 2600) - 3120) < 1e-6);
    assert.equal(cameraFarForRadius(8000, 2600), 8000);
  });

  it('keeps every other map on the π yaw', () => {
    const paths = [
      '/maps/4p_doom_spiral/4p_doom_spiral.sgb',
      '/maps/4p_into_the_breach/4p_into_the_breach.sgb',
      '/maps/6p_mortalis/6p_mortalis.sgb',
      '/maps/6p_parmenie/6p_parmenie.sgb',
      '/maps/6p_vandea_coast/6p_vandea_coast.sgb',
      '/maps/8p_burial_grounds/8p_burial_grounds.sgb',
      '/maps/8p_oasis_of_sharr/8p_oasis_of_sharr.sgb',
      '',
      null,
      undefined,
    ];
    for (const p of paths) {
      assert.equal(cameraAlphaForMap(p), Math.PI, String(p));
    }
  });

  it('targets the blue IG base instead of the terrain center', () => {
    assert.deepEqual(
      cameraTargetForMap('/maps/6p_alvarus/6p_alvarus.sgb', { x: 0, y: 5, z: 0 }),
      { x: 14.76, y: 0, z: -102.98 },
    );
    assert.deepEqual(
      cameraTargetForMap('arena', { x: 0, y: 5, z: 0 }),
      { x: -74, y: 0, z: -110 },
    );
  });
});
