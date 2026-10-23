import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readInputSource } from './input-src.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Hovering a building/structure/airfield draws a green flat 2D footprint
// rectangle around the whole entity mesh root (not the hit child mesh).
describe('building hover outline', () => {
  it('resolves the entity root from hit meta', () => {
    const src = readInputSource();
    const body = src.slice(
      src.indexOf('function _updateBuildingHover'),
      src.indexOf("canvas.addEventListener('pointermove'"),
    );
    assert.ok(body.includes('meta?.buildingEntityId ?? meta?.structureEntityId ?? meta?.airfieldEntityId'), 'same chain as click-select');
    assert.ok(body.includes("world.get(id, 'mesh')"), 'entity mesh looked up');
    assert.ok(body.includes('mc?.root'), 'whole root outlined, not the hit child');
  });

  it('green flat rect is created, refreshed and disposed', () => {
    const src = readInputSource();
    assert.ok(src.includes('new THREE.LineBasicMaterial({ color: 0x00ff00 })'), 'green line');
    assert.ok(src.includes('line.frustumCulled = false;'), 'no frustum pops on rewrite');
    const rect = src.slice(src.indexOf('function _updateFootRect'), src.indexOf('function _clearBuildingOutline'));
    assert.ok(rect.includes('p.setXYZ(4, x0, y, z0);'), 'closed 5-point loop');
    assert.ok(rect.includes('p.needsUpdate = true;'), 'in-place rewrite, no realloc');
    const body = src.slice(src.indexOf('function _updateBuildingHover'));
    assert.ok(body.includes('_updateFootRect(_hoverBuildingOutline, target);'), 're-glued while hovered');
    const clear = src.slice(src.indexOf('function _clearBuildingOutline'), src.indexOf('function _updateBuildingHover'));
    assert.ok(clear.includes('disposeObj(_hoverBuildingOutline);'), 'helper disposed on change');
  });

  it('hover tick drives the outline', () => {
    const src = readInputSource();
    assert.ok(src.includes('_updateBuildingHover(hit);'), 'wired next to point-base hover');
  });
});
