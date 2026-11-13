import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as THREE from 'three';

globalThis.window = {};
globalThis.document = { getElementById: () => null, querySelector: () => null };
const saved = new Map();
globalThis.localStorage = {
  getItem: (key) => saved.get(key) ?? null,
  setItem: (key, value) => saved.set(key, value),
};

const {
  kasrkinFireRate, setKasrkinFireRate, KASRKIN_FIRE_RATE_STORAGE_KEY,
} = await import('../src/combat/fire-rate.js');
const sceneMod = await import('../src/core/scene.js');
const scene = new THREE.Scene();
scene._registerShadows = () => {};
sceneMod.__setSceneCameraForTests(scene, { target: new THREE.Vector3() });
const { World } = await import('../src/core/ecs.js');
const { _squadFireAll } = await import('../src/systems/squad.js');
const { getWeapon, dpsAgainst } = await import('../src/combat/stats.js');
const { getSoldierMuzzlePos } = await import('../src/entities/entities.js');
const { systemLaserBullet, systemBeam } = await import('../src/systems/projectiles.js');

function addKasrkinRig(root) {
  // Use the shipped model's actual marker hierarchy and bone transforms,
  // without loading textures or requiring a renderer.
  const file = readFileSync(new URL('../models/ig/infantry/kasrkin.glb', import.meta.url));
  const gltf = JSON.parse(file.subarray(20, 20 + file.readUInt32LE(12)).toString());
  const nodes = gltf.nodes.map((node) => {
    const obj = new THREE.Object3D();
    obj.name = node.name;
    if (node.translation) obj.position.fromArray(node.translation);
    if (node.rotation) obj.quaternion.fromArray(node.rotation);
    if (node.scale) obj.scale.fromArray(node.scale);
    return obj;
  });
  gltf.nodes.forEach((node, i) => {
    for (const child of node.children || []) nodes[i].add(nodes[child]);
  });
  for (const index of gltf.scenes[gltf.scene || 0].nodes) root.add(nodes[index]);
  return root.getObjectByName('marker_lasgun_muzzle');
}

function setup(unitType = 'kasrkin', projectileType = null, squadProjectile = 'beam') {
  const world = new World();
  const squadId = world.createEntity([]);
  const squad = { unitType, projectileType: squadProjectile, team: 'blue' };
  world.add(squadId, 'squad', squad);
  const soldierId = world.createEntity([]);
  const soldier = {
    unitType, squadId, projectileType, attackRate: 1, attackCooldown: 0,
    weapon: unitType === 'kasrkin' ? 'hellgun' : 'lasgun', damageMult: 1,
  };
  world.add(soldierId, 'soldier', soldier);
  world.add(soldierId, 'mesh', { root: new THREE.Group() });
  const target = world.createEntity([]);
  world.add(target, 'soldier', { armorClass: 'infantry_med' });
  const root = new THREE.Group();
  root.position.set(10, 0, 0);
  world.add(target, 'mesh', { root });
  return {
    world, soldier, soldierId,
    fire: (dt = 0) => _squadFireAll(world, squadId, squad, [soldierId], dt, { soldierEntityId: target }),
  };
}

describe('Kasrkin live fire rate', () => {
  beforeEach(() => {
    scene.clear();
    setKasrkinFireRate(4);
  });

  it('fires four bursts per second when tuned to 4 while preserving hellgun DPS', () => {
    const { world, soldier, fire } = setup();
    fire();
    assert.equal(soldier.attackCooldown, 0.25);
    for (let i = 0; i < 3; i++) fire(0.25);
    const beams = world.query('beam');
    assert.equal(beams.length, 4);
    const damage = beams.reduce((sum, id) => sum + world.get(id, 'beam').damage, 0);
    assert.ok(Math.abs(damage - dpsAgainst(getWeapon('hellgun'), 'infantry_med')) < 1e-9);
  });

  it('changes existing soldiers immediately and preserves DPS at slower and faster rates', () => {
    const { world, soldier, fire } = setup();
    for (const rate of [0.4, 2, 8, 10]) {
      setKasrkinFireRate(rate);
      soldier.attackCooldown = 0;
      const before = new Set(world.query('beam'));
      fire();
      assert.equal(soldier.attackCooldown, 1 / rate);
      const shot = world.query('beam').find((id) => !before.has(id));
      assert.ok(Math.abs(world.get(shot, 'beam').damage * rate - 19.3) < 1e-9);
    }
    setKasrkinFireRate(0.4);
    soldier.attackCooldown = 2.5;
    setKasrkinFireRate(10);
    const before = world.query('beam').length;
    fire(0.1);
    assert.equal(world.query('beam').length, before + 1, 'does not wait out the old slow cooldown');
  });

  it('keeps ordinary infantry cadence and the one-second plasma interval independent of the hellgun slider', () => {
    for (const [unitType, personalProjectile, interval] of [['guardsmen', null, 2.5], ['kasrkin', 'plasma', 1]]) {
      const { soldier, fire } = setup(unitType, personalProjectile);
      setKasrkinFireRate(10);
      fire();
      assert.equal(soldier.attackCooldown, interval);
    }
  });

  it('supports laser projectiles and either team’s ordinary gunfire', () => {
    for (const [type, tag] of [['laser', 'laserBullet'], ['bullet', 'bullet']]) {
      const { world, soldier, fire } = setup('kasrkin', null, type);
      fire();
      assert.equal(soldier.attackCooldown, 0.25);
      const shots = world.query(tag);
      assert.equal(shots.length, 1);
      assert.equal(world.get(shots[0], tag).damage, 19.3 / 4);
    }
  });

  it('starts the beam at the hellgun muzzle through movement, scale, and weapon animation', () => {
    const { world, soldierId, fire } = setup();
    const root = world.get(soldierId, 'mesh').root;
    const muzzle = addKasrkinRig(root);
    assert.equal(muzzle.parent.name, 'bone_ig_hand_weapon_r');
    root.position.set(3, 5, 7);
    root.rotation.y = 0.7;
    root.scale.setScalar(1.6);
    for (let pose = 0; pose < 2; pose++) {
      muzzle.parent.rotation.z += 0.3;
      root.position.x += 2;
      const expected = muzzle.getWorldPosition(new THREE.Vector3());
      assert.ok(getSoldierMuzzlePos(world, soldierId, 'hellgun').distanceTo(expected) < 1e-9);
      fire(0.25);
      const ids = world.query('beam');
      const beam = world.get(ids[ids.length - 1], 'mesh').root;
      const start = beam.localToWorld(new THREE.Vector3(0, -beam.geometry.parameters.height / 2, 0));
      assert.ok(start.distanceTo(expected) < 1e-6, 'beam endpoint is the animated muzzle, including its height');
    }
  });

  it('anchors a laser streak at the muzzle and preserves its aim in flight', () => {
    const { world, soldierId, fire } = setup('kasrkin', null, 'laser');
    const root = world.get(soldierId, 'mesh').root;
    root.position.set(2, 4, 3);
    const muzzle = addKasrkinRig(root);
    const expected = muzzle.getWorldPosition(new THREE.Vector3());
    fire();
    const id = world.query('laserBullet')[0];
    const laser = world.get(id, 'mesh').root;
    assert.equal(laser.name, 'hellgun_laser');
    assert.ok(laser.position.distanceTo(expected) < 1e-9);
    laser.geometry.computeBoundingBox();
    assert.equal(laser.geometry.boundingBox.min.z, 0, 'no streak extends behind the muzzle');
    const direction = laser.getWorldDirection(new THREE.Vector3());
    const shot = world.get(id, 'laserBullet');
    const velocity = new THREE.Vector3(shot.vx, shot.vy, shot.vz).normalize();
    assert.ok(direction.distanceTo(velocity) < 1e-9);
    systemLaserBullet(world, 0.001);
    assert.ok(laser.getWorldDirection(new THREE.Vector3()).distanceTo(velocity) < 1e-9);
  });

  it('gives hellgun lasers a warm orange-white core, orange edges, and independent fading', () => {
    const { world, fire } = setup();
    fire();
    const firstId = world.query('beam')[0];
    const first = world.get(firstId, 'mesh').root;
    assert.equal(first.name, 'hellgun_laser');
    assert.equal(world.get(firstId, 'beam').projectileType, 'hellgun_laser');
    const core = first.getObjectByName('hellgun_laser_core');
    const edgeColor = first.material.color;
    const coreColor = core.material.color;
    assert.ok(coreColor.r > edgeColor.r && coreColor.g > edgeColor.g);
    assert.ok(edgeColor.r > edgeColor.g && edgeColor.g > edgeColor.b, 'orange edges (r > g > b)');
    assert.ok(core.scale.x < 1 && core.scale.z < 1, 'light core lies inside the outer tube');
    let freedMaterials = 0;
    let freedGeometry = 0;
    first.geometry.addEventListener('dispose', () => freedGeometry++);
    first.traverse((part) => part.material.addEventListener('dispose', () => freedMaterials++));
    world.get(firstId, 'beam').hit = true;
    world.addSystem(systemBeam);
    world.tick(0.09);
    assert.ok(first.material.opacity < 0.92);
    assert.equal(first.material.opacity, core.material.opacity, 'all layers fade together');
    fire(0.25);
    const secondId = world.query('beam').find((id) => id !== firstId);
    const second = world.get(secondId, 'mesh').root;
    assert.equal(second.material.opacity, 0.92, 'new shot is fully bright');
    assert.notEqual(first.material, second.material);
    world.get(secondId, 'beam').hit = true;
    world.tick(0.1);
    assert.equal(world.get(firstId, 'mesh'), undefined, 'expired laser removed');
    assert.equal(freedMaterials, 4, 'expired layers release their materials');
    assert.equal(freedGeometry, 0, 'shared geometry stays alive for the next laser');
    assert.ok(world.get(secondId, 'mesh'), 'newer shot is still visible');
    const other = setup('guardsmen');
    other.fire();
    const ordinary = other.world.get(other.world.query('beam')[0], 'mesh').root;
    assert.equal(ordinary.name, 'lasgun_laser');
    assert.equal(ordinary.getObjectByName('hellgun_laser_core'), undefined);
  });

  it('uses the fallback when the hellgun marker is absent, ignoring other weapons’ muzzles', () => {
    const { world, soldierId } = setup();
    const root = world.get(soldierId, 'mesh').root;
    root.position.set(4, 0, 6);
    const plasma = new THREE.Object3D();
    plasma.name = 'marker_plasma_muzzle';
    plasma.position.set(9, 9, 9);
    root.add(plasma);
    assert.deepEqual(getSoldierMuzzlePos(world, soldierId, 'hellgun').toArray(), [4, 1.05, 6]);
  });

  it('persists preferences, clamps the slider range, and handles unavailable storage', () => {
    assert.equal(setKasrkinFireRate('6.5'), 6.5);
    assert.equal(saved.get(KASRKIN_FIRE_RATE_STORAGE_KEY), '6.5');
    assert.equal(kasrkinFireRate(), 6.5);
    assert.equal(setKasrkinFireRate(100), 10);
    assert.equal(setKasrkinFireRate(0.1), 0.4);
    assert.equal(setKasrkinFireRate('invalid'), 10);
    const storage = globalThis.localStorage;
    try {
      delete globalThis.localStorage;
      assert.equal(setKasrkinFireRate(5), 5);
      assert.equal(kasrkinFireRate(), 5);
    } finally {
      globalThis.localStorage = storage;
    }
  });
});
