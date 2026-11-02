import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

register('./node-esm-hooks.mjs', import.meta.url);
globalThis.window = { addEventListener() {}, removeEventListener() {} };
globalThis.document = { getElementById: () => null };

const THREE = await import('three');
const scene = await import('../src/core/scene.js');
const { World } = await import('../src/core/ecs.js');
const { applyLookDelta, setCameraMode } = await import('../src/render/camera-fps.js');
const { stickToKeys, isTouchDevice } = await import('../src/input/touch-controls.js');

function bootRider() {
  const cam = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  cam.alpha = 0;
  cam.beta = 1;
  scene.__setSceneCameraForTests(new THREE.Scene(), cam);
  const w = new World();
  scene.setWorld(w);
  const qid = w.createEntity(['squad']);
  const sid = w.createEntity(['soldier']);
  w.add(qid, 'squad', {
    position: new THREE.Vector3(0, 0, 0),
    facing: new THREE.Vector3(0, 0, 1),
    speed: 6,
    soldiers: [sid],
    moveOrder: null,
    stopped: true,
    flyOrder: null,
    forcedTarget: 'x',
    forcedSoldierId: 'y',
  });
  w.add(sid, 'soldier', {});
  w.add(sid, 'mesh', { root: { position: new THREE.Vector3(0, 0, 0) } });
  scene.setSelSquads([qid]);
  return cam;
}

describe('touch controls', () => {
  it('maps stick deflection to WASD with a deadzone', () => {
    assert.deepEqual(stickToKeys(0, 0), { KeyW: false, KeyS: false, KeyA: false, KeyD: false });
    assert.deepEqual(stickToKeys(0.1, 0.1), { KeyW: false, KeyS: false, KeyA: false, KeyD: false });
    assert.deepEqual(stickToKeys(0, -1), { KeyW: true, KeyS: false, KeyA: false, KeyD: false });
    assert.deepEqual(stickToKeys(0, 1), { KeyW: false, KeyS: true, KeyA: false, KeyD: false });
    assert.deepEqual(stickToKeys(-1, 0), { KeyW: false, KeyS: false, KeyA: true, KeyD: false });
    assert.deepEqual(stickToKeys(1, 0), { KeyW: false, KeyS: false, KeyA: false, KeyD: true });
    assert.deepEqual(stickToKeys(0.8, -0.8), { KeyW: true, KeyS: false, KeyA: false, KeyD: true });
  });

  it('applies look deltas without pointer lock in shooter mode', () => {
    const cam = bootRider();
    try {
      assert.equal(setCameraMode('fps'), 'fps');
      const yawFrom = cam.alpha;
      const pitchFrom = cam.beta;
      assert.equal(applyLookDelta(100, -50), true);
      assert.ok(Math.abs(cam.alpha - (yawFrom + 0.28)) < 1e-9, `yaw ${cam.alpha}`);
      assert.ok(Math.abs(cam.beta - (pitchFrom + 0.11)) < 1e-9, `pitch ${cam.beta}`);
    } finally {
      setCameraMode('orbit');
      scene.setSelSquads([]);
    }
  });

  it('ignores look deltas outside shooter mode', () => {
    const cam = bootRider();
    try {
      assert.equal(setCameraMode('orbit'), 'orbit');
      assert.equal(applyLookDelta(100, -50), false);
      assert.equal(cam.alpha, 0);
    } finally {
      scene.setSelSquads([]);
    }
  });

  it('reports no touch device under node', () => {
    assert.equal(isTouchDevice(), false);
  });

  it('wires stick, look and fire without touching desktop paths', () => {
    const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
    const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
    const touch = read('src/input/touch-controls.ts');
    assert.ok(touch.includes("touch-stick-base"), 'stick base overlay exists');
    assert.ok(touch.includes("touch-fire-btn"), 'fire button exists');
    assert.ok(touch.includes("keys.KeyW = state.KeyW"), 'stick writes the shared WASD key state');
    assert.ok(touch.includes('applyLookDelta('), 'look drag drives the camera');
    assert.ok(touch.includes('issueFpsShot('), 'fire button shoots through the fps pipeline');
    assert.ok(touch.includes('setInterval') === false, 'no timers; visibility syncs from the frame loop');
    const events = read('src/input/events.ts');
    assert.ok(events.includes("event.pointerType === 'touch' && isShooterMode()"), 'touch taps skip the mouse fire path in shooter mode');
    const game = read('src/core/game.ts');
    assert.ok(game.includes('syncTouchControls();'), 'frame loop syncs touch UI visibility');
  });
});
