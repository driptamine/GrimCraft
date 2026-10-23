import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { captureSlotTarget, CAPTURE_GUARD_DISTANCE, PLANTER_SPEED_MULT, PLANTER_STAND_DISTANCE, PLANTER_PLANT_DISTANCE, PLANTER_PLANT_YAW_OFF, POINT_SOCKET_OFFSET, RELIC_SOCKET_OFFSET, planterSocketXZ, planterPlantYaw, planterStandTarget, shouldHoldForCapture, isCaptureEngaged } from '../src/soldier-aim.js';

describe('capture slots', () => {
  it('guards stand clear of the point model', () => {
    assert.equal(CAPTURE_GUARD_DISTANCE, 10);
  });

  it('planter advances at normal pace, without the catch-up bonus', () => {
    assert.equal(PLANTER_SPEED_MULT, 1.0);
  });

  it('planter stops on the plant ring around the socket', () => {
    const t = captureSlotTarget({
      isPlanter: true, slotX: 10, slotZ: 5, centerX: 100, centerZ: 200, soldierX: 0, soldierZ: 0,
    });
    const s = { x: 100 + POINT_SOCKET_OFFSET.x, z: 200 + POINT_SOCKET_OFFSET.z };
    assert.ok(Math.abs(Math.hypot(t.x - s.x, t.z - s.z) - PLANTER_PLANT_DISTANCE) < 1e-9);
    assert.ok(t.x < 100 && t.z < 200, 'stays on the approach ray');
  });

  it('planter stacked on the socket defaults to a +x plant spot', () => {
    const t = captureSlotTarget({
      isPlanter: true, slotX: 0, slotZ: 0, centerX: 0, centerZ: 0,
      soldierX: POINT_SOCKET_OFFSET.x, soldierZ: POINT_SOCKET_OFFSET.z,
    });
    assert.ok(Math.abs(t.x - (POINT_SOCKET_OFFSET.x + PLANTER_PLANT_DISTANCE)) < 1e-9);
    assert.ok(Math.abs(t.z - POINT_SOCKET_OFFSET.z) < 1e-9);
  });

  it('plant yaw faces the socket minus the rod-side offset', () => {
    const yaw = planterPlantYaw({ soldierX: 0, soldierZ: 0, centerX: 0, centerZ: 10 });
    assert.ok(Math.abs(yaw - (Math.atan2(-0.0414, 9.8995) - PLANTER_PLANT_YAW_OFF)) < 1e-9);
    const yawW = planterPlantYaw({ soldierX: 10, soldierZ: 0, centerX: 0, centerZ: 0, kind: 'relic' });
    assert.ok(Math.abs(yawW - (Math.atan2(-10.0297, -0.1216) - PLANTER_PLANT_YAW_OFF)) < 1e-9);
  });

  it('socket offsets are measured per kind with a point default', () => {
    assert.deepEqual(planterSocketXZ({ centerX: 100, centerZ: 200, kind: 'point' }), { x: 100 - 0.0414, z: 200 - 0.1005 });
    assert.deepEqual(planterSocketXZ({ centerX: 100, centerZ: 200, kind: 'relic' }), { x: 100 - 0.0297, z: 200 - 0.1216 });
    assert.deepEqual(planterSocketXZ({ centerX: 100, centerZ: 200 }), { x: 100 - 0.0414, z: 200 - 0.1005 });
    assert.deepEqual([POINT_SOCKET_OFFSET.x, RELIC_SOCKET_OFFSET.x], [-0.0414, -0.0297]);
  });

  it('planted planter backs toward his squad but stays on the point', () => {
    assert.ok(PLANTER_STAND_DISTANCE < 4.5);
    const t = planterStandTarget({ centerX: 0, centerZ: 0, squadX: 30, squadZ: 0 });
    assert.deepEqual(t, { x: PLANTER_STAND_DISTANCE, z: 0 });
    const diag = planterStandTarget({ centerX: 10, centerZ: 10, squadX: 20, squadZ: 20 });
    assert.ok(Math.abs(Math.hypot(diag.x - 10, diag.z - 10) - PLANTER_STAND_DISTANCE) < 1e-9);
    assert.ok(diag.x > 10 && diag.z > 10);
    const custom = planterStandTarget({ centerX: 0, centerZ: 0, squadX: 0, squadZ: -5, standDistance: 2 });
    assert.deepEqual(custom, { x: 0, z: -2 });
  });

  it('planter stand-off falls back to +x when the squad is centered', () => {
    const t = planterStandTarget({ centerX: 5, centerZ: 5, squadX: 5, squadZ: 5 });
    assert.deepEqual(t, { x: 5 + PLANTER_STAND_DISTANCE, z: 5 });
  });

  it('distant guards keep their formation slot', () => {
    const t = captureSlotTarget({
      isPlanter: false, slotX: 10, slotZ: 0, centerX: 0, centerZ: 0, soldierX: 9, soldierZ: 0,
    });
    assert.deepEqual(t, { x: 10, z: 0 });
  });

  it('close guards are pushed radially out to the guard ring', () => {
    const t = captureSlotTarget({
      isPlanter: false, slotX: 1, slotZ: 1, centerX: 0, centerZ: 0, soldierX: 5, soldierZ: 5,
    });
    assert.ok(Math.abs(Math.hypot(t.x, t.z) - CAPTURE_GUARD_DISTANCE) < 1e-9);
    assert.ok(t.x > 0 && t.z > 0);
  });

  it('slot exactly at center falls back to the soldier offset', () => {
    const t = captureSlotTarget({
      isPlanter: false, slotX: 0, slotZ: 0, centerX: 0, centerZ: 0, soldierX: -4, soldierZ: 0,
    });
    assert.deepEqual([t.x, t.z], [-CAPTURE_GUARD_DISTANCE, 0]);
  });

  it('soldier stacked on the center defaults to +x', () => {
    const t = captureSlotTarget({
      isPlanter: false, slotX: 0, slotZ: 0, centerX: 0, centerZ: 0, soldierX: 0, soldierZ: 0,
    });
    assert.deepEqual([t.x, t.z], [CAPTURE_GUARD_DISTANCE, 0]);
  });

  it('halts squads ordered onto a point at guard distance', () => {
    const base = { orderX: 0, orderZ: 0, spX: 0, spZ: 0, captureRadius: 4.5 };
    assert.equal(shouldHoldForCapture({ ...base, squadX: 10, squadZ: 0 }), true);
    assert.equal(shouldHoldForCapture({ ...base, squadX: 6, squadZ: 0, guardDistance: 5 }), false);
    assert.equal(shouldHoldForCapture({ ...base, squadX: 12, squadZ: 0 }), false);
    assert.equal(shouldHoldForCapture({ ...base, squadX: 6, squadZ: 0, orderX: 20, orderZ: 0 }), false);
    assert.equal(shouldHoldForCapture({ ...base, squadX: 6, squadZ: 0, orderX: 4.5, orderZ: 0 }), false);
  });

  it('engages on boots or a held order, never on a bare far order', () => {
    assert.equal(isCaptureEngaged({ squadInside: true, soldierInside: false, orderedHold: false }), true);
    assert.equal(isCaptureEngaged({ squadInside: false, soldierInside: true, orderedHold: false }), true);
    assert.equal(isCaptureEngaged({ squadInside: false, soldierInside: false, orderedHold: true }), true);
    assert.equal(isCaptureEngaged({ squadInside: false, soldierInside: false, orderedHold: false }), false);
  });
});
