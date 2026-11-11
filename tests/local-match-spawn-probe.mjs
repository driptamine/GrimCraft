// Helper for local-match-spawn.test.js (not a test file itself).
// Drives the real public resetGame headlessly: importing game.js leaves the
// process unable to exit on its own under node --test, so this runs in a
// child process and terminates explicitly; the test asserts its exit code.
import { register } from 'node:module';

register('./node-esm-hooks.mjs', import.meta.url);
import * as THREE from 'three';

globalThis.window = { addEventListener() {}, _currentMapKey: 'arena' };
const fakeCanvas = { style: {} };
globalThis.document = { getElementById: (id) => (id === 'renderCanvas' ? fakeCanvas : null) };

const sceneMod = await import('../src/core/scene.js');
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

const game = await import('../src/core/game.js');


const { makeLocalMatch, setLocalMatch } = await import('../src/core/local-match.js');
const { createLobby, setLobbySlot } = await import('../src/net/lobbies.js');
const { systemAI } = await import('../src/systems/meta.js');
const assert = (await import('node:assert/strict')).default;
const lobby = createLobby({total:6});
lobby.players[0].faction='Imperial Guard';
setLobbySlot(lobby,3,{username:'Computer 4',faction:'Tau',team:2,ping:0,controller:'computer'});
const config=makeLocalMatch(lobby,'/maps/6p_alvarus/6p_alvarus.sgb');
setLocalMatch(config);window._currentMapKey=config.mapKey;
game.resetGame(config.mapKey);
let world=sceneMod.world;
assert.equal(world.query('building').length,2);
// Check rendered ECS positions, including the camera, rather than just the planner.
const basePositions=world.query('building').map(id=>world.get(id,'mesh').root.position);
assert.ok(basePositions.some(p=>Math.abs(p.x-14.76)<.01 && Math.abs(p.z+102.98)<.01));
assert.ok(basePositions.some(p=>Math.abs(p.x+5.38)<.01 && Math.abs(p.z-114.06)<.01));
assert.equal(sceneMod.camera.target.x,14.76);
assert.equal(sceneMod.camera.target.z,-102.98);

const squads=world.query('squad').map(id=>world.get(id,'squad'));
assert.equal(squads.length,4);
assert.deepEqual([...new Set(squads.map(s=>s.faction))].sort(),['ig','tau']);
assert.equal(world.query('squad','computer').length,2);
systemAI(world,2);
for(const id of world.query('computer')){
  const squad=world.get(id,'squad');
  assert.ok(squad.moveOrder);assert.ok(squad.forcedTarget);
  assert.equal(world.get(squad.forcedTarget,'squad').team,'blue');
}
// No legacy Chaos replenishment may enter a configured match.
for(let i=0;i<30;i++)systemAI(world,2);
assert.equal(world.query('squad').length,4);
setLobbySlot(lobby,0,{username:'Computer 1',faction:'Necrons',team:1,ping:0,controller:'computer'});
setLocalMatch(makeLocalMatch(lobby,config.mapKey));game.resetGame(config.mapKey);
world=sceneMod.world;
assert.equal(world.query('squad','computer').length,world.query('squad').length);
assert.equal(sceneMod.canCommand('blue'),false);
assert.equal(sceneMod.canCommand('red'),false);
setLocalMatch(null);
assert.equal(sceneMod.canCommand('blue'),true);
console.log('Local match: selected factions, stable slots, computer orders and all-computer spectator checks passed');
process.exit(0);
