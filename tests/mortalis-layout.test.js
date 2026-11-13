import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { inflateSync } from 'node:zlib';
import { extractSgbLayout } from '../scripts/extract-sgb-layout.mjs';
import { createSgbParser } from '../src/maps/sgb-parser.js';
import { resolveDecalUrl } from '../src/maps/decal-size.js';

for (const expected of [
  { map: '6p_mortalis', decals: 288, entities: 296, types: 10, counts: [[14, 126], [15, 66], [18, 32], [35, 28], [50, 4]], origin: -257, size: 257, missing: [] },
  { map: '8p_oasis_of_sharr', decals: 913, entities: 569, types: 15, counts: [[30, 495], [58, 200], [102, 18], [143, 44], [144, 267]], origin: -513, size: 513, missing: [] },
  { map: '8p_burial_grounds', decals: 1180, entities: 1204, types: 17, counts: [[33, 239], [37, 660], [50, 10], [55, 96], [82, 19]], origin: -513, size: 513, missing: [] },
  { map: '4p_doom_spiral', decals: 424, entities: 375, types: 15, counts: [[31, 104], [72, 9], [75, 3]], origin: -257, size: 257, missing: [] },
]) {
const folder = fileURLToPath(new URL(`../maps/${expected.map}/`, import.meta.url));
const bytes = fs.readFileSync(folder + `${expected.map}.sgb`);
const layout = JSON.parse(fs.readFileSync(folder + 'layout.json', 'utf8'));

describe(`${expected.map} authored layout`, () => {
  it('can be reproduced from the SGB without hand-placed coordinates', () => {
    assert.deepEqual(layout, extractSgbLayout(bytes, `${expected.map}.sgb`).layout);
    assert.equal(layout.decals.length, expected.decals);
    assert.equal(layout.entities.length, expected.entities);
    assert.equal(new Set(layout.decals.map((decal) => decal.ref)).size, expected.types);
    assert.deepEqual(layout.terrain.detail_textures.map(({ index, tile_count }) => [index, tile_count]).sort((a, b) => a[0] - b[0]), expected.counts);
    assert.deepEqual(layout.terrain.local_origin, [expected.origin, expected.origin]);
    assert.deepEqual(layout.terrain.size, [expected.size, expected.size]);
  });

  it('preserves raw decal coordinates, rotations and texture tile IDs', () => {
    const parser = createSgbParser();
    const source = parser.parse(bytes);
    assert.deepEqual(layout.terrain.texture_indices.rows.flat(), source.tileTextureIndices);
    const paths = new Map(source.decalLinks.map(({ id, path }) => [id, path]));
    assert.deepEqual(layout.decals, source.decals.map((decal) => ({ id: decal.id, ref: paths.get(decal.decalIdx), x: decal.x, z: decal.z, size_raw: decal.size, rotation_rad: decal.angle })));
  });

  it('assigns every terrain tile its authored texture and preserves all triangles', () => {
    const parser = createSgbParser();
    parser.parse(bytes);
    const root = parser.createThreeMap(null, { tileTextureIndices: layout.terrain.texture_indices.rows.flat() });
    assert.equal(new Set(root.children.map((mesh) => mesh.material)).size, new Set(layout.terrain.texture_indices.rows.flat()).size);
    let triangles = 0;
    const actualCounts = new Map();
    for (const mesh of root.children) {
      const positions = mesh.geometry.getAttribute('position');
      triangles += mesh.geometry.index.count / 3;
      // Each source tile contributes 17*17 vertices, even after merging.
      for (let vertex = 0; vertex < positions.count; vertex += 289) {
        const col = Math.round((positions.getX(vertex) - expected.origin) / 32);
        const row = Math.round((positions.getZ(vertex) - expected.origin) / 32);
        assert.equal(mesh.userData.detailTextureIndex, layout.terrain.texture_indices.rows[row][col], `tile ${col},${row}`);
        actualCounts.set(mesh.userData.detailTextureIndex, (actualCounts.get(mesh.userData.detailTextureIndex) || 0) + 1);
      }
    }
    assert.equal(triangles, ((expected.size - 1) / 16) ** 2 * 512);
    for (const detail of layout.terrain.detail_textures) assert.equal(actualCounts.get(detail.index), detail.tile_count);
  });

  it('resolves supplied decals to this map before shared files and identifies missing assets', () => {
    const assets = Object.fromEntries(fs.readdirSync(folder + 'decals', { recursive: true }).filter((name) => name.endsWith('.png')).map((name) => [`/maps/${expected.map}/decals/${name}`, `${expected.map}:${name}`]));
    assets['/maps/6p_alvarus/decals/jungle/jungle_canopy_01.png'] = 'wrong shared asset';
    const missing = new Set();
    for (const decal of layout.decals) {
      const url = resolveDecalUrl(decal.ref, `/maps/${expected.map}/${expected.map}.sgb`, assets);
      if (!url) missing.add(decal.ref);
      else assert.ok(url.startsWith(`${expected.map}:`), decal.ref);
    }
    assert.deepEqual([...missing], expected.missing);
    assert.equal(resolveDecalUrl('art/decals/jungle/jungle_canopy_01', '/maps/6p_alvarus/6p_alvarus.sgb', assets), 'wrong shared asset');
  });

  it('stores complete browser-ready RGBA PNGs after removing source format duplicates', () => {
    for (const dir of ['textures', 'decals']) {
      for (const file of fs.readdirSync(folder + dir, { recursive: true }).filter((file) => file.endsWith('.png'))) {
        const png = fs.readFileSync(folder + dir + '/' + file);
        assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
        assert.equal(png[24], 8, '8-bit channels');
        assert.equal(png[25], 6, 'RGBA includes decal transparency');
        const width = png.readUInt32BE(16), height = png.readUInt32BE(20);
        assert.ok(width > 0 && height > 0);
        const compressed = [];
        for (let offset = 8; offset < png.length;) {
          const length = png.readUInt32BE(offset);
          if (png.toString('ascii', offset + 4, offset + 8) === 'IDAT') compressed.push(png.subarray(offset + 8, offset + 8 + length));
          offset += length + 12;
        }
        const scanlines = inflateSync(Buffer.concat(compressed));
        assert.equal(scanlines.length, height * (width * 4 + 1), `${dir}/${file}: all pixels present`);
      }
    }
  });
});
}
