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
const { World } = await import('../src/ecs.js');
const { createLightningEntity, createSquadEntity, getSoldierMuzzlePos } = await import('../src/entities.js');
const { NecronLightning } = await import('../src/necron-lightning.js');
const { systemBeam } = await import('../src/systems.js');

function makeStubWorld() {
  const comps = new Map();
  let nextId = 1;
  return {
    createEntity() {
      return nextId++;
    },
    add(id, type, data) {
      if (!comps.has(id)) comps.set(id, new Map());
      comps.get(id).set(type, data);
    },
    get(id, type) {
      return comps.get(id)?.get(type);
    },
    has(id, type) {
      return comps.get(id)?.has(type) ?? false;
    },
  };
}

function fireBolt(options = {}) {
  const scene = new THREE.Scene();
  const bolt = new NecronLightning(scene, { duration: 0.3, ...options });
  bolt.fire(new THREE.Vector3(0, 1.05, 0), new THREE.Vector3(20, 1.0, 0));
  return { scene, bolt };
}

function collect(root) {
  const out = { lines: [], tubes: [], sprites: [] };
  root.traverse((child) => {
    if (child.isSprite) out.sprites.push(child);
    else if (child.isLine) out.lines.push(child);
    else if (child.isMesh && child.geometry?.type === 'TubeGeometry') out.tubes.push(child);
  });
  return out;
}

describe('necron lightning effect', () => {
  it('fire builds layered bolt attached to the scene', () => {
    const { scene, bolt } = fireBolt({ branchCount: 4 });
    assert.equal(bolt.root.parent, scene);
    const parts = collect(bolt.root);
    assert.equal(parts.tubes.length, 2, 'energy tube + aura tube');
    assert.ok(parts.lines.length >= 1 + 4, 'core line + branch pool + impact arcs');
    assert.equal(parts.sprites.length, 3, 'mid glow + hit glow + impact flash');
    for (const tube of parts.tubes) {
      tube.geometry.computeBoundingBox();
      const box = tube.geometry.boundingBox.clone().expandByScalar(0.2);
      assert.ok(box.containsPoint(new THREE.Vector3(0, 1.05, 0)), 'tube starts at muzzle');
      assert.ok(box.containsPoint(new THREE.Vector3(20, 1.0, 0)), 'tube ends at target');
    }
  });

  it('core re-jitters every frame and the bolt ends after duration', () => {
    const { bolt } = fireBolt();
    const before = Float32Array.from(bolt._coreGeo.attributes.position.array);
    assert.equal(bolt.update(1 / 60), true);
    const after = bolt._coreGeo.attributes.position.array;
    let changed = 0;
    for (let i = 0; i < before.length; i++) {
      if (before[i] !== after[i]) changed += 1;
    }
    assert.ok(changed > 0, 'core path perturbed between frames');
    let ticks = 1;
    while (bolt.update(1 / 60)) {
      ticks += 1;
      assert.ok(ticks < 60, 'bolt must end');
    }
    assert.ok(ticks >= 15 && ticks <= 25, `lifetime ~duration, took ${ticks} ticks`);
    assert.equal(bolt.root.visible, false);
  });

  it('bolt converges exactly onto the target', () => {
    const { bolt } = fireBolt();
    const target = new THREE.Vector3(20, 1.0, 0);
    const start = new THREE.Vector3(0, 1.05, 0);
    const axis = target.clone().sub(start);
    for (let frame = 0; frame < 5; frame++) {
      bolt.update(1 / 60);
      const pos = bolt._coreGeo.attributes.position;
      const last = new THREE.Vector3().fromBufferAttribute(pos, pos.count - 1);
      assert.ok(last.distanceTo(target) < 1e-6, 'core ends exactly at the target');
      for (let i = 0; i < pos.count; i++) {
        const t = i / (pos.count - 1);
        if (t < 0.85 || t >= 1) continue;
        const v = new THREE.Vector3().fromBufferAttribute(pos, i);
        const closest = start.clone().addScaledVector(axis, t);
        assert.ok(
          v.distanceTo(closest) < 0.2,
          `near-target point ${i} stays tight, got ${v.distanceTo(closest)}`,
        );
      }
    }
  });

  it('bolt layers stay thin', () => {
    const { bolt } = fireBolt();
    assert.ok(bolt._tubeMid.geometry.parameters.radius <= 0.03);
    assert.ok(bolt._tubeAura.geometry.parameters.radius <= 0.08);
    bolt.update(1 / 60);
    bolt.update(1 / 60);
    assert.ok(bolt._tubeMid.geometry.parameters.radius <= 0.03);
    assert.ok(bolt._tubeAura.geometry.parameters.radius <= 0.08);
  });

  it('branches live only a few frames and re-fire elsewhere', () => {
    const { bolt } = fireBolt({ branchCount: 3, branchProbability: 1 });
    assert.equal(bolt._branches.length, 3);
    let sawVisible = 0;
    for (let i = 0; i < 12; i++) {
      bolt.update(1 / 60);
      if (bolt._branches.some((b) => b.line.visible)) sawVisible += 1;
    }
    assert.ok(sawVisible > 0, 'branches appear during the discharge');
    for (const b of bolt._branches) {
      assert.ok(b.life <= 0.1, `short branch life, got ${b.life}`);
    }
  });

  it('dispose detaches the bolt and frees geometries', () => {
    const { scene, bolt } = fireBolt();
    const geos = [];
    bolt.root.traverse((child) => {
      if (child.geometry) geos.push(child.geometry);
    });
    assert.ok(geos.length > 0);
    bolt.dispose();
    assert.equal(bolt.root.parent, null);
    assert.equal(bolt.alive, false);
    assert.equal(bolt.update(1 / 60), false);
    assert.equal(scene.children.includes(bolt.root), false);
  });

  it('createLightningEntity registers a damaging shot', () => {
    const world = makeStubWorld();
    const targetId = world.createEntity();
    const targetMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1));
    targetMesh.position.set(10, 0, 0);
    world.add(targetId, 'mesh', { root: targetMesh });
    const id = createLightningEntity(world, new THREE.Vector3(0, 0, 0), 'blue', 4242, targetId, 1);
    assert.ok(id, 'lightning entity id returned');
    assert.ok(world.get(id, 'mesh').lightning instanceof NecronLightning);
    const beam = world.get(id, 'beam');
    assert.equal(beam.team, 'blue');
    assert.equal(beam.targetId, targetId);
    assert.ok(beam.damage > 0);
    assert.equal(createLightningEntity(world, new THREE.Vector3(), 'blue', 1, 999, 1), null);
  });

  it('systemBeam damages the target and cleans the bolt up', () => {
    const world = new World();
    const targetId = world.createEntity([]);
    const targetMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1));
    targetMesh.position.set(10, 0, 0);
    world.add(targetId, 'soldier', { hp: 1000, maxHp: 1000, squadId: null });
    world.add(targetId, 'mesh', { root: targetMesh });
    const id = createLightningEntity(world, new THREE.Vector3(0, 0, 0), 'blue', 4242, targetId, 1);
    world.addSystem(systemBeam);
    world.tick(1 / 60);
    assert.ok(world.get(targetId, 'soldier').hp < 1000, 'target took damage on first tick');
    for (let i = 0; i < 40; i++) {
      world.tick(1 / 60);
    }
    assert.deepEqual(world.query('beam', 'mesh'), [], 'bolt entity destroyed after discharge');
    assert.equal(world.get(id, 'mesh')?.lightning?.alive ?? false, false);
  });

  it('muzzle lookup prefers the gun-tip marker', () => {
    const world = makeStubWorld();
    const soldierId = world.createEntity();
    const root = new THREE.Group();
    root.position.set(10, 0, 0);
    const base = new THREE.Object3D();
    base.name = 'marker_gun_muzzle_01';
    base.position.set(0, 1.0, 0);
    const tip = new THREE.Object3D();
    tip.name = 'marker_gun_muzzle_ctr_out';
    tip.position.set(0.5, 1.2, 0.3);
    root.add(base, tip);
    world.add(soldierId, 'mesh', { root });
    const muzzle = getSoldierMuzzlePos(world, soldierId);
    assert.ok(muzzle.distanceTo(new THREE.Vector3(10.5, 1.2, 0.3)) < 1e-9);
  });

  it('muzzle origin extends past the tip along the barrel axis', () => {
    const world = makeStubWorld();
    const soldierId = world.createEntity();
    const root = new THREE.Group();
    root.position.set(10, 0, 0);
    const base = new THREE.Object3D();
    base.name = 'marker_gun_tube_ctr_base';
    base.position.set(-0.5, 1.2, 0.3);
    const tip = new THREE.Object3D();
    tip.name = 'marker_gun_muzzle_ctr_out';
    tip.position.set(0.5, 1.2, 0.3);
    root.add(base, tip);
    world.add(soldierId, 'mesh', { root });
    const muzzle = getSoldierMuzzlePos(world, soldierId);
    assert.ok(muzzle.distanceTo(new THREE.Vector3(11.0, 1.2, 0.3)) < 1e-9);
  });

  it('muzzle lookup falls back to chest height without markers', () => {
    const world = makeStubWorld();
    const soldierId = world.createEntity();
    const root = new THREE.Group();
    root.position.set(4, 0, 6);
    const bone = new THREE.Object3D();
    bone.name = 'bip01_r_hand';
    root.add(bone);
    world.add(soldierId, 'mesh', { root });
    assert.ok(getSoldierMuzzlePos(world, soldierId).distanceTo(new THREE.Vector3(4, 1.05, 6)) < 1e-9);
    assert.ok(getSoldierMuzzlePos(world, 999).distanceTo(new THREE.Vector3(0, 1.05, 0)) < 1e-9);
  });

  it('lightning starts exactly at the muzzle point', () => {
    const world = makeStubWorld();
    const soldierId = world.createEntity();
    const root = new THREE.Group();
    root.position.set(10, 0, 0);
    const tip = new THREE.Object3D();
    tip.name = 'marker_gun_muzzle_ctr_out';
    tip.position.set(0.5, 1.2, 0.3);
    root.add(tip);
    world.add(soldierId, 'mesh', { root });
    const targetId = world.createEntity();
    const targetMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1));
    targetMesh.position.set(30, 0, 0);
    world.add(targetId, 'mesh', { root: targetMesh });
    const muzzle = getSoldierMuzzlePos(world, soldierId);
    const id = createLightningEntity(world, muzzle, 'blue', soldierId, targetId, 1);
    const pathStart = world.get(id, 'mesh').lightning._path[0];
    assert.ok(pathStart.distanceTo(muzzle) === 0);
  });

  it('necron squads default to lightning, others keep beam/bullet', () => {
    const world = makeStubWorld();
    const necronId = createSquadEntity(world, 'blue', 0, 0, 1, null, 'necrons');
    assert.equal(world.get(necronId, 'squad').projectileType, 'lightning');
    const igId = createSquadEntity(world, 'blue', 40, 0, 1, null, 'ig');
    assert.equal(world.get(igId, 'squad').projectileType, 'beam');
    const chaosId = createSquadEntity(world, 'red', 0, 40, 1, null, 'chaos');
    assert.equal(chaosId && world.get(chaosId, 'squad').projectileType, 'bullet');
  });
});
