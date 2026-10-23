import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { mergeSkinnedContainer, SOLDIER_SWITCHED_NODES } from '../src/merge-skinned.js';

function skinAttr(geo, joint) {
  const n = geo.getAttribute('position').count;
  const idx = new Uint16Array(n * 4);
  const wgt = new Float32Array(n * 4);
  for (let i = 0; i < n; i += 1) {
    idx[i * 4] = joint;
    wgt[i * 4] = 1;
  }
  geo.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(idx, 4));
  geo.setAttribute('skinWeight', new THREE.Float32BufferAttribute(wgt, 4));
}

function rig() {
  const root = new THREE.Bone();
  root.name = 'root';
  const child = new THREE.Bone();
  child.name = 'child';
  child.position.y = 1;
  root.add(child);
  return { root, skeleton: new THREE.Skeleton([root, child]) };
}

function skinnedBox(name, material, joint = 0, x = 0) {
  const geo = new THREE.BoxGeometry(1, 1, 1);
  geo.translate(x, 0, 0);
  skinAttr(geo, joint);
  const mesh = new THREE.SkinnedMesh(geo, material);
  mesh.name = name;
  return mesh;
}

// Bones live at scene root (shared graph); each mesh binds with its own
// world matrix, like GLTFLoader output.
function containerWith(skeleton, ...meshes) {
  const scene = new THREE.Group();
  scene.add(skeleton.bones[0]);
  for (const m of meshes) scene.add(m);
  scene.updateMatrixWorld(true);
  for (const m of meshes) {
    if (m.isSkinnedMesh) m.bind(skeleton);
  }
  return { scene, animations: [] };
}

const meshCount = (scene) => {
  let n = 0;
  scene.traverse((o) => { if (o.isMesh) n += 1; });
  return n;
};

describe('merge-skinned', () => {
  it('merges same-material skinned meshes, keeps shared skeleton', () => {
    const mat = new THREE.MeshStandardMaterial({ name: 'body' });
    const { skeleton } = rig();
    const c = containerWith(skeleton,
      skinnedBox('a', mat, 0, 0), skinnedBox('b', mat, 0, 5), skinnedBox('c', mat, 1, -5));
    const stats = mergeSkinnedContainer(c, []);
    assert.equal(meshCount(c.scene), 1);
    assert.equal(stats.before, 3);
    assert.equal(stats.after, 1);
    const merged = c.scene.children.find((o) => o.isMesh);
    assert.equal(merged.isSkinnedMesh, true);
    assert.equal(merged.skeleton, skeleton);
    assert.ok(merged.bindMatrix.equals(new THREE.Matrix4()));
    merged.geometry.computeBoundingBox();
    const bb = merged.geometry.boundingBox;
    assert.ok(bb.min.x <= -5.5 && bb.max.x >= 5.5);
    assert.ok(merged.geometry.getAttribute('skinIndex'));
  });

  it('does not mix materials', () => {
    const m1 = new THREE.MeshStandardMaterial({ name: 'm1' });
    const m2 = new THREE.MeshStandardMaterial({ name: 'm2' });
    const { skeleton } = rig();
    const c = containerWith(skeleton, skinnedBox('a', m1), skinnedBox('b', m1, 0, 2), skinnedBox('c', m2));
    mergeSkinnedContainer(c, []);
    assert.equal(meshCount(c.scene), 2);
  });

  it('does not merge across skeletons', () => {
    const mat = new THREE.MeshStandardMaterial({ name: 'body' });
    const r1 = rig();
    const r2 = rig();
    const scene = new THREE.Group();
    scene.add(r1.root);
    scene.add(r2.root);
    const a = skinnedBox('a', mat);
    const b = skinnedBox('b', mat, 0, 2);
    scene.add(a, b);
    scene.updateMatrixWorld(true);
    a.bind(r1.skeleton);
    b.bind(r2.skeleton);
    mergeSkinnedContainer({ scene, animations: [] }, []);
    assert.equal(meshCount(scene), 2);
  });

  it('does not merge across different world matrices', () => {
    const mat = new THREE.MeshStandardMaterial({ name: 'body' });
    const { skeleton } = rig();
    const scene = new THREE.Group();
    scene.add(skeleton.bones[0]);
    const holder = new THREE.Group();
    holder.position.x = 10;
    holder.add(skinnedBox('a', mat));
    scene.add(holder, skinnedBox('b', mat));
    scene.updateMatrixWorld(true);
    scene.traverse((o) => { if (o.isSkinnedMesh) o.bind(skeleton); });
    mergeSkinnedContainer({ scene, animations: [] }, []);
    assert.equal(meshCount(scene), 2);
  });

  it('excludes hidden, switched and animated subtrees', () => {
    assert.ok(SOLDIER_SWITCHED_NODES.includes('guardsmen_lasgun'));
    assert.ok(SOLDIER_SWITCHED_NODES.includes('guard_banner'));
    assert.ok(SOLDIER_SWITCHED_NODES.includes('karskin_plasmagun'));
    const mat = new THREE.MeshStandardMaterial({ name: 'body' });
    const { skeleton } = rig();
    const c = containerWith(skeleton,
      skinnedBox('guardsmen_head02', mat),
      skinnedBox('guardsmen_lasgun', mat, 0, 2),
      skinnedBox('Turbine', mat, 0, 4),
      skinnedBox('body_a', mat, 0, 6),
      skinnedBox('body_b', mat, 0, 8));
    c.animations = [{ tracks: [{ name: 'Turbine.rotation' }] }];
    const stats = mergeSkinnedContainer(c, ['guardsmen_head02']);
    assert.equal(meshCount(c.scene), 4);
    assert.equal(stats.excludedHidden, 1);
    assert.equal(stats.excludedSwitched, 1);
    assert.equal(stats.excludedAnimated, 1);
  });

  it('merges rigid meshes in the same container into a plain Mesh', () => {
    const mat = new THREE.MeshStandardMaterial({ name: 'body' });
    const { skeleton } = rig();
    const rigid = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), mat);
    rigid.name = 'plate_a';
    rigid.position.x = 20;
    const rigid2 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), mat);
    rigid2.name = 'plate_b';
    rigid2.position.x = 22;
    const c = containerWith(skeleton, rigid, rigid2, skinnedBox('a', mat));
    const stats = mergeSkinnedContainer(c, []);
    assert.equal(meshCount(c.scene), 2);
    const plain = c.scene.children.find((o) => o.isMesh && !o.isSkinnedMesh);
    assert.ok(plain);
    plain.geometry.computeBoundingBox();
    assert.ok(plain.geometry.boundingBox.max.x >= 22.5);
    assert.equal(stats.after, 2);
  });

  it('skips instanced and morph meshes, keeps originals on failure', () => {
    const mat = new THREE.MeshStandardMaterial({ name: 'body' });
    const { skeleton } = rig();
    const geo = new THREE.BoxGeometry(1, 1, 1);
    skinAttr(geo, 0);
    const inst = new THREE.InstancedMesh(geo, mat, 2);
    inst.name = 'im';
    const morphGeo = new THREE.BoxGeometry(1, 1, 1);
    skinAttr(morphGeo, 0);
    morphGeo.morphAttributes.position = [new THREE.Float32BufferAttribute(new Array(72).fill(0), 3)];
    const morph = new THREE.SkinnedMesh(morphGeo, mat);
    morph.name = 'mo';
    const broken = skinnedBox('broken', mat);
    broken.geometry.deleteAttribute('normal');
    const c = containerWith(skeleton, inst, morph, broken, skinnedBox('a', mat, 0, 3));
    const stats = mergeSkinnedContainer(c, []);
    assert.equal(meshCount(c.scene), 4);
    assert.equal(stats.skipped, 2);
    assert.equal(stats.failed, 1);
  });
});
