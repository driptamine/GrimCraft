import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import * as THREE from 'three';

register('./node-esm-hooks.mjs', import.meta.url);
globalThis.window = {};
globalThis.document = { getElementById: () => null };
const systems = await import('../src/systems.js');
const { FORMATION } = await import('../src/scene.js');

const ONESHOT_TICKS = 30;
const DT = 1 / 60;

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

function stubRoot(entries, x, z) {
  const root = new THREE.Group();
  root.position.set(x, 0, z);
  root._animGroups = { idle: {}, run: {}, shoot: {}, shootMove: {}, flagPlant1: {}, flagPlant2: {}, capture1: {}, capture2: {} };
  root._currentAnim = 'idle';
  root._pendingEnd = null;
  root._playAnim = function (name, loop = true) {
    if (root._currentAnim === name) return;
    entries.push(name);
    root._currentAnim = name;
    root._pendingEnd = loop ? null : ONESHOT_TICKS;
  };
  return root;
}

function setupCapture() {
  const world = makeWorld();
  const spId = world.createEntity();
  world.add(spId, 'strategicPoint', {
    kind: 'point', position: new THREE.Vector3(0, 0, 0), owner: null, faction: null,
    captureProgress: 0, captureRadius: 4.5, hasListeningPost: false, hasTowerBase: false,
    lpTier: 0, researchQueue: [], reqTimer: 0, lpMesh: null,
  });
  world.add(spId, 'mesh', { root: new THREE.Group(), model: null });
  const squadId = world.createEntity();
  const soldiers = [null];
  const entriesBySoldier = {};
  for (let i = 1; i <= 5; i++) {
    const sid = world.createEntity();
    world.add(sid, 'soldier', {
      squadId, formIdx: i, unitType: 'guardsmen', hp: 100, maxHp: 100,
      attackCooldown: 0, attackRate: 2.4, walkTime: 0, flashTimer: 0, shootTimer: 0,
      scatter: null, stagger: 0, isGrenadier: false, isSuperior: i === 1,
      moveSpeed: 6, idlePhase: 0, idleYawOffset: 0, cloaked: false, revealTimer: 0, damageMult: 1,
    });
    const entries = [];
    entriesBySoldier[sid] = entries;
    const f = FORMATION[i];
    world.add(sid, 'mesh', { root: stubRoot(entries, 30 + f.x, f.z) });
    soldiers.push(sid);
  }
  world.add(squadId, 'squad', {
    team: 'blue', faction: 'ig', unitType: 'guardsmen',
    position: new THREE.Vector3(30, 0, 0),
    facing: new THREE.Vector3(0, 0, 1), visualFacing: new THREE.Vector3(0, 0, 1),
    speed: 6, attackRange: 22, detectionRange: 40,
    grenadeCd: 0, grenadeReloadTime: 3, idleTime: 0,
    reinforceQueue: [], reinforceProgress: 0, grenadeQueue: [], grenadeProgress: 0,
    moveOrder: new THREE.Vector3(0, 0, 0), stopped: false, capturingSpId: null,
    // Right-click orders set both: the move plus the explicit capture order.
    captureOrderSpId: spId,
    selected: false, autoChase: false, projectileType: 'beam',
    soldiers, forcedTarget: null, forcedSoldierId: null, autoReinforce: false,
  });
  world.add(squadId, 'mesh', { hpBar: new THREE.Group(), reinBar: null, grenadeSetupBar: null });
  return { world, spId, squadId, soldiers, entriesBySoldier };
}

function runCapture({ volleys = false } = {}) {
  const { world, spId, squadId, soldiers, entriesBySoldier } = setupCapture();
  const squad = world.get(squadId, 'squad');
  const alive = soldiers.slice(1);
  const planter = world.get(alive[0], 'soldier');
  let lastStage = 'init';
  let resetsWhileEngaged = 0;
  let sawBanner = false;
  for (let tick = 0; tick < 2400; tick++) {
    for (const sid of alive) {
      const root = world.get(sid, 'mesh').root;
      if (root._pendingEnd !== null) {
        root._pendingEnd -= 1;
        if (root._pendingEnd <= 0) {
          root._pendingEnd = null;
          root._currentAnim = null;
        }
      }
      const s = world.get(sid, 'soldier');
      s.shootTimer = Math.max(0, s.shootTimer - DT);
      if (volleys && tick >= 220 && tick <= 620 && tick % 40 === 0) {
        s.shootTimer = 0.4;
      }
    }
    systems.systemSquad(world, DT);
    const stage = planter.captureStage;
    if (lastStage !== 'init' && lastStage !== 0 && stage === 0 && squad.capturingSpId != null) {
      resetsWhileEngaged++;
    }
    lastStage = stage;
    if (planter._bannerShown === true && stage < 2) {
      sawBanner = true;
    }
  }
  return { world, spId, squadId, alive, entriesBySoldier, resetsWhileEngaged, sawBanner };
}

function countEntries(entries, name) {
  return entries.filter((n) => n === name).length;
}

describe('capture sequence integration', () => {
  it('plays every capture clip exactly once in a peaceful capture', () => {
    const { world, spId, alive, entriesBySoldier, resetsWhileEngaged, sawBanner } = runCapture();
    assert.equal(resetsWhileEngaged, 0);
    const planterEntries = entriesBySoldier[alive[0]];
    assert.equal(countEntries(planterEntries, 'flagPlant1'), 1);
    assert.equal(countEntries(planterEntries, 'flagPlant2'), 1);
    assert.equal(countEntries(planterEntries, 'capture1'), 1);
    assert.equal(world.get(alive[0], 'soldier')._captureDone, true);
    assert.equal(world.get(alive[0], 'mesh').root._currentAnim, 'idle');
    assert.equal(sawBanner, true);
    assert.equal(world.get(alive[0], 'soldier')._bannerShown, false);
    const planterPos = world.get(alive[0], 'mesh').root.position;
    const standOff = Math.hypot(planterPos.x, planterPos.z);
    assert.ok(Math.abs(standOff - 4.0) < 0.15, `planter stands off at ${standOff}`);
    assert.ok(standOff < 4.5, 'planter keeps boots on the point');
    // Every guard plays capture1 once, then replays capture2 until the flip.
    for (const idx of [1, 2, 3, 4]) {
      assert.equal(countEntries(entriesBySoldier[alive[idx]], 'capture1'), 1);
      assert.ok(countEntries(entriesBySoldier[alive[idx]], 'capture2') > 1, `guard ${idx} replays capture2`);
      assert.equal(world.get(alive[idx], 'soldier')._captureDone, true);
      assert.equal(world.get(alive[idx], 'mesh').root._currentAnim, 'idle');
    }
    const sp = world.get(spId, 'strategicPoint');
    assert.equal(sp.captureProgress, 1);
    assert.equal(sp.owner, 'blue');
    assert.equal(typeof sp.raiseFrom, 'number');
    assert.ok(sp.raiseFrom >= 0 && sp.raiseFrom < 1);
  });

  it('never restarts the sequence on combat interruptions', () => {
    const { world, spId, alive, resetsWhileEngaged } = runCapture({ volleys: true });
    assert.equal(resetsWhileEngaged, 0);
    assert.equal(world.get(alive[0], 'soldier')._captureDone, true);
    assert.equal(world.get(alive[1], 'soldier')._captureDone, true);
    const sp = world.get(spId, 'strategicPoint');
    assert.equal(sp.captureProgress, 1);
    assert.equal(sp.owner, 'blue');
  });
});
