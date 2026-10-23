import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { spPingFrame } from '../src/three-helpers.js';

describe('sp ping frame', () => {
  it('starts small and opaque', () => {
    assert.deepEqual(spPingFrame(0, 0.9, 8), { scale: 0.5, opacity: 1 });
  });

  it('ends at full radius and fully faded', () => {
    assert.deepEqual(spPingFrame(0.9, 0.9, 8), { scale: 8, opacity: 0 });
  });

  it('fades mostly near the end while growing linearly', () => {
    const mid = spPingFrame(0.45, 0.9, 8);
    assert.equal(mid.scale, 4.25);
    assert.equal(mid.opacity, 0.75);
    const late = spPingFrame(0.81, 0.9, 8);
    assert.ok(Math.abs(late.opacity - 0.19) < 1e-9);
  });

  it('clamps outside the duration', () => {
    assert.deepEqual(spPingFrame(-1, 0.9, 8), { scale: 0.5, opacity: 1 });
    assert.deepEqual(spPingFrame(99, 0.9, 8), { scale: 8, opacity: 0 });
  });
});
