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
const { applyPlasmaGlow, updatePlasmaGlow } = await import('../src/plasma-glow.js');
const { makeSoldierMesh } = await import('../src/meshes.js');
const { factionContainers } = await import('../src/factions.js');

function kasrkinHierarchy() {
  const root = new THREE.Group();
  root.name = 'soldier_clone';
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), bodyMat);
  body.name = 'karskin_body';
  const gun = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.8), bodyMat);
  gun.name = 'karskin_plasmagun';
  const bone = new THREE.Group();
  bone.name = 'bone_ig_hand_weapon_r';
  const pwr = new THREE.Object3D();
  pwr.name = 'marker_plasma_pwr';
  pwr.position.set(0.15, 0.24, 0.01);
  const muzzle = new THREE.Object3D();
  muzzle.name = 'marker_plasma_muzzle';
  muzzle.position.set(0.78, 0.21, 0.01);
  bone.add(pwr, muzzle);
  root.add(body, gun, bone);
  return { root, body, gun, bodyMat };
}

function collectHalos(group) {
  const halos = [];
  group.traverse((child) => {
    if (child.name === 'plasma_glow_halo') halos.push(child);
  });
  return halos;
}

describe('kasrkin plasmagun glow', () => {
  it('lights the gun coils and anchors halos to the weapon bone', () => {
    const { root, body, gun, bodyMat } = kasrkinHierarchy();
    const group = applyPlasmaGlow(root);
    assert.ok(group, 'glow group returned');
    assert.equal(group.parent.name, 'bone_ig_hand_weapon_r');
    // Gun gets an emissive clone; the shared body material is untouched.
    assert.notEqual(gun.material, bodyMat);
    assert.equal(body.material, bodyMat);
    assert.equal(bodyMat.emissive.getHex(), 0x000000);
    assert.ok(gun.material.emissive.getHex() !== 0x000000, 'coils emissive set');
    assert.ok(gun.material.emissiveIntensity > 1);
    const halos = collectHalos(group);
    assert.equal(halos.length, 2);
    for (const halo of halos) {
      assert.ok(halo.isSprite);
      assert.equal(halo.material.blending, THREE.AdditiveBlending);
    }
  });

  it('capsule core rides the chamber axis between the markers', () => {
    const first = kasrkinHierarchy();
    const second = kasrkinHierarchy();
    const groupA = applyPlasmaGlow(first.root);
    const groupB = applyPlasmaGlow(second.root);
    const capA = groupA.getObjectByName('plasma_glow_capsule');
    const capB = groupB.getObjectByName('plasma_glow_capsule');
    assert.ok(capA, 'capsule present');
    assert.equal(capA.geometry.type, 'CapsuleGeometry', 'core is a capsule');
    assert.equal(capA.geometry, capB.geometry, 'capsule geometry shared');
    assert.equal(capA.material, capB.material, 'capsule material shared');
    assert.ok(capA.material.isMeshBasicMaterial, 'capsule unlit bright');
    const bone = first.root.getObjectByName('bone_ig_hand_weapon_r');
    const pwr = bone.getObjectByName('marker_plasma_pwr').position;
    const muzzle = bone.getObjectByName('marker_plasma_muzzle').position;
    const axis = muzzle.clone().sub(pwr).normalize();
    const dir = new THREE.Vector3(0, 1, 0).applyQuaternion(capA.quaternion);
    assert.ok(dir.dot(axis) > 0.99, 'capsule axis aligned with the chamber');
    const expected = pwr.clone().lerp(muzzle, 0.45);
    assert.deepEqual(
      capA.position.toArray().map((v) => +v.toFixed(6)),
      expected.toArray().map((v) => +v.toFixed(6)),
      'capsule centered on the chamber axis',
    );
  });

  it('capsule pulses with the shared plasma energy', () => {
    const { root } = kasrkinHierarchy();
    const group = applyPlasmaGlow(root);
    const cap = group.getObjectByName('plasma_glow_capsule');
    const samples = new Set();
    for (let i = 0; i < 12; i++) {
      updatePlasmaGlow(1 / 60);
      const c = cap.material.color;
      samples.add((c.r + c.g + c.b).toFixed(4));
      assert.ok(c.b >= c.r && c.b >= c.g, 'capsule stays blue-white');
    }
    assert.ok(samples.size > 1, 'capsule brightness breathes with the pulse');
  });

  it('reuses one shared emissive material across soldiers', () => {
    const first = kasrkinHierarchy();
    const second = kasrkinHierarchy();
    applyPlasmaGlow(first.root);
    applyPlasmaGlow(second.root);
    assert.equal(second.gun.material, first.gun.material);
  });

  it('leaves models without a visible plasmagun untouched', () => {
    assert.equal(applyPlasmaGlow(new THREE.Group()), null);
    assert.equal(applyPlasmaGlow(null), null);
    const { root, gun } = kasrkinHierarchy();
    gun.visible = false;
    assert.equal(applyPlasmaGlow(root), null);
  });

  it('frame tick pulses the shared plasma energy', () => {
    const { gun } = kasrkinHierarchy();
    applyPlasmaGlow(gun.parent);
    const mat = gun.material;
    const samples = new Set();
    for (let i = 0; i < 12; i++) {
      updatePlasmaGlow(1 / 60);
      samples.add(mat.emissiveIntensity.toFixed(4));
    }
    assert.ok(samples.size > 1, 'emissive intensity breathes over time');
    assert.ok(mat.emissiveIntensity > 1, 'stays hot');
  });

  it('kasrkin soldiers spawn glowing, guardsmen without', () => {
    factionContainers.ig.units.kasrkin = {
      scene: kasrkinHierarchy().root, animations: [], _hiddenNodes: null,
    };
    const plasmaRoot = makeSoldierMesh('blue', { faction: 'ig', unitType: 'kasrkin' });
    let plasmaGroups = 0;
    plasmaRoot.traverse((child) => {
      if (child.name === 'plasma_glow') plasmaGroups += 1;
    });
    assert.equal(plasmaGroups, 1, 'one glow assembly per kasrkin');

    const plain = new THREE.Group();
    plain.add(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1)));
    factionContainers.ig.soldier = { scene: plain, animations: [], _hiddenNodes: null };
    const guardRoot = makeSoldierMesh('blue', { faction: 'ig' });
    let guardGroups = 0;
    guardRoot.traverse((child) => {
      if (child.name === 'plasma_glow') guardGroups += 1;
    });
    assert.equal(guardGroups, 0, 'no glow on models without a plasmagun');
  });
});
