// Helper for necron-default-spawn.test.js (not a test file itself).
// Drives the real public resetGame headlessly: importing game.js leaves the
// process unable to exit on its own under node --test, so this runs in a
// child process and terminates explicitly; the test asserts its exit code.
import { register } from 'node:module';

register('./node-esm-hooks.mjs', import.meta.url);
import * as THREE from 'three';

globalThis.window = { addEventListener() {}, _currentMapKey: 'arena' };
const fakeCanvas = { style: {} };
globalThis.document = { getElementById: (id) => (id === 'renderCanvas' ? fakeCanvas : null) };

const sceneMod = await import('../src/scene.js');
const headlessScene = new THREE.Scene();
headlessScene._registerShadows = () => {};
sceneMod.__setSceneCameraForTests(headlessScene, { target: new THREE.Vector3() });

const factions = await import('../src/factions.js');
// Stand-ins for loaded GLB containers (real load needs fetch + GL); the
// soldier-slot lookup under test is identical either way.
for (const key of factions.ARENA_POSITION_FACTIONS) {
  factions.factionContainers[key].soldier = { scene: new THREE.Group(), animations: [], _hiddenNodes: null };
  factions.factionContainers[key].worker = { scene: new THREE.Group(), animations: [], _hiddenNodes: null };
}

const game = await import('../src/game.js');

function necronSquads(world) {
  return world.query('squad')
    .map((id) => ({ id, c: world.get(id, 'squad') }))
    .filter((s) => s.c.faction === 'necrons');
}

function aliveSoldiers(world, squad) {
  return squad.c.soldiers.filter((sid) => sid !== null && world.has(sid, 'soldier'));
}

let failures = 0;
const check = (cond, label) => {
  console.log(cond ? `  ok - ${label}` : `  FAIL - ${label}`);
  if (!cond) failures += 1;
};

for (const mapKey of ['arena', '/maps/6p_alvarus/6p_alvarus.sgb', '/maps/6p_mortalis/mortalis.sgb']) {
  console.log(`map: ${mapKey}`);
  globalThis.window._currentMapKey = mapKey;
  game.resetGame(mapKey);
  const world = sceneMod.world;

  check(
    factions.FACTIONS.necrons.infantry[1].model === 'models/necrons/infantry/necron_basic_warrior.glb',
    'soldier slot is necron_basic_warrior.glb',
  );
  const squads = necronSquads(world);
  check(squads.length === 2, `two necron squads spawned (got ${squads.length})`);
  for (const [i, s] of squads.entries()) {
    check(s.c.team === 'blue', `squad ${i} on default blue side`);
    check(s.c.unitType === null, `squad ${i} uses default soldier (unitType null)`);
    check(s.c.projectileType === 'lightning', `squad ${i} fires green lightning`);
    check(aliveSoldiers(world, s).length === 5, `squad ${i} has 5 soldiers`);
    const roots = aliveSoldiers(world, s).map((sid) => world.get(sid, 'mesh').root);
    check(roots.every((r) => r.name === 'faction_soldier_root'), `squad ${i} meshes resolved via soldier slot`);
  }

  for (let i = 0; i < 30; i++) world.tick(1 / 60);
  const after = necronSquads(world);
  check(after.length === 2, `two necron squads persist after 30 ticks (got ${after.length})`);
  for (const [i, s] of after.entries()) {
    check(aliveSoldiers(world, s).length === 5, `squad ${i} still 5 soldiers after 30 ticks`);
  }
}

if (failures > 0) {
  console.error(`${failures} check(s) failed`);
  process.exit(1);
}
console.log('all headless resetGame checks passed');
process.exit(0);
