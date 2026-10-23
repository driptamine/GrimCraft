import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { applyZoom, MIN_ZOOM_RADIUS, MAX_ZOOM_RADIUS, DEFAULT_CAMERA_RADIUS, DEFAULT_CAMERA_ALPHA, DEFAULT_CAMERA_BETA } from '../src/camera-zoom.js';

describe('camera zoom', () => {
  it('exposes the widened default range', () => {
    assert.equal(MIN_ZOOM_RADIUS, 6);
    assert.equal(MAX_ZOOM_RADIUS, 800);
  });

  it('pins the default radius used by init and backspace reset', () => {
    assert.equal(DEFAULT_CAMERA_RADIUS, 55);
  });

  it('pins the backspace reset orientation at alpha 315deg beta 50deg', () => {
    assert.equal(DEFAULT_CAMERA_ALPHA, (315 * Math.PI) / 180);
    assert.equal(DEFAULT_CAMERA_BETA, (50 * Math.PI) / 180);
  });

  it('zooms in on positive deltaY and out on negative', () => {
    assert.ok(applyZoom(62, 100) < 62);
    assert.ok(applyZoom(62, -100) > 62);
  });

  it('clamps to the active radius limits', () => {
    assert.equal(applyZoom(62, 100000), MIN_ZOOM_RADIUS);
    assert.equal(applyZoom(62, -100000), MAX_ZOOM_RADIUS);
  });

  it('respects per-map limit overrides', () => {
    assert.equal(applyZoom(500, 100000, 10, 500), 10);
    assert.equal(applyZoom(20, -100000, 10, 500), 500);
  });
});
