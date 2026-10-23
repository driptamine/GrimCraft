import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = fs.readFileSync(path.join(root, 'src/game.js'), 'utf8');

// Frame-loop wiring that cannot run headless: pin the structure so the
// perf work stays wired (dynamic resolution, shadow follow, HUD cadence).
describe('frame loop perf wiring', () => {
  it('ticks dynamic resolution and applies ratio changes', () => {
    assert.ok(src.includes('dynRes.tick(getFps())'), 'fps meter drives the ladder');
    assert.ok(src.includes('renderer.setPixelRatio(dynRatio)'), 'ratio applied to the renderer');
  });

  it('follows the shadow frustum to the camera target', () => {
    assert.ok(src.includes('updateShadowFollow()'), 'called every frame');
    assert.ok(src.includes('sun.target.updateMatrixWorld()'), 'moved target takes effect');
    assert.ok(src.includes('Math.max(90, Math.min(150'), 'box sized to the zoom radius');
  });
});
