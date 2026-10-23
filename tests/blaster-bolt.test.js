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
const { PLAYER } = sceneMod;
const { World } = await import('../src/ecs.js');
const { systemBullet, systemBlasterBullet } = await import('../src/systems.js');
const { createSquadEntity } = await import('../src/entities.js');
const { factionContainers } = await import('../src/factions.js');
const {
  makeBlasterBoltMesh,
  updateBlasterBoltFx,
  BLASTER_CORE_NAME,
  BLASTER_SHELL_NAME,
} = await import('../src/blaster-bolt.js');

function collectByName(root) {
  const found = {};
  root.traverse((child) => {
    if (child.name) {
      found[child.name] = child;
    }
  });
  return found;
}

describe('tau blaster bolt', () => {
  it('builds a thin long bright-blue bolt from shared assets', () => {
    const bolt = makeBlasterBoltMesh();
    assert.equal(bolt.name, 'blasterbolt');
    const found = collectByName(bolt);
    assert.ok(found[BLASTER_CORE_NAME], 'core present');
    assert.ok(found[BLASTER_SHELL_NAME], 'shell present');
    // Bright blue: light-blue core, saturated blue additive shell.
    assert.equal(found[BLASTER_CORE_NAME].material.color.getHex(), 0x8ecfff);
    assert.equal(found[BLASTER_SHELL_NAME].material.color.getHex(), 0x2b9bff);
    assert.equal(found[BLASTER_SHELL_NAME].material.blending, THREE.AdditiveBlending);
    // Thin and long along the flight axis.
    for (const name of [BLASTER_CORE_NAME, BLASTER_SHELL_NAME]) {
      const geo = found[name].geometry;
      geo.computeBoundingBox();
      const size = geo.boundingBox.getSize(new THREE.Vector3());
      assert.ok(size.z > size.x * 10, `${name} is long and thin`);
    }
    // Shared across bolts.
    const other = collectByName(makeBlasterBoltMesh());
    assert.equal(found[BLASTER_CORE_NAME].geometry, other[BLASTER_CORE_NAME].geometry);
    assert.equal(found[BLASTER_SHELL_NAME].material, other[BLASTER_SHELL_NAME].material);
  });

  it('updateBlasterBoltFx shimmers the shared shell', () => {
    const shell = collectByName(makeBlasterBoltMesh())[BLASTER_SHELL_NAME].material;
    updateBlasterBoltFx(1.0);
    const a = shell.opacity;
    updateBlasterBoltFx(1.2);
    assert.notEqual(shell.opacity, a);
    assert.ok(shell.opacity > 0.3 && shell.opacity < 0.8);
  });

  it('systemBullet ignores blaster bolts', () => {
    const world = new World();
    const id = world.createEntity([]);
    const root = new THREE.Group();
    root.position.set(0, 1.05, 0);
    world.add(id, 'bullet', {
      team: PLAYER, targetId: 9999, age: 0,
      vx: 10, vy: 0, vz: 0, damage: 10, projectileType: 'blaster',
    });
    world.add(id, 'mesh', { root });
    systemBullet(world, 0.1);
    assert.equal(world.get(id, 'bullet').age, 0);
    assert.equal(world.get(id, 'mesh').root.position.x, 0);
  });

  it('blaster reaches a troop body and evaporates on impact', () => {
    const world = new World();
    world.addSystem(systemBullet);
    world.addSystem(systemBlasterBullet);
    const target = world.createEntity([]);
    const targetRoot = new THREE.Group();
    targetRoot.position.set(20, 0, 0);
    world.add(target, 'soldier', { hp: 100, squadId: 0 });
    world.add(target, 'mesh', { root: targetRoot });
    const id = world.createEntity([]);
    const root = new THREE.Group();
    root.position.set(0, 1.05, 0);
    world.add(id, 'bullet', {
      team: PLAYER, targetId: target, age: 0,
      vx: 30, vy: 0, vz: 0, damage: 10, projectileType: 'blaster',
    });
    world.add(id, 'mesh', { root });
    for (let i = 0; i < 600 && world.has(id, 'bullet'); i++) {
      world.tick(1 / 60);
    }
    assert.ok(world.get(target, 'soldier').hp < 100, 'troop takes the hit');
    assert.ok(!world.has(id, 'bullet'), 'bolt evaporates on impact');
  });

  it('tau squads fire blaster bolts', () => {
    factionContainers.tau = factionContainers.tau || {};
    factionContainers.tau.soldier = {
      scene: (() => {
        const g = new THREE.Group();
        g.add(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial()));
        return g;
      })(),
      animations: [],
      _hiddenNodes: null,
    };
    const world = new World();
    const squadId = createSquadEntity(world, PLAYER, 0, 0, 2, null, 'tau');
    assert.equal(world.get(squadId, 'squad').projectileType, 'blaster');
  });
});
