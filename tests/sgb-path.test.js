import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createChunkReader } from '../src/sgb-reader.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Independent re-derivation of the DATAIMPA grid straight from the SGB
// (own chunk walk, own index math): the committed JSON must match it cell
// for cell. World->local uses the game root mapping (rotY 90 + horizontal
// mirror, same as hq_position.json: local x = -worldZ, local z = -worldX);
// the raw chunk is heightfield-local, row-major, 4 world units per cell.
function sgbImpaRaw() {
  const buf = fs.readFileSync(path.join(root, 'maps/6p_alvarus/6p_alvarus.sgb'));
  const rr = createChunkReader(buf);
  rr.skipChunky();
  let end = rr.size;
  for (const want of ['FOLDSCEN', 'FOLDWSTC', 'FOLDMSTC', 'FOLDPFDR', 'DATAIMPA']) {
    let found = false;
    while (rr.position < end) {
      const h = rr.readHeader();
      const pe = rr.position + h.size;
      if (h.typeid === want) {
        end = pe;
        found = true;
        break;
      }
      while (rr.position < pe) rr.skip(pe - rr.position);
    }
    assert.ok(found, `chunk present: ${want}`);
  }
  assert.equal(rr.readU32(), 128);
  assert.equal(rr.readU32(), 128);
  return rr.readData(128 * 128);
}

function loadPathJson() {
  return JSON.parse(fs.readFileSync(path.join(root, 'maps/6p_alvarus/6p_alvarus_path.json'), 'utf8'));
}

describe('alvarus path grid', () => {
  it('declares a 128x128 world-frame grid over the full map', () => {
    const doc = loadPathJson();
    assert.equal(doc.map, '6p_alvarus');
    assert.equal(doc.grid.frame, 'world');
    assert.equal(doc.grid.sizeX, 128);
    assert.equal(doc.grid.sizeZ, 128);
    assert.equal(doc.grid.cellWorld, 4);
    assert.equal(doc.grid.originX, -256);
    assert.equal(doc.grid.originZ, -256);
    assert.equal(doc.rows.length, 128);
    for (const row of doc.rows) assert.equal(row.length, 128);
  });

  it('matches the SGB Passability Map bytes in every cell', () => {
    const doc = loadPathJson();
    const raw = sgbImpaRaw();
    assert.equal(raw.length, 128 * 128);
    for (let r = 0; r < 128; r++) {
      for (let c = 0; c < 128; c++) {
        const wx = -256 + (c + 0.5) * 4;
        const wz = -256 + (r + 0.5) * 4;
        const i = Math.floor((-wz + 256) / 4);
        const j = Math.floor((-wx + 256) / 4);
        assert.equal(doc.rows[r][c], raw[j * 128 + i], `cell c=${c} r=${r}`);
      }
    }
  });

  it('carries the known value histogram (no silent corruption)', () => {
    const doc = loadPathJson();
    assert.deepEqual(doc.counts, { 0: 3, 2: 11694, 3: 441, 7: 4245, 64: 1 });
    const seen = new Set();
    for (const row of doc.rows) for (const v of row) seen.add(v);
    assert.deepEqual([...seen].sort((a, b) => a - b), [0, 2, 3, 7, 64]);
  });

  it('orientation: spawns read free, borders read closed', () => {
    const doc = loadPathJson();
    const at = (wx, wz) => doc.rows[Math.floor((wz + 256) / 4)][Math.floor((wx + 256) / 4)];
    const layout = JSON.parse(fs.readFileSync(path.join(root, 'maps/6p_alvarus/6p_alvarus.json'), 'utf8'));
    assert.ok(layout.positions.length >= 6);
    for (const p of layout.positions) {
      assert.equal(at(p.x, p.z), 2, `spawn (${p.x},${p.z}) free`);
    }
    assert.equal(at(254, 0), 7, 'east border closed');
    assert.equal(at(-254, 0), 7, 'west border closed');
    assert.equal(at(0, 0), 2, 'map center free');
  });

  it('hills are unmarked: the steep face reads free', () => {
    const doc = loadPathJson();
    const at = (wx, wz) => doc.rows[Math.floor((wz + 256) / 4)][Math.floor((wx + 256) / 4)];
    // 1.06-slope face: hills are slope-blocked at runtime, not paint-blocked.
    assert.equal(at(42, -102), 2);
  });
});
