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
const { _builderCombat } = await import('../src/systems/builder.js');

function makeWorld() {
  return new World();
}

function addSoldier(world, x, hp = 100) {
  const id = world.createEntity([]);
  world.add(id, 'soldier', { hp, maxHp: 100, squadId: null, cloaked: false, revealTimer: 0 });
  const root = new THREE.Group();
  root.position.set(x, 0, 0);
  world.add(id, 'mesh', { root });
  return id;
}

function addSquad(world, team, soldierIds, x = 0) {
  const id = world.createEntity([]);
  const soldiers = soldierIds.map((sid) => {
    if (sid !== null) {
      world.get(sid, 'soldier').squadId = id;
    }
    return sid;
  });
  world.add(id, 'squad', { team, soldiers, position: new THREE.Vector3(x, 0, 0) });
  return id;
}

function addBuilder(world, opts = {}) {
  const id = world.createEntity([]);
  const root = new THREE.Group();
  root.position.set(0, 0, 0);
  world.add(id, 'builder', {
    team: PLAYER, attackMove: true, stance: 'stand', meleeOrder: false,
    attackRange: 12, attackCd: 0, attackDamage: 10, repairTarget: null,
    moveTarget: { x: 1, z: 1 }, ...opts,
  });
  world.add(id, 'mesh', { root });
  return { id, b: world.get(id, 'builder'), m: world.get(id, 'mesh') };
}

// Builder auto-engage uses squared comparisons; winners must match the
// plain-distance behavior: nearest in-range enemy squad, nothing else.
describe('builder aggro', () => {
  it('engages the nearest in-range enemy and clears the move order', () => {
    const world = makeWorld();
    const far = addSoldier(world, 13);
    addSquad(world, 'red', [far], 13);
    const near = addSoldier(world, 5);
    addSquad(world, 'red', [near], 5);
    const { b, m } = addBuilder(world);
    _builderCombat(world, b, m, 0.1);
    assert.equal(b.moveTarget, null);
    assert.ok(world.get(near, 'soldier').hp < 100, 'nearest soldier damaged');
    assert.equal(world.get(far, 'soldier').hp, 100, 'far soldier untouched');
  });

  it('ignores same-team squads and targets beyond aggro range', () => {
    const world = makeWorld();
    const friend = addSoldier(world, 3);
    addSquad(world, PLAYER, [friend], 3);
    const distant = addSoldier(world, 40);
    addSquad(world, 'red', [distant], 40);
    const { b, m } = addBuilder(world);
    _builderCombat(world, b, m, 0.1);
    assert.deepEqual(b.moveTarget, { x: 1, z: 1 });
    assert.equal(world.get(friend, 'soldier').hp, 100);
    assert.equal(world.get(distant, 'soldier').hp, 100);
  });

  it('melee stance uses the short 8-unit aggro radius', () => {
    const world = makeWorld();
    const mid = addSoldier(world, 10);
    addSquad(world, 'red', [mid], 10);
    const { b, m } = addBuilder(world, { meleeOrder: true });
    _builderCombat(world, b, m, 0.1);
    assert.deepEqual(b.moveTarget, { x: 1, z: 1 }, '10u ignored in melee stance');
    assert.equal(world.get(mid, 'soldier').hp, 100);
  });
});
