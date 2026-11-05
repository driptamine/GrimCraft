import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { World } from '../src/core/ecs.js';
import { updateMeleeEngagements } from '../src/combat/melee-engagements.js';

globalThis.window = {};
globalThis.document = { getElementById: () => null, querySelector: () => null };
const scene = await import('../src/core/scene.js');
const headless = new THREE.Scene();
headless._registerShadows = () => {};
scene.__setSceneCameraForTests(headless, { target: new THREE.Vector3() });
const { createSquadEntity } = await import('../src/entities/entities.js');
const { systemSoldier, systemSquad } = await import('../src/systems/squad.js');

function addSquad(world, team, x, count, attackMode = 'ranged') {
  const id = world.createEntity([]);
  const squad = { team, attackMode, detectionRange: 40, position: new THREE.Vector3(x, 0, 0), soldiers: [], stopped: false };
  world.add(id, 'squad', squad);
  for (let i = 0; i < count; i++) {
    const soldierId = world.createEntity([]);
    world.add(soldierId, 'soldier', { squadId: id, hp: 100, attackCooldown: 0, shootTimer: 0 });
    const root = new THREE.Group();
    root.position.set(x, 0, i * 3);
    world.add(soldierId, 'mesh', { root });
    squad.soldiers.push(soldierId);
  }
  return { id, squad, soldiers: squad.soldiers };
}

describe('melee opponent assignment', () => {
  it('pairs equal squads reciprocally even when the order clicked one specific soldier', () => {
    const world = new World();
    const blue = addSquad(world, 'blue', -0.8, 3, 'melee');
    const red = addSquad(world, 'red', 0.8, 3);
    blue.squad.forcedSoldierId = red.soldiers[0];
    updateMeleeEngagements(world, [blue.id, red.id]);
    const targets = blue.soldiers.map((id) => world.get(id, 'soldier').meleeTargetId);
    assert.equal(new Set(targets).size, 3, 'all attackers get different opponents');
    for (const id of blue.soldiers) {
      const attacker = world.get(id, 'soldier');
      const defender = world.get(attacker.meleeTargetId, 'soldier');
      assert.equal(defender.meleeTargetId, id);
      assert.equal(attacker.meleeEngaged, true);
      assert.equal(defender.meleeEngaged, true, 'ranged defender automatically joins the duel');
    }
    assert.equal(red.squad.attackMode, 'ranged', 'temporary melee does not overwrite the chosen stance');
  });

  it('keeps duels stable as fighters move and shares targets only when outnumbering the enemy', () => {
    const world = new World();
    const blue = addSquad(world, 'blue', -0.8, 7, 'melee');
    const red = addSquad(world, 'red', 0.8, 3);
    blue.squad.forcedTarget = red.id;
    updateMeleeEngagements(world, [blue.id, red.id]);
    const paired = red.soldiers.map((id) => [id, world.get(id, 'soldier').meleeTargetId]);
    const loads = red.soldiers.map((target) => blue.soldiers.filter((id) => world.get(id, 'soldier').meleeTargetId === target).length).sort();
    assert.deepEqual(loads, [2, 2, 3]);
    for (const id of blue.soldiers) world.get(id, 'mesh').root.position.z += 0.4;
    updateMeleeEngagements(world, [red.id, blue.id]);
    for (const [id, target] of paired) assert.equal(world.get(id, 'soldier').meleeTargetId, target);
  });

  it('reserves opponents globally across several attacking squads and replaces dead targets', () => {
    const world = new World();
    const blue = addSquad(world, 'blue', -1, 3, 'melee');
    const allies = addSquad(world, 'blue', -2, 3, 'melee');
    const red = addSquad(world, 'red', 1, 6);
    const ids = [blue.id, allies.id, red.id];
    const attackers = [...blue.soldiers, ...allies.soldiers];
    updateMeleeEngagements(world, ids);
    assert.equal(new Set(attackers.map((id) => world.get(id, 'soldier').meleeTargetId)).size, 6);
    const deadId = red.soldiers[0];
    world.get(deadId, 'soldier').hp = 0;
    updateMeleeEngagements(world, ids);
    assert.ok(attackers.every((id) => world.get(id, 'soldier').meleeTargetId !== deadId));
    assert.equal(world.get(deadId, 'soldier').meleeTargetId, null);
    assert.equal(world.get(deadId, 'soldier').meleeEngaged, false);
  });

  it('does not force distant defenders into melee and releases engagements when attackers withdraw', () => {
    const world = new World();
    const blue = addSquad(world, 'blue', 0, 1, 'melee');
    const red = addSquad(world, 'red', 20, 1);
    updateMeleeEngagements(world, [blue.id, red.id]);
    assert.equal(world.get(red.soldiers[0], 'soldier').meleeEngaged, false);
    world.get(red.soldiers[0], 'mesh').root.position.x = 1;
    updateMeleeEngagements(world, [blue.id, red.id]);
    assert.equal(world.get(red.soldiers[0], 'soldier').meleeEngaged, true);
    blue.squad.moveOrder = new THREE.Vector3(-30, 0, 0);
    blue.squad.attackMove = false;
    updateMeleeEngagements(world, [blue.id, red.id]);
    for (const id of [...blue.soldiers, ...red.soldiers]) {
      assert.equal(world.get(id, 'soldier').meleeEngaged, false);
      assert.equal(world.get(id, 'soldier').meleeTargetId, null);
    }
  });

  it('ignores allies, dead, cloaked, and airborne targets, and does not start melee between ranged units', () => {
    const world = new World();
    const blue = addSquad(world, 'blue', 0, 1, 'melee');
    const red = addSquad(world, 'red', 1, 4);
    world.get(red.soldiers[0], 'soldier').hp = 0;
    Object.assign(world.get(red.soldiers[1], 'soldier'), { cloaked: true, revealTimer: 0 });
    world.get(red.soldiers[2], 'soldier')._flyStage = 2;
    updateMeleeEngagements(world, [blue.id, red.id]);
    assert.equal(world.get(blue.soldiers[0], 'soldier').meleeTargetId, red.soldiers[3]);
    blue.squad.attackMode = 'ranged';
    updateMeleeEngagements(world, [blue.id, red.id]);
    assert.equal(world.get(blue.soldiers[0], 'soldier').meleeTargetId, null);
  });
});

function battle(blueCount, redCount) {
  const world = new World();
  scene.setWorld(world);
  const blueId = createSquadEntity(world, 'blue', -0.8, 0, blueCount, 'guardsmen', 'ig');
  const redId = createSquadEntity(world, 'red', 0.8, 0, redCount, 'chaos_space_marine', 'chaos');
  const blue = world.get(blueId, 'squad');
  const red = world.get(redId, 'squad');
  Object.assign(blue, { attackMode: 'melee', attackMove: true, autoChase: true, forcedTarget: redId });
  Object.assign(red, { attackMode: 'ranged', autoChase: false, stopped: true });
  const animations = new Map();
  for (const squad of [blue, red]) {
    squad.soldiers.filter((id) => id != null).forEach((id, index) => {
      const soldier = world.get(id, 'soldier');
      Object.assign(soldier, { hp: 10000, maxHp: 10000, attackRate: 2, attackCooldown: 0 });
      const root = world.get(id, 'mesh').root;
      root.position.set(squad.position.x, 0, (index - 1) * 3);
      animations.set(id, []);
      root._playAnim = (name) => animations.get(id).push(name);
    });
  }
  return { world, blue, red, animations, tick() { systemSoldier(world, 1 / 60); systemSquad(world, 1 / 60); world._flushDestroyed(); } };
}

describe('mutual melee combat', () => {
  beforeEach(() => headless.clear());

  it('both teams strike their own opponents, take damage, and suppress gunfire while engaged', () => {
    const { world, blue, red, animations, tick } = battle(3, 3);
    tick();
    for (const squad of [blue, red]) {
      for (const id of squad.soldiers.filter((id) => id != null)) {
        const soldier = world.get(id, 'soldier');
        assert.ok(soldier.meleeEngaged);
        assert.ok(soldier.hp < 10000, 'each fighter receives its opponent’s strike');
        assert.ok(animations.get(id).includes('melee'), 'both factions play melee animations');
        assert.equal(soldier.shootTimer, 0);
      }
    }
    assert.equal(world.query('beam').length, 0);
    assert.equal(world.query('bullet').length, 0);
    blue.attackMode = 'ranged';
    blue.attackMove = false;
    blue.forcedTarget = null;
    blue.moveOrder = new THREE.Vector3(-100, 0, 0);
    tick();
    for (const id of red.soldiers.filter((id) => id != null)) {
      assert.equal(world.get(id, 'soldier').meleeEngaged, false);
      assert.equal(world.get(id, 'soldier').meleeTimer, 0);
    }
  });

  it('only tied-up defenders stop firing; unpaired squadmates can still use ranged attacks', () => {
    const { world, red, tick } = battle(1, 3);
    tick();
    const defenders = red.soldiers.filter((id) => id != null).map((id) => world.get(id, 'soldier'));
    assert.equal(defenders.filter((soldier) => soldier.meleeEngaged).length, 1);
    assert.equal(defenders.filter((soldier) => soldier.shootTimer > 0).length, 2);
    assert.equal(world.query('bullet').length, 2);
  });

  it('also engages the player’s ranged troops when the red team initiates melee', () => {
    const { world, blue, red, animations, tick } = battle(2, 2);
    Object.assign(blue, { attackMode: 'ranged', attackMove: false, autoChase: false, stopped: true, forcedTarget: null });
    Object.assign(red, { attackMode: 'melee', attackMove: true, autoChase: true, stopped: false, forcedTarget: world.get(blue.soldiers.find((id) => id != null), 'soldier').squadId });
    tick();
    for (const squad of [blue, red]) {
      for (const id of squad.soldiers.filter((id) => id != null)) {
        assert.ok(world.get(id, 'soldier').meleeEngaged);
        assert.ok(world.get(id, 'soldier').hp < 10000);
        assert.ok(animations.get(id).includes('melee'));
      }
    }
    assert.equal(blue.attackMode, 'ranged');
    assert.equal(world.query('beam').length, 0);
    assert.equal(world.query('bullet').length, 0);
  });
});
