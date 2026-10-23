import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  radToDeg,
  degToRad,
  normAlphaDeg,
  clampBetaRad,
  clampRadius,
  clampTargetXZ,
  clampTargetY,
} from '../src/camera-params.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function approx(actual, expected, eps = 1e-9) {
  assert.ok(Math.abs(actual - expected) < eps, `expected ${actual} ≈ ${expected}`);
}

describe('camera-params helpers', () => {
  it('converts radians to degrees and back', () => {
    approx(radToDeg(0.9), 51.5662, 1e-4);
    approx(degToRad(radToDeg(0.9)), 0.9);
    approx(degToRad(270), (3 * Math.PI) / 2);
  });

  it('normalizes yaw to [0, 360)', () => {
    approx(normAlphaDeg(-Math.PI / 2), 270);
    approx(normAlphaDeg((3 * Math.PI) / 2), 270);
    approx(normAlphaDeg(Math.PI), 180);
    approx(normAlphaDeg(0), 0);
    approx(normAlphaDeg(7 * Math.PI), 180);
  });

  it('clamps beta to the live pitch limits', () => {
    const cam = { lowerBetaLimit: 0.15, upperBetaLimit: 1.38 };
    assert.equal(clampBetaRad(0.01, cam), 0.15);
    assert.equal(clampBetaRad(2, cam), 1.38);
    assert.equal(clampBetaRad(0.9, cam), 0.9);
    assert.equal(clampBetaRad(-5, null), 0.15);
  });

  it('clamps radius to the live zoom limits', () => {
    const cam = { lowerRadiusLimit: 6, upperRadiusLimit: 800 };
    assert.equal(clampRadius(1, cam), 6);
    assert.equal(clampRadius(5000, cam), 800);
    assert.equal(clampRadius(62, cam), 62);
    assert.equal(clampRadius(1, null), 6);
  });

  it('clamps target X/Z to pan bounds and Y to relief span', () => {
    assert.equal(clampTargetXZ(200, 128), 128);
    assert.equal(clampTargetXZ(-200, 128), -128);
    assert.equal(clampTargetXZ(30, 128), 30);
    assert.equal(clampTargetY(100), 60);
    assert.equal(clampTargetY(-100), -10);
    assert.equal(clampTargetY(12.5), 12.5);
  });
});

describe('camera panel wiring', () => {
  it('index.html owns the CAMERA button, panel, sliders and readout', () => {
    const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
    assert.ok(html.includes('id="camera-panel-btn"'), 'toggle button exists');
    assert.ok(html.includes('onclick="toggleCameraPanel()"'), 'button toggles panel');
    assert.ok(html.includes('<div id="camera-panel">'), 'panel exists');
    assert.ok(html.includes('id="camera-readout"'), 'POS/TGT readout exists');
    for (const id of ['alpha', 'beta', 'radius', 'tx', 'ty', 'tz']) {
      assert.ok(html.includes(`id="camera-${id}"`), `slider camera-${id} exists`);
      assert.ok(
        html.includes(`updateCameraParam('${id}'`),
        `slider camera-${id} writes live`,
      );
    }
    assert.ok(html.includes('onclick="resetCameraPanel()"'), 'reset button exists');
    assert.ok(html.includes('id="camera-fps-btn"'), 'fps toggle exists');
    assert.ok(html.includes('onclick="toggleCameraFps()"'), 'fps toggle flips mode');
    assert.ok(html.includes('<div id="fps-crosshair"></div>'), 'fps crosshair exists');
    assert.ok(html.includes('<div id="fps-hitmarker"></div>'), 'fps hitmarker exists');
    assert.ok(html.includes('id="gunPoseTip"'), 'gun pose readout exists');
    assert.ok(html.includes('id="gunPosePanel"'), 'gun pose sliders exist');
    for (const id of ['gunPosX', 'gunPosY', 'gunPosZ', 'gunRotX', 'gunRotY', 'gunRotZ', 'gunScale']) {
      assert.ok(html.includes(`id="${id}"`), `slider ${id} exists`);
    }
    const events = fs.readFileSync(path.join(root, 'src/input/events.js'), 'utf8');
    assert.ok(events.includes("event.code === 'KeyP'"), 'P toggles gun posing');
    assert.ok(events.includes('toggleGunEditMode()'), 'P wired to gun edit');
    assert.ok(events.includes('copyGunPose()'), 'C copies the gun pose');
    assert.ok(events.includes('initGunPosePanel()'), 'sliders wired at boot');
    assert.ok(html.includes('#fps-crosshair {'), 'fps crosshair styled');
    assert.ok(html.includes('#fps-hitmarker::before'), 'fps hitmarker styled');
    assert.ok(html.includes('transparent 9px 19px'), 'hitmarker keeps a clear center gap');
    assert.ok(html.includes('pointer-events:none'), 'fps crosshair never blocks clicks');
    const fps = fs.readFileSync(path.join(root, 'src/camera-fps.js'), 'utf8');
    assert.ok(fps.includes("getElementById('fps-crosshair')"), 'fps mode owns crosshair visibility');
    assert.ok(fps.includes("cross.style.display = riding ? 'block' : 'none'"), 'crosshair shows only while riding');
  });

  it('game.js binds the camera panel globals', () => {
    const game = fs.readFileSync(path.join(root, 'src/game.js'), 'utf8');
    assert.ok(game.includes('window.toggleCameraPanel'), 'toggle bound');
    assert.ok(game.includes('window.updateCameraParam'), 'param writer bound');
    assert.ok(game.includes('window.resetCameraPanel'), 'reset bound');
    assert.ok(game.includes("import('./camera-panel.js')"), 'lazy import used');
    assert.ok(game.includes('window.toggleCameraFps'), 'fps toggle bound');
    assert.ok(game.includes('toggleCameraFps } from'), 'fps toggle shared with hotkey');
  });

  it('TAB toggles the camera and LMB free-fires a beam in fps', () => {
    const events = fs.readFileSync(path.join(root, 'src/input/events.js'), 'utf8');
    assert.ok(events.includes("event.code === 'Tab'"), 'TAB hotkey handled');
    assert.ok(events.includes('toggleCameraFps()'), 'TAB flips the camera');
    const orders = fs.readFileSync(path.join(root, 'src/input/orders.js'), 'utf8');
    assert.ok(orders.includes('pickFpsTargetMesh(sx, sy, target.squadId)'), 'fps shot skips the ridden squad');
    assert.ok(orders.includes('createBeamEntity(world, from, target.squad.team'), 'enemy clicks fire a damaging beam');
    assert.ok(orders.includes('spawnBeamTracer(from, point)'), 'anywhere else fires a free tracer');
    const shotFn = orders.slice(orders.indexOf('export function issueFpsShot'), orders.indexOf('export function issueGroundOrder'));
    assert.ok(!shotFn.includes('forcedTarget'), 'fps shots never issue attack orders');
    assert.ok(!shotFn.includes('moveOrder'), 'fps shots never touch movement');
    assert.ok(shotFn.includes('getViewmodelMuzzleWorldPos()'), 'beam starts at the viewmodel muzzle');
    assert.ok(shotFn.includes('flashHitmarker()'), 'enemy hits flash the hitmarker X');
    assert.ok(shotFn.includes('playHitCrunch()'), 'enemy hits crunch');
    assert.ok(shotFn.includes('order.targetSoldierId, 1, true)'), 'muzzle height survives into the beam');
  });

  it('camera-panel.js drives the orbit rig, not a copy', () => {
    const panel = fs.readFileSync(path.join(root, 'src/camera-panel.js'), 'utf8');
    assert.ok(panel.includes("from './scene.js'"), 'imports live camera binding');
    assert.ok(panel.includes('camera.alpha ='), 'writes yaw');
    assert.ok(panel.includes('camera.beta ='), 'writes pitch');
    assert.ok(panel.includes('camera.radius ='), 'writes radius');
    assert.ok(panel.includes('camera.target'), 'writes target XYZ');
    assert.ok(panel.includes('addCameraChangeObserver'), 'syncs back on external moves');
  });
});
