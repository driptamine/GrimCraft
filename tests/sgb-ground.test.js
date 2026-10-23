import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  HILL_DEFLECT_RAD,
  HILL_MAX_SLOPE,
  HILL_RELEASE_DIST,
  sgbAvoidUphill,
  sgbGroundY,
} from '../src/sgb-surface.js';

// Literal passability grid builder: covers [originX, originX+size*cell).
function makePassGrid(originX, originZ, cell, size, blockedAt) {
  const rows = [];
  for (let r = 0; r < size; r++) {
    const row = new Array(size).fill(2);
    rows.push(row);
  }
  for (const [c, r, v = 7] of blockedAt) {
    rows[r][c] = v;
  }
  return { rows, grid: { sizeX: size, sizeZ: size, cellWorld: cell, originX, originZ } };
}

// Walker (2.5,2.5) heading +x probes three distinct cells (cell 4u):
// straight [5,4], flank A [4,5], flank B [4,4].
const FLAT_TRIO = { x: 2.5, z: 2.5, dx: 1, dz: 0 };

const identity = (tx, tz, out) => { out.x = tx; out.z = tz; return out; };
const flat = () => 0;

// Gaussian hill: A=6, sigma=5 -> peak slope ~0.73 (a real flank to avoid).
const hill = (x, z) => 6 * Math.exp(-(x * x + z * z) / 50);

function walk({ surf, from, to, avoid, release = HILL_RELEASE_DIST, step = 0.35, maxSteps = 3000 }) {
  let x = from[0];
  let z = from[1];
  const out = { x: 0, z: 0 };
  const mem = { _avoidSide: 0 };
  let minCore = Infinity;
  let maxH = -Infinity;
  for (let i = 0; i < maxSteps; i++) {
    const dx = to[0] - x;
    const dz = to[1] - z;
    const d = Math.hypot(dx, dz);
    if (d < 0.5) return { reached: true, minCore, maxH, steps: i };
    let mx = dx / d;
    let mz = dz / d;
    if (avoid) {
      sgbAvoidUphill(identity, 0, surf, x, z, mx, mz, d, release, mem, out);
      mx = out.x;
      mz = out.z;
    }
    x += mx * step;
    z += mz * step;
    const r = Math.hypot(x, z);
    if (r < minCore) minCore = r;
    const h = surf(x, z);
    if (h > maxH) maxH = h;
  }
  return { reached: false, minCore, maxH, steps: maxSteps };
}

describe('sgb ground seating', () => {
  it('flat field + offset seats feet on the surface', () => {
    assert.equal(sgbGroundY(identity, -10, () => 10, 4, 5), 0);
  });

  it('reads through the world->local mapper (root yaw/mirror)', () => {
    const rot90 = (tx, tz, out) => { out.x = -tz; out.z = tx; return out; };
    assert.equal(sgbGroundY(rot90, 5, (x) => x, 10, 20), -15);
  });

  it('no sampler => 0 (flat maps keep exact old behavior)', () => {
    assert.equal(sgbGroundY(identity, 3, null, 1, 2), 0);
    assert.equal(sgbGroundY(identity, 3, undefined, 1, 2), 0);
  });
});

describe('sgb hill avoidance', () => {
  it('straight on flat / gentle / downhill', () => {
    const out = { x: 0, z: 0 };
    assert.equal(sgbAvoidUphill(identity, 0, flat, 0, 0, 1, 0, 50, HILL_RELEASE_DIST, null, out), false);
    assert.deepEqual(out, { x: 1, z: 0 });
    assert.equal(sgbAvoidUphill(identity, 0, (x) => 0.3 * x, 0, 0, 1, 0, 50, HILL_RELEASE_DIST, null, out), false);
    assert.equal(sgbAvoidUphill(identity, 0, (x) => -0.9 * x, 0, 0, 1, 0, 50, HILL_RELEASE_DIST, null, out), false);
  });

  it('deflects ~60 deg on steep uphill, unit length, tracks side', () => {
    const out = { x: 0, z: 0 };
    const mem = {};
    const changed = sgbAvoidUphill(identity, 0, (x) => 0.8 * x, 0, 0, 1, 0, 50, HILL_RELEASE_DIST, mem, out);
    assert.equal(changed, true);
    assert.ok(Math.abs(Math.hypot(out.x, out.z) - 1) < 1e-9);
    assert.ok(Math.abs(out.x - Math.cos(HILL_DEFLECT_RAD)) < 1e-9, JSON.stringify(out));
    assert.equal(mem._avoidSide, -1);
  });

  it('normalizes non-unit input before probing', () => {
    const out = { x: 0, z: 0 };
    assert.equal(sgbAvoidUphill(identity, 0, flat, 0, 0, 3, 4, 50, HILL_RELEASE_DIST, null, out), false);
    assert.ok(Math.abs(out.x - 0.6) < 1e-9 && Math.abs(out.z - 0.8) < 1e-9);
  });

  it('goes straight near the goal so hilltop goals stay reachable', () => {
    const out = { x: 0, z: 0 };
    const mem = { _avoidSide: 1 };
    const changed = sgbAvoidUphill(identity, 0, (x) => 0.8 * x, 0, 0, 1, 0, 3, HILL_RELEASE_DIST, mem, out);
    assert.equal(changed, false);
    assert.deepEqual(out, { x: 1, z: 0 });
    assert.equal(mem._avoidSide, 0);
  });

  it('no sampler => straight (flat maps unaffected)', () => {
    const out = { x: 0, z: 0 };
    assert.equal(sgbAvoidUphill(identity, 0, null, 0, 0, 1, 0, 50, HILL_RELEASE_DIST, null, out), false);
    assert.deepEqual(out, { x: 1, z: 0 });
  });

  it('holds its flank when surrounded, escapes straight after the budget', () => {
    const wall = (x) => (x <= 0 ? 0 : 3 * x);
    const out = { x: 0, z: 0 };
    // x=0.5: straight slope 3, both +/-60 flanks 1.5 > giveup.
    const mem = { _avoidSide: -1 };
    const held = sgbAvoidUphill(identity, 0, wall, 0.5, 0, 1, 0, 50, HILL_RELEASE_DIST, mem, out);
    assert.equal(held, true, 'slides along the wall instead of climbing it');
    assert.equal(mem._avoidSide, -1);
    assert.ok(out.z > 0.8, JSON.stringify(out));
    // No flank held yet (first contact): still takes flank A deterministically,
    // otherwise wide faces drill straight through instead of skirting.
    const freshMem = {};
    const fresh = sgbAvoidUphill(identity, 0, wall, 0.5, 0, 1, 0, 50, HILL_RELEASE_DIST, freshMem, out);
    assert.equal(fresh, true);
    assert.equal(freshMem._avoidSide, -1);
    // Stateless callers (no memory) go straight.
    const stateless = sgbAvoidUphill(identity, 0, wall, 0.5, 0, 1, 0, 50, HILL_RELEASE_DIST, null, out);
    assert.equal(stateless, false);
    // Budget spent (12u+ of spiraling, e.g. a crater rim): push through.
    const tired = { _avoidSide: -1, _avoidGx: -20, _avoidGz: 0 };
    const escaped = sgbAvoidUphill(identity, 0, wall, 0.5, 0, 1, 0, 50, HILL_RELEASE_DIST, tired, out);
    assert.equal(escaped, false);
    assert.deepEqual(out, { x: 1, z: 0 });
    assert.equal(tired._avoidSide, 0);
  });

  it('sticks to its side within the margin, flips past it', () => {
    const out = { x: 0, z: 0 };
    const mem = {};
    // Tilted ramp: B flank (0.31) beats A (0.49) -> side +1.
    sgbAvoidUphill(identity, 0, (x, z) => 0.8 * x + 0.1 * z, 0, 0, 1, 0, 50, HILL_RELEASE_DIST, mem, out);
    assert.equal(mem._avoidSide, 1);
    // Mild mirror tilt: A better by 0.034 < stick -> stays on B.
    sgbAvoidUphill(identity, 0, (x, z) => 0.8 * x - 0.02 * z, 0, 0, 1, 0, 50, HILL_RELEASE_DIST, mem, out);
    assert.equal(mem._avoidSide, 1);
    // Strong mirror tilt: A better by 0.17 > stick -> flips to A.
    sgbAvoidUphill(identity, 0, (x, z) => 0.8 * x - 0.1 * z, 0, 0, 1, 0, 50, HILL_RELEASE_DIST, mem, out);
    assert.equal(mem._avoidSide, -1);
  });

  it('control: straight-line walking goes OVER the hill (the old behavior)', () => {
    const run = walk({ surf: hill, from: [-20, 0], to: [20, 0], avoid: false });
    assert.equal(run.reached, true);
    assert.ok(run.minCore < 1, `through the core: ${run.minCore}`);
    assert.ok(run.maxH > 5.5, `over the top: ${run.maxH}`);
  });

  it('routes AROUND the hill and still arrives', () => {
    const run = walk({ surf: hill, from: [-20, 0], to: [20, 0], avoid: true });
    assert.equal(run.reached, true);
    assert.ok(run.minCore > 4, `skirted the core: ${run.minCore}`);
    assert.ok(run.maxH < 4.5, `never climbed high: ${run.maxH}`);
  });

  it('hilltop goals stay reachable (release lets the final climb happen)', () => {
    const run = walk({ surf: hill, from: [-20, 0], to: [0, 0], avoid: true });
    assert.equal(run.reached, true);
    assert.ok(run.maxH > 5, `climbed to the top: ${run.maxH}`);
  });

  it('threshold sits between rolling terrain and hill flanks', () => {
    assert.ok(HILL_MAX_SLOPE > 0.4 && HILL_MAX_SLOPE < 0.8, HILL_MAX_SLOPE);
  });
});

describe('sgb passability avoidance', () => {
  it('deflects around a closed cell on perfectly flat ground', () => {
    const grid = makePassGrid(-16, -16, 4, 8, [[5, 4]]);
    const out = { x: 0, z: 0 };
    const mem = {};
    const changed = sgbAvoidUphill(identity, 0, flat, FLAT_TRIO.x, FLAT_TRIO.z, 1, 0, 50, HILL_RELEASE_DIST, mem, out, grid);
    assert.equal(changed, true);
    assert.ok(Math.abs(Math.hypot(out.x, out.z) - 1) < 1e-9);
    assert.ok(Math.abs(out.x - Math.cos(HILL_DEFLECT_RAD)) < 1e-9, JSON.stringify(out));
    assert.equal(mem._avoidSide, -1);
  });

  it('prefers the free flank when straight and one side are closed', () => {
    const grid = makePassGrid(-16, -16, 4, 8, [[5, 4], [4, 5]]);
    const out = { x: 0, z: 0 };
    const mem = {};
    const changed = sgbAvoidUphill(identity, 0, flat, FLAT_TRIO.x, FLAT_TRIO.z, 1, 0, 50, HILL_RELEASE_DIST, mem, out, grid);
    assert.equal(changed, true);
    assert.equal(mem._avoidSide, 1);
    assert.ok(out.z < -0.8, JSON.stringify(out));
  });

  it('spirals out when surrounded by closed paint, escapes after the budget', () => {
    const grid = makePassGrid(-16, -16, 4, 8, [[5, 4], [4, 5], [4, 4]]);
    const out = { x: 0, z: 0 };
    const mem = { _avoidSide: -1 };
    const held = sgbAvoidUphill(identity, 0, flat, FLAT_TRIO.x, FLAT_TRIO.z, 1, 0, 50, HILL_RELEASE_DIST, mem, out, grid);
    assert.equal(held, true, 'holds the flank to spiral out');
    assert.equal(mem._avoidSide, -1);
    const tired = { _avoidSide: -1, _avoidGx: -20, _avoidGz: 0 };
    const escaped = sgbAvoidUphill(identity, 0, flat, FLAT_TRIO.x, FLAT_TRIO.z, 1, 0, 50, HILL_RELEASE_DIST, tired, out, grid);
    assert.equal(escaped, false, 'budget spent: push through');
    assert.deepEqual(out, { x: 1, z: 0 });
  });

  it('release lets goals on closed cells stay reachable', () => {
    const grid = makePassGrid(-16, -16, 4, 8, [[5, 4]]);
    const out = { x: 0, z: 0 };
    const changed = sgbAvoidUphill(identity, 0, flat, FLAT_TRIO.x, FLAT_TRIO.z, 1, 0, 3, HILL_RELEASE_DIST, null, out, grid);
    assert.equal(changed, false);
    assert.deepEqual(out, { x: 1, z: 0 });
  });

  it('walks out of a closed cell toward free ground', () => {
    // Walker stands on [4,4] (blocked), probes ahead are free.
    const grid = makePassGrid(-16, -16, 4, 8, [[4, 4]]);
    const out = { x: 0, z: 0 };
    const changed = sgbAvoidUphill(identity, 0, flat, FLAT_TRIO.x, FLAT_TRIO.z, 1, 0, 50, HILL_RELEASE_DIST, null, out, grid);
    assert.equal(changed, false);
    assert.deepEqual(out, { x: 1, z: 0 });
  });

  it('treats fringe and unknown values as closed, out-of-grid as free', () => {
    const out = { x: 0, z: 0 };
    for (const v of [3, 0, 64]) {
      const grid = makePassGrid(-16, -16, 4, 8, [[5, 4, v]]);
      const changed = sgbAvoidUphill(identity, 0, flat, FLAT_TRIO.x, FLAT_TRIO.z, 1, 0, 50, HILL_RELEASE_DIST, null, out, grid);
      assert.equal(changed, true, `value ${v} deflects`);
    }
    const grid = makePassGrid(-16, -16, 4, 8, []);
    const changed = sgbAvoidUphill(identity, 0, flat, 15, 0, 1, 0, 50, HILL_RELEASE_DIST, null, out, grid);
    assert.equal(changed, false, 'probe past the edge goes straight');
  });

  it('slope logic is unchanged when the grid adds nothing', () => {
    const grid = makePassGrid(-16, -16, 4, 8, []);
    const out = { x: 0, z: 0 };
    const mem = {};
    const changed = sgbAvoidUphill(identity, 0, (x) => 0.8 * x, 0, 0, 1, 0, 50, HILL_RELEASE_DIST, mem, out, grid);
    assert.equal(changed, true);
    assert.equal(mem._avoidSide, -1);
  });

  it('routes around a closed disc on flat ground and still arrives', () => {
    const grid = makePassGrid(-32, -32, 4, 16, []);
    for (let r = 0; r < 16; r++) {
      for (let c = 0; c < 16; c++) {
        if (Math.hypot(-32 + (c + 0.5) * 4, -32 + (r + 0.5) * 4) < 8) grid.rows[r][c] = 7;
      }
    }
    const run = (avoid) => {
      let x = -20, z = 0;
      const out = { x: 0, z: 0 };
      const mem = { _avoidSide: 0 };
      let minCore = Infinity;
      for (let i = 0; i < 3000; i++) {
        const dx = 20 - x, dz = 0 - z;
        const d = Math.hypot(dx, dz);
        if (d < 0.5) return { reached: true, minCore };
        let mx = dx / d, mz = dz / d;
        if (avoid) {
          sgbAvoidUphill(identity, 0, flat, x, z, mx, mz, d, HILL_RELEASE_DIST, mem, out, grid);
          mx = out.x; mz = out.z;
        }
        x += mx * 0.35; z += mz * 0.35;
        const rr = Math.hypot(x, z);
        if (rr < minCore) minCore = rr;
      }
      return { reached: false, minCore };
    };
    const straight = run(false);
    assert.ok(straight.minCore < 1, `control goes through: ${straight.minCore}`);
    const skirt = run(true);
    assert.equal(skirt.reached, true);
    assert.ok(skirt.minCore > 5, `skirted the disc: ${skirt.minCore}`);
  });

  it('goals inside a closed zone stay reachable (relic case)', () => {
    const grid = makePassGrid(-32, -32, 4, 16, []);
    for (let r = 0; r < 16; r++) {
      for (let c = 0; c < 16; c++) {
        if (Math.hypot(-32 + (c + 0.5) * 4, -32 + (r + 0.5) * 4) < 8) grid.rows[r][c] = 7;
      }
    }
    let x = -20, z = 0;
    const out = { x: 0, z: 0 };
    const mem = { _avoidSide: 0 };
    let reached = false;
    for (let i = 0; i < 3000; i++) {
      const dx = 0 - x, dz = 0 - z;
      const d = Math.hypot(dx, dz);
      if (d < 0.5) { reached = true; break; }
      sgbAvoidUphill(identity, 0, flat, x, z, dx / d, dz / d, d, HILL_RELEASE_DIST, mem, out, grid);
      x += out.x * 0.35; z += out.z * 0.35;
    }
    assert.equal(reached, true);
  });
});
