import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { mkTorus } from '../src/three-helpers.js';

// Ground rings (selection discs, team rings, pings) must lie flat in XZ:
// a torus standing in XY would read as sunk into the surface.
describe('ground torus rings', () => {
  it('lays mkTorus flat: y-extent is the tube, x/z-extents are the diameter', () => {
    const ring = mkTorus('test-ring', 1.5, 0.06, 24);
    const box = new THREE.Box3().setFromObject(ring);
    const size = new THREE.Vector3();
    box.getSize(size);
    // Faceted tube (10 radial segments): bbox reaches tube*cos(pi/10).
    assert.ok(size.y <= 0.06 && size.y > 0.05, `tube vertical extent ${size.y}`);
    // Outer width = centerline diameter + one tube radius per side.
    assert.ok(Math.abs(size.x - 1.56) < 0.03, `ring width ${size.x}`);
    assert.ok(Math.abs(size.z - 1.56) < 0.03, `ring depth ${size.z}`);
  });

  it('keeps the tube symmetric about its plane (no baked sink offset)', () => {
    const ring = mkTorus('test-ring-2', 2.2, 0.18, 24);
    const box = new THREE.Box3().setFromObject(ring);
    assert.ok(Math.abs(box.min.y + box.max.y) < 1e-6, `centered ${box.min.y}..${box.max.y}`);
  });
});
