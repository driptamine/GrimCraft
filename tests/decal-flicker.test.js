import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { decalLayer } from '../src/decal-size.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Regression: decals flickered during edge-scroll. All sheets are
// transparent with no renderOrder, so three.js re-sorted the overlaps by
// origin depth every frame and the blend order kept swapping. Fix: fixed
// negative draw sequence (before all other transparents) + no depth writes
// (depth test stays on).
describe('decal flicker fix', () => {
  it('layers ground stain first, rubble mid, craters on top', () => {
    assert.equal(decalLayer('art/decals/z_all/chaos_taint_02'), 0);
    assert.equal(decalLayer('art/decals/jungle/jungle_rubble01'), 1);
    assert.equal(decalLayer('art/decals/jungle/jungle_mud_02'), 1);
    assert.equal(decalLayer('art/decals/jungle/stone_cliff_05'), 1);
    assert.equal(decalLayer('art/decals/urban/urban_rubble03'), 1);
    assert.equal(decalLayer('art/decals/z_all/crater_02'), 2);
    assert.equal(decalLayer('art/decals/z_all/crater_charred_01'), 2);
    assert.equal(decalLayer('art/decals/z_all/crater_dust_01'), 2);
    assert.equal(decalLayer('art/decals/unknown/future'), 1);
  });

  it('both builders assign the fixed negative draw sequence', () => {
    const src = fs.readFileSync(path.join(root, 'src/sgb-decals.js'), 'utf8');
    const sgb = src.slice(src.indexOf('export function buildSgbDecals('), src.indexOf('export function buildSgbDecalsFromLayout('));
    const layout = src.slice(src.indexOf('export function buildSgbDecalsFromLayout('));
    assert.match(sgb, /plane\.renderOrder = -100000 \+ decalLayer\(path\) \* 10000 \+ i;/);
    assert.match(layout, /plane\.renderOrder = -100000 \+ decalLayer\(decal\.path\) \* 10000 \+ i;/);
  });

  it('decal material skips depth writes but keeps the depth test', () => {
    const src = fs.readFileSync(path.join(root, 'src/sgb-decals.js'), 'utf8');
    const factory = src.slice(src.indexOf('function _createDecalMaterial'), src.indexOf('export function clearSgbDecals'));
    assert.ok(factory.includes('mat.depthWrite = false;'), 'overlaps blend, never occlude');
    assert.ok(!factory.includes('mat.depthTest = false'), 'terrain/units still occlude decals');
  });
});
