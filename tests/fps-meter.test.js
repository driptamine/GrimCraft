import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createFpsMeter, tickFps, getFps } from '../src/hud/store.js';

describe('fps meter', () => {
  it('stays zero until the window elapses, then reports rounded fps', () => {
    const meter = createFpsMeter(500);
    for (let i = 0; i <= 30; i += 1) {
      meter.tick(i * 16);
    }
    assert.equal(meter.fps, 0);
    meter.tick(500);
    assert.equal(meter.fps, 64);
  });

  it('recomputes every window', () => {
    const meter = createFpsMeter(500);
    meter.tick(0);
    meter.tick(500);
    assert.equal(meter.fps, 4);
    meter.tick(1000);
    assert.equal(meter.fps, 2);
  });

  it('singleton used by the game loop starts clean', () => {
    assert.equal(tickFps(100000), 0);
    assert.equal(tickFps(100500), 4);
    assert.equal(getFps(), 4);
  });
});
