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
const { particles } = sceneMod;
const {
  makeBulletMesh, makeLaserBulletMesh, makePlasmaBulletMesh, makeGrenadeMesh,
} = await import('../src/meshes.js');
const { spawnParticles } = await import('../src/systems.js');
const { disposeObj } = await import('../src/three-helpers.js');

// High-rate throwaways (shots, hit particles) share one BufferGeometry per
// type instead of allocating + uploading a fresh one per instance.
describe('projectile geometry sharing', () => {
  it('reuses one shared geometry per projectile type', () => {
    const pairs = [
      [makeBulletMesh(), makeBulletMesh()],
      [makeLaserBulletMesh(), makeLaserBulletMesh()],
      [makePlasmaBulletMesh(), makePlasmaBulletMesh()],
      [makeGrenadeMesh(), makeGrenadeMesh()],
    ];
    for (const [a, b] of pairs) {
      const geo = a.geometry ?? a.children[0]?.geometry;
      const other = b.geometry ?? b.children[0]?.geometry;
      assert.ok(geo, 'mesh has geometry');
      assert.equal(geo, other, 'same geometry object across calls');
      assert.equal(geo.userData.shared, true, 'marked shared for disposeObj');
    }
  });

  it('keeps the original dimensions', () => {
    assert.deepEqual(
      [makeBulletMesh().geometry.parameters.width, makeBulletMesh().geometry.parameters.depth],
      [0.04, 0.5],
    );
    assert.equal(makeLaserBulletMesh().geometry.parameters.depth, 8.0);
    assert.ok(makePlasmaBulletMesh().geometry instanceof THREE.IcosahedronGeometry);
    assert.equal(makeGrenadeMesh().children[0].geometry.parameters.radius, 0.275);
  });

  it('snapshots particle color instead of aliasing the input', () => {
    const before = particles.length;
    const color = new THREE.Color(0.2, 0.4, 0.6);
    spawnParticles(new THREE.Vector3(0, 0, 0), color, 1);
    color.setRGB(1, 1, 1);
    const mat = particles[particles.length - 1].material;
    assert.ok(Math.abs(mat.color.r - 0.2) < 1e-6, 'material keeps the spawn-time color');
    particles.length = before;
  });

  it('shares particle geometry and survives disposal', () => {
    const before = particles.length;
    spawnParticles(new THREE.Vector3(0, 0, 0), new THREE.Color(1, 1, 1), 3);
    const fresh = particles.slice(before);
    assert.equal(fresh.length, 3);
    assert.equal(fresh[0].mesh.geometry, fresh[1].mesh.geometry);
    assert.equal(fresh[0].mesh.geometry.userData.shared, true);
    disposeObj(fresh[0].mesh);
    assert.equal(fresh[1].mesh.geometry, fresh[2].mesh.geometry, 'shared geo intact after a sibling dies');
    particles.length = before;
  });
});
