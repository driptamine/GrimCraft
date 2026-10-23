import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import * as THREE from 'three';

register('./node-esm-hooks.mjs', import.meta.url);
globalThis.document = { getElementById: () => null };
const { AnimGroup } = await import('../src/gltf-models.js');

function scrubFixture() {
  const root = new THREE.Group();
  const bone = new THREE.Group();
  bone.name = 'pole';
  root.add(bone);
  const track = new THREE.VectorKeyframeTrack('.position', [0, 1], [0, -4, 0, 0, 2, 0]);
  const clip = new THREE.AnimationClip('raise', 1, [track]);
  // Retarget the track at the bone.
  clip.tracks[0] = new THREE.VectorKeyframeTrack('pole.position', [0, 1], [0, -4, 0, 0, 2, 0]);
  const mixer = new THREE.AnimationMixer(root);
  const group = new AnimGroup(clip, mixer, null);
  return { root, bone, mixer, group };
}

describe('anim scrub', () => {
  it('freezes the clip at progress * duration and holds across updates', () => {
    const { bone, mixer, group } = scrubFixture();
    group.scrub(0.5);
    mixer.update(0.016);
    assert.equal(bone.position.y, -1);
    mixer.update(1);
    assert.equal(bone.position.y, -1);
    group.scrub(1);
    mixer.update(0.016);
    assert.equal(bone.position.y, 2);
    group.scrub(0);
    mixer.update(0.016);
    assert.equal(bone.position.y, -4);
  });

  it('clamps progress and hands control back to start()', () => {
    const { bone, mixer, group } = scrubFixture();
    group.scrub(5);
    mixer.update(0.016);
    assert.equal(bone.position.y, 2);
    group.scrub(-3);
    mixer.update(0.016);
    assert.equal(bone.position.y, -4);
    group.start(true, 1);
    mixer.update(0.5);
    assert.ok(bone.position.y > -4 && bone.position.y < 2);
  });
});
