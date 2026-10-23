import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { applySgbRootTransform } from '../src/sgb-mirror.js';

function worldOf(root, x, y, z) {
  root.updateMatrixWorld(true);
  return new THREE.Vector3(x, y, z).applyMatrix4(root.matrixWorld);
}

function close(actual, expected, label) {
  assert.ok(Math.abs(actual - expected) < 1e-9, `${label}: got ${actual}, want ${expected}`);
}

describe('sgb map horizontal mirror', () => {
  it('sets map yaw and mirrored scale', () => {
    const root = new THREE.Group();
    applySgbRootTransform(root, 90, true);
    close(root.rotation.y, Math.PI / 2, 'yaw');
    assert.equal(root.scale.x, 1);
    assert.equal(root.scale.y, 1);
    assert.equal(root.scale.z, -1);
  });

  it('negates world X, keeps world Z and Y', () => {
    const mirrored = new THREE.Group();
    applySgbRootTransform(mirrored, 90, true);
    const plain = new THREE.Group();
    plain.rotation.y = Math.PI / 2;
    const m = worldOf(mirrored, 10, 2, 30);
    const p = worldOf(plain, 10, 2, 30);
    close(m.x, -p.x, 'world x negated');
    close(m.z, p.z, 'world z kept');
    close(m.y, p.y, 'world y kept');
  });

  it('reverses each row, keeps row order (10 9 8 -> 8 9 10)', () => {
    // One screen row = constant world Z = constant local X; order along the
    // row runs along local Z.
    const mirrored = new THREE.Group();
    applySgbRootTransform(mirrored, 90, true);
    const plain = new THREE.Group();
    plain.rotation.y = Math.PI / 2;
    const locals = [-10, 0, 10];
    const px = locals.map((lz) => worldOf(plain, 0, 0, lz).x);
    const mx = locals.map((lz) => worldOf(mirrored, 0, 0, lz).x);
    const pz = locals.map((lz) => worldOf(plain, 0, 0, lz).z);
    const mz = locals.map((lz) => worldOf(mirrored, 0, 0, lz).z);
    for (let i = 0; i < locals.length; i += 1) {
      close(mz[i], pz[i], `row ${i} stays on its world Z`);
      close(mx[i], -px[i], `row ${i} order reverses`);
    }
    // Plain row runs ascending in world X, mirrored runs descending.
    assert.ok(px[0] < px[1] && px[1] < px[2], `plain ascending, got ${px}`);
    assert.ok(mx[0] > mx[1] && mx[1] > mx[2], `mirrored descending, got ${mx}`);
  });

  it('flipH=false leaves the map unmirrored', () => {
    const root = new THREE.Group();
    applySgbRootTransform(root, 90, false);
    assert.equal(root.scale.z, 1);
    const w = worldOf(root, 10, 2, 30);
    close(w.x, 30, 'world x');
    close(w.y, 2, 'world y');
    close(w.z, -10, 'world z');
  });

  it('ignores a missing root', () => {
    assert.doesNotThrow(() => applySgbRootTransform(null, 90, true));
  });
});
