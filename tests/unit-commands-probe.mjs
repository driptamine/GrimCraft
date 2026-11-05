import assert from 'node:assert/strict';
import * as THREE from 'three';

globalThis.window = { addEventListener() {}, _currentMapKey: 'arena' };
globalThis.document = { getElementById: () => null, querySelector: () => null };
const scene = await import('../src/core/scene.js');
const headless = new THREE.Scene();
headless._registerShadows = () => {};
scene.__setSceneCameraForTests(headless, { target: new THREE.Vector3() });
const { World } = await import('../src/core/ecs.js');
const commands = await import('../src/input/unit-commands.js');
const { createSquadEntity } = await import('../src/entities/entities.js');
const { systemSquad } = await import('../src/systems/squad.js');
const world = new World();
scene.setWorld(world);
scene.setControlBoth(false);
scene.setSelBuilder(null);
scene.setSelBuildings([]);
const ids = [];
for (const kind of ['squad', 'apc', 'vehicle', 'jet']) {
  const id = world.createEntity([]);
  world.add(id, kind, {
    team: 'blue', position: new THREE.Vector3(), soldiers: [],
    moveOrder: new THREE.Vector3(20, 0, 20), forcedTarget: 100, forcedSoldierId: 101,
    flyOrder: new THREE.Vector3(1, 0, 1), captureOrderSpId: 22,
    forcedTargetSqId: 100, strafe: {}, stance: 'stand',
  });
  ids.push(id);
}
scene.setSelSquads(ids);
commands.stopSelectedTroops();
for (const { kind, unit } of commands.selectedTroops()) {
  assert.equal(unit.moveOrder, null, `${kind} stops`);
  assert.equal(unit.forcedTarget, null);
  assert.equal(unit.forcedSoldierId, null);
  assert.equal(unit.stopped, true);
  if (kind === 'squad') {
    assert.equal(unit.flyOrder, null);
    assert.equal(unit.captureOrderSpId, null);
  }
  if (kind === 'jet') {
    assert.equal(unit.waitOrders, true);
    assert.equal(unit.strafe, null);
    assert.equal(unit.forcedTargetSqId, null);
  }
}

commands.setUnitCommand('move');
assert.equal(commands.pendingUnitCommand, 'move');
commands.clearUnitCommand();
assert.equal(commands.pendingUnitCommand, null);
commands.issueUnitCommand('move', new THREE.Vector3(40, 0, 50));
for (const { kind, unit } of commands.selectedTroops()) {
  assert.ok(unit.moveOrder, `${kind} receives a move order in a mixed selection`);
  assert.equal(unit.moveOrder.x, 40);
  assert.equal(unit.moveOrder.z, 50);
  assert.equal(unit.attackMove, false);
  assert.equal(unit.stopped, false);
}
assert.equal(world.get(ids[3], 'jet').moveOrder.y, scene.JET_ALT);
assert.equal(world.get(ids[3], 'jet').patrolMode, 'hold');

commands.issueUnitCommand('attackmove', new THREE.Vector3(60, 0, 70));
for (const { unit } of commands.selectedTroops()) {
  assert.equal(unit.attackMove, true);
  assert.equal(unit.attackMode, 'ranged');
  assert.equal(unit.autoChase, true);
}
commands.setUnitStance('stand');
for (const { unit } of commands.selectedTroops()) {
  assert.equal(unit.stance, 'stand');
  assert.equal(unit.moveOrder, null);
  assert.equal(unit.autoChase, false);
}
commands.setUnitStance('ranged');
for (const { unit } of commands.selectedTroops()) {
  assert.equal(unit.stance, 'ranged');
  assert.equal(unit.stopped, false);
  assert.equal(unit.autoChase, true);
}

scene.setSelSquads([ids[0]]);
commands.setUnitCommand('melee');
assert.equal(commands.tryUnitCommandClick(0, 0, 0), false, 'left-click does not issue melee');
assert.equal(commands.pendingUnitCommand, 'melee', 'left-click leaves melee armed for right-click');
assert.equal(commands.tryUnitCommandClick(0, 0, 1), false, 'middle-click does not issue melee');
commands.clearUnitCommand();
commands.issueUnitCommand('melee', new THREE.Vector3(4, 0, 5));
assert.equal(world.get(ids[0], 'squad').attackMode, 'melee');
assert.equal(scene.attackMode, 'ranged', 'changing one squad does not switch all troops');
scene.setSelSquads([ids[1], ids[2], ids[3]]);
commands.setUnitCommand('melee');
assert.equal(commands.pendingUnitCommand, null, 'unsupported melee cannot be armed for vehicles');

const enemyId = world.createEntity([]);
world.add(enemyId, 'squad', { team: 'red', position: new THREE.Vector3(90, 0, 90), soldiers: [] });
scene.setSelSquads([ids[0], enemyId]);
commands.issueUnitCommand('attackmove', new THREE.Vector3(30, 0, 30), { squadId: enemyId });
assert.equal(world.get(ids[0], 'squad').forcedTarget, enemyId);
assert.equal(world.get(enemyId, 'squad').moveOrder, undefined, 'enemy units are not commanded');
commands.setUnitCommand('move');
scene.setSelSquads([ids[2]]);
assert.equal(commands.tryUnitCommandClick(0, 0), false, 'a changed selection cancels stale targeting');
assert.equal(commands.pendingUnitCommand, null);

// Exercise the actual combat loop: attack-move retains its destination
// during an engagement, ordinary movement does not pause.
const battle = new World();
scene.setWorld(battle);
scene.setSelSquads([]);
const blue = createSquadEntity(battle, 'blue', 0, 0, 1, 'guardsmen', 'ig');
const red = createSquadEntity(battle, 'red', 10, 0, 1, 'guardsmen', 'ig');
const squad = battle.get(blue, 'squad');
const opponent = battle.get(red, 'squad');
opponent.stopped = true;
scene.setSelSquads([blue]);
commands.issueUnitCommand('attackmove', new THREE.Vector3(100, 0, 0));
const before = squad.position.clone();
systemSquad(battle, 1 / 60);
assert.equal(squad.position.x, before.x, 'attack-move pauses for an enemy in range');
assert.ok(squad.moveOrder, 'destination survives the engagement');
commands.issueUnitCommand('move', new THREE.Vector3(100, 0, 0));
systemSquad(battle, 1 / 60);
assert.ok(squad.position.x > before.x, 'ordinary move keeps advancing');
commands.setUnitStance('stand');
const held = squad.position.clone();
systemSquad(battle, 1 / 60);
assert.equal(squad.position.x, held.x, 'stand keeps the squad in place');
opponent.position.set(35, 0, 0);
for (const id of opponent.soldiers) if (id !== null) battle.get(id, 'mesh').root.position.set(35, 0, 0);
commands.setUnitStance('ranged');
systemSquad(battle, 1 / 60);
assert.ok(squad.position.x > held.x, 'ranged stance pursues an enemy beyond firing range');

console.log('all unit command checks passed');
process.exit(0);
