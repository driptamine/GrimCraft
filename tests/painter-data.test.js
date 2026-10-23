import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
globalThis.window = {};
await import('../tools/alvarus-grid-data.js');
const baked = globalThis.window.ALVARUS_GRID;
const pathDoc = JSON.parse(
  fs.readFileSync(path.join(root, 'maps/6p_alvarus/6p_alvarus_path.json'), 'utf8'),
);
const gameLayout = JSON.parse(
  fs.readFileSync(path.join(root, 'maps/6p_alvarus/6p_alvarus.json'), 'utf8'),
);
const html = fs.readFileSync(path.join(root, 'tools/path-painter.html'), 'utf8');

describe('path painter data', () => {
  it('matches the live grid geometry and paint plus committed edits', () => {
    assert.deepEqual(baked.grid, pathDoc.grid);
    const edits = JSON.parse(
      fs.readFileSync(path.join(root, 'maps/6p_alvarus/6p_alvarus_path_edits.json'), 'utf8'),
    ).edits;
    const expected = pathDoc.rows.map((row) => row.slice());
    for (const e of edits) expected[e.r][e.c] = e.v;
    assert.deepEqual(baked.paint, expected);
  });

  it('layers the committed painter edits over the SGB paint', () => {
    const edits = JSON.parse(
      fs.readFileSync(path.join(root, 'maps/6p_alvarus/6p_alvarus_path_edits.json'), 'utf8'),
    ).edits;
    assert.ok(edits.length > 0);
    for (const e of edits) {
      assert.equal(baked.paint[e.r][e.c], e.v, `edit c=${e.c} r=${e.r} baked`);
    }
  });

  it('covers every relic the game spawns', () => {
    const relics = (gameLayout.strategicPoints || []).filter((p) => p.kind === 'relic');
    assert.ok(relics.length > 0);
    assert.deepEqual(
      baked.relics.slice().sort((a, b) => a.x - b.x || a.z - b.z),
      relics.map((p) => ({ x: p.x, z: p.z })).sort((a, b) => a.x - b.x || a.z - b.z),
    );
  });

  it('renders rotated 180 degrees (view-only, export keeps data cells)', () => {
    assert.ok(html.includes('N - 1 - c'), 'display mapping rotated');
    assert.ok(html.includes('N - 1 - Math.floor'), 'pick mapping inverted');
  });

  it('painter page wires the data file and the export ids', () => {
    assert.ok(html.includes('src="alvarus-grid-data.js"'), 'loads baked data');
    for (const id of ['cv', 'vals', 'brushes', 'reset', 'copy', 'dl', 'nchanged', 'readout', 'export']) {
      assert.ok(html.includes(`id="${id}"`), `element #${id}`);
    }
  });
});
