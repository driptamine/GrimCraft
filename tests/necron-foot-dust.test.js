import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { NecronFootDust } from '../src/fx/necron-foot-dust.js';

const tick = (dust, root, scene, frames, speed = 0) => {
    for (let frame = 0; frame < frames; frame++) {
        root.position.x += speed / 60;
        dust.update(1 / 60, [root], scene);
    }
};

test('walking makes low ground dust, standing produces none, and the last footfall fades', () => {
    const scene = new THREE.Scene(), root = new THREE.Group();
    scene.add(root);root.position.y = 2;
    const dust = new NecronFootDust(() => 2);
    tick(dust, root, scene, 90);
    assert.equal(scene.getObjectByName('necron_foot_dust'), undefined);
    tick(dust, root, scene, 60, 3);
    const cloud = scene.getObjectByName('necron_foot_dust');
    assert.ok(cloud?.count > 0);
    assert.equal(cloud.userData.pickable, false);
    const transform = new THREE.Matrix4();cloud.getMatrixAt(0, transform);
    assert.ok(transform.elements[13] > 2 && transform.elements[13] < 2.3, 'dust stays just above the sampled terrain');
    assert.ok([...cloud.geometry.getAttribute('dustOpacity').array].some(opacity => opacity > 0));
    tick(dust, root, scene, 90);
    assert.equal(scene.getObjectByName('necron_foot_dust'), undefined);
});

test('teleports, airborne motion, invisible and removed warriors do not emit foot dust', () => {
    const scene = new THREE.Scene(), root = new THREE.Group();scene.add(root);
    const dust = new NecronFootDust(() => 0);
    dust.update(1 / 60, [root], scene);
    root.position.x = 100;dust.update(1 / 60, [root], scene);
    assert.equal(scene.getObjectByName('necron_foot_dust'), undefined);
    root.position.y = 3;tick(dust, root, scene, 60, 3);
    assert.equal(scene.getObjectByName('necron_foot_dust'), undefined);
    root.position.y = 0;root.visible = false;tick(dust, root, scene, 60, 3);
    assert.equal(scene.getObjectByName('necron_foot_dust'), undefined);
    root.visible = true;root.removeFromParent();tick(dust, root, scene, 60, 3);
    assert.equal(scene.getObjectByName('necron_foot_dust'), undefined);
});

test('dust stays bounded for large armies and resets without leaving a cross-map trail', () => {
    const scene = new THREE.Scene(), roots = Array.from({ length: 200 }, () => new THREE.Group());
    scene.add(...roots);
    const dust = new NecronFootDust(() => 0);
    for (let frame = 0; frame < 60; frame++) {
        roots.forEach(root => root.position.x += .1);
        dust.update(1 / 60, roots, scene);
    }
    assert.ok(scene.getObjectByName('necron_foot_dust').count <= 320);
    const replacement = new THREE.Scene();replacement.add(...roots);
    dust.update(1 / 60, roots, replacement);
    assert.equal(scene.getObjectByName('necron_foot_dust'), undefined);
    assert.equal(replacement.getObjectByName('necron_foot_dust'), undefined);
    tick(dust, roots[0], replacement, 30, 3);
    assert.ok(replacement.getObjectByName('necron_foot_dust').count > 0);
    dust.clear();
    assert.equal(replacement.getObjectByName('necron_foot_dust'), undefined);
});
