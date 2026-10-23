import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import * as THREE from 'three';
import { setDefaultScene } from '../src/three-helpers.js';

// Teach node the Vite-isms in the import chain (bare JSON imports,
// import.meta.env) before the dynamic import below runs.
register('./node-esm-hooks.mjs', import.meta.url);
// js/scene.js reads the render canvas once at module top level; stub that
// single call so the real entities.js can load in node (browser unaffected).
globalThis.document = { getElementById: () => null };
const { createBeamEntity } = await import('../src/entities.js');

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

describe('beam entity (squad fire)', () => {
  it('createBeamEntity centers the beam without assigning read-only position', () => {
    const scene = new THREE.Scene();
    setDefaultScene(scene);
    const world = makeStubWorld();
    const targetId = world.createEntity();
    const targetMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1));
    targetMesh.position.set(10, 0, 0);
    world.add(targetId, 'mesh', { root: targetMesh });

    // Pre-fix this threw "Cannot assign to read only property 'position'".
    const beamId = createBeamEntity(world, new THREE.Vector3(0, 0, 0), 'red', 4242, targetId, 1);

    assert.ok(beamId, 'beam entity id returned');
    const beamMesh = world.get(beamId, 'mesh').root;
    assert.ok(beamMesh instanceof THREE.Mesh);
    // midpoint of (0, 1.05, 0) and (10, 1.0, 0)
    const expected = new THREE.Vector3(5, 1.025, 0);
    assert.ok(
      beamMesh.position.distanceTo(expected) < 1e-9,
      `beam centered at midpoint, got ${beamMesh.position.toArray()}`,
    );
    const beam = world.get(beamId, 'beam');
    assert.equal(beam.team, 'red');
    assert.equal(beam.targetId, targetId);
  });

  it('createBeamEntity returns null when the target has no mesh', () => {
    const scene = new THREE.Scene();
    setDefaultScene(scene);
    const world = makeStubWorld();
    assert.equal(createBeamEntity(world, new THREE.Vector3(), 'red', 1, 999, 1), null);
  });
});
