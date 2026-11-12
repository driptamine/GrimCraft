import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { World } from '../src/core/ecs.js';
import { hasActiveConstructionWorker } from '../src/systems/construction.js';

test('only a living worker with an active order inside construction range contributes work', () => {
  const world = new World(), siteId = world.createEntity([]);
  const site = { team: 'blue', position: new THREE.Vector3(), deliveryTime: 1, deliveryProgress: 1 };
  const addWorker = () => {
    const id = world.createEntity([]), root = new THREE.Group();root.position.set(4.85, 20, 0);
    const worker = { team: 'blue', hp: 100, isBuilding: true, buildTarget: { pendingEntityId: siteId }, buildTargetSP: null, moveTarget: null, repairTarget: null };
    world.add(id, 'builder', worker);world.add(id, 'mesh', { root });
    return { id, root, worker };
  };
  const { id, root, worker } = addWorker();
  assert.equal(hasActiveConstructionWorker(world, siteId, site), true, 'terrain height does not change horizontal work range');
  worker.isBuilding = false;assert.equal(hasActiveConstructionWorker(world, siteId, site), false);
  worker.isBuilding = true;worker.moveTarget = new THREE.Vector3(30, 0, 0);assert.equal(hasActiveConstructionWorker(world, siteId, site), false);
  worker.moveTarget = null;root.position.x = 30;assert.equal(hasActiveConstructionWorker(world, siteId, site), false);
  root.position.x = 4.85;worker.hp = 0;assert.equal(hasActiveConstructionWorker(world, siteId, site), false);
  worker.hp = 100;worker.buildTarget.pendingEntityId = siteId + 100;assert.equal(hasActiveConstructionWorker(world, siteId, site), false);
  const second = addWorker();assert.equal(hasActiveConstructionWorker(world, siteId, site), true, 'another active worker can continue the same site');
  world.destroyEntity(second.id);world._flushDestroyed();assert.equal(hasActiveConstructionWorker(world, siteId, site), false);
  worker.buildTarget.pendingEntityId = siteId;site.deliveryProgress = .5;
  assert.equal(hasActiveConstructionWorker(world, siteId, site), false, 'assembly waits for the initial delivery');
});
