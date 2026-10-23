// Builds a polygon navmesh for 6p_alvarus out of 6p_alvarus_path.json.
//
// Walkable = passability value 2 (PASS_OPEN, same rule as
// sgbPassBlockedAt); every other value is blocked. Open cells are merged
// greedily into maximal rectangles, then neighboring rects are linked
// through shared-border portal segments. All coordinates are integer
// world units (cell 4). Output is deterministic: same bytes on every run.
// Run: node scripts/build-alvarus-navmesh.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcPath = join(rootDir, 'maps', '6p_alvarus', '6p_alvarus_path.json');
const outPath = join(rootDir, 'maps', '6p_alvarus', '6p_alvarus_navmesh.json');

const WALKABLE = 2;

const doc = JSON.parse(readFileSync(srcPath, 'utf8'));
const { sizeX, sizeZ, cellWorld, originX, originZ } = doc.grid;
const rows = doc.rows;
if (!rows || rows.length !== sizeZ || rows[0].length !== sizeX) {
  throw new Error('path.json grid mismatch');
}
const open = (r, c) => rows[r][c] === WALKABLE;

// Greedy maximal-rectangle merge in fixed row-major order.
const claimed = new Uint8Array(sizeX * sizeZ);
const rects = []; // cell coords {c0,r0,c1,r1}, c1/r1 exclusive
for (let r = 0; r < sizeZ; r += 1) {
  for (let c = 0; c < sizeX; c += 1) {
    if (!open(r, c) || claimed[r * sizeX + c]) continue;
    let w = 1;
    while (c + w < sizeX && open(r, c + w) && !claimed[r * sizeX + c + w]) w += 1;
    let h = 1;
    let grow = true;
    while (grow && r + h < sizeZ) {
      for (let cc = c; cc < c + w; cc += 1) {
        if (!open(r + h, cc) || claimed[(r + h) * sizeX + cc]) {
          grow = false;
          break;
        }
      }
      if (grow) h += 1;
    }
    for (let rr = r; rr < r + h; rr += 1) {
      for (let cc = c; cc < c + w; cc += 1) {
        claimed[rr * sizeX + cc] = 1;
      }
    }
    rects.push({ c0: c, r0: r, c1: c + w, r1: r + h });
  }
}

const X = (c) => originX + c * cellWorld;
const Z = (r) => originZ + r * cellWorld;
const world = rects.map((rc) => [
  X(rc.c0), Z(rc.r0), X(rc.c1), Z(rc.r1),
]); // [minX,minZ,maxX,maxZ]

// Links: rect pairs sharing a border segment (nonzero overlap).
// Vertical sides indexed by x, horizontal by z; each side lists the rects
// on its negative/positive face so matches are found without O(n^2).
const vertAt = new Map(); // x -> [{z0,z1,rect,side}] side -1 (right face) | +1 (left face)
const horizAt = new Map(); // z -> [{x0,x1,rect,side}]
const pushSide = (map, key, entry) => {
  let list = map.get(key);
  if (!list) {
    list = [];
    map.set(key, list);
  }
  list.push(entry);
};
world.forEach(([minX, minZ, maxX, maxZ], i) => {
  pushSide(vertAt, minX, { z0: minZ, z1: maxZ, rect: i, side: 1 });
  pushSide(vertAt, maxX, { z0: minZ, z1: maxZ, rect: i, side: -1 });
  pushSide(horizAt, minZ, { x0: minX, x1: maxX, rect: i, side: 1 });
  pushSide(horizAt, maxZ, { x0: minX, x1: maxX, rect: i, side: -1 });
});
const overlap = (a0, a1, b0, b1) => [Math.max(a0, b0), Math.min(a1, b1)];
const links = []; // [a,b,ax,az,bx,bz], a < b
const seen = new Set();
const addLink = (a, b, ax, az, bx, bz) => {
  const [ra, rb] = a < b ? [a, b] : [b, a];
  const key = `${ra}:${rb}:${ax},${az},${bx},${bz}`;
  if (seen.has(key)) return;
  seen.add(key);
  links.push([ra, rb, ax, az, bx, bz]);
};
for (const [x, list] of vertAt) {
  const neg = list.filter((s) => s.side < 0);
  const pos = list.filter((s) => s.side > 0);
  for (const a of neg) {
    for (const b of pos) {
      if (a.rect === b.rect) continue;
      const [z0, z1] = overlap(a.z0, a.z1, b.z0, b.z1);
      if (z1 > z0) addLink(a.rect, b.rect, x, z0, x, z1);
    }
  }
}
for (const [z, list] of horizAt) {
  const neg = list.filter((s) => s.side < 0);
  const pos = list.filter((s) => s.side > 0);
  for (const a of neg) {
    for (const b of pos) {
      if (a.rect === b.rect) continue;
      const [x0, x1] = overlap(a.x0, a.x1, b.x0, b.x1);
      if (x1 > x0) addLink(a.rect, b.rect, x0, z, x1, z);
    }
  }
}
links.sort((p, q) => (p[0] - q[0]) || (p[1] - q[1]) || (p[2] - q[2]) || (p[3] - q[3]));

const head = JSON.stringify({
  map: '6p_alvarus',
  source: 'maps/6p_alvarus/6p_alvarus_path.json',
  grid: { cellWorld, originX, originZ },
}, null, 2).replace(/\n\}$/, '');
const block = (name, rows) => `"${name}": [\n` + rows.map((row) => '    [' + row.join(', ') + ']').join(',\n') + '\n  ]';
const body = block('rects', world) + ',\n  ' + block('links', links) + '\n}';
writeFileSync(outPath, head + ',\n  ' + body + '\n');
console.log(`navmesh: ${rects.length} rects, ${links.length} links -> ${outPath}`);
