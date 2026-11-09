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
  if (nativeMelee) {
    for (const name of ['melee_attack_1', 'melee_attack_2', 'melee_attack_3', 'melee_damage_l', 'melee_damage_r', 'melee_block']) {
      container.animations.push(clip(name, true));
    }
  }
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

const { triggerMeleeHitReaction } = await import('../src/combat/melee-hit-reaction.js');
describe('melee attack and reaction cycles', () => {
  it('cycles attack clips once per swing and keeps the current swing on repeated frame requests', () => {
    const { root } = fixture();
    for (const index of [1, 2, 3, 1]) {
      assert.equal(root._nextMeleeAttack(), 0.65);
      root._playAnim('melee', false, true);
      assert.equal(root._animGroups.melee.name, `melee_attack_${index}`);
      root._playAnim('melee', false);
      assert.equal(root._animGroups.melee.name, `melee_attack_${index}`);
      updateMixers(0.7);
    }
  });
  it('cycles left/right/block, with left/right only for models without a block', () => {
    for (const block of [true, false]) {
      const { root } = fixture();
      if (!block) delete root._animGroups.hitBlock;
      const soldier = { hp: 100 };
      const world = { get: (_, type) => type === 'soldier' ? soldier : { root } };
      const expected = block ? ['hitL', 'hitR', 'hitBlock', 'hitL'] : ['hitL', 'hitR', 'hitL', 'hitR'];
      for (const name of expected) {
        assert.equal(triggerMeleeHitReaction(world, 1), true);
        assert.equal(soldier.hitReactionAnim, name);
      }
      soldier.hp = 0;
      assert.equal(triggerMeleeHitReaction(world, 1), false);
    }
  });
});

describe('authored melee damage playback', () => {
  for (const model of ['space marines/troops/space_marine', 'chaos/infantry/chaos_space_marine', 'ig/infantry/guardsmen']) {
    for (const side of ['l', 'r']) {
      it(`${model}: damage_${side} visibly moves before the reaction window expires`, () => {
        const file = readFileSync(new URL(`../models/${model}.glb`, import.meta.url));
        const jsonLength = file.readUInt32LE(12);
        const doc = JSON.parse(file.subarray(20, 20 + jsonLength).toString());
        const binary = file.subarray(28 + jsonLength);
        const animation = doc.animations.find((a) => a.name === `melee_damage_${side}`);
        const channel = animation.channels.find((c) => c.target.path === 'rotation' && doc.nodes[c.target.node].name === 'bip01 spine');
        const sampler = animation.samplers[channel.sampler];
        const values = (index, size) => {
          const accessor = doc.accessors[index];
          const view = doc.bufferViews[accessor.bufferView];
          const offset = (view.byteOffset || 0) + (accessor.byteOffset || 0);
          return Array.from({ length: accessor.count * size }, (_, i) => binary.readFloatLE(offset + i * 4));
        };
        const bone = new THREE.Bone();
        bone.name = 'spine';
        const source = new THREE.Group();
        source.add(bone);
        const clip = new THREE.AnimationClip(animation.name, 2.5, [
          new THREE.QuaternionKeyframeTrack('spine.quaternion', values(sampler.input, 1), values(sampler.output, 4)),
        ]);
        const root = _makeFactionSoldierMesh({ scene: source, animations: [clip], meshes: [], _hiddenNodes: [], dispose() {} }, 'blue', {}, 'ig');
        roots.push(root);
        const spine = root.getObjectByName('spine');
        root._playAnim(side === 'l' ? 'hitL' : 'hitR', false, true);
        updateMixers(0.01);
        const initial = spine.quaternion.clone();
        updateMixers(0.39);
        assert.ok(initial.angleTo(spine.quaternion) > 0.05, 'reaction has reached the flinch by 0.4 seconds');
        updateMixers(0.41);
        assert.equal(root._currentAnim, null, 'entire reaction finishes within 0.8 seconds');
      });
    }
  }
});
