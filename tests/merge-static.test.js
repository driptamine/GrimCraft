import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { mergeStaticContainer } from '../src/merge-static.js';

function box(name, material, x = 0) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
  mesh.name = name;
  mesh.position.x = x;
  return mesh;
}

function containerWith(...objects) {
  const scene = new THREE.Group();
  for (const o of objects) scene.add(o);
  return { scene, animations: [] };
}

const meshCount = (scene) => {
  let n = 0;
  scene.traverse((o) => { if (o.isMesh) n += 1; });
  return n;
};

describe('merge-static', () => {
  it('merges same-material meshes into one, keeps bounds', () => {
    const mat = new THREE.MeshStandardMaterial({ name: 'wall' });
    const c = containerWith(box('a', mat, 0), box('b', mat, 5), box('c', mat, -5));
    const stats = mergeStaticContainer(c, []);
    assert.equal(meshCount(c.scene), 1);
    assert.equal(stats.before, 3);
    assert.equal(stats.after, 1);
    const merged = c.scene.children.find((o) => o.isMesh);
    assert.equal(merged.material, mat);
    merged.geometry.computeBoundingBox();
    const bb = merged.geometry.boundingBox;
    assert.ok(bb.min.x <= -5.5 && bb.max.x >= 5.5);
  });

  it('does not mix materials', () => {
    const m1 = new THREE.MeshStandardMaterial({ name: 'm1' });
    const m2 = new THREE.MeshStandardMaterial({ name: 'm2' });
    const c = containerWith(box('a', m1, 0), box('b', m1, 2), box('c', m2, 4));
    mergeStaticContainer(c, []);
    assert.equal(meshCount(c.scene), 2);
  });

  it('excludes hidden-name subtrees (exact and _inst_)', () => {
    const mat = new THREE.MeshStandardMaterial({ name: 'wall' });
    const parent = new THREE.Group();
    parent.name = 'scaffolding';
    parent.add(box('child', mat, 0));
    const c = containerWith(parent, box('scaffolding_inst_7', mat, 3), box('wall_a', mat, 6), box('wall_b', mat, 9));
    const stats = mergeStaticContainer(c, ['scaffolding']);
    // hidden parent child + _inst_ mesh stay, two walls merge
    assert.equal(meshCount(c.scene), 3);
    assert.equal(stats.excludedHidden, 2);
    assert.equal(stats.after, 3);
  });

  it('excludes animated-node subtrees from clip tracks', () => {
    const mat = new THREE.MeshStandardMaterial({ name: 'wall' });
    const wobble = new THREE.Group();
    wobble.name = 'Turbine';
    wobble.add(box('blade', mat, 0));
    const c = containerWith(wobble, box('wall_a', mat, 6), box('wall_b', mat, 9));
    c.animations = [{ tracks: [{ name: 'Turbine.rotation' }] }];
    const stats = mergeStaticContainer(c, []);
    assert.equal(meshCount(c.scene), 2);
    assert.equal(stats.excludedAnimated, 1);
  });

  it('skips skinned, instanced and morph meshes', () => {
    const mat = new THREE.MeshStandardMaterial({ name: 'wall' });
    const geo = new THREE.BoxGeometry(1, 1, 1);
    const skinned = new THREE.SkinnedMesh(geo, mat);
    skinned.name = 'sk';
    const inst = new THREE.InstancedMesh(geo, mat, 2);
    inst.name = 'im';
    const morphGeo = new THREE.BoxGeometry(1, 1, 1);
    morphGeo.morphAttributes.position = [new THREE.Float32BufferAttribute(new Array(72).fill(0), 3)];
    const morph = new THREE.Mesh(morphGeo, mat);
    morph.name = 'mo';
    const c = containerWith(skinned, inst, morph, box('a', mat, 0), box('b', mat, 2));
    const stats = mergeStaticContainer(c, []);
    assert.equal(meshCount(c.scene), 4);
    assert.equal(stats.skipped, 3);
    assert.equal(stats.before, 5);
    assert.equal(stats.after, 4);
  });

  it('splits multi-material meshes per group into material pools', () => {
    const m1 = new THREE.MeshStandardMaterial({ name: 'm1' });
    const m2 = new THREE.MeshStandardMaterial({ name: 'm2' });
    const twoGroup = new THREE.BoxGeometry(1, 1, 1);
    twoGroup.clearGroups();
    twoGroup.addGroup(0, 18, 0);
    twoGroup.addGroup(18, 18, 1);
    const multi = new THREE.Mesh(twoGroup, [m1, m2]);
    multi.name = 'mm';
    const c = containerWith(multi, box('a', m1, 5), box('b', m2, -5));
    const stats = mergeStaticContainer(c, []);
    assert.equal(meshCount(c.scene), 2);
    assert.equal(stats.before, 4);
    assert.equal(stats.after, 2);
    assert.equal(stats.merged, 2);
    const merged1 = c.scene.children.find((o) => o.isMesh && o.material === m1);
    merged1.geometry.computeBoundingBox();
    // group half (x in [-0.5, 0.5]) plus box at x=5
    assert.ok(merged1.geometry.boundingBox.max.x >= 5.5);
  });

  it('keeps originals when geometries are incompatible', () => {
    const mat = new THREE.MeshStandardMaterial({ name: 'wall' });
    const a = box('a', mat, 0);
    const b = box('b', mat, 2);
    b.geometry.deleteAttribute('uv');
    const c = containerWith(a, b);
    const stats = mergeStaticContainer(c, []);
    assert.equal(meshCount(c.scene), 2);
    assert.equal(stats.failed, 1);
  });

  it('leaves single-mesh groups untouched', () => {
    const mat = new THREE.MeshStandardMaterial({ name: 'wall' });
    const c = containerWith(box('a', mat, 0));
    const before = c.scene.children[0];
    mergeStaticContainer(c, []);
    assert.equal(c.scene.children[0], before);
  });

  it('bakes world transforms of nested parents', () => {
    const mat = new THREE.MeshStandardMaterial({ name: 'wall' });
    const parent = new THREE.Group();
    parent.name = 'part';
    parent.position.set(10, 0, 0);
    parent.add(box('a', mat, 0));
    const c = containerWith(parent, box('b', mat, 0));
    mergeStaticContainer(c, []);
    const merged = c.scene.children.find((o) => o.isMesh);
    merged.geometry.computeBoundingBox();
    const bb = merged.geometry.boundingBox;
    assert.ok(bb.min.x <= -0.5 && bb.max.x >= 10.5);
    assert.deepEqual(merged.position.toArray(), [0, 0, 0]);
  });
});
