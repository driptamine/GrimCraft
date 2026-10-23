import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readInputSource } from './input-src.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Regression: the DECALS/TEXTURE tab showed every group eye as enabled
// while the master switch (default ON, living in the terrain panel)
// kept all meshes hidden — "enabled but nothing appears on scene".
describe('decals tab master toggle', () => {
  it('tab owns a master switch wired to the same toggle', () => {
    const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
    const panel = html.slice(
      html.indexOf('<div id="decals-panel">'),
      html.indexOf('<div id="nodes-panel">'),
    );
    assert.ok(panel.includes('data-decal-toggle'), 'master button lives inside #decals-panel');
    assert.ok(panel.includes('onclick="toggleSgbDecals()"'), 'master button flips master visibility');
    assert.equal(
      (html.match(/data-decal-toggle/g) || []).length, 2,
      'terrain panel + decals tab switches, no strays',
    );
  });

  it('label sync covers every master switch, not just the first', () => {
    const src = fs.readFileSync(path.join(root, 'src/sgb-decals.js'), 'utf8');
    const body = src.slice(
      src.indexOf('function setDecalButtonLabel'),
      src.indexOf('export function areSgbDecalsVisible'),
    );
    assert.ok(body.includes("querySelectorAll('[data-decal-toggle]')"), 'all switches relabeled');
    assert.ok(!body.includes('querySelector('), 'no first-only querySelector left');
  });

  it('showing a group lifts the master switch so it appears on scene', () => {
    const src = fs.readFileSync(path.join(root, 'src/sgb-decals.js'), 'utf8');
    const body = src.slice(
      src.indexOf('export function setDecalGroupVisible'),
      src.indexOf('export function toggleDecalGroup'),
    );
    assert.ok(body.includes('visible && !_decalVisible'), 'only when master is off');
    assert.ok(body.includes('toggleSgbDecals()'), 'full toggle semantics reused');
  });
});

describe('decals tab hover toggle', () => {
  it('tab owns a hover switch wired to the hover toggle', () => {
    const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
    const panel = html.slice(
      html.indexOf('<div id="decals-panel">'),
      html.indexOf('<div id="nodes-panel">'),
    );
    assert.ok(panel.includes('data-decal-hover'), 'hover button lives inside #decals-panel');
    assert.ok(panel.includes('onclick="toggleDecalHover()"'), 'hover button flips hover mode');
  });

  it('hover outline creation is gated by the flag, toggle clears + relabels', () => {
    const src = fs.readFileSync(path.join(root, 'src/sgb-decals.js'), 'utf8');
    assert.match(src, /let _decalHoverEnabled = false;/);
    const handler = src.slice(
      src.indexOf("canvas.addEventListener('pointermove'"),
      src.indexOf("canvas.addEventListener('click'"),
    );
    assert.ok(handler.includes('if (!_decalHoverEnabled)'), 'gate at top of hover handler');
    const toggle = src.slice(
      src.indexOf('export function toggleDecalHover'),
      src.indexOf('export function toggleSgbDecals'),
    );
    assert.ok(toggle.includes('_decalHoverEnabled = !_decalHoverEnabled'), 'flag flips');
    assert.ok(toggle.includes('_clearHover()'), 'disabling clears a live outline');
    assert.ok(toggle.includes('setDecalHoverLabel()'), 'button label follows');
  });

  it('game exposes the hover toggle on window', () => {
    const game = fs.readFileSync(path.join(root, 'src/game.js'), 'utf8');
    assert.ok(game.includes('window.toggleDecalHover = '), 'onclick handler resolves');
  });

  it('outline factory is gated so select red is suppressed too', () => {
    const src = fs.readFileSync(path.join(root, 'src/sgb-decals.js'), 'utf8');
    const factory = src.slice(
      src.indexOf('function _makeOutline'),
      src.indexOf('function _disposeOutline'),
    );
    assert.ok(factory.includes('if (!_decalHoverEnabled) return null;'), 'hover yellow + select red both gated');
  });

  it('toggle off drops select visual + pill, toggle on restores select visual', () => {
    const src = fs.readFileSync(path.join(root, 'src/sgb-decals.js'), 'utf8');
    const toggle = src.slice(
      src.indexOf('export function toggleDecalHover'),
      src.indexOf('export function toggleSgbDecals'),
    );
    assert.ok(toggle.includes('_selectedOutline = null'), 'red visual dropped');
    assert.ok(toggle.includes("getElementById('decalHoverTip')"), 'name pill hidden');
    assert.ok(toggle.includes('} else if (_selectedDecal) {'), 'select visual restored on re-enable');
    assert.ok(!toggle.includes('_selectedDecal = null'), 'selection state itself survives');
  });

  it('hover name pill respects the flag', () => {
    const input = readInputSource();
    assert.ok(input.includes("from '../sgb-decals.js'"), 'flag imported (acyclic: sgb-decals never imports input)');
    const tip = input.slice(
      input.indexOf('function _updateDecalHover'),
      input.indexOf("canvas.addEventListener('pointermove'"),
    );
    assert.ok(tip.includes('if (!isDecalHoverEnabled())'), 'pill gated');
  });
});
