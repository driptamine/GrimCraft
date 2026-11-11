import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';
import { updateSunShadowCamera } from '../src/render/lighting.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = fs.readFileSync(path.join(root, 'src/core/game.ts'), 'utf8');

// Frame-loop wiring that cannot run headless: pin the structure so the
// perf work stays wired (dynamic resolution, shadow follow, HUD cadence).
describe('frame loop perf wiring', () => {
  it('ticks dynamic resolution and applies ratio changes', () => {
    assert.ok(src.includes('dynRes.tick(getFps())'), 'fps meter drives the ladder');
    assert.ok(src.includes('renderer.setPixelRatio(dynRatio)'), 'ratio applied to the renderer');
  });

  it('follows the shadow frustum to the camera target', () => {
    assert.ok(src.includes('updateShadowFollow()'), 'called every frame');
    assert.ok(src.includes('updateSunShadowCamera(sun, camera.target, camera.radius)'), 'frame loop delegates the current target and zoom');
    const sun = new THREE.DirectionalLight(), target = new THREE.Vector3(100, 12, -40);
    updateSunShadowCamera(sun, target, 30);
    assert.ok(sun.target.getWorldPosition(new THREE.Vector3()).equals(target), 'moved target takes effect');
    const closeBox = sun.shadow.camera.right;
    updateSunShadowCamera(sun, target, 100);
    assert.ok(sun.shadow.camera.right > closeBox, 'shadow coverage follows the zoom radius');
  });
});
