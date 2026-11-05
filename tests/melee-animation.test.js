import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as THREE from 'three';

globalThis.window = {};
globalThis.document = { getElementById: () => null };
const scene = await import('../src/core/scene.js');
scene.__setSceneCameraForTests(new THREE.Scene(), { target: new THREE.Vector3() });
const { findMeleeClip, makeMeleeFallbackClip } = await import('../src/render/melee-animation.js');
const { _makeFactionSoldierMesh } = await import('../src/meshes/soldiers.js');
const { updateMixers } = await import('../src/render/gltf-models.js');
const roots = [];

function fixture(nativeMelee = true) {
  const model = new THREE.Group();
  const arm = new THREE.Bone();
  arm.name = 'bip01 r upperarm';
  model.add(arm);
  const still = [0, 0, 0, 1, 0, 0, 0, 1];
  const clip = (name, moving = false) => new THREE.AnimationClip(name, 0.65, [
    new THREE.QuaternionKeyframeTrack(`${arm.name}.quaternion`, [0, 0.65], moving ? [0, 0, 0, 1, 0.5, 0, 0, Math.sqrt(0.75)] : still),
  ]);
  const container = {
    scene: model, meshes: [], _hiddenNodes: [], dispose() {},
    animations: [clip('idle_1'), clip('move_run_1'), clip('idle_firing_1')],
  };
  if (nativeMelee) container.animations.push(clip('melee_attack_1', true));
  const root = _makeFactionSoldierMesh(container, 'blue', { unitType: 'guardsmen' }, 'ig');
  roots.push(root);
  return { root, sourceArm: arm, arm: root.getObjectByName(arm.name), container };
}

afterEach(() => {
  for (const root of roots.splice(0)) {
    for (const group of new Set(Object.values(root._animGroups))) group?.dispose();
  }
});

describe('melee animation clips', () => {
  it('selects the actual Guardsmen and Kasrkin attacks rather than block or damage reactions', () => {
    for (const name of ['guardsmen', 'kasrkin']) {
      const file = readFileSync(new URL(`../models/ig/infantry/${name}.glb`, import.meta.url));
      const gltf = JSON.parse(file.subarray(20, 20 + file.readUInt32LE(12)).toString());
      const clips = gltf.animations.map((animation) => new THREE.AnimationClip(animation.name));
      assert.equal(findMeleeClip(clips, 'melee_attack_1').name, 'melee_attack_1');
    }
    const candidates = ['vis_knife_sync_kill_1', 'melee_block', 'melee_damage_l', 'MELEE_IDLE', 'MELEE_RUN', 'MELEE_1'].map((name) => new THREE.AnimationClip(name));
    assert.equal(findMeleeClip(candidates).name, 'MELEE_1');
  });

  it('plays the registered attack once and allows explicit orders to interrupt it', () => {
    const { root, arm } = fixture();
    root._playAnim('melee');
    assert.equal(root._currentAnim, 'melee');
    assert.equal(root._animGroups.melee.loopAnimation, false);
    updateMixers(0.2);
    assert.ok(Math.abs(arm.quaternion.x) > 0.01, 'attack moves the actual arm');
    root._playAnim('idle');
    assert.equal(root._currentAnim, 'melee', 'idle does not cut a swing short');
    root._playAnim('run', undefined, true);
    assert.equal(root._currentAnim, 'run', 'a move or stop order can interrupt');
    root._playAnim('melee', false, true);
    updateMixers(0.7);
    assert.equal(root._currentAnim, null, 'attack completes without looping');
    root._playAnim('idle');
    assert.equal(root._currentAnim, 'idle');
  });

  it('provides an arm swing when a model has no melee clip without modifying the source model', () => {
    const { root, arm, sourceArm, container } = fixture(false);
    assert.equal(container.animations.length, 3);
    assert.equal(root._animGroups.melee.name, 'melee_attack_fallback');
    root._playAnim('melee');
    updateMixers(0.15);
    assert.ok(Math.abs(arm.quaternion.x) > 0.1);
    assert.equal(sourceArm.quaternion.x, 0, 'shared source rig is untouched');
    const staticClip = makeMeleeFallbackClip(new THREE.Group());
    assert.equal(staticClip.tracks[0].name, '.quaternion', 'static models get a small body strike');
  });
});
