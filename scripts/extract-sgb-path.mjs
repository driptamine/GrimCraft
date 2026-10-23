// Extracts the DATAIMPA "Passability Map" (128x128) out of
// maps/6p_alvarus/6p_alvarus.sgb into maps/6p_alvarus/6p_alvarus_path.json.
//
// Grid orientation: the raw chunk is heightfield-local (same row-major
// convention as DATAHMAP). Cells are reprojected to WORLD frame through the
// game's own root transform (applySgbRootTransform from src/sgb-mirror.js
// with the sgb-upload defaults: rotY 90 + horizontal mirror), so JSON rows
// map to world z/x bands directly with no transform needed to consume them.
// Verified: blocked border bands land on world borders; hill cells (e.g. the
// 1.06-slope face at world (42,-102)) read free, matching the finding that
// hills are slope-blocked at runtime, not paint-blocked.
// Run: node scripts/extract-sgb-path.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';
import { createChunkReader } from '../src/sgb-reader.js';
import { applySgbRootTransform } from '../src/sgb-mirror.js';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcPath = join(rootDir, 'maps', '6p_alvarus', '6p_alvarus.sgb');
const outPath = join(rootDir, 'maps', '6p_alvarus', '6p_alvarus_path.json');

const GRID = 128;
const CELL = 4; // world units per cell (512-unit heightfield / 128)
const HALF = 256;
// Mirrors _sgbRotate/_sgbFlipH defaults in src/sgb-upload.js.
const ROOT_ROT_DEG = 90;
const ROOT_FLIP_H = true;

function readImpaGrid(buf) {
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
    if (!found) throw new Error('chunk not found: ' + want);
  }
  const sx = rr.readU32();
  const sz = rr.readU32();
  if (sx !== GRID || sz !== GRID) throw new Error(`unexpected IMPA dims ${sx}x${sz}`);
  return rr.readData(sx * sz);
}

const buf = readFileSync(srcPath);
const raw = readImpaGrid(buf);

const root = new THREE.Object3D();
applySgbRootTransform(root, ROOT_ROT_DEG, ROOT_FLIP_H);
root.updateMatrixWorld(true);
const worldToLocal = root.matrixWorld.clone().invert();
const v = new THREE.Vector3();

const rows = [];
const counts = {};
const unknowns = [];
for (let r = 0; r < GRID; r++) {
  const row = new Array(GRID);
  for (let c = 0; c < GRID; c++) {
    const wx = -HALF + (c + 0.5) * CELL;
    const wz = -HALF + (r + 0.5) * CELL;
    v.set(wx, 0, wz).applyMatrix4(worldToLocal);
    const i = Math.min(GRID - 1, Math.max(0, Math.floor((v.x + HALF) / CELL)));
    const j = Math.min(GRID - 1, Math.max(0, Math.floor((v.z + HALF) / CELL)));
    const val = raw[j * GRID + i];
    row[c] = val;
    counts[val] = (counts[val] || 0) + 1;
    if (val !== 2 && val !== 3 && val !== 7) unknowns.push({ value: val, col: c, row: r, worldX: +wx.toFixed(1), worldZ: +wz.toFixed(1) });
  }
  rows.push(row);
}

const doc = {
  map: '6p_alvarus',
  source: {
    file: '6p_alvarus.sgb',
    chunk: 'FOLDWSTC/FOLDMSTC/FOLDPFDR/DATAIMPA',
    chunkName: 'Passability Map',
    note: 'Raw bytes reprojected to world frame. Hills are NOT marked here (slope-blocked at runtime); 7 = painted closed ground (borders, cliff/flat zones). 5 of 22 objective sites read 7 (incl. 1 relic inside a 60u+ flat 7-zone), so capture logic must tolerate blocked cells at objectives.',
  },
  grid: {
    sizeX: GRID,
    sizeZ: GRID,
    cellWorld: CELL,
    originX: -HALF,
    originZ: -HALF,
    frame: 'world',
    layout: 'rows[r][c]: world x in [originX + c*4, originX + (c+1)*4), z in [originZ + r*4, originZ + (r+1)*4)',
    transform: 'applySgbRootTransform(rotY=90, flipH=true) per src/sgb-mirror.js and src/sgb-upload.js defaults',
  },
  legend: {
    2: 'free ground',
    7: 'closed paint (borders, cliff/flat zones) — route around',
    3: 'fringe at closed-zone edges (treat as closed for movement)',
    0: 'unknown/unused (3 corner cells)',
    64: 'unknown/unused (1 corner cell)',
  },
  counts,
  rows,
};

const head = JSON.stringify({ ...doc, rows: undefined }, null, 2).replace(/\n\}$/, '');
const body = '"rows": [\n' + rows.map((row) => '    [' + row.join(', ') + ']').join(',\n') + '\n  ]\n}';
writeFileSync(outPath, head + ',\n  ' + body + '\n');
console.log('wrote', outPath);
console.log('counts:', JSON.stringify(counts));
console.log('unknown cells:', JSON.stringify(unknowns));
// Anchors: borders must read blocked, map center + known hill cells must read free.
const at = (wx, wz) => rows[Math.floor((wz + HALF) / CELL)][Math.floor((wx + HALF) / CELL)];
console.log('anchor east-border (254,0)=', at(254, 0), 'west-border (-254,0)=', at(-254, 0), 'south-border (0,254)=', at(0, 254));
console.log('anchor center (0,0)=', at(0, 0), 'hill-face (42,-102)=', at(42, -102), 'hill-point (110,-88)=', at(110, -88));
