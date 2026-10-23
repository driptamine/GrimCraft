import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readMeshesSource } from './meshes-src.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Regression: soldier HP bars looked "under" the decal sheets. Bars are
// opaque (drawn in the opaque pass) while decals are transparent (later,
// nearer to a top-down camera), so sheets blended over the bars. Fix: bars
// join the transparent pass AFTER the decals (negative renderOrder) with
// no depth test/write — always visible, same pixels otherwise.
describe('hp bar over decals', () => {
  it('all three bar materials are transparent with no depth flags', () => {
    const src = readMeshesSource();
    const factory = src.slice(src.indexOf('export function makeHpBar'), src.indexOf('export function updateHpBar'));
    assert.equal((factory.match(/\.transparent = true/g) || []).length, 3, 'border + bg + fg');
    assert.equal((factory.match(/\.depthTest = false/g) || []).length, 3, 'always visible');
    assert.equal((factory.match(/\.depthWrite = false/g) || []).length, 3, 'never occlude later transparents');
    assert.equal((factory.match(/\.renderOrder = 2/g) || []).length, 3, 'after decals (negative order)');
  });
});
