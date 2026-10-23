import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  worldToCell,
  cellToWorld,
  nearestFreeCell,
  hasLineOfSight,
  findSquadPath,
  updateMoverRoute,
  updateSquadRoute,
  snapOrderToFree,
  applyPathEdits,
} from '../pathfinding/astar-integrated.js';
import { createSgbParser } from '../src/sgb-parser.js';
import { sgbPassBlockedAt } from '../pathfinding/avoid.js';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const passGrid = JSON.parse(
  fs.readFileSync(path.join(root, 'maps/6p_alvarus/6p_alvarus_path.json'), 'utf8'),
);
const flat = () => 0;

// Wall on row 88 (world z=98): cells 69..90 closed, free ground both sides.
const WEST = { x: 10, z: 98 };
const EAST = { x: 118, z: 98 };

describe('astar integrated with the game grid', () => {
  it('maps world<->cell exactly like the steering predicate', () => {
    for (const [x, z] of [[10, 98], [-250, -250], [0, 0], [250, 250]]) {
      const cell = worldToCell(passGrid, x, z);
      assert.ok(cell, `in grid (${x},${z})`);
      const center = cellToWorld(passGrid, cell.x, cell.y);
      assert.equal(sgbPassBlockedAt(passGrid, x, z), sgbPassBlockedAt(passGrid, center.x, center.z));
    }
    assert.equal(worldToCell(passGrid, -300, 0), null);
  });

  it('returns null without a grid and on a free straight line', () => {
    assert.equal(findSquadPath(WEST, { x: 30, z: 98 }, { passGrid: null }), null);
    assert.equal(findSquadPath({ x: 10, z: 20 }, { x: 60, z: 20 }, { passGrid, groundAt: flat }), null);
  });

  it('routes around the closed block, every waypoint on free paint', () => {
    assert.equal(hasLineOfSight(passGrid, WEST.x, WEST.z, EAST.x, EAST.z), false);
    const route = findSquadPath(WEST, EAST, { passGrid, groundAt: flat });
    assert.ok(route && route.length > 1, 'detours instead of drilling through');
    for (const wp of route) {
      assert.equal(sgbPassBlockedAt(passGrid, wp.x, wp.z), false, `waypoint (${wp.x},${wp.z}) free`);
    }
    assert.deepEqual(route[route.length - 1], EAST);
  });

  it('snaps a blocked goal to nearby free ground', () => {
    // Just inside the closed block edge (cell 72,88), free ground 4 cells out.
    const goal = { x: -256 + 72.5 * 4, z: -256 + 88.5 * 4 };
    assert.equal(sgbPassBlockedAt(passGrid, goal.x, goal.z), true);
    const route = findSquadPath(WEST, goal, { passGrid, groundAt: flat });
    assert.ok(route, 'still routes to the snapped goal');
    assert.deepEqual(route[route.length - 1], goal);
  });

  it('smooths without cutting closed paint', () => {
    const route = findSquadPath(WEST, EAST, { passGrid, groundAt: flat });
    assert.ok(route.length <= 6, `compact after smoothing (${route.length})`);
    for (let i = 1; i < route.length; i += 1) {
      assert.ok(
        hasLineOfSight(passGrid, route[i - 1].x, route[i - 1].z, route[i].x, route[i].z),
        'every leg walks free paint',
      );
    }
  });

  it('snapOrderToFree keeps free orders and lifts blocked ones out', () => {
    assert.equal(snapOrderToFree(WEST.x, WEST.z, passGrid), null);
    assert.equal(snapOrderToFree(WEST.x, WEST.z, null), null);
    // Inside the closed block edge (cell 72,88).
    const snapped = snapOrderToFree(-256 + 72.5 * 4, -256 + 88.5 * 4, passGrid);
    assert.ok(snapped, 'snapped to free ground');
    assert.equal(sgbPassBlockedAt(passGrid, snapped.x, snapped.z), false);
  });

  it('contours the relic hill at its foot, climbing only the final approach', () => {
    const sgb = fs.readFileSync(path.join(root, 'maps/6p_alvarus/6p_alvarus.sgb'));
    const parser = createSgbParser(null);
    parser.parse(sgb);
    const groundAt = (x, z) => parser.sampleHeight(x, z);
    const route = findSquadPath({ x: 20, z: 36 }, { x: 86, z: 36 }, { passGrid, groundAt });
    assert.ok(route && route.length > 1, 'detours instead of climbing straight');
    assert.deepEqual(route[route.length - 1], { x: 86, z: 36 }, 'hilltop goal still reached');
    const early = route.slice(0, Math.max(1, Math.floor(route.length * 0.6)));
    const earlyMax = Math.max(...early.map((w) => groundAt(w.x, w.z)));
    assert.ok(earlyMax <= 14.5, `stays low early (max ${earlyMax.toFixed(1)})`);
  });

  it('nearestFreeCell snaps and reports boxed-in cells', () => {
    const free = worldToCell(passGrid, WEST.x, WEST.z);
    assert.deepEqual(nearestFreeCell(passGrid, free.x, free.y), free);
    const deep = worldToCell(passGrid, -256 + 72.5 * 4, -256 + 88.5 * 4);
    const snapped = nearestFreeCell(passGrid, deep.x, deep.y);
    const center = cellToWorld(passGrid, snapped.x, snapped.y);
    assert.ok(snapped && !sgbPassBlockedAt(passGrid, center.x, center.z));
  });

  it('nearestFreeCell scans the whole grid past thick walls', () => {
    // 32x32 all closed except (0,0): 16 cells from the middle, past the
    // 8-cell spiral — the fallback must still find it.
    const rows = Array.from({ length: 32 }, () => Array(32).fill(7));
    rows[0][0] = 2;
    const thick = { grid: { originX: 0, originZ: 0, cellWorld: 4, sizeX: 32, sizeZ: 32 }, rows };
    assert.deepEqual(nearestFreeCell(thick, 16, 16), { x: 0, y: 0 });
    rows[0][0] = 7;
    assert.equal(nearestFreeCell(thick, 16, 16), null);
  });

  it('routes from a start deep inside closed paint instead of drilling', () => {
    // Cell (86,22) is 7 in the shipped grid: start inside the wall block.
    const start = { x: -256 + 86.5 * 4, z: -256 + 22.5 * 4 };
    assert.equal(sgbPassBlockedAt(passGrid, start.x, start.z), true);
    const route = findSquadPath(start, EAST, { passGrid, groundAt: flat });
    assert.ok(route && route.length > 1, 'exits the wall with a real route');
    for (const wp of route.slice(0, -1)) {
      assert.equal(sgbPassBlockedAt(passGrid, wp.x, wp.z), false, `waypoint (${wp.x},${wp.z}) free`);
    }
  });
});

describe('squad route state', () => {
  const makeSquad = (x, z, order) => ({
    position: { x, y: 0, z },
    moveOrder: order,
    _astarPath: null,
    _astarKey: null,
  });

  it('stays out of the way on free ground and without orders', () => {
    const squad = makeSquad(10, 20, { x: 60, z: 20 });
    assert.equal(updateSquadRoute(squad, { passGrid, groundAt: flat }), null);
    assert.deepEqual(squad._astarPath, []);
    squad.moveOrder = null;
    assert.equal(updateSquadRoute(squad, { passGrid, groundAt: flat }), null);
  });

  it('tagged pursuit cache rebuilds only when the target meaningfully moves', async () => {
    const { updateMoverRoute } = await import('../pathfinding/astar-integrated.js');
    const mover = { position: { x: WEST.x, y: 0, z: WEST.z } };
    const target = { x: EAST.x, z: EAST.z };
    const opts = { passGrid, groundAt: flat, tag: 'hunt', keyPrecision: 4 };
    const first = updateMoverRoute(mover, mover.position, target, opts);
    assert.ok(first, 'pursuit waypoint issued');
    target.x += 0.5;
    assert.equal(updateMoverRoute(mover, mover.position, target, opts), first, 'no rebuild on jitter');
    target.x += 5;
    const second = updateMoverRoute(mover, mover.position, target, opts);
    assert.ok(second, 'still routing after the target moved cells');
    assert.notEqual(mover._astarKey_hunt, undefined, 'tagged cache used');
    assert.equal(mover._astarPath, undefined, 'order cache untouched');
  });

  it('rebuilds when the order changes and walks the waypoints', () => {
    const squad = makeSquad(WEST.x, WEST.z, { ...EAST });
    const first = updateSquadRoute(squad, { passGrid, groundAt: flat });
    assert.ok(first, 'waypoint issued around the block');
    const key = squad._astarKey;
    // Same order: no rebuild, same waypoint.
    assert.deepEqual(updateSquadRoute(squad, { passGrid, groundAt: flat }), first);
    assert.equal(squad._astarKey, key);
    // Walk to the first waypoint: it drops, the next one serves.
    squad.position.x = first.x;
    squad.position.z = first.z;
    const second = updateSquadRoute(squad, { passGrid, groundAt: flat });
    assert.ok(second && (second.x !== first.x || second.z !== first.z));
    // New order on a free straight: full rebuild, back to straight-line.
    squad.position.x = 10;
    squad.position.z = 20;
    squad.moveOrder = { x: 60, z: 20 };
    assert.equal(updateSquadRoute(squad, { passGrid, groundAt: flat }), null);
  });

  it('applies painter edits on top, ignoring garbage', () => {
    const rows = Array.from({ length: 4 }, () => Array(4).fill(2));
    const doc = { grid: { originX: 0, originZ: 0, cellWorld: 4, sizeX: 4, sizeZ: 4 }, rows };
    const n = applyPathEdits(doc, [
      { c: 1, r: 2, v: 7 },
      { c: 9, r: 9, v: 7 },
      { c: 0, r: 0, v: 5 },
      null,
    ]);
    assert.equal(n, 1);
    assert.equal(rows[2][1], 7);
    assert.equal(applyPathEdits(null, [{ c: 0, r: 0, v: 7 }]), 0);
  });

  it('exits closed paint to free ground instead of going straight', () => {
    // No route possible (goal off-grid) while standing on a 7: the mover
    // must get a free-cell exit target, not null (straight through).
    const rows = Array.from({ length: 8 }, () => Array(8).fill(7));
    rows[0][0] = 2;
    const pocket = { grid: { originX: 0, originZ: 0, cellWorld: 4, sizeX: 8, sizeZ: 8 }, rows };
    const mover = { position: { x: 22, y: 0, z: 22 } };
    const wp = updateMoverRoute(mover, mover.position, { x: 1000, z: 1000 }, { passGrid: pocket, groundAt: flat });
    assert.ok(wp, 'exit waypoint issued');
    assert.deepEqual([wp.x, wp.z], [2, 2], 'nearest free cell center');
    // Standing on free ground with no route: still null, no escape.
    const free = { position: { x: 2, y: 0, z: 2 } };
    assert.equal(updateMoverRoute(free, free.position, { x: 1000, z: 1000 }, { passGrid: pocket, groundAt: flat }), null);
  });
});
