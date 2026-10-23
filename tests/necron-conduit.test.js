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
const { attachGaussConduit, updateNecronConduits } = await import('../src/necron-conduit.js');
const { makeSoldierMesh } = await import('../src/meshes.js');
const { factionContainers } = await import('../src/factions.js');

function gunHierarchy() {
  const root = new THREE.Group();
  root.name = 'soldier_clone';
  const hand = new THREE.Group();
  hand.name = 'bone_hand_r';
  const base = new THREE.Object3D();
  base.name = 'marker_gun_tube_ctr_base';
  base.position.set(0, 0, 0);
  const end = new THREE.Object3D();
  end.name = 'marker_gun_tube_ctr_end';
  end.position.set(0, 0.74, 0);
  hand.add(base, end);
  root.add(hand);
  return root;
}

function collectConduit(group) {
  const out = { casing: null, stream: null, filaments: [], rings: [], sprites: [] };
  group.traverse((child) => {
    if (child.name === 'gauss_conduit_casing') out.casing = child;
    else if (child.name === 'gauss_conduit_stream') out.stream = child;
    else if (child.name === 'gauss_conduit_filament') out.filaments.push(child);
    else if (child.name === 'gauss_conduit_ring') out.rings.push(child);
    else if (child.isSprite) out.sprites.push(child);
  });
  return out;
}

describe('gauss flayer energy conduit', () => {
  it('attaches casing, stream, filaments, rings and glow under the gun bone', () => {
    const root = gunHierarchy();
    const group = attachGaussConduit(root);
    assert.ok(group, 'conduit group returned');
    assert.equal(group.parent.name, 'bone_hand_r');
    const parts = collectConduit(group);
    assert.ok(parts.casing, 'transparent casing present');
    assert.equal(parts.casing.material.transparent, true);
    assert.ok(parts.casing.material.opacity < 0.5);
    assert.ok(parts.stream, 'energy stream present');
    assert.ok(parts.stream.material.isShaderMaterial, 'stream uses the pulse shader');
    assert.ok('uTime' in parts.stream.material.uniforms);
    assert.equal(parts.filaments.length, 2);
    assert.equal(parts.rings.length, 2);
    assert.equal(parts.sprites.length, 1);
    // Stream physically contained inside the casing.
    assert.ok(parts.stream.geometry.parameters.radius < parts.casing.geometry.parameters.radius);
  });

  it('reuses shared geometries and materials across soldiers', () => {
    const first = collectConduit(attachGaussConduit(gunHierarchy()));
    const second = collectConduit(attachGaussConduit(gunHierarchy()));
    assert.equal(second.casing.geometry, first.casing.geometry);
    assert.equal(second.casing.material, first.casing.material);
    assert.equal(second.stream.geometry, first.stream.geometry);
    assert.equal(second.stream.material, first.stream.material);
    assert.equal(second.rings[0].geometry, first.rings[0].geometry);
  });

  it('returns null when the model has no gun markers', () => {
    assert.equal(attachGaussConduit(new THREE.Group()), null);
    assert.equal(attachGaussConduit(null), null);
    const partial = new THREE.Group();
    const hand = new THREE.Group();
    hand.name = 'bone_hand_r';
    const base = new THREE.Object3D();
    base.name = 'marker_gun_tube_ctr_base';
    hand.add(base);
    partial.add(hand);
    assert.equal(attachGaussConduit(partial), null);
  });

  it('frame tick advances the shared energy clock', () => {
    const group = attachGaussConduit(gunHierarchy());
    const mat = collectConduit(group).stream.material;
    const before = mat.uniforms.uTime.value;
    updateNecronConduits(1 / 60);
    updateNecronConduits(1 / 60);
    assert.ok(mat.uniforms.uTime.value > before);
  });

  it('necron soldiers spawn with the conduit, others without', () => {
    factionContainers.necrons.soldier = { scene: gunHierarchy(), animations: [], _hiddenNodes: null };
    const necronRoot = makeSoldierMesh('blue', { faction: 'necrons' });
    const found = [];
    necronRoot.traverse((child) => {
      if (child.name === 'gauss_conduit') found.push(child);
    });
    assert.equal(found.length, 1, 'one conduit per warrior');

    factionContainers.ig.soldier = { scene: gunHierarchy(), animations: [], _hiddenNodes: null };
    const igRoot = makeSoldierMesh('blue', { faction: 'ig' });
    let igConduits = 0;
    igRoot.traverse((child) => {
      if (child.name === 'gauss_conduit') igConduits += 1;
    });
    assert.equal(igConduits, 0, 'no conduit on non-necron soldiers');
  });
});
