import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { isGroundMesh } from '../src/three-helpers.js';

describe('ground picking', () => {
  it('accepts the default ground plane and SGB tiles', () => {
    const ground = { name: 'ground' };
    assert.equal(isGroundMesh(ground, ground), true);
    assert.equal(isGroundMesh({ name: 'SGB_Tile_0' }, ground), true);
    assert.equal(isGroundMesh({ name: 'SGB_Tile_12' }, null), true);
  });

  it('rejects units, decals and helper meshes', () => {
    const ground = { name: 'ground' };
    assert.equal(isGroundMesh({ name: 'soldier' }, ground), false);
    assert.equal(isGroundMesh({ name: 'decal_1' }, ground), false);
    assert.equal(isGroundMesh({ name: 'grid' }, ground), false);
    assert.equal(isGroundMesh(null, ground), false);
    assert.equal(isGroundMesh(undefined, null), false);
    assert.equal(isGroundMesh({}, ground), false);
  });
});
