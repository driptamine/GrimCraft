import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readInputSource } from './input-src.mjs';
import * as THREE from 'three';
import { screenToNDC, intersectGroundPlane, clampGhostPos } from '../src/ghost-place.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function orthoTopCamera() {
  const cam = new THREE.OrthographicCamera(-50, 50, 50, -50, 0.1, 200);
  cam.position.set(0, 100, 10);
  cam.lookAt(0, 0, 0); // slight tilt: avoids the degenerate up vector of straight-down
  cam.updateMatrixWorld();
  return cam;
}

describe('ghost placement math', () => {
  it('maps screen corners and center to NDC', () => {
    const rect = { left: 10, top: 20, width: 800, height: 600 };
    const out = new THREE.Vector2();
    screenToNDC(10, 20, rect, out);
    assert.deepEqual([out.x, out.y], [-1, 1]);
    screenToNDC(810, 620, rect, out);
    assert.deepEqual([out.x, out.y], [1, -1]);
    screenToNDC(410, 320, rect, out);
    assert.ok(Math.abs(out.x) < 1e-12 && Math.abs(out.y) < 1e-12);
  });

  it('hits the y=0 plane under a top-down camera', () => {
    const cam = orthoTopCamera();
    const out = new THREE.Vector3();
    const hit = intersectGroundPlane(new THREE.Vector2(0, 0), cam, out);
    assert.ok(hit, 'center ray hits the plane');
    assert.ok(Math.abs(out.x) < 1e-9 && Math.abs(out.y) < 1e-9 && Math.abs(out.z) < 1e-9);
  });

  it('misses when the ray runs parallel to or away from the plane', () => {
    const cam = new THREE.PerspectiveCamera(60, 1, 0.1, 500);
    cam.position.set(0, 10, 0);
    cam.lookAt(0, 11, 0); // looking up: no y=0 hit
    cam.updateMatrixWorld();
    assert.equal(intersectGroundPlane(new THREE.Vector2(0, 0), cam, new THREE.Vector3()), null);
  });

  it('clamps into the playable square with a 4-unit margin by default', () => {
    const out = { x: 0, z: 0 };
    clampGhostPos(3, -2, 60, out);
    assert.deepEqual(out, { x: 3, z: -2 });
    clampGhostPos(999, -999, 60, out);
    assert.deepEqual(out, { x: 56, z: -56 });
  });
});

// The ghost path must stay cheap: no full-scene raycast per mousemove,
// no shadow-map work for the translucent ghost, no per-frame traversal.
describe('ghost placement wiring', () => {
  const src = readInputSource();
  const moveBody = src.slice(src.indexOf('export function _moveBuildGhost'), src.indexOf('export function startBuild'));
  const startBody = src.slice(src.indexOf('export function _startBuildGhost'), src.indexOf('export function _moveBuildGhost'));

  it('moves the ghost via the O(1) math plane, not a scene raycast', () => {
    assert.ok(!moveBody.includes('raycastGround('), 'no full-scene raycast in _moveBuildGhost');
    assert.ok(moveBody.includes('intersectGroundPlane('), 'math-plane hit instead');
  });

  it('defers mousemove placement to once per frame', () => {
    assert.ok(!src.includes('_moveBuildGhost(event.clientX, event.clientY)'), 'no synchronous call from the mouse handler');
    assert.ok(src.includes('_ghostPending = true;'), 'mousemove only stores coords');
    assert.ok(src.includes('_moveBuildGhost(_ghostPendingX, _ghostPendingY);'), 'observer applies them per frame');
  });

  it('keeps the ghost out of the shadow map', () => {
    assert.ok(startBody.includes('mesh.castShadow = false;'), 'no shadow casting');
    assert.ok(startBody.includes('mesh.receiveShadow = false;'), 'no shadow receiving');
  });

  it('pulses opacity over a cached mesh list', () => {
    assert.ok(startBody.includes('_buildGhostMeshes.push(mesh)'), 'list cached once at creation');
    assert.ok(src.includes('_buildGhostMeshes[i].material.opacity = alpha;'), 'per-frame loop touches opacity only');
  });
});
