import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
describe('decal-group eye toggle', () => {
  it('sgb-decals exposes group visibility API', () => {
    const src = fs.readFileSync(path.join(root, 'src/sgb-decals.js'), 'utf8');
    assert.match(src, /export function isDecalGroupVisible/);
    assert.match(src, /export function setDecalGroupVisible/);
    assert.match(src, /export function toggleDecalGroup/);
    assert.match(src, /_hiddenGroups/);
  });
  it('decals-panel renders eye icon per group', () => {
    const src = fs.readFileSync(path.join(root, 'src/decals-panel.js'), 'utf8');
    assert.match(src, /decal-group-eye/);
    assert.match(src, /toggleDecalGroup/);
    assert.match(src, /isDecalGroupVisible/);
    const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
    assert.match(html, /\.decal-group-eye/);
  });
});
