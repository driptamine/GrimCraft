import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { register } from 'node:module';

register('./node-esm-hooks.mjs', import.meta.url);
globalThis.window = {};
globalThis.document = { getElementById: () => null, querySelector: () => null };

const sceneMod = await import('../src/scene.js');
const headlessScene = new THREE.Scene();
headlessScene._registerShadows = () => {};
sceneMod.__setSceneCameraForTests(headlessScene, { target: new THREE.Vector3() });
const { World } = await import('../src/ecs.js');
const { systemSquad, systemSoldier } = await import('../src/systems.js');
const { FORMATION, PLAYER, SQUAD_MAX } = sceneMod;

const dt = 1 / 60;
let world;
let squad;
let log;

function makeRoot(tag) {
  const root = new THREE.Group();
  root._playAnim = (name, loop, force) => { log.push({ tag, name, force: !!force }); };
  return root;
}

function hpBar() {
  const g = new THREE.Group();
  g._fg = { scale: new THREE.Vector3(1, 1, 1), position: new THREE.Vector3() };
  g._bg = {};
  g._width = 1;
  return g;
}

function addSquad(n) {
  const squadId = world.createEntity([]);
  world.add(squadId, 'squad', {
    team: PLAYER, faction: 'ig', unitType: 'guardsmen',
    position: new THREE.Vector3(0, 0, 0),
    facing: new THREE.Vector3(0, 0, 1), visualFacing: new THREE.Vector3(0, 0, 1),
    speed: 6, attackRange: 22, detectionRange: 40,
    grenadeCd: 0, grenadeReloadTime: 3, idleTime: 0,
    reinforceQueue: [], reinforceProgress: 0, grenadeQueue: [], grenadeProgress: 0,
    moveOrder: null, stopped: false, capturingSpId: null, selected: false,
    autoChase: false, projectileType: 'bullet',
    soldiers: Array(SQUAD_MAX).fill(null),
    forcedTarget: null, forcedSoldierId: null, autoReinforce: false,
  });
  world.add(squadId, 'mesh', { root: makeRoot('sq'), hpBar: hpBar() });
  const comp = world.get(squadId, 'squad');
  for (let i = 1; i <= n; i++) {
    const id = world.createEntity([]);
    const f = FORMATION[i];
    const root = makeRoot(`s${i}`);
    root.position.set(f.x, 0, f.z);
    world.add(id, 'soldier', {
      squadId, formIdx: i, unitType: 'guardsmen', hp: 100, maxHp: 100,
      attackCooldown: 0, attackRate: 2, walkTime: 0, flashTimer: 0, shootTimer: 0,
      scatter: null, stagger: 0, isGrenadier: false, isSuperior: false,
      moveSpeed: 6, idlePhase: 0, idleYawOffset: 0, cloaked: false, revealTimer: 0,
      damageMult: 1, captureStage: 0, _guardStage: 0, _capturePrev: null,
      _captureDone: false, _planterBackedOff: false, _captureKey: null, _fleeing: false,
    });
    world.add(id, 'mesh', { root, hpBar: hpBar() });
    comp.soldiers[i] = id;
  }
  return comp;
}

function frames(n) {
  for (let f = 0; f < n; f++) {
    systemSoldier(world, dt);
    systemSquad(world, dt);
  }
}

function s1reqs() {
  return log.filter((e) => e.tag === 's1');
}

beforeEach(() => {
  world = new World();
  log = [];
  squad = addSquad(3);
});

describe('squad anim transitions', () => {
  it('Q freezes formation settling and idles on the same frame', () => {
    squad.moveOrder = { x: 60, z: 0 };
    squad.stopped = false;
    frames(30);
    const positions = () => squad.soldiers.filter(Boolean).map((id) => world.get(id, 'mesh').root.position.clone());
    // Q stop
    squad.moveOrder = null;
    squad.stopped = true;
    log = [];
    systemSoldier(world, dt);
    systemSquad(world, dt);
    const first = s1reqs();
    assert.equal(first.length, 1);
    assert.equal(first[0].name, 'idle');
    assert.equal(first[0].force, true);
    const frozen = positions();
    frames(60);
    const still = positions();
    for (let i = 0; i < frozen.length; i++) {
      // XZ only: breathing bob still moves Y (visual only).
      const dx = still[i].x - frozen[i].x;
      const dz = still[i].z - frozen[i].z;
      assert.equal(Math.hypot(dx, dz), 0);
    }
    assert.ok(s1reqs().every((e) => e.name === 'idle'));
  });

  it('RMB after stop requests run on the same frame', () => {
    squad.moveOrder = null;
    squad.stopped = true;
    frames(10);
    squad.moveOrder = { x: -40, z: 10 };
    squad.stopped = false;
    log = [];
    systemSoldier(world, dt);
    systemSquad(world, dt);
    const first = s1reqs();
    assert.equal(first.length, 1);
    assert.equal(first[0].name, 'run');
    assert.equal(first[0].force, true);
  });

  it('arrival still settles into formation naturally (no force)', () => {
    squad.moveOrder = { x: 60, z: 0 };
    squad.stopped = false;
    frames(30);
    // Teleport near the order so arrival clears it next frame.
    squad.position.set(59.8, 0, 0);
    // Keep the formation glued to the squad, then scatter one soldier.
    for (const soldierId of squad.soldiers.filter(Boolean)) {
      const soldier = world.get(soldierId, 'soldier');
      const f = FORMATION[soldier.formIdx];
      const r = world.get(soldierId, 'mesh').root;
      r.position.set(59.8 + f.x, 0, f.z);
    }
    const root = world.get(squad.soldiers[1], 'mesh').root;
    root.position.x += 3;
    log = [];
    systemSoldier(world, dt);
    systemSquad(world, dt);
    assert.equal(squad.moveOrder, null);
    assert.equal(squad.stopped, false);
    const names = s1reqs().map((e) => e.name);
    assert.ok(names.includes('run'), 'settling soldier keeps running');
    assert.ok(s1reqs().every((e) => e.force === false), 'arrival is not an edge');
    const before = root.position.clone();
    frames(240);
    assert.ok(root.position.distanceTo(before) > 1, 'soldier walks to its slot');
    const tail = s1reqs();
    assert.equal(tail[tail.length - 1].name, 'idle');
  });

  it('steady frames never force', () => {
    squad.moveOrder = { x: 60, z: 0 };
    squad.stopped = false;
    frames(60);
    assert.ok(log.every((e) => e.force === false));
  });
});
