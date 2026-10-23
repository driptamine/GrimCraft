import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
describe('decal layering like chaos_taint_02', () => {
  it('positions use direct world x,z from preview (no tile offset)', () => {
    const src = fs.readFileSync(path.join(root, 'src/sgb-decals.js'), 'utf8');
    assert.match(src, /позиции из maps\/6p_alvarus\/6p_alvarus_preview\.png/);
    assert.match(src, /plane\.position\.set\(decal\.x, y, decal\.z\)/);
    assert.ok(!src.includes('CreateDecal'), 'should use planes at exact x,z, not projected decal with offset');
  });
  it('layered material — alpha blend, not black, positions from preview', () => {
    const src = fs.readFileSync(path.join(root, 'src/sgb-decals.js'), 'utf8');
    assert.match(src, /MeshBasicMaterial/);
    assert.match(src, /mat\.transparent = true/);
    assert.match(src, /mat\.map = texture/);
    assert.match(src, /mat\.color = new THREE\.Color\(1, 1, 1\)/);
    assert.match(src, /plane\.position\.set\(decal\.x, y, decal\.z\)/);
  });
});
