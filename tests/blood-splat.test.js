import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import * as THREE from 'three';

register('./node-esm-hooks.mjs', import.meta.url);
globalThis.window = {};
globalThis.document = { getElementById: () => null };
const sceneMod = await import('../src/scene.js');
const headlessScene = new THREE.Scene();
headlessScene._registerShadows = () => {};
sceneMod.__setSceneCameraForTests(headlessScene, { target: new THREE.Vector3() });
const { particles } = await import('../src/scene.js');
const { isGuardsmanMesh, spawnBloodSplat } = await import('../src/blood/blood-splat.js');
const { _soldierTakeDamage } = await import('../src/systems/combat.js');
const { World } = await import('../src/ecs.js');

function guardsmanRoot() {
  const root = new THREE.Group();
  root.name = 'soldier_clone';
  root.position.set(10, 0, 20);
  const head = new THREE.Group();
  head.name = 'guardsmen_head03';
  root.add(head);
  return root;
}

describe('blood splat', () => {
  it('detects guardsmen.glb meshes by head node', () => {
    assert.equal(isGuardsmanMesh(guardsmanRoot()), true);
    assert.equal(isGuardsmanMesh(new THREE.Group()), false);
    assert.equal(isGuardsmanMesh(null), false);
  });

  it('spawns a red upward burst into the shared pool', () => {
    particles.length = 0;
    const n = spawnBloodSplat({ x: 10, y: 1.1, z: 20 }, 1);
    assert.equal(n, 10);
    assert.equal(particles.length, 10);
    for (const p of particles) {
      assert.ok(p.vy > 0, 'spurts upward');
      assert.ok(p.life >= 0.35 && p.life <= 0.7);
      assert.equal(p.age, 0);
      assert.ok(p.noGravity === undefined, 'shared tick applies gravity');
      assert.ok(p.material.color.r > 0.4 && p.material.color.g < 0.15, 'blood red');
    }
    assert.equal(spawnBloodSplat(null), 0);
    particles.length = 0;
  });

  it('bleeds on survivable hits, bursts on kills', () => {
    const world = new World();
    const squadId = world.createEntity(['squad']);
    world.add(squadId, 'squad', { team: 'red' });
    const soldierId = world.createEntity(['soldier']);
    world.add(soldierId, 'soldier', { squadId, hp: 100, flashTimer: 0 });
    world.add(soldierId, 'mesh', { root: guardsmanRoot() });
    particles.length = 0;
    _soldierTakeDamage(world, soldierId, 10);
    assert.equal(world.get(soldierId, 'soldier').hp, 90);
    assert.equal(particles.length, 21);
    // Non-guardsmen meshes bleed nothing.
    world.get(soldierId, 'mesh').root = new THREE.Group();
    _soldierTakeDamage(world, soldierId, 10);
    assert.equal(particles.length, 21);
    particles.length = 0;
  });
});
