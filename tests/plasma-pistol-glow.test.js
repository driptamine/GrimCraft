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
const { addPlasmaPistolGlow, updatePlasmaPistolGlow, GUN_MESH, WEAPON_BONE } = await import('../src/plasma-pistol-glow.js');
const { makeSoldierMesh } = await import('../src/meshes.js');
const { factionContainers } = await import('../src/factions.js');
const { _toggleMeshNode } = await import('../src/entities.js');

function guardsmanHierarchy() {
  const root = new THREE.Group();
  root.name = 'soldier_clone';
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x3a3a3a });
  const body = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), bodyMat);
  body.name = 'guard_body';
  const pistol = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 0.5), bodyMat);
  pistol.name = 'guardsmen_plasma_pistol';
  const bone = new THREE.Group();
  bone.name = 'bone_ig_hand_weapon_r';
  const glow = new THREE.Object3D();
  glow.name = 'marker_plasma_glow';
  glow.position.set(0.075, 0.075, 0.25);
  const muzzle = new THREE.Object3D();
  muzzle.name = 'marker_plasma_muzzle';
  muzzle.position.set(0.54, 0.2, 0);
  bone.add(glow, muzzle);
  root.add(body, pistol, bone);
  return { root, body, pistol, bone, bodyMat };
}

function collectGlow(group) {
  const out = { halos: [], sparks: [], lights: [] };
  group.traverse((child) => {
    if (child.name === 'plasma_pistol_halo') out.halos.push(child);
    else if (child.name === 'plasma_pistol_spark') out.sparks.push(child);
    else if (child.isPointLight) out.lights.push(child);
  });
  return out;
}

describe('guardsmen plasma pistol glow', () => {
  it('exposes the gun mesh name as an easy constant', () => {
    assert.equal(GUN_MESH, 'guardsmen_plasma_pistol');
  });

  it('lights the pistol chamber with one halo, one spark and one light', () => {
    const { root, body, pistol, bone, bodyMat } = guardsmanHierarchy();
    assert.equal(WEAPON_BONE, 'bone_ig_hand_weapon_r');
    const group = addPlasmaPistolGlow(root);
    assert.ok(group, 'glow group returned');
    assert.equal(group.parent, bone, 'assembly rides the weapon bone, not the frozen skinned mesh');
    // Pistol gets an emissive clone; the shared body material is untouched.
    assert.notEqual(pistol.material, bodyMat);
    assert.equal(body.material, bodyMat);
    assert.equal(bodyMat.emissive.getHex(), 0x000000);
    assert.ok(pistol.material.emissive.getHex() !== 0x000000, 'chamber emissive set');
    assert.ok(pistol.material.emissiveIntensity > 1);
    const parts = collectGlow(group);
    assert.equal(parts.halos.length, 1, 'single chamber halo');
    assert.equal(parts.sparks.length, 1, 'single micro-spark');
    assert.equal(parts.lights.length, 1);
    assert.ok(parts.lights[0].distance <= 4, 'bounded light spill');
    assert.equal(parts.halos[0].scale.x, 0.55, 'chamber halo kept');
    for (const halo of [...parts.halos, ...parts.sparks]) {
      assert.ok(halo.isSprite);
      assert.equal(halo.material.blending, THREE.AdditiveBlending);
    }
    // Bright blue-purple glow across chamber, core, halos, sparks and spill light.
    assert.equal(pistol.material.emissive.getHex(), 0xe4daff);
    assert.equal(parts.halos[0].material.color.getHex(), 0x5569ff);
    assert.equal(parts.sparks[0].material.color.getHex(), 0x7d96ff);
    assert.equal(parts.lights[0].color.getHex(), 0x738cff);
    // The gun animates with the hand bone: the glow must travel with it,
    // never freeze at the bind pose while the pistol moves away.
    root.updateMatrixWorld(true);
    const before = parts.halos[0].getWorldPosition(new THREE.Vector3());
    bone.position.set(2, 0, 0);
    root.updateMatrixWorld(true);
    const after = parts.halos[0].getWorldPosition(new THREE.Vector3());
    assert.ok(Math.abs(after.x - before.x - 2) < 1e-6, 'halo follows the weapon bone');
  });

  it('core is a shared thin capsule aligned with the barrel', () => {
    const first = guardsmanHierarchy();
    const second = guardsmanHierarchy();
    const groupA = addPlasmaPistolGlow(first.root);
    const groupB = addPlasmaPistolGlow(second.root);
    const coreA = groupA.getObjectByName('plasma_pistol_core');
    const coreB = groupB.getObjectByName('plasma_pistol_core');
    assert.ok(coreA, 'capsule core present');
    assert.equal(coreA.geometry.type, 'CapsuleGeometry', 'core is a capsule');
    assert.equal(coreA.geometry, coreB.geometry, 'core geometry shared');
    assert.equal(coreA.material, coreB.material, 'core material shared');
    assert.ok(coreA.material.isMeshBasicMaterial, 'core unlit bright');
    const p = coreA.geometry.parameters;
    assert.ok(p.radius < 0.05, 'capsule thin');
    assert.ok(p.height + 2 * p.radius > 4 * p.radius, 'capsule longer than wide');
    // Capsule axis (+Y) must point along the barrel (chamber -> muzzle).
    const dir = new THREE.Vector3(0, 1, 0).applyQuaternion(coreA.quaternion);
    const glowMark = first.bone.getObjectByName('marker_plasma_glow');
    const muzzleMark = first.bone.getObjectByName('marker_plasma_muzzle');
    const barrel = muzzleMark.position.clone().sub(glowMark.position).normalize();
    assert.ok(dir.dot(barrel) > 0.99, 'capsule axis aligned with barrel');
    const expected = glowMark.position.clone().addScaledVector(barrel, 0.12);
    assert.deepEqual(
      coreA.position.toArray().map((v) => +v.toFixed(6)),
      expected.toArray().map((v) => +v.toFixed(6)),
      'capsule shifted from the chamber toward the muzzle',
    );
  });

  it('capsule core holds steady white-blue', () => {
    const { root } = guardsmanHierarchy();
    const group = addPlasmaPistolGlow(root);
    const core = group.getObjectByName('plasma_pistol_core');
    for (let i = 0; i <= 40; i++) {
      updatePlasmaPistolGlow(i * 0.07);
      const c = core.material.color;
      assert.ok(c.b >= c.r && c.b >= c.g, 'core stays blue-white');
      assert.ok(Math.min(c.r, c.g, c.b) > 0.3, 'core stays bright');
    }
    assert.equal(core.material.color.getHex(), 0xf0e6ff, 'steady core color');
  });

  it('gas envelope hugs the capsule with a steady noise shader', () => {
    const first = guardsmanHierarchy();
    const second = guardsmanHierarchy();
    const groupA = addPlasmaPistolGlow(first.root);
    const groupB = addPlasmaPistolGlow(second.root);
    const gasA = groupA.getObjectByName('plasma_pistol_gas');
    const gasB = groupB.getObjectByName('plasma_pistol_gas');
    const coreA = groupA.getObjectByName('plasma_pistol_core');
    assert.ok(gasA, 'gas shell present');
    assert.equal(gasA.geometry.type, 'CapsuleGeometry', 'gas shell is a capsule');
    assert.equal(gasA.geometry, gasB.geometry, 'gas geometry shared');
    assert.equal(gasA.material, gasB.material, 'gas material shared');
    assert.ok(
      gasA.geometry.parameters.radius > coreA.geometry.parameters.radius,
      'shell larger than the core',
    );
    assert.deepEqual(gasA.position.toArray(), coreA.position.toArray(), 'gas centered on the core');
    assert.deepEqual(
      gasA.quaternion.toArray(),
      coreA.quaternion.toArray(),
      'gas aligned with the core',
    );
    assert.ok(gasA.material.isShaderMaterial, 'gas uses a shader');
    assert.equal(gasA.material.blending, THREE.AdditiveBlending, 'gas additive');
    assert.equal(gasA.material.transparent, true);
    assert.equal(gasA.material.depthWrite, false);
    assert.ok(!('uTime' in gasA.material.uniforms), 'no time uniform: steady gas');
    assert.ok(!gasA.material.fragmentShader.includes('uTime'), 'shader has no animation clock');
    assert.equal(gasA.material.uniforms.uColorDeep.value.getHex(), 0x2e2a99);
    assert.equal(gasA.material.uniforms.uColorHot.value.getHex(), 0xbfb8ff);
  });

  it('masks emissive to the chamber area via shader chunk', () => {
    const { pistol } = guardsmanHierarchy();
    addPlasmaPistolGlow(pistol.parent);
    const mask = pistol.geometry.attributes.aEmissive;
    assert.ok(mask, 'aEmissive attribute present');
    assert.equal(mask.count, pistol.geometry.attributes.position.count);
    let min = 1;
    let max = 0;
    for (let i = 0; i < mask.count; i++) {
      min = Math.min(min, mask.array[i]);
      max = Math.max(max, mask.array[i]);
    }
    assert.equal(max, 1, 'chamber vertex fully lit');
    assert.equal(min, 0, 'far vertices stay dark');
    assert.equal(typeof pistol.material.onBeforeCompile, 'function');
    assert.equal(pistol.material.customProgramCacheKey(), 'plasmaPistolChamberMask');
  });

  it('reuses one shared emissive material and is idempotent', () => {
    const first = guardsmanHierarchy();
    const second = guardsmanHierarchy();
    addPlasmaPistolGlow(first.root);
    addPlasmaPistolGlow(second.root);
    assert.equal(second.pistol.material, first.pistol.material);
    const again = addPlasmaPistolGlow(first.root);
    assert.equal(again, first.root.getObjectByName('plasma_pistol_glow'));
    let groups = 0;
    first.root.traverse((child) => {
      if (child.name === 'plasma_pistol_glow') groups += 1;
    });
    assert.equal(groups, 1, 'no duplicate assembly on re-apply');
  });

  it('glow visibility follows the pistol through upgrade toggles', () => {
    const { root } = guardsmanHierarchy();
    const group = addPlasmaPistolGlow(root);
    assert.ok(group.visible, 'visible with the pistol out');
    _toggleMeshNode(root, 'guardsmen_plasma_pistol', false);
    assert.equal(group.visible, false, 'hidden with the pistol');
    _toggleMeshNode(root, 'guardsmen_plasma_pistol', true);
    assert.equal(group.visible, true, 'back with the pistol');
    _toggleMeshNode(root, 'guardsmen_lasgun', false);
    assert.equal(group.visible, true, 'unrelated toggles leave it alone');
  });

  it('stays null-safe without pistol or markers, applies when hidden', () => {
    assert.equal(addPlasmaPistolGlow(new THREE.Group()), null);
    assert.equal(addPlasmaPistolGlow(null), null);
    const bare = new THREE.Group();
    const pistol = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.1, 0.3),
      new THREE.MeshStandardMaterial(),
    );
    pistol.name = 'guardsmen_plasma_pistol';
    bare.add(pistol);
    assert.equal(addPlasmaPistolGlow(bare), null, 'no markers, no glow');
    // Hidden pistol still gets the assembly, but it starts hidden too.
    const { root, pistol: hidden } = guardsmanHierarchy();
    hidden.visible = false;
    const group = addPlasmaPistolGlow(root);
    assert.ok(group, 'assembly installs on hidden pistol too');
    assert.equal(group.visible, false, 'assembly starts hidden with the pistol');
  });

  it('tick keeps the shared plasma energy steady', () => {
    const { pistol } = guardsmanHierarchy();
    const group = addPlasmaPistolGlow(pistol.parent);
    const mat = pistol.material;
    const light = group.getObjectByName('plasma_pistol_spill');
    for (let t = 0; t < 4; t += 0.2) {
      updatePlasmaPistolGlow(t);
      assert.equal(mat.emissiveIntensity, 4.2, 'steady chamber heat');
      assert.equal(light.intensity, 1.6, 'steady spill level');
    }
  });

  it('guardsmen spawn glowing only with the pistol model', () => {
    factionContainers.ig.soldier = {
      scene: guardsmanHierarchy().root, animations: [], _hiddenNodes: null,
    };
    const plasmaRoot = makeSoldierMesh('blue', { faction: 'ig' });
    let plasmaGroups = 0;
    plasmaRoot.traverse((child) => {
      if (child.name === 'plasma_pistol_glow') plasmaGroups += 1;
    });
    assert.equal(plasmaGroups, 1, 'one glow assembly per pistol carrier');

    const plain = new THREE.Group();
    plain.add(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1)));
    factionContainers.necrons.soldier = { scene: plain, animations: [], _hiddenNodes: null };
    const plainRoot = makeSoldierMesh('blue', { faction: 'necrons' });
    let plainGroups = 0;
    plainRoot.traverse((child) => {
      if (child.name === 'plasma_pistol_glow') plainGroups += 1;
    });
    assert.equal(plainGroups, 0, 'no glow on models without a pistol');
  });
});
