import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
describe('decal black fix', () => {
  it('uses glob-resolved URLs so vite build emits textures (not 404)', () => {
    const src = fs.readFileSync(path.join(root, 'src/sgb-decals.js'), 'utf8');
    assert.match(src, /DECAL_GLOB.*import\.meta\.glob/);
    assert.match(src, /DECAL_GLOB\[key\]/);
  });
  it('unlit material not black, no tint, alpha-blend layering', () => {
    const src = fs.readFileSync(path.join(root, 'src/sgb-decals.js'), 'utf8');
    // three.js spelling of the same contract: unlit white base, double-sided,
    // alpha-blended over the texture alpha, layered via polygon offset.
    assert.match(src, /MeshBasicMaterial/);
    assert.match(src, /mat\.color = new THREE\.Color\(1, 1, 1\)/);
    assert.match(src, /side = THREE\.DoubleSide/);
    assert.match(src, /mat\.transparent = true/);
    assert.match(src, /polygonOffsetFactor = -2/);
    assert.match(src, /mat\.map = texture/);
    assert.ok(!src.includes('alphaTest'), 'alpha-test would eat semi-transparent pixels');
  });
  it('vite copies maps so decals not 404 as black', () => {
    const viteCfg = fs.readFileSync(path.join(root, 'vite.config.js'), 'utf8');
    assert.match(viteCfg, /sync-runtime-assets/);
    assert.match(viteCfg, /src: 'maps', dest: 'dist\/maps'/);
    // excludeMaps (not excludeModels) keeps .tga/.dds decals in dist.
    assert.match(viteCfg, /exclude: excludeMaps/);
  });
  it('png textures are marked sRGB like tga/dds (no washed-out decals)', () => {
    const src = fs.readFileSync(path.join(root, 'src/three-helpers.js'), 'utf8');
    const marks = src.match(/\.colorSpace = THREE\.SRGBColorSpace/g) || [];
    assert.ok(marks.length >= 2, 'tga/dds path + png path both mark sRGB');
  });
  it('glob covers every map decals dir, no chaos-only filter', () => {
    const src = fs.readFileSync(path.join(root, 'src/sgb-decals.js'), 'utf8');
    assert.match(src, /\/maps\/\*\*\/decals\/\*\*/);
    assert.ok(!src.includes('__NONE__'), 'chaos-only filter would hide every map except alvarus');
    assert.ok(!src.includes('DECAL_FILTER'), 'filter const removed with the filter');
  });
  it('unresolved textures are skipped, never built as 404 planes', () => {
    const src = fs.readFileSync(path.join(root, 'src/sgb-decals.js'), 'utf8');
    assert.match(src, /return null; \/\/ unresolved/);
    assert.match(src, /fileUrlForDecalPath\(path\) !== null/);
    assert.match(src, /\.filter\(\(d\) => d\.url !== null\)/);
  });
});
