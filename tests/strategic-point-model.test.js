import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import { readFileSync } from 'node:fs';
import * as THREE from 'three';
import { setDefaultScene } from '../src/three-helpers.js';
import { CAPTURE_GUARD_DISTANCE } from '../src/soldier-aim.js';

register('./node-esm-hooks.mjs', import.meta.url);
globalThis.document = { getElementById: () => null };
const { STRATEGIC_POINT_HIDDEN_NODES, makeStrategicPointMesh, patchStrategicPointGroundPlane, patchStrategicPointCenterpost } = await import('../src/meshes.js');
const { createStrategicPointEntity } = await import('../src/entities.js');

function makeStubWorld() {
  const comps = new Map();
  let nextId = 1;
  return {
    createEntity() {
      return nextId++;
    },
    add(id, type, data) {
      if (!comps.has(id)) comps.set(id, new Map());
      comps.get(id).set(type, data);
    },
    get(id, type) {
      return comps.get(id)?.get(type);
    },
    has(id, type) {
      return comps.get(id)?.has(type) ?? false;
    },
  };
}

function glbMeshNodeNames(url) {
  const buf = readFileSync(url);
  const jsonLen = buf.readUInt32LE(12);
  const json = JSON.parse(buf.subarray(20, 20 + jsonLen).toString('utf8'));
  return [...new Set(json.nodes.filter((n) => 'mesh' in n).map((n) => n.name))];
}

// Mirrors the hidden-node predicate in _instantiateFromContainer
// (src/model-upload.js): exact match or plain prefix.
const covered = (node) => STRATEGIC_POINT_HIDDEN_NODES.some((wanted) => {
  const child = String(node).toLowerCase();
  const want = String(wanted).toLowerCase();
  return child === want || child.startsWith(want);
});

describe('strategic point model', () => {
  it('hides every banner/flag/rod/pole mesh in the point and relic glbs', () => {
    for (const file of ['strategic_point.glb', 'relic.glb']) {
      const names = glbMeshNodeNames(new URL(`../models/points/${file}`, import.meta.url));
      assert.ok(names.length > 20, `${file}: parsed mesh nodes (saw ${names.length})`);
      const flagged = names.filter((n) => /banner|flag|rod|pole/i.test(n));
      assert.ok(flagged.length > 0, `${file} has faction dressing nodes`);
      for (const name of flagged) {
        assert.ok(covered(name), `${file}: ${name} is hidden`);
      }
    }
    const names = glbMeshNodeNames(new URL('../models/points/strategic_point.glb', import.meta.url));
    for (const name of ['base', 'console', 'console_arm', 'doora', 'doorb', 'stratetgic_point_centerpost']) {
      assert.ok(names.includes(name), `${name} exists in the glb`);
      assert.ok(!covered(name), `${name} stays visible`);
    }
    assert.ok(names.includes('ground_plane'), 'ground_plane exists in the glb');
    assert.ok(!covered('ground_plane'), 'blob-shadow quad stays visible (black look kept)');
    assert.ok(!covered('ground_plane_1'), 'visible with the clone dedupe suffix too');
  });

  it('ground_plane blends under doora/doorb instead of blacking them out', () => {
    const shared = new THREE.MeshStandardMaterial({ color: 0x111111, transparent: true });
    shared.depthWrite = true;
    const group = new THREE.Group();
    const quad = new THREE.Mesh(new THREE.BufferGeometry(), shared);
    quad.name = 'ground_plane';
    const door = new THREE.Mesh(new THREE.BufferGeometry(), shared);
    door.name = 'doora';
    group.add(quad, door);
    const patched = patchStrategicPointGroundPlane(group);
    assert.equal(patched, 1);
    // Visible, own material clone, no depth writes: draws first, doors blend over it.
    assert.equal(quad.visible, true);
    assert.notEqual(quad.material, shared);
    assert.equal(quad.material.depthWrite, false);
    assert.equal(quad.material.depthTest, true);
    assert.ok(quad.renderOrder < door.renderOrder);
    // Look preserved: same map/color/transparent blending as the shared material.
    assert.equal(quad.material.map, shared.map);
    assert.equal(quad.material.transparent, shared.transparent);
    assert.ok(quad.material.color.equals(shared.color));
    // Siblings sharing the material are untouched.
    assert.equal(door.material, shared);
    assert.equal(shared.depthWrite, true);
  });

  it('centerpost renders opaque, not ghostly transparent', () => {
    const shared = new THREE.MeshStandardMaterial({ color: 0x888888, transparent: true });
    shared.depthWrite = false;
    const group = new THREE.Group();
    const post = new THREE.Mesh(new THREE.BufferGeometry(), shared);
    post.name = 'stratetgic_point_centerpost';
    const door = new THREE.Mesh(new THREE.BufferGeometry(), shared);
    door.name = 'doora';
    group.add(post, door);
    const patched = patchStrategicPointCenterpost(group);
    assert.equal(patched, 1);
    // Own opaque clone: solid metal post in the opaque pass with depth writes.
    assert.notEqual(post.material, shared);
    assert.equal(post.material.transparent, false);
    assert.equal(post.material.opacity, 1);
    assert.equal(post.material.depthWrite, true);
    assert.equal(post.material.depthTest, true);
    // Look preserved: same map/color as the shared material.
    assert.equal(post.material.map, shared.map);
    assert.ok(post.material.color.equals(shared.color));
    // Siblings sharing the material are untouched.
    assert.equal(door.material, shared);
    assert.equal(shared.transparent, true);
    assert.equal(shared.depthWrite, false);
  });

  it('centerpost patch matches clone-suffixed names and no-ops cleanly', () => {
    const mat = new THREE.MeshStandardMaterial({ transparent: true });
    const group = new THREE.Group();
    const post = new THREE.Mesh(new THREE.BufferGeometry(), mat);
    post.name = 'stratetgic_point_centerpost_1';
    group.add(post);
    assert.equal(patchStrategicPointCenterpost(group), 1);
    assert.equal(post.material.transparent, false);
    assert.equal(patchStrategicPointCenterpost(new THREE.Group()), 0);
    assert.equal(patchStrategicPointCenterpost(null), 0);
  });

  it('ground_plane patch matches clone-suffixed names and no-ops cleanly', () => {
    const mat = new THREE.MeshStandardMaterial();
    const group = new THREE.Group();
    const quad = new THREE.Mesh(new THREE.BufferGeometry(), mat);
    quad.name = 'ground_plane_inst_3';
    group.add(quad);
    assert.equal(patchStrategicPointGroundPlane(group), 1);
    assert.equal(quad.visible, true);
    assert.equal(patchStrategicPointGroundPlane(new THREE.Group()), 0);
    assert.equal(patchStrategicPointGroundPlane(null), 0);
  });

  it('falls back to the procedural point without a loaded container', () => {
    const viz = makeStrategicPointMesh(10, 20);
    assert.ok(viz.group);
    assert.equal(viz.gem, null);
    assert.equal(viz.gemMat, null);
    assert.equal(viz.capRing, null);
    assert.equal(viz.capRingMat, null);
    assert.equal(viz.pillar, null);
    assert.equal(viz.group.position.x, 10);
    assert.equal(viz.group.position.z, 20);
  });

  it('covers the model with its capture radius, inside the guard ring', () => {
    setDefaultScene(new THREE.Scene());
    const world = makeStubWorld();
    const id = createStrategicPointEntity(world, 5, 6, 'point');
    const radius = world.get(id, 'strategicPoint').captureRadius;
    assert.equal(radius, 4.5);
    assert.ok(CAPTURE_GUARD_DISTANCE > radius);
  });

  it('stamps point meshes as the SP click target', () => {
    setDefaultScene(new THREE.Scene());
    for (const kind of ['point', 'relic']) {
      const world = makeStubWorld();
      const id = createStrategicPointEntity(world, 5, 6, kind);
      const meshes = [];
      world.get(id, 'mesh').root.traverse((child) => {
        if (child.isMesh) meshes.push(child);
      });
      assert.ok(meshes.length > 0, `${kind} has clickable meshes`);
      for (const mesh of meshes) {
        assert.equal(mesh.userData.strategicPointEntityId, id);
        assert.notEqual(mesh.userData.pickable, false);
      }
    }
  });
});
