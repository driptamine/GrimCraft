// Bakes painter data for tools/path-painter.html out of the game sources:
// heights sampled from 6p_alvarus.sgb DATAHMAP via the game's own parser,
// paint from 6p_alvarus_path.json, relics from 6p_alvarus.json (game source).
// Output is a plain <script>-includable file (file:// safe, no fetch).
// Run: node scripts/build-painter-data.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createSgbParser } from '../src/sgb-parser.js';
import { applyPathEdits } from '../pathfinding/astar-integrated.js';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const outPath = join(rootDir, 'tools', 'alvarus-grid-data.js');

const sgbBuf = readFileSync(join(rootDir, 'maps', '6p_alvarus', '6p_alvarus.sgb'));
const parser = createSgbParser(null);
parser.parse(sgbBuf);

const pathDoc = JSON.parse(readFileSync(join(rootDir, 'maps', '6p_alvarus', '6p_alvarus_path.json'), 'utf8'));
try {
  const editDoc = JSON.parse(readFileSync(join(rootDir, 'maps', '6p_alvarus', '6p_alvarus_path_edits.json'), 'utf8'));
  applyPathEdits(pathDoc, editDoc.edits);
} catch {
  // No hand paint yet.
}
// Relics from the same file the game spawns them from (map-layout.js
// strategicPointsFor -> maps/6p_alvarus/6p_alvarus.json, already in world
// frame). Note 6p_alvarus_layout_upd.json relic_struct entities are the same
// relics in heightfield-local frame (world == (-lz, -lx)); plotting them raw
// is what misplaced the markers before.
const gameLayout = JSON.parse(readFileSync(join(rootDir, 'maps', '6p_alvarus', '6p_alvarus.json'), 'utf8'));

const { sizeX, sizeZ, cellWorld, originX, originZ } = pathDoc.grid;
// World -> SGB heightfield frame: the game renders the terrain root yawed
// 90° and mirrored (sgb-mirror.js) and samples heights through its inverse
// (terrain.js _sgbToLocal). For that setup the inverse is (x, z) -> (-z, -x).
// Verified two ways: the SGB passability mapping negates both axes the same
// way (sgb-path.test.js), and layout entities sit exactly on identity-
// sampled terrain in heightfield frame (relic y == sampleHeight(x, z)).
// Sampling with world coords directly draws every hill rotated/mirrored.
const toHeightFrame = (x, z) => [-z, -x];
const heights = new Array(sizeX * sizeZ);
for (let r = 0; r < sizeZ; r += 1) {
  for (let c = 0; c < sizeX; c += 1) {
    const x = originX + (c + 0.5) * cellWorld;
    const z = originZ + (r + 0.5) * cellWorld;
    const [hx, hz] = toHeightFrame(x, z);
    heights[r * sizeX + c] = Math.round(parser.sampleHeight(hx, hz) * 100) / 100;
  }
}
const relics = (gameLayout.strategicPoints || [])
  .filter((p) => p.kind === 'relic')
  .map((p) => ({ x: p.x, z: p.z }));

const data = {
  grid: pathDoc.grid,
  paint: pathDoc.rows,
  heights,
  relics,
  legend: pathDoc.legend || {},
};
writeFileSync(outPath, 'window.ALVARUS_GRID = ' + JSON.stringify(data) + ';\n');
console.log('wrote', outPath, `${sizeX}x${sizeZ} cells, ${relics.length} relics`);
