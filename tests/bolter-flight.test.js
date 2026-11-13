import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { World } from '../src/core/ecs.js';

globalThis.window = {};
globalThis.document = { getElementById: () => null, querySelector: () => null };
const state = await import('../src/core/scene.js');
const scene = new THREE.Scene();scene._registerShadows = () => {};
state.__setSceneCameraForTests(scene, { target: new THREE.Vector3() });
const { createBulletEntity } = await import('../src/entities/entities.js');
const { systemBullet } = await import('../src/systems/projectiles.js');

beforeEach(() => { window._multiplayerMode = false;window.__sgbTerrainRoot = null;window.__sgbSampleHeight = null;scene.clear();state.particles.length = 0; });
function shot({ distance = 25, shooterHeight = 0, targetHeight = shooterHeight } = {}) {
  window.__sgbTerrainRoot = new THREE.Group();
  window.__sgbSampleHeight = x => shooterHeight + (targetHeight - shooterHeight) * Math.max(0, Math.min(1, x / distance));
  const world = new World(), shooter = world.createEntity([]), target = world.createEntity([]);
  world.add(shooter, 'soldier', { unitType: 'chaos_space_marine', weapon: 'bolter' });
  world.add(target, 'soldier', { hp: 100, maxHp: 100 });
  const targetRoot = new THREE.Group();targetRoot.position.set(distance, targetHeight, 0);scene.add(targetRoot);
  world.add(target, 'mesh', { root: targetRoot });
  const origin = new THREE.Vector3(0, shooterHeight, 0);
  const id = createBulletEntity(world, origin, 'red', shooter, target, 1, 10);
  return { world, id, target, targetRoot, origin, root: world.get(id, 'mesh').root };
}
test('Chaos bolter reaches full range at 60, 30 and 10 FPS on flat and elevated maps', () => {
  for (const height of [0, 8, 10]) {
    for (const delta of [1/60, 1/30, .1]) {
      for (let attempt = 0; attempt < 8; attempt++) {
        const f = shot({ shooterHeight: height });
        assert.equal(f.root.position.y, height + 1.05);
        assert.equal(f.origin.y, height, 'do not mutate the soldier position');
        for (let tick = 0; tick < 100 && f.world.has(f.id, 'bullet'); tick++) { systemBullet(f.world, delta);f.world._flushDestroyed(); }
        assert.equal(f.world.get(f.target, 'soldier').hp, 90, `height ${height}, dt ${delta}`);
        assert.equal(f.world.has(f.id, 'bullet'), false);
      }
    }
  }
});
test('rounds aim at the body when shooting uphill and downhill', () => {
  for (const [shooterHeight, targetHeight] of [[0, 5], [10, 3], [8, 12]]) {
    const f = shot({ shooterHeight, targetHeight });
    for (let tick = 0; tick < 120 && f.world.has(f.id, 'bullet'); tick++) { systemBullet(f.world, 1/30);f.world._flushDestroyed(); }
    assert.equal(f.world.get(f.target, 'soldier').hp, 90);
  }
});
test('a round crossing the target between frames hits once before entity cleanup', () => {
  const f = shot({ distance: 5 });
  systemBullet(f.world, .3);
  assert.equal(f.world.get(f.target, 'soldier').hp, 90);
  systemBullet(f.world, .01);
  assert.equal(f.world.get(f.target, 'soldier').hp, 90, 'deferred removal cannot apply damage twice');
});
test('lifetime covers extended weapon ranges and missed rounds still expire', () => {
  const f = shot({ distance: 100 });
  assert.ok(f.world.get(f.id, 'bullet').lifetime > 2);
  for (let tick = 0; tick < 200 && f.world.has(f.id, 'bullet'); tick++) { systemBullet(f.world, 1/30);f.world._flushDestroyed(); }
  assert.equal(f.world.get(f.target, 'soldier').hp, 90);
  const missed = shot();missed.targetRoot.position.z = 20;
  for (let tick = 0; tick < 200 && missed.world.has(missed.id, 'bullet'); tick++) { systemBullet(missed.world, 1/30);missed.world._flushDestroyed(); }
  assert.equal(missed.world.get(missed.target, 'soldier').hp, 100);
  assert.equal(missed.world.has(missed.id, 'bullet'), false);
});
