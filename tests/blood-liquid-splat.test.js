import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import * as THREE from 'three';

register('./node-esm-hooks.mjs', import.meta.url);
globalThis.window = {};
globalThis.document = { getElementById: () => null };
const sceneMod = await import('../src/scene.js');
const headlessScene = new THREE.Scene();
headlessScene._registerShadows = () => {};
sceneMod.__setSceneCameraForTests(headlessScene, { target: new THREE.Vector3() });
const { particles } = await import('../src/scene.js');
const { spawnBloodLiquid } = await import('../src/blood/blood-liquid-splat.js');

describe('liquid blood', () => {
  it('sprays mist plus gore, nothing else', () => {
    particles.length = 0;
    const n = spawnBloodLiquid({ x: 10, y: 1.1, z: 20 }, 1);
    assert.equal(n, 21);
    assert.equal(particles.length, 21);
    const mist = particles.filter((p) => p.life < 0.45);
    const gore = particles.filter((p) => p.life >= 0.5);
    assert.equal(mist.length, 14);
    assert.equal(gore.length, 7);
    const geo = particles[0].mesh.geometry;
    for (const d of particles) {
      assert.equal(d.mesh.geometry, geo, 'one shared droplet geometry');
      assert.ok(d.mesh.scale.y > d.mesh.scale.x, 'stretched along flight');
      assert.ok(d.vy > 0);
      assert.ok(d.noGravity === undefined, 'droplets fall');
      assert.ok(d.grow === undefined, 'no spreading puddles');
    }
    for (const g of gore) {
      assert.ok(g.mesh.scale.x > mist[0].mesh.scale.x, 'gore drops are bigger');
    }
    assert.equal(spawnBloodLiquid(null), 0);
    particles.length = 0;
  });

  it('escalates both tiers on kills', () => {
    particles.length = 0;
    const n = spawnBloodLiquid({ x: 0, y: 1.1, z: 0 }, 1.6);
    assert.equal(n, Math.round(14 * 1.6) + Math.round(7 * 1.6));
    particles.length = 0;
  });
});
