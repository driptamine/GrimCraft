import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

describe('decal x/y/z sliders', () => {
  it('sgb-decals exposes position API for selected decal', () => {
    const src = fs.readFileSync(path.join(root, 'src/sgb-decals.js'), 'utf8');
    assert.match(src, /export function getSelectedDecal\(\)/);
    assert.match(src, /export function getSelectedDecalPosition\(\)/);
    assert.match(src, /export function setSelectedDecalPosition\(/);
    // userData carries x/y/z for sliders
    assert.match(src, /userData\.x/);
    assert.match(src, /userData\.y/);
    assert.match(src, /userData\.z/);
  });
  it('decals-panel has X/Y/Z slider controls', () => {
    const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
    assert.match(html, /id="decal-pos-controls"/);
    assert.match(html, /id="decal-pos-x"/);
    assert.match(html, /id="decal-pos-y"/);
    assert.match(html, /id="decal-pos-z"/);
    const panelSrc = fs.readFileSync(path.join(root, 'src/decals-panel.js'), 'utf8');
    assert.match(panelSrc, /syncPosControls/);
    assert.match(panelSrc, /ensureSliders/);
    assert.match(panelSrc, /setSelectedDecalPosition/);
  });
  it('slider ranges cover world extent and height', () => {
    const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
    // X/Z should span world_half_extent 256, Y should span height
    assert.match(html, /id="decal-pos-x"[^>]*min="-256"[^>]*max="256"/);
    assert.match(html, /id="decal-pos-z"[^>]*min="-256"[^>]*max="256"/);
    assert.match(html, /id="decal-pos-y"[^>]*min="-10"[^>]*max="70"/);
  });
});
