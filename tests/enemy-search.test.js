import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import * as THREE from 'three';

register('./node-esm-hooks.mjs', import.meta.url);
globalThis.window = {};
globalThis.document = { getElementById: () => null };
const { findClosestEnemySoldier } = await import('../src/systems.js');

function makeWorld() {
  const comps = new Map();
  let nextId = 1;
  return {
    createEntity() {
      const id = nextId++;
      comps.set(id, new Map());
      return id;
    },
    add(id, type, data) {
      comps.get(id).set(type, data);
    },
    get(id, type) {
      return comps.get(id)?.get(type);
    },
    query(...types) {
      const out = [];
      for (const [id, m] of comps) {
        if (types.every((t) => m.has(t))) out.push(id);
      }
      return out;
    },
  };
}

function addSoldier(world, x, z, opts = {}) {
  const id = world.createEntity();
  world.add(id, 'soldier', { cloaked: false, revealTimer: 0, ...opts });
  if (!opts.noMesh) {
    world.add(id, 'mesh', { root: { position: new THREE.Vector3(x, 0, z) } });
  }
  return id;
}

function addSquad(world, team, soldiers) {
  const id = world.createEntity();
  world.add(id, 'squad', { team, soldiers, position: new THREE.Vector3(0, 0, 0) });
  return id;
}

const at = (x, z) => new THREE.Vector3(x, 0, z);

describe('findClosestEnemySoldier', () => {
  it('picks the geometrically closest enemy and reports exact distance', () => {
    const world = makeWorld();
    addSquad(world, 'blue', []);
    addSquad(world, 'red', [addSoldier(world, 30, 0), addSoldier(world, 10, 0), addSoldier(world, 20, 0)]);
    const hit = findClosestEnemySoldier(world, 'blue', at(0, 0));
    assert.equal(hit.distance, 10);
    assert.equal(world.get(hit.soldierEntityId, 'mesh').root.position.x, 10);
  });

  it('skips same-team squads, cloaked soldiers, dead slots and missing parts', () => {
    const world = makeWorld();
    addSquad(world, 'blue', [addSoldier(world, 1, 0)]);
    addSquad(world, 'red', [
      null,
      addSoldier(world, 5, 0, { cloaked: true, revealTimer: 0 }),
      addSoldier(world, 7, 0, { noMesh: true }),
      addSoldier(world, 12, 0),
    ]);
    const ghost = world.createEntity();
    world.add(ghost, 'soldier', {});
    addSquad(world, 'red', [ghost, addSoldier(world, 50, 0)]);
    const hit = findClosestEnemySoldier(world, 'blue', at(0, 0));
    assert.equal(hit.distance, 12);
  });

  it('returns null when no enemy soldier qualifies', () => {
    const world = makeWorld();
    addSquad(world, 'blue', [addSoldier(world, 3, 0)]);
    assert.equal(findClosestEnemySoldier(world, 'blue', at(0, 0)), null);
    assert.equal(findClosestEnemySoldier(world, 'red', at(0, 0))?.distance, 3);
  });

  it('honors a precomputed squad list identically to the default scan', () => {
    const world = makeWorld();
    const far = addSquad(world, 'red', [addSoldier(world, 40, 0)]);
    const near = addSquad(world, 'red', [addSoldier(world, 8, 0)]);
    const all = world.query('squad');
    const a = findClosestEnemySoldier(world, 'blue', at(0, 0));
    const b = findClosestEnemySoldier(world, 'blue', at(0, 0), all);
    assert.equal(a.soldierEntityId, b.soldierEntityId);
    assert.equal(b.distance, 8);
    const subset = findClosestEnemySoldier(world, 'blue', at(0, 0), [far, near].filter((id) => id === far));
    assert.equal(subset.distance, 40);
    assert.equal(findClosestEnemySoldier(world, 'blue', at(0, 0), []), null);
  });
});
