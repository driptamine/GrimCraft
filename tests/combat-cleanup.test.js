import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';

globalThis.window = {};
globalThis.document = { getElementById: () => null };
const state = await import('../src/core/scene.js');
const scene = new THREE.Scene();
scene._registerShadows = () => {};
state.__setSceneCameraForTests(scene, { target: new THREE.Vector3() });
const { _makeFactionSoldierMesh } = await import('../src/meshes/soldiers.js');
const { updateMixers, instantiateGltf } = await import('../src/render/gltf-models.js');
const { disposeSoldierMeshes, disposeMeshComponent, spawnParticles } = await import('../src/systems/combat.js');
const { systemParticle } = await import('../src/systems/projectiles.js');
const { spawnBloodLiquid } = await import('../src/fx/blood/blood-liquid-splat.js');

function soldierFixture() {
  const model = new THREE.Group();
  const bone = new THREE.Bone();
  bone.name = 'arm';
  model.add(bone, new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial()));
  const clip = name => new THREE.AnimationClip(name, 1, [
    new THREE.NumberKeyframeTrack('arm.rotation[z]', [0, 1], [0, 0.4]),
  ]);
  const container = { scene: model, meshes: [], _hiddenNodes: [], dispose() {},
    animations: ['idle_1', 'move_run_1', 'idle_firing_1', 'melee_attack_1', 'unused_clip', 'die_normal_1'].map(clip) };
  const root = _makeFactionSoldierMesh(container, 'blue', { unitType: 'guardsmen' }, 'ig');
  return { root, model, container };
}

for (const [label, cleanup] of [['soldier death', disposeSoldierMeshes], ['world reset', disposeMeshComponent]]) {
  test(`${label} unregisters the entire animation instance, including unused clips`, () => {
    const hitboxesBefore = state._allHitboxes.length;
    const { root } = soldierFixture();
    const mixer = root._animGroups.idle._mixer;
    let ticks = 0;
    const originalUpdate = mixer.update;
    mixer.update = function(dt) { ticks++; return originalUpdate.call(this, dt); };
    updateMixers(0.1);
    assert.equal(ticks, 1);
    cleanup({ root });
    cleanup({ root });
    updateMixers(0.1);
    assert.equal(ticks, 1, 'dead instance must no longer retain its rig in the global mixer set');
    assert.equal(root.parent, null);
    assert.equal(state._allHitboxes.length, hitboxesBefore, 'dead hitboxes leave the global debug registry');
  });
}

test('removing a soldier does not dispose geometry still used by its living sibling', () => {
  const { root, model, container } = soldierFixture();
  const sibling = _makeFactionSoldierMesh(container, 'blue', { unitType: 'guardsmen' }, 'ig');
  let disposed = 0;
  model.children[1].geometry.addEventListener('dispose', () => disposed++);
  try {
    disposeSoldierMeshes({ root });
    assert.equal(disposed, 0, 'instanced GLTF geometry belongs to the source container');
    assert.ok(sibling.getObjectByProperty('isMesh', true));
  } finally {
    disposeMeshComponent({ root: sibling });
  }
});

test('instance disposal frees its bone texture once without touching another skeleton', () => {
  const model = new THREE.Group();
  const bone = new THREE.Bone();
  model.add(bone);
  const skin = new THREE.SkinnedMesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
  skin.bind(new THREE.Skeleton([bone]));
  model.add(skin);
  const container = { scene: model, animations: [], meshes: [skin], _hiddenNodes: [], dispose() {} };
  const first = instantiateGltf(container);
  const second = instantiateGltf(container);
  const skeleton = first.rootNodes[0].getObjectByProperty('isSkinnedMesh', true).skeleton;
  const otherSkeleton = second.rootNodes[0].getObjectByProperty('isSkinnedMesh', true).skeleton;
  skeleton.computeBoneTexture();
  otherSkeleton.computeBoneTexture();
  let disposed = 0;
  skeleton.boneTexture.addEventListener('dispose', () => disposed++);
  first.dispose();
  first.dispose();
  assert.equal(disposed, 1);
  assert.equal(skeleton.boneTexture, null);
  assert.ok(otherSkeleton.boneTexture, 'living rig keeps its own bone texture');
  second.dispose();
});

test('expired hit and blood particles release every owned material, preserving shared geometry', () => {
  let materialDisposals = 0;
  let geometryDisposals = 0;
  let spawned = 0;
  for (let round = 0; round < 20; round++) {
    spawnParticles(new THREE.Vector3(), new THREE.Color('red'), 8);
    spawnBloodLiquid(new THREE.Vector3());
    for (const particle of state.particles) {
      spawned++;
      particle.material.addEventListener('dispose', () => materialDisposals++);
      particle.mesh.geometry.addEventListener('dispose', () => geometryDisposals++);
    }
    systemParticle(null, 3);
    assert.equal(state.particles.length, 0);
  }
  assert.equal(materialDisposals, spawned, 'GPU materials must not accumulate across combat bursts');
  assert.equal(geometryDisposals, 0);
});
