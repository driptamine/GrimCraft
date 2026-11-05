import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { attachPlasmaCloudBlaster, updatePlasmaCloudBlaster, CLOUD_BLASTER_STAGE_LENGTHS } from '../src/fx/plasma-cloud-blaster.js';

describe('growing blue blaster inside plasma cloud volleys', () => {
  it('immediately shows a short translucent blue beam with shared resources', () => {
    const carrier = new THREE.Group();
    const beam = attachPlasmaCloudBlaster(carrier, 10);
    assert.equal(beam.visible, true);
    assert.equal(beam.name, 'plasma_cloud_blaster');
    assert.equal(beam.children.length, 2);
    for (const child of beam.children) {
      assert.equal(child.geometry.type, 'CylinderGeometry');
      assert.equal(child.geometry.userData.shared, true);
      assert.ok(child.material.color.b > child.material.color.r);
      assert.ok(child.material.opacity > 0 && child.material.opacity < 1);
      assert.equal(child.material.transparent, true);
      assert.equal(child.material.depthWrite, false);
      assert.equal(child.userData.pickable, false);
    }
    const other = attachPlasmaCloudBlaster(new THREE.Group(), 20);
    assert.equal(other.children[0].material, beam.children[0].material);
    assert.equal(other.children[0].geometry, beam.children[0].geometry);
    assert.equal(attachPlasmaCloudBlaster(carrier, 10), beam, 'attaches just one beam per volley');
  });

  it('uses three fixed lengths on the thirds of A→B, capped at 60% of soldier height', () => {
    assert.deepEqual(CLOUD_BLASTER_STAGE_LENGTHS, [1.85 * 0.2, 1.85 * 0.4, 1.85 * 0.6]);
    for (const distance of [3, 30, 90]) {
      const carrier = new THREE.Group();
      const beam = attachPlasmaCloudBlaster(carrier, distance);
      for (const progress of [0, 0.1, 0.32, 1 / 3, 0.5, 2 / 3, 0.8, 0.99]) {
        const travelled = progress * distance;
        carrier.position.z = travelled;
        carrier.scale.setScalar(1 + progress * 0.27);
        updatePlasmaCloudBlaster(carrier, travelled);
        carrier.updateMatrixWorld(true);
        const bounds = new THREE.Box3().setFromObject(beam);
        const expected = CLOUD_BLASTER_STAGE_LENGTHS[Math.min(2, Math.floor(progress * 3))];
        assert.equal(beam.visible, true);
        assert.ok(Math.abs(bounds.max.z - bounds.min.z - expected) < 1e-6,
          `fixed length at progress ${progress}, distance ${distance}`);
        assert.ok(Math.abs(bounds.min.z - Math.min(travelled, distance - expected)) < 1e-6,
          'bolt travels toward B instead of stretching from A');
        assert.ok(bounds.max.z <= distance + 1e-6, 'head never overshoots B');
      }
      updatePlasmaCloudBlaster(carrier, distance);
      assert.equal(beam.visible, false);
    }
  });

  it('moves the preview beam without moving its carrier and clamps very close targets', () => {
    const carrier = new THREE.Group();
    const beam = attachPlasmaCloudBlaster(carrier, 10, false);
    carrier.scale.setScalar(1.27);
    updatePlasmaCloudBlaster(carrier, 4);
    carrier.updateMatrixWorld(true);
    const bounds = new THREE.Box3().setFromObject(beam);
    assert.ok(Math.abs(bounds.min.z - 4) < 1e-6);
    assert.ok(Math.abs(bounds.max.z - bounds.min.z - CLOUD_BLASTER_STAGE_LENGTHS[1]) < 1e-6);
    assert.deepEqual(carrier.position, new THREE.Vector3(), 'preview clouds never move');
    const closeBeam = attachPlasmaCloudBlaster(new THREE.Group(), 0.1);
    const closeBounds = new THREE.Box3().setFromObject(closeBeam);
    assert.ok(closeBounds.min.z > -1e-6 && closeBounds.max.z < 0.1 + 1e-6);
    assert.equal(attachPlasmaCloudBlaster(new THREE.Group(), 0), null);
  });
});
