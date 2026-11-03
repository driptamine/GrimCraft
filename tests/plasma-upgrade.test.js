import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { register } from 'node:module';

register('./node-esm-hooks.mjs', import.meta.url);
globalThis.window = {};
globalThis.document = { getElementById: () => null, querySelector: () => null };

const sceneMod = await import('../src/core/scene.js');
const headlessScene = new THREE.Scene();
headlessScene._registerShadows = () => {};
sceneMod.__setSceneCameraForTests(headlessScene, { target: new THREE.Vector3() });
const { World } = await import('../src/core/ecs.js');
const { systemSquad, _squadFireAll } = await import('../src/systems/squad.js');
const { upgradeToPlasma } = await import('../src/entities/entities.js');
const { FORMATION, PLAYER } = sceneMod;

const dt = 1 / 60;
let world;
let squadId;
let soldierId;

function blankRoot() {
  return new THREE.Group();
}

function addSquadWithPlasmaQueued() {
  squadId = world.createEntity([]);
  world.add(squadId, 'squad', {
    team: PLAYER, faction: 'ig', unitType: 'guardsmen',
    position: new THREE.Vector3(0, 0, 0),
    facing: new THREE.Vector3(0, 0, 1), visualFacing: new THREE.Vector3(0, 0, 1),
    speed: 6, attackRange: 22, detectionRange: 40,
    grenadeCd: 0, grenadeReloadTime: 3, idleTime: 0,
    reinforceQueue: [], reinforceProgress: 0, grenadeQueue: [], grenadeProgress: 0,
    plasmaQueue: [], plasmaProgress: 0,
    moveOrder: null, stopped: false, capturingSpId: null, selected: false,
    autoChase: false, projectileType: 'bullet',
    soldiers: [null],
    forcedTarget: null, forcedSoldierId: null, autoReinforce: false,
  });
  world.add(squadId, 'mesh', { root: blankRoot() });
  soldierId = world.createEntity([]);
  world.add(soldierId, 'soldier', {
    squadId, formIdx: 1, unitType: 'guardsmen', hp: 100, maxHp: 100,
    attackCooldown: 0, attackRate: 2, walkTime: 0, flashTimer: 0, shootTimer: 0,
    scatter: null, stagger: 0, flyAlt: 0, _flyStage: 0,
    isGrenadier: false, isSuperior: false, projectileType: null,
    moveSpeed: 6, idlePhase: 0, idleYawOffset: 0,
    cloaked: false, revealTimer: 0, damageMult: 1,
  });
  const root = blankRoot();
  root.position.set(0, 0, 0);
  world.add(soldierId, 'mesh', { root });
  const sq = world.get(squadId, 'squad');
  sq.soldiers[0] = soldierId;
  sq.plasmaQueue.push({ solId: soldierId });
}

beforeEach(() => {
  world = new World();
  addSquadWithPlasmaQueued();
});

describe('plasma upgrade queue', () => {
  it('completes one plasma upgrade after the build time and frees the queue', () => {
    for (let i = 0; i < Math.ceil(2.5 / dt); i += 1) {
      systemSquad(world, dt);
    }
    const soldier = world.get(soldierId, 'soldier');
    assert.equal(soldier.projectileType, 'plasma');
    assert.equal(world.get(squadId, 'squad').plasmaQueue.length, 0);
  });

  it('upgradeToPlasma assigns the personal plasma type', () => {
    upgradeToPlasma(world, soldierId);
    assert.equal(world.get(soldierId, 'soldier').projectileType, 'plasma');
  });

  it('an upgraded soldier fires plasma while the squad still fires bullets', () => {
    upgradeToPlasma(world, soldierId);
    const enemySoldier = world.createEntity([]);
    world.add(enemySoldier, 'soldier', { squadId: null });
    const enemyRoot = blankRoot();
    enemyRoot.position.set(10, 0, 0);
    world.add(enemySoldier, 'mesh', { root: enemyRoot });
    const sq = world.get(squadId, 'squad');
    _squadFireAll(world, squadId, sq, [soldierId], dt, { soldierEntityId: enemySoldier, distance: 10 });
    const bullets = world.query('bullet');
    assert.ok(bullets.length > 0, 'a shot was fired');
    const types = new Set(bullets.map((id) => world.get(id, 'bullet').projectileType));
    assert.ok(types.has('plasma'), 'upgraded soldier fires plasma');
  });
});
