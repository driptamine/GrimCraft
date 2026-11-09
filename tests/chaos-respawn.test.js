import { it } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { World } from '../src/core/ecs.js';

globalThis.window = {};
globalThis.document = { getElementById: () => null, querySelector: () => null };
const scene = await import('../src/core/scene.js');
const headless = new THREE.Scene();
headless._registerShadows = () => {};
scene.__setSceneCameraForTests(headless, { target: new THREE.Vector3() });
const { systemAI } = await import('../src/systems/meta.js');

it('keeps one four-man Chaos squad and replaces it only after the last soldier dies', () => {
  scene.setControlBoth(false);
  scene.counters.aiT = 0;
  const world = new World();
  const living = () => world.query('soldier').filter((id) => world.get(id, 'soldier').hp > 0);
  systemAI(world, 28);
  assert.equal(living().length, 4);
  const firstSquad = living();
  for (let i = 0; i < 10; i++) systemAI(world, 30);
  assert.deepEqual(living(), firstSquad);
  for (const id of firstSquad.slice(0, 3)) world.get(id, 'soldier').hp = 0;
  systemAI(world, 100);
  assert.deepEqual(living(), [firstSquad[3]], 'one survivor prevents another squad spawning');
  world.get(firstSquad[3], 'soldier').hp = 0;
  systemAI(world, 27);
  assert.equal(living().length, 0);
  systemAI(world, 1);
  assert.equal(living().length, 4);
  assert.ok(living().every((id) => !firstSquad.includes(id)));
  const squad = world.get(world.get(living()[0], 'soldier').squadId, 'squad');
  assert.equal(squad.faction, 'chaos');
  assert.equal(squad.unitType, 'chaos_space_marine');
  systemAI(world, 100);
  assert.equal(living().length, 4);
});
