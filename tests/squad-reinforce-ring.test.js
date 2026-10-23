import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import * as THREE from 'three';

register('./node-esm-hooks.mjs', import.meta.url);
globalThis.window = {};
globalThis.document = { getElementById: () => null };
const systems = await import('../src/systems.js');
const entities = await import('../src/entities.js');
const sceneMod = await import('../src/scene.js');
{
  const headless = new THREE.Scene();
  headless._registerShadows = () => {};
  sceneMod.__setSceneCameraForTests(headless, { target: new THREE.Vector3() });
}

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
    has(id, type) {
      const m = comps.get(id);
      if (!m) return false;
      return type === undefined ? true : m.has(type);
    },
    query(...types) {
      const out = [];
      for (const [id, m] of comps) {
        if (types.every((t) => m.has(t))) out.push(id);
      }
      return out;
    },
    destroyEntity(id) {
      comps.delete(id);
    },
  };
}

// Selected squad that lost its formIdx-1 soldier in combat and is about to
// be reinforced through the real systemSquad flow. Slot 2 stays alive so the
// squad itself is not disbanded mid-tick.
function setupSelectedSquad() {
  const world = makeWorld();
  const squadId = world.createEntity();
  world.add(squadId, 'squad', {
    team: 'blue', faction: 'ig', unitType: 'guardsmen',
    position: new THREE.Vector3(0, 0, 0),
    facing: new THREE.Vector3(0, 0, 1), visualFacing: new THREE.Vector3(0, 0, 1),
    speed: 6, attackRange: 22, detectionRange: 40,
    grenadeCd: 0, grenadeReloadTime: 3, idleTime: 0,
    reinforceQueue: [{ formIdx: 1 }], reinforceProgress: 0,
    grenadeQueue: [], grenadeProgress: 0,
    moveOrder: null, stopped: true, capturingSpId: null,
    captureOrderSpId: null,
    selected: true, autoChase: false, projectileType: 'bullet',
    soldiers: [null, null, null], forcedTarget: null, forcedSoldierId: null, autoReinforce: false,
  });
  world.add(squadId, 'mesh', { hpBar: new THREE.Group(), reinBar: null, grenadeSetupBar: null });
  const keeperId = entities.createSoldierEntity(world, squadId, 2);
  world.get(squadId, 'squad').soldiers[2] = keeperId;
  return { world, squadId };
}

describe('reinforced soldiers keep the selection torus', () => {
  it('fresh rings become visible on a selected squad', () => {
    const { world, squadId } = setupSelectedSquad();
    systems.systemSquad(world, 7.5);
    const squad = world.get(squadId, 'squad');
    const soldierId = squad.soldiers[1];
    assert.ok(soldierId, 'reinforcement arrived');
    const root = world.get(soldierId, 'mesh').root;
    assert.ok(root._selDisc, 'factory ring present');
    assert.equal(root._selDisc.visible, true, 'torus visible while selected');
    assert.equal(root._selMat.opacity, 0.9);
  });

  it('unselected squads keep fresh rings hidden', () => {
    const { world, squadId } = setupSelectedSquad();
    world.get(squadId, 'squad').selected = false;
    systems.systemSquad(world, 7.5);
    const soldierId = world.get(squadId, 'squad').soldiers[1];
    assert.ok(soldierId, 'reinforcement arrived');
    const root = world.get(soldierId, 'mesh').root;
    assert.equal(root._selDisc.visible, false, 'no ring without selection');
  });
});
