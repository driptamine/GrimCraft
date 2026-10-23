import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readSystemsSource } from './systems-src.mjs';
import * as THREE from 'three';
import { register } from 'node:module';

register('./node-esm-hooks.mjs', import.meta.url);
globalThis.window = {};
globalThis.document = { getElementById: () => null, querySelector: () => null };

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const factions = await import('../src/factions.js');
const scene = await import('../src/scene.js');
const { setWorld } = scene;
const { factionsWithHQ, hqPositionForFaction, hqTeamForFaction } = await import('../src/hud/data.js');
const { World } = await import('../src/ecs.js');

describe('switch faction', () => {
  it('points the player side at a valid faction, ignores unknown keys', () => {
    assert.equal(factions.playerFaction, 'ig');
    factions.setPlayerFaction('tau');
    assert.equal(factions.playerFaction, 'tau');
    factions.setPlayerFaction('no-such-faction');
    assert.equal(factions.playerFaction, 'tau');
    factions.setPlayerFaction('ig');
    assert.equal(factions.playerFaction, 'ig');
  });

  it('finds each faction HQ position, null when none stands', () => {
    assert.equal(hqPositionForFaction('ig'), null);
    const world = new World();
    setWorld(world);
    const ig = world.createEntity([]);
    world.add(ig, 'building', { type: 'hq', faction: 'ig', position: new THREE.Vector3(10, 0, 20) });
    const chaos = world.createEntity([]);
    world.add(chaos, 'building', { type: 'hq', faction: 'chaos', position: new THREE.Vector3(-30, 0, -40) });
    const temple = world.createEntity([]);
    world.add(temple, 'building', { type: 'chaos_temple', faction: 'chaos', position: new THREE.Vector3(0, 0, 0) });
    assert.deepEqual(hqPositionForFaction('ig'), new THREE.Vector3(10, 0, 20));
    assert.deepEqual(hqPositionForFaction('chaos'), new THREE.Vector3(-30, 0, -40));
    assert.equal(hqPositionForFaction('orks'), null);
  });

  it('lists HQ factions in canonical cycle order, skipping the rest', () => {
    setWorld(undefined);
    assert.deepEqual(factionsWithHQ(), []);
    const world = new World();
    setWorld(world);
    const addHq = (faction) => {
      const id = world.createEntity([]);
      world.add(id, 'building', { type: 'hq', faction, position: new THREE.Vector3(0, 0, 0) });
    };
    addHq('tau');
    addHq('chaos');
    addHq('ig');
    const other = world.createEntity([]);
    world.add(other, 'building', { type: 'chaos_temple', faction: 'chaos', position: new THREE.Vector3(0, 0, 0) });
    assert.deepEqual(factionsWithHQ(), ['ig', 'chaos', 'tau']);
  });

  it('button sits below the camera panel and calls switchFaction()', () => {
    const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
    assert.ok(html.includes('<button id="switch-faction-btn" onclick="switchFaction()">'), 'button exists');
    assert.ok(
      html.indexOf('id="switch-faction-btn"') > html.indexOf('id="camera-reset-btn"'),
      'below the camera buttons',
    );
    const jsx = fs.readFileSync(path.join(root, 'src/hud/components/ActionsGrid.jsx'), 'utf8');
    assert.ok(!jsx.includes('SWITCH FACTION'), 'not inside the action grid');
  });

  it('game.js binds switchFaction and the module swaps + jumps', () => {
    const game = fs.readFileSync(path.join(root, 'src/game.js'), 'utf8');
    assert.ok(game.includes('window.switchFaction'), 'global bound');
    assert.ok(game.includes("import('./switch-faction.js')"), 'lazy import used');
    const mod = fs.readFileSync(path.join(root, 'src/switch-faction.js'), 'utf8');
    assert.ok(mod.includes('factionsWithHQ()'), 'cycles HQ factions');
    assert.ok(mod.includes('setPlayerFaction(next)'), 'advances the player side');
    assert.ok(mod.includes('hqTeamForFaction(next)'), 'reads the new side team');
    assert.ok(mod.includes('setPlayerTeam(team)'), 'hands control to the player');
    assert.ok(mod.includes('hqPositionForFaction(next)'), 'looks up the new side HQ');
    assert.ok(mod.includes('camera.target = new THREE.Vector3(hq.x, 0, hq.z);'), 'jumps the camera');
    assert.ok(mod.includes('updateHUD();'), 'refreshes the HUD');
  });

  it('hands orders to the switched side team, restores after', () => {
    assert.equal(scene.PLAYER, 'blue');
    scene.setPlayerTeam('red');
    assert.equal(scene.PLAYER, 'red');
    assert.equal(scene.canCommand('red'), true);
    assert.equal(scene.canCommand('blue'), false);
    scene.setPlayerTeam('nope');
    assert.equal(scene.PLAYER, 'red');
    scene.setPlayerTeam('blue');
    assert.equal(scene.PLAYER, 'blue');
    assert.equal(scene.canCommand('blue'), true);
  });

  it('reports each HQ team for the control handoff', () => {
    const world = new World();
    setWorld(world);
    const ig = world.createEntity([]);
    world.add(ig, 'building', { type: 'hq', faction: 'ig', team: 'blue', position: new THREE.Vector3(0, 0, 0) });
    const chaos = world.createEntity([]);
    world.add(chaos, 'building', { type: 'hq', faction: 'chaos', team: 'red', position: new THREE.Vector3(0, 0, 0) });
    assert.equal(hqTeamForFaction('ig'), 'blue');
    assert.equal(hqTeamForFaction('chaos'), 'red');
    assert.equal(hqTeamForFaction('orks'), null);
  });

  it('combat and capture key off teams, not the commanded side', () => {
    const src = readSystemsSource();
    assert.ok(src.includes("if (squadComponent.team === 'blue') {"), 'capture direction team-fixed');
    assert.ok(src.includes("newOwner = 'blue';"), 'full cap credits blue');
    assert.ok(src.includes("if (strategicPoint.owner === 'blue') {"), 'gem follows owner team');
    assert.ok(src.includes('if (!esq || esq.team === b.team) {'), 'builders skip own team');
    assert.ok(
      src.includes('createBulletEntity(world, fakeFiringPos, structureComponent.team, id, closest);'),
      'towers fire for their team',
    );
    assert.ok(
      src.includes("createSquadEntity(world, PLAYER === 'blue' ? 'red' : 'blue',"),
      'AI reinforces the side you do not command',
    );
    assert.ok(src.includes("PLAYER === 'blue' ? 'RED WINS' : 'BLUE WINS'"), 'win text follows the loser');
  });

  it('top bar names the commanded side', () => {
    const top = fs.readFileSync(path.join(root, 'src/hud/components/TopBar.jsx'), 'utf8');
    assert.ok(top.includes('`⚔ CONTROL: ${PLAYER.toUpperCase()}`'), 'label follows PLAYER');
    assert.ok(!top.includes('CONTROL: BLUE'), 'no hardcoded side');
  });
});
