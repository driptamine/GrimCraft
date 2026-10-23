import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readMeshesSource } from './meshes-src.mjs';
import { animSwitchBlocked, computeSoldierYaw, isFleeingMove, resolveIdleAnim, IDLE_TRACKING_HOLD_SEC } from '../src/soldier-aim.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

describe('soldier aim yaw', () => {
  it('snaps to movement direction when running without firing', () => {
    assert.equal(
      computeSoldierYaw({ shooting: false, moving: true, moveAngle: 1.2, aimAngle: -0.5, currentYaw: 0, deltaTime: 0.016 }),
      1.2,
    );
  });

  it('eases toward aim when firing on the move', () => {
    const yaw = computeSoldierYaw({ shooting: true, moving: true, moveAngle: Math.PI / 2, aimAngle: 0, currentYaw: Math.PI / 2, deltaTime: 0.016 });
    assert.ok(yaw < Math.PI / 2 && yaw > 0, `turns from run dir toward aim, got ${yaw}`);
    // Converges near the aim within one 0.4s shoot window.
    let y = Math.PI / 2;
    for (let t = 0; t < 0.4; t += 0.016) {
      y = computeSoldierYaw({ shooting: true, moving: true, moveAngle: Math.PI / 2, aimAngle: 0, currentYaw: y, deltaTime: 0.016 });
    }
    assert.ok(Math.abs(y) < 0.1, `converged to aim, got ${y}`);
  });

  it('eases toward aim when idle (unchanged behavior)', () => {
    const yaw = computeSoldierYaw({ shooting: false, moving: false, moveAngle: 0, aimAngle: 1, currentYaw: 0, deltaTime: 0.016 });
    assert.ok(yaw > 0 && yaw < 1, `eases toward aim, got ${yaw}`);
  });

  it('takes the short way around the circle', () => {
    const yaw = computeSoldierYaw({ shooting: true, moving: true, moveAngle: 0, aimAngle: Math.PI - 0.1, currentYaw: -Math.PI + 0.1, deltaTime: 0.016 });
    assert.ok(yaw < -Math.PI + 0.1, `wraps the short way, got ${yaw}`);
  });

  it('detects running away from the aim direction', () => {
    assert.equal(isFleeingMove(0, 0), false);
    assert.equal(isFleeingMove(0.5, 0), false);
    assert.equal(isFleeingMove(Math.PI / 2, 0), false);
    assert.equal(isFleeingMove(Math.PI / 2 + 0.1, 0), true);
    assert.equal(isFleeingMove(Math.PI, 0), true);
  });

  it('faces movement while fleeing even when firing', () => {
    assert.equal(
      computeSoldierYaw({ shooting: true, moving: true, moveAngle: 1.2, aimAngle: -1.2, currentYaw: 0, deltaTime: 0.016, fleeing: true }),
      1.2,
    );
  });

  it('still aims on the run when advancing (not fleeing)', () => {
    const yaw = computeSoldierYaw({ shooting: true, moving: true, moveAngle: 0.2, aimAngle: 0, currentYaw: 0.2, deltaTime: 0.016, fleeing: false });
    assert.ok(yaw < 0.2 && yaw > -0.1, `turns toward aim, got ${yaw}`);
  });
});

describe('anim shoot lock', () => {
  it('holds an unfinished firing clip against run/idle', () => {
    assert.equal(animSwitchBlocked({ currentAnim: 'shoot', shootDone: false, name: 'run' }), true);
    assert.equal(animSwitchBlocked({ currentAnim: 'shootMove', shootDone: false, name: 'idle' }), true);
  });

  it('releases when the clip ends or nothing changes', () => {
    assert.equal(animSwitchBlocked({ currentAnim: 'shoot', shootDone: true, name: 'run' }), false);
    assert.equal(animSwitchBlocked({ currentAnim: 'shoot', shootDone: false, name: 'shoot' }), false);
    assert.equal(animSwitchBlocked({ currentAnim: 'run', shootDone: false, name: 'idle' }), false);
  });

  it('a new player order cuts instantly', () => {
    assert.equal(animSwitchBlocked({ currentAnim: 'shoot', shootDone: false, name: 'run', force: true }), false);
    assert.equal(animSwitchBlocked({ currentAnim: 'shootMove', shootDone: false, name: 'idle', force: true }), false);
  });
});

describe('idle_tracking after stop', () => {
  it('a stop order enters the tracking pose first, even from run or idle', () => {
    assert.equal(resolveIdleAnim({ hasTracking: true, force: true, currentAnim: 'run', now: 10 }), 'idle_tracking');
    assert.equal(resolveIdleAnim({ hasTracking: true, force: true, currentAnim: 'idle', now: 10 }), 'idle_tracking');
    assert.equal(resolveIdleAnim({ hasTracking: true, force: true, currentAnim: 'shoot', now: 10 }), 'idle_tracking');
  });

  it('holds tracking after a finished clip, then relaxes to idle', () => {
    assert.equal(resolveIdleAnim({ hasTracking: true, shootJustEnded: true, now: 10 }), 'idle_tracking');
    assert.equal(
      resolveIdleAnim({ hasTracking: true, currentAnim: 'idle_tracking', trackingUntil: 12, now: 11 }),
      'idle_tracking',
    );
    assert.equal(
      resolveIdleAnim({ hasTracking: true, currentAnim: 'idle_tracking', trackingUntil: 12, now: 12.5 }),
      'idle',
    );
  });

  it('falls back to plain idle without a tracking clip', () => {
    assert.equal(resolveIdleAnim({ hasTracking: false, force: true, now: 10 }), 'idle');
    assert.equal(resolveIdleAnim({ hasTracking: true, currentAnim: 'run', now: 10 }), 'idle');
  });

  it('the hold window is a positive tunable', () => {
    assert.ok(IDLE_TRACKING_HOLD_SEC > 0);
  });

  it('meshes.js resolves idle through the shared resolver', () => {
    const src = readMeshesSource();
    assert.ok(src.includes('resolvedName = resolveIdleAnim({'), 'idle resolution delegates to resolveIdleAnim');
    assert.ok(src.includes('root._trackingUntil = nowSec + IDLE_TRACKING_HOLD_SEC;'), 'stop edge and clip end arm the hold');
  });
});
