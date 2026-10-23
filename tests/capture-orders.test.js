import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readInputSource } from './input-src.mjs';
import { readSystemsSource } from './systems-src.mjs';
import {
  shouldTickCapture,
  decayedCaptureProgress,
  CAPTURE_PROGRESS_RATE,
  CAPTURE_DECAY_DELAY_SEC,
} from '../src/soldier-aim.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readSrc = (p) => fs.readFileSync(path.join(root, p), 'utf8');

// Capture requires an explicit right-click order: proximity alone never ticks,
// and abandoned progress drains to 0 immediately once capping stops.
describe('capture orders', () => {
  it('pins the capture rate and zero decay delay', () => {
    assert.equal(CAPTURE_PROGRESS_RATE, 1 / 20);
    assert.equal(CAPTURE_DECAY_DELAY_SEC, 0);
  });

  it('ticks only with an order for this point plus boots on it', () => {
    const base = { spId: 7, squadInside: true, soldierInside: false };
    assert.equal(shouldTickCapture({ ...base, captureOrderSpId: 7 }), true);
    assert.equal(
      shouldTickCapture({ spId: 7, captureOrderSpId: 7, squadInside: false, soldierInside: true }),
      true,
      'a single soldier (planter) on the point ticks',
    );
    assert.equal(shouldTickCapture({ ...base, captureOrderSpId: null }), false);
    assert.equal(shouldTickCapture({ ...base, captureOrderSpId: 9 }), false);
    assert.equal(
      shouldTickCapture({ spId: 7, captureOrderSpId: 7, squadInside: false, soldierInside: false }),
      false,
      'a bare order with nobody on the point must not cap',
    );
  });

  it('drains abandoned progress toward 0 without crossing sides', () => {
    assert.equal(decayedCaptureProgress(0.5, 1), 0.5 - CAPTURE_PROGRESS_RATE);
    assert.equal(decayedCaptureProgress(-0.5, 1), -0.5 + CAPTURE_PROGRESS_RATE);
    assert.equal(decayedCaptureProgress(0.01, 1), 0);
    assert.equal(decayedCaptureProgress(-0.01, 1), 0);
    assert.equal(decayedCaptureProgress(0, 1), 0);
  });

  it('declares the capture order on the entities without an idle clock', () => {
    const src = readSrc('src/entities.js');
    assert.ok(src.includes('captureOrderSpId: null'), 'squad factory carries the order');
    assert.ok(!src.includes('_captureIdle'), 'no idle clock: decay starts immediately');
  });

  it('gates the tick, engagement and decay in the systems', () => {
    const src = readSystemsSource();
    assert.ok(src.includes('shouldTickCapture({ captureOrderSpId: squadComponent.captureOrderSpId'), 'tick gated on order');
    assert.ok(src.includes('strategicPoint._capTicked = true'), 'tick stamps the point');
    assert.ok(
      src.includes('isCaptureEngaged({ squadInside, soldierInside, orderedHold }) && squadComponent.captureOrderSpId === spId'),
      'engagement (plant anims/flag) matches the tick gate',
    );
    assert.ok(!src.includes('CAPTURE_DECAY_DELAY_SEC'), 'no grace period gates the decay');
    assert.ok(!src.includes('_captureIdle'), 'no idle clock gates the decay');
    assert.ok(src.includes('decayedCaptureProgress(strategicPoint.captureProgress, deltaTime)'), 'idle progress drains');
    assert.ok(src.includes('Math.abs(strategicPoint.captureProgress) < 1'), 'owned points never decay');
  });

  it('sets the order on right-click capture requests', () => {
    const src = readInputSource();
    assert.ok(
      src.includes('squad.captureOrderSpId = hitSpId ?? _spIdAt(destination.x, destination.z) ?? null'),
      'point click or destination-on-point orders a capture, other moves clear it',
    );
  });

  it('clears the order on attack, fly, Q stop and boarding', () => {
    const src = readInputSource();
    const clears = (src.match(/captureOrderSpId = null/g) || []).length;
    assert.ok(clears >= 4, `expected attack/fly/stop/board clears, found ${clears}`);
  });

  it('renders the capture progress bar grey', () => {
    const src = readSrc('src/hud/components/CaptureBars.jsx');
    assert.ok(src.includes("linear-gradient(90deg,#5c5c5c,#9a9a9a)"), 'grey fill');
    assert.ok(!src.includes('#1155ff'), 'no blue fill left');
    assert.ok(!src.includes('#ff2200'), 'no red fill left');
  });
});
