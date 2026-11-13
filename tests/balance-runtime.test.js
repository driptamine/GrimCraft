import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { World } from '../src/core/ecs.js';
import { ARMOR_TYPES, newMod, clone } from '../src/balance/model.js';
import { BASE_WEAPONS } from '../src/balance/catalog.js';
import { setNetworkBalanceMod } from '../src/balance/runtime.js';

globalThis.window = {};
globalThis.document = { getElementById: () => null, querySelector: () => null };
const state = await import('../src/core/scene.js');
const scene = new THREE.Scene();scene._registerShadows = () => {};
state.__setSceneCameraForTests(scene, { target: new THREE.Vector3() });
const { _squadFireAll } = await import('../src/systems/squad.js');

test('actual projectiles use the edited hit damage and interval without visual cadence compensation', () => {
  const mod = newMod();mod.weapons.lasgun = { ...clone(BASE_WEAPONS.lasgun), mode: 'ap', minDamage: 20, maxDamage: 24, accuracy: 1, refire: 1, armorPiercing: Object.fromEntries(ARMOR_TYPES.map(key => [key, 25])) };
  // Load through the network context seam; call the normal single-player firing system directly.
  window._multiplayerMode = true;setNetworkBalanceMod(mod);
  const world = new World(), squadId = world.createEntity([]), shooter = world.createEntity([]), target = world.createEntity([]);
  const squad = { team: 'blue', faction: 'ig', unitType: 'guardsmen', projectileType: 'bullet', soldiers: [shooter] };
  const soldier = { squadId, weapon: 'lasgun', attackRate: 2, attackCooldown: 0, damageMult: 1 };
  world.add(squadId, 'squad', squad);world.add(shooter, 'soldier', soldier);
  world.add(shooter, 'mesh', { root: new THREE.Group() });
  world.add(target, 'soldier', { hp: 1000, armorClass: 'infantry_med' });
  const targetRoot = new THREE.Group();targetRoot.position.set(10, 0, 0);world.add(target, 'mesh', { root: targetRoot });
  const fire = delta => _squadFireAll(world, squadId, squad, [shooter], delta, { soldierEntityId: target });
  fire(0);
  assert.equal(world.query('bullet').length, 1);
  assert.equal(world.get(world.query('bullet')[0], 'bullet').damage, 5.5);
  assert.equal(soldier.attackCooldown, 1);
  fire(.9);assert.equal(world.query('bullet').length, 1);
  fire(.11);assert.equal(world.query('bullet').length, 2);
  mod.weapons.lasgun.refire = 2;
  fire(1.1);
  assert.equal(soldier.attackCooldown, 2);
  assert.equal(world.get(world.query('bullet').at(-1), 'bullet').damage, 5.5);
  setNetworkBalanceMod(null);window._multiplayerMode = false;
});
