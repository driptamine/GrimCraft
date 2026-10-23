import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {
  setDefaultScene, mkBox, mkTorus, mkLineSystem, mkGroup, childMeshes,
  descendants, disposeObj, ghostHitboxMaterial, matchHiddenNodeName,
} from '../src/three-helpers.js';
import { AnimGroup, instantiateGltf, mixerThrottleStep, updateMixers } from '../src/gltf-models.js';

describe('three.js migration plumbing', () => {
  it('factories attach named meshes to the default scene', () => {
    const scene = new THREE.Scene();
    setDefaultScene(scene);
    const box = mkBox('w1', 2, 4, 6);
    assert.equal(box.name, 'w1');
    assert.ok(box.geometry instanceof THREE.BoxGeometry);
    assert.deepEqual(
      [box.geometry.parameters.width, box.geometry.parameters.height, box.geometry.parameters.depth],
      [2, 4, 6],
    );
    assert.equal(box.parent, scene);
    const group = mkGroup('g1');
    group.add(box);
    assert.equal(box.parent, group);
    assert.ok(!scene.children.includes(box));
  });

  it('mkTorus lies flat like the old ground rings', () => {
    const scene = new THREE.Scene();
    setDefaultScene(scene);
    const torus = mkTorus('sel', 1.5, 0.06, 24);
    torus.geometry.computeBoundingBox();
    const size = new THREE.Vector3();
    torus.geometry.boundingBox.getSize(size);
    assert.ok(size.y < 0.2, `flat ring expected, got y-extent ${size.y}`);
    assert.ok(Math.abs(size.x - 1.56) < 0.05, `x-extent ~diameter, got ${size.x}`);
  });

  it('mkLineSystem expands strips into segments with vertex colors', () => {
    const scene = new THREE.Scene();
    setDefaultScene(scene);
    const a = new THREE.Vector3(0, 0, 0);
    const b = new THREE.Vector3(1, 0, 0);
    const c = new THREE.Vector3(0, 0, 1);
    const red = new THREE.Color(1, 0, 0);
    const lines = mkLineSystem('ls', [[a, b], [b, c]], [[red, red], [red, red]], 0.7);
    assert.ok(lines instanceof THREE.LineSegments);
    assert.equal(lines.geometry.getAttribute('position').count, 4);
    assert.equal(lines.geometry.getAttribute('color').count, 4);
    assert.equal(lines.material.opacity, 0.7);
    assert.equal(lines.material.transparent, true);
  });

  it('childMeshes/descendants/disposeObj manage the graph', () => {
    const scene = new THREE.Scene();
    setDefaultScene(scene);
    const root = mkGroup('root');
    const box = mkBox('b', 1, 1, 1);
    const inner = mkGroup('inner');
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(1));
    root.add(box);
    root.add(inner);
    inner.add(sphere);
    assert.deepEqual(childMeshes(root).map((m) => m.name).sort(), ['', 'b']);
    assert.equal(descendants(root).length, 3);
    let disposed = false;
    box.geometry.addEventListener('dispose', () => { disposed = true; });
    disposeObj(root);
    assert.equal(root.parent, null);
    assert.equal(root.userData.disposed, true);
    assert.equal(disposed, true);
    // shared materials survive a shallow dispose
    const mat = new THREE.MeshStandardMaterial();
    box.material = mat;
    let matDisposed = false;
    mat.addEventListener('dispose', () => { matDisposed = true; });
    disposeObj(box);
    assert.equal(matDisposed, false);
  });

  it('ghostHitboxMaterial stays cached and writes nothing', () => {
    assert.equal(ghostHitboxMaterial(), ghostHitboxMaterial());
    assert.equal(ghostHitboxMaterial().colorWrite, false);
    assert.equal(ghostHitboxMaterial().depthWrite, false);
  });

  it('instantiateGltf clones animated models per instance', () => {
    const scene = new THREE.Scene();
    setDefaultScene(scene);
    const model = new THREE.Group();
    model.name = 'soldier';
    const body = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1));
    body.name = 'body';
    model.add(body);
    const idle = new THREE.AnimationClip('idle', 1, [
      new THREE.NumberKeyframeTrack('.position[x]', [0, 1], [0, 1]),
    ]);
    const shoot = new THREE.AnimationClip('idle_firing', 0.5, [
      new THREE.NumberKeyframeTrack('.position[x]', [0, 0.5], [0, 0.2]),
    ]);
    const container = { scene: model, animations: [idle, shoot], meshes: [body] };
    const inst = instantiateGltf(container);
    assert.equal(inst.rootNodes.length, 1);
    assert.notEqual(inst.rootNodes[0], model);
    assert.deepEqual(inst.animationGroups.map((g) => g.name), ['idle', 'idle_firing']);
    assert.ok(inst.animationGroups[0] instanceof AnimGroup);
    assert.ok(inst.mixer instanceof THREE.AnimationMixer);
    inst.dispose();
  });

  it('AnimGroup plays, stops, ends once, and disposes safely', () => {
    const root = new THREE.Group();
    const clip = new THREE.AnimationClip('idle_firing', 0.5, [
      new THREE.NumberKeyframeTrack('.position[x]', [0, 0.5], [0, 0.2]),
    ]);
    const mixer = new THREE.AnimationMixer(root);
    const record = { mixer, alive: 1 };
    const group = new AnimGroup(clip, mixer, record);
    assert.equal(group.name, 'idle_firing');
    assert.equal(group.getDuration(), 0.5);

    let ended = 0;
    group.onAnimationGroupEndObservable.addOnce(() => { ended += 1; });
    group.start(false, 1.0);
    assert.equal(group.loopAnimation, false);
    // drive the mixer directly (updateMixers only ticks registered mixers)
    mixer.update(1.0);
    assert.equal(ended, 1);

    group.onAnimationGroupEndObservable.addOnce(() => { ended += 1; });
    group.onAnimationGroupEndObservable.clear();
    group.start(true, 2.0);
    assert.equal(group.loopAnimation, true);
    mixer.update(5.0);
    assert.equal(ended, 1);

    group.stop();
    group.dispose();
    group.dispose();
    assert.equal(record.alive, 0);
  });

  it('updateMixers tolerates an empty registry', () => {
    updateMixers(0.016);
    updateMixers(0);
  });

  it('mixerThrottleStep banks hidden mixers instead of freezing them', () => {
    assert.equal(mixerThrottleStep(true, 7, 2), 1);
    assert.equal(mixerThrottleStep(false, 4, 0), 4);
    assert.equal(mixerThrottleStep(false, 5, 0), 0);
    assert.equal(mixerThrottleStep(false, 6, 2), 4);
  });

  it('updateMixers throttles offscreen instances but still finishes one-shots', () => {
    const camera = new THREE.PerspectiveCamera(45, 1, 0.5, 3000);
    camera.position.set(0, 0, 0);
    camera.lookAt(0, 0, -10);
    camera.updateMatrixWorld();
    const make = (x) => {
      const model = new THREE.Group();
      const body = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1));
      model.add(body);
      const clip = new THREE.AnimationClip('bang', 0.5, [
        // NOTE: scale, not position — a position track would move the root
        // itself and drag the hidden instance back onscreen.
        new THREE.NumberKeyframeTrack('.scale[x]', [0, 0.5], [1, 1.5]),
      ]);
      const inst = instantiateGltf({ scene: model, animations: [clip], meshes: [body] });
      inst.rootNodes[0].position.set(x, 0, -10);
      inst.rootNodes[0].updateMatrixWorld(true);
      return inst;
    };
    const seen = make(0);
    const hidden = make(500);
    seen.animationGroups[0].start(true, 1.0);
    hidden.animationGroups[0].start(true, 1.0);
    for (let i = 0; i < 8; i++) {
      updateMixers(0.05, camera);
    }
    // Onscreen: every tick applied (8 x 0.05). Offscreen: banked ticks only,
    // but total progressed time is identical (2 x 0.2).
    assert.ok(Math.abs(seen.mixer.time - 0.4) < 1e-6, `seen=${seen.mixer.time}`);
    assert.ok(Math.abs(hidden.mixer.time - 0.4) < 1e-6, `hidden=${hidden.mixer.time}`);
    // One-shot still completes while offscreen.
    let ended = 0;
    hidden.animationGroups[0].onAnimationGroupEndObservable.addOnce(() => { ended += 1; });
    hidden.animationGroups[0].start(false, 1.0);
    for (let i = 0; i < 40; i++) {
      updateMixers(0.05, camera);
    }
    assert.equal(ended, 1);
    seen.dispose();
    hidden.dispose();
  });

  it('matchHiddenNodeName covers GLTFLoader dedupe suffixes', () => {
    // exact names (guard_banner cloth, chaos_banner cloth)
    assert.equal(matchHiddenNodeName('guard_banner', 'guard_banner'), true);
    assert.equal(matchHiddenNodeName('chaos_banner', 'chaos_banner'), true);
    // three.js dedupes bone+mesh name clashes: the mesh keeps name_1
    assert.equal(matchHiddenNodeName('guard_banner_rod_1', 'guard_banner_rod'), true);
    assert.equal(matchHiddenNodeName('marine_sergeant_banner_rod_1', 'marine_sergeant_banner_rod'), true);
    assert.equal(matchHiddenNodeName('guard_banner_rod_12', 'guard_banner_rod'), true);
    // case-insensitive, legacy Babylon _inst_ clones still match
    assert.equal(matchHiddenNodeName('Guard_Banner', 'guard_banner'), true);
    assert.equal(matchHiddenNodeName('guard_banner_rod_inst_2', 'guard_banner_rod'), true);
    // no over-matching: other parts stay visible
    assert.equal(matchHiddenNodeName('guard_banner_rod_extra', 'guard_banner_rod'), false);
    assert.equal(matchHiddenNodeName('guard_banner_rod', 'guard_banner'), false);
    assert.equal(matchHiddenNodeName('guardsmen_body', 'guard_banner'), false);
    assert.equal(matchHiddenNodeName('', 'guard_banner'), false);
  });
});
