import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readInputSource } from './input-src.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Navigating the cursor into POINT_HOVER_RADIUS of a strategic point or
// relic root draws a white flat 2D ring around the entity root. Direct ray
// hits on tall point meshes (poles, post, console) outside the circle must
// NOT draw it. The radius is a user-tweakable const: lock its
// existence/usage, never its value.
describe('point base hover ring', () => {
  it('ring triggers on ground proximity, not mesh hits', () => {
    const src = readInputSource();
    const body = src.slice(
      src.indexOf('function _updatePointBaseHover'),
      src.indexOf("canvas.addEventListener('pointermove'"),
    );
    assert.ok(body.includes("query('strategicPoint')"), 'scans points and relics');
    assert.ok(body.includes('withinHoverRadius'), 'flat proximity check');
    assert.ok(body.includes('POINT_HOVER_RADIUS'), 'same radius as the cursor');
    assert.ok(body.includes('_lastGroundPt'), 'reuses the cached ground pick');
    assert.ok(body.includes("world.get(spId, 'mesh')"), 'ring centered on entity root');
    assert.ok(!body.includes("mesh.name === 'base'"), 'no mesh-hit trigger: circle only');
    assert.ok(!body.includes("kind === 'point'"), 'no kind exclusion: relics included');
  });

  it('ring radius is an editable exported const', () => {
    const src = readInputSource();
    assert.match(src, /export const POINT_HOVER_RADIUS = [\d.]+;/);
    assert.match(src, /export const POINT_HOVER_SEGMENTS = \d+;/);
    const ring = src.slice(src.indexOf('function _updateHoverRing'), src.indexOf('function _updatePointBaseHover'));
    assert.ok(ring.includes('POINT_HOVER_RADIUS'), 'radius drives the circle');
    assert.ok(ring.includes('Math.cos(a)'), 'circle loop');
  });

  it('white ring is created, refreshed and disposed', () => {
    const src = readInputSource();
    assert.ok(src.includes('new THREE.LineBasicMaterial({ color: 0xffffff })'), 'white line');
    assert.ok(src.includes('line.frustumCulled = false;'), 'no frustum pops on rewrite');
    const ring = src.slice(src.indexOf('function _updateHoverRing'), src.indexOf('function _updatePointBaseHover'));
    assert.ok(ring.includes('p.needsUpdate = true;'), 'in-place rewrite, no realloc');
    const clear = src.slice(src.indexOf('function _clearPointBaseOutline'), src.indexOf('function _makeHoverRing'));
    assert.ok(clear.includes('disposeObj(_pointBaseOutline);'), 'helper disposed on change');
  });

  it('hover tick drives the ring', () => {
    const src = readInputSource();
    assert.ok(src.includes('_updatePointBaseHover();'), 'wired next to decal hover, no ray hit needed');
  });

  it('capture cursor triggers on entering the hover circle', () => {
    const src = readInputSource();
    const body = src.slice(
      src.indexOf('function _updateHoverCursor'),
      src.indexOf('// Enemy hover highlight'),
    );
    assert.ok(body.includes("query('strategicPoint')"), 'scans points and relics');
    assert.ok(body.includes('withinHoverRadius'), 'flat proximity check');
    assert.ok(body.includes('POINT_HOVER_RADIUS'), 'same radius as the ring');
    assert.ok(body.includes('_lastGroundPt'), 'reuses the cached ground pick');
    assert.ok(body.includes("hover = { kind: 'sp' }"), 'resolves to the capture cursor');
    assert.ok(body.includes('!repairMode'), 'repair targeting keeps its own cursor');
    assert.ok(!body.includes('meta.strategicPointEntityId'), 'no whole-mesh trigger: circle only');
  });

  it('ground pick is cached once per hover tick', () => {
    const src = readInputSource();
    assert.ok(src.includes('const _lastGroundPt = { x: 0, z: 0, valid: false };'), 'preallocated cache');
    const coords = src.slice(
      src.indexOf('function _updateCursorCoords'),
      src.indexOf('let _decalHoverEl'),
    );
    assert.ok(coords.includes('_lastGroundPt.valid = !!pt;'), 'validity follows the pick');
    assert.ok(coords.includes('_lastGroundPt.x = pt.x;'), 'x cached');
  });
});
