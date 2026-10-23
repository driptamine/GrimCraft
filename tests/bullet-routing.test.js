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
const { PLAYER } = sceneMod;
const { World } = await import('../src/ecs.js');
const { systemBullet, systemPlasmaBullet } = await import('../src/systems.js');
const { createPlasmaBulletEntity } = await import('../src/entities.js');

// systemBullet must only fly plain tracer rounds. Plasma bolts carry the same
// 'bullet' component and are owned by systemPlasmaBullet; if systemBullet also
// processes them they age twice as fast, move at double speed, take gravity
// they were never meant to have, and die mid-field before reaching the target.
function spawnBolt(world, projectileType) {
  const id = world.createEntity([]);
  const root = new THREE.Group();
  root.position.set(0, 1.05, 0);
  world.add(id, 'bullet', {
    team: PLAYER,
    targetId: 9999, // no such soldier: pure flight, no hit branch
    age: 0,
    vx: 10,
    vy: 0,
    vz: 0,
    damage: 10,
    ...(projectileType ? { projectileType } : {}),
  });
  world.add(id, 'mesh', { root });
  return id;
}

describe('bullet routing', () => {
  it('systemBullet leaves plasma bolts alone', () => {
    const world = new World();
    const id = spawnBolt(world, 'plasma');
    systemBullet(world, 0.1);
    assert.ok(world.has(id, 'bullet'), 'plasma survives systemBullet');
    assert.equal(world.get(id, 'bullet').age, 0);
    assert.equal(world.get(id, 'mesh').root.position.x, 0);
    assert.equal(world.get(id, 'bullet').vy, 0);
  });

  it('systemBullet still flies regular tracers', () => {
    const world = new World();
    const id = spawnBolt(world, null);
    systemBullet(world, 0.1);
    assert.ok(world.has(id, 'bullet'));
    assert.equal(world.get(id, 'bullet').age, 0.1);
    assert.ok(Math.abs(world.get(id, 'mesh').root.position.x - 1.0) < 1e-9);
  });

  it('plasma advances exactly once per full system tick', () => {
    const world = new World();
    const id = spawnBolt(world, 'plasma');
    systemBullet(world, 0.1);
    systemPlasmaBullet(world, 0.1);
    assert.equal(world.get(id, 'bullet').age, 0.1);
    assert.ok(Math.abs(world.get(id, 'mesh').root.position.x - 1.0) < 1e-9);
  });

  it('plasma reaches a troop body and evaporates on impact', () => {
    const world = new World();
    world.addSystem(systemBullet);
    world.addSystem(systemPlasmaBullet);
    const target = world.createEntity([]);
    const targetRoot = new THREE.Group();
    targetRoot.position.set(20, 0, 0); // feet-anchored, like real soldiers
    world.add(target, 'soldier', { hp: 100, squadId: 0 });
    world.add(target, 'mesh', { root: targetRoot });
    const id = world.createEntity([]);
    const root = new THREE.Group();
    root.position.set(0, 1.05, 0);
    world.add(id, 'bullet', {
      team: PLAYER, targetId: target, age: 0,
      vx: 18, vy: 0, vz: 0, damage: 10, projectileType: 'plasma',
    });
    world.add(id, 'mesh', { root });
    for (let i = 0; i < 600 && world.has(id, 'bullet'); i++) {
      world.tick(1 / 60);
    }
    assert.ok(world.get(target, 'soldier').hp < 100, 'troop takes the hit');
    assert.ok(!world.has(id, 'bullet'), 'bolt evaporates on impact');
  });

  it('plasma spawns at double speed', () => {
    const world = new World();
    const target = world.createEntity([]);
    const targetRoot = new THREE.Group();
    targetRoot.position.set(20, 0, 0);
    world.add(target, 'mesh', { root: targetRoot });
    const id = createPlasmaBulletEntity(world, new THREE.Vector3(0, 0, 0), PLAYER, 0, target, 1);
    const bullet = world.get(id, 'bullet');
    const speed = Math.hypot(bullet.vx, bullet.vy, bullet.vz);
    assert.ok(speed >= 32 && speed <= 40, `spawn speed ${speed.toFixed(1)} in 2x band`);
  });

  it('enemy bullets still splash PLAYER apcs after the roster hoist', () => {
    const world = new World();
    const apc = world.createEntity([]);
    world.add(apc, 'apc', { team: PLAYER, hp: 100, position: new THREE.Vector3(5, 0, 0) });
    const id = spawnBolt(world, null);
    world.get(id, 'bullet').team = 'red';
    world.get(id, 'mesh').root.position.set(5, 1.0, 0);
    systemBullet(world, 0.1);
    assert.equal(world.get(apc, 'apc').hp, 100 - 10 * 0.4);
    world.tick(1 / 60);
    assert.ok(!world.has(id, 'bullet'), 'bullet consumed on impact');
  });

  it('bullets ignore distant apcs', () => {
    const world = new World();
    const apc = world.createEntity([]);
    world.add(apc, 'apc', { team: PLAYER, hp: 100, position: new THREE.Vector3(50, 0, 0) });
    const id = spawnBolt(world, null);
    systemBullet(world, 0.1);
    assert.equal(world.get(apc, 'apc').hp, 100);
    assert.ok(world.has(id, 'bullet'), 'bullet keeps flying');
  });
});
