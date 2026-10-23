// A* wired into the game: world-space routing over the SGB passability
// grid (<map>_path.json via window.__sgbPassGrid) with slope-aware costs and
// line-of-sight smoothing. Blocking uses sgbPassBlockedAt, so a routed path
// never disagrees with the local steering in avoid.js.
//
// Contract with the game:
// - No grid (flat maps, menu) -> every function returns null: squads keep
//   the exact old straight-line behavior.
// - Straight line free -> null: no waypoint state, zero overhead per tick.
// - Blocked/boxed with no route -> escape: standing on closed paint, the
//   mover steps out to the nearest free cell first (never straight through
//   the wall); a truly disconnected pocket still falls back to straight.
// - Route state lives on the squad component (_astarPath/_astarKey, local
//   only): recomputed deterministically when the order changes, so there is
//   nothing extra to sync for multiplayer.
import { astar } from './astar.js';
import { sgbPassBlockedAt } from './avoid.js';
import { _groundAt } from '../src/systems/terrain.js';

const DEFAULT_SLOPE_PENALTY = 24;
const DEFAULT_SLOPE_CAP = 10;
const DEFAULT_MAX_EXPAND = 20000;
const WAYPOINT_REACH = 1.5;
const ENDPOINT_SNAP_CELLS = 8;
// Straight-line total ascent above this runs A* instead of going straight:
// flat maps keep the exact old behavior, hills get routed around.
const CLIMB_DETOUR_ASCENT = 2;
// Uphill grade the router never plans through (same language as the local
// steering deflect threshold): steeper legs are not line-of-sight. Downhill
// is always free. Hilltop goals stay reachable: a short final approach hop
// is exempt, the last climb is the mover's release distance.
export const ROUTE_MAX_GRADE = 0.5;
const FINAL_APPROACH_HOP = 12;

// Routing modes the pathfinding tab offers. 'astar' routes blocked orders
// around closed paint; 'straight' is the classic behavior (straight line +
// local avoidance only) — updateSquadRoute stays out of the way.
export const ROUTING_MODES = [
  { id: 'astar', name: 'ASTAR WAYPOINTS', desc: 'routes blocked orders around closed paint' },
  { id: 'straight', name: 'STRAIGHT + LOCAL AVOID', desc: 'classic: straight line, deflects locally' },
];

let _routingMode = 'astar';

export function getRoutingMode() {
  return _routingMode;
}

export function setRoutingMode(mode) {
  if (ROUTING_MODES.some((m) => m.id === mode)) {
    _routingMode = mode;
  }
  return _routingMode;
}

function _gridOf(opts) {
  if (opts && opts.passGrid) return opts.passGrid;
  if (typeof window !== 'undefined') return window.__sgbPassGrid || null;
  return null;
}

function _groundOf(opts) {
  if (opts && typeof opts.groundAt === 'function') return opts.groundAt;
  return _groundAt;
}

// World -> cell. Same mapping as sgbPassBlockedAt; null outside the grid.
export function worldToCell(passGrid, x, z) {
  if (!passGrid || !passGrid.rows || !passGrid.grid) return null;
  const g = passGrid.grid;
  const cx = Math.floor((x - g.originX) / g.cellWorld);
  const cy = Math.floor((z - g.originZ) / g.cellWorld);
  if (cx < 0 || cy < 0 || cx >= g.sizeX || cy >= g.sizeZ) return null;
  return { x: cx, y: cy };
}

// Cell -> world (cell center).
export function cellToWorld(passGrid, cx, cy) {
  const g = passGrid.grid;
  return {
    x: g.originX + (cx + 0.5) * g.cellWorld,
    z: g.originZ + (cy + 0.5) * g.cellWorld,
  };
}

export function isCellBlocked(passGrid, cx, cy) {
  const w = cellToWorld(passGrid, cx, cy);
  return sgbPassBlockedAt(passGrid, w.x, w.z);
}

// Nearest free cell within radius (cells), spiral out. Null when boxed in.
export function nearestFreeCell(passGrid, cx, cy, radius = ENDPOINT_SNAP_CELLS) {
  const g = passGrid.grid;
  const inBounds = (x, y) => x >= 0 && y >= 0 && x < g.sizeX && y < g.sizeZ;
  if (inBounds(cx, cy) && !isCellBlocked(passGrid, cx, cy)) return { x: cx, y: cy };
  for (let r = 1; r <= radius; r += 1) {
    // Whole chebyshev ring, nearest first: side columns included, so a free
    // cell due west/east is found (not skipped) and preferred over farther
    // diagonal cells on the same ring.
    const ring = [];
    for (let dx = -r; dx <= r; dx += 1) {
      ring.push({ x: cx + dx, y: cy - r, dx, dy: -r });
      ring.push({ x: cx + dx, y: cy + r, dx, dy: r });
    }
    for (let dy = -r + 1; dy <= r - 1; dy += 1) {
      ring.push({ x: cx - r, y: cy + dy, dx: -r, dy });
      ring.push({ x: cx + r, y: cy + dy, dx: r, dy });
    }
    ring.sort((a, b) => (a.dx * a.dx + a.dy * a.dy) - (b.dx * b.dx + b.dy * b.dy) || a.dy - b.dy || a.dx - b.dx);
    for (const c of ring) {
      if (inBounds(c.x, c.y) && !isCellBlocked(passGrid, c.x, c.y)) {
        return { x: c.x, y: c.y };
      }
    }
  }
  // Thick wall: the spiral missed — scan the whole grid for the nearest
  // free cell, so endpoints always snap whenever any free cell exists.
  // Without this a start deep inside closed paint snaps to null, the route
  // comes back null, and the mover drills straight through the wall.
  let best = null;
  let bestD = Infinity;
  for (let y = 0; y < g.sizeZ; y += 1) {
    for (let x = 0; x < g.sizeX; x += 1) {
      if (isCellBlocked(passGrid, x, y)) continue;
      const d = (x - cx) * (x - cx) + (y - cy) * (y - cy);
      if (d < bestD) {
        bestD = d;
        best = { x, y };
      }
    }
  }
  return best;
}

// Total positive ascent along a straight walk, sampled every 2 units.
export function ascentAlongLine(groundAt, ax, az, bx, bz) {
  if (typeof groundAt !== 'function') return 0;
  const dist = Math.hypot(bx - ax, bz - az);
  const steps = Math.max(1, Math.ceil(dist / 2));
  let total = 0;
  let prev = groundAt(ax, az);
  for (let i = 1; i <= steps; i += 1) {
    const t = i / steps;
    const h = groundAt(ax + (bx - ax) * t, az + (bz - az) * t);
    total += Math.max(0, h - prev);
    prev = h;
  }
  return total;
}

// True when some 2-unit uphill segment is steeper than the router allows.
// Downhill segments never block.
export function legBlockedByGrade(groundAt, ax, az, bx, bz) {
  if (typeof groundAt !== 'function') return false;
  const dist = Math.hypot(bx - ax, bz - az);
  const steps = Math.max(1, Math.ceil(dist / 2));
  let prev = groundAt(ax, az);
  for (let i = 1; i <= steps; i += 1) {
    const t = i / steps;
    const h = groundAt(ax + (bx - ax) * t, az + (bz - az) * t);
    if ((h - prev) / (dist / steps) > ROUTE_MAX_GRADE) {
      return true;
    }
    prev = h;
  }
  return false;
}

// Straight-line walk, sampled every half cell: blocked when any sample sits
// on closed paint. Same predicate as the steering, so smoothing never cuts
// through a zone the local avoidance would refuse. With a height sampler,
// uphill legs steeper than ROUTE_MAX_GRADE are not line-of-sight either.
export function hasLineOfSight(passGrid, ax, az, bx, bz, groundAt = null) {
  const g = passGrid.grid;
  const dist = Math.hypot(bx - ax, bz - az);
  const steps = Math.max(1, Math.ceil(dist / (g.cellWorld * 0.25)));
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    if (sgbPassBlockedAt(passGrid, ax + (bx - ax) * t, az + (bz - az) * t)) {
      return false;
    }
  }
  if (groundAt && legBlockedByGrade(groundAt, ax, az, bx, bz)) {
    return false;
  }
  return true;
}

// Greedy furthest-visible splice over the cell path, returned as world
// waypoints (goal last, start excluded). The final leg into the goal is
// exempt from the grade check (hilltop goals stay reachable); paint still
// applies everywhere.
export function smoothPathCells(passGrid, cells, groundAt = null) {
  if (!cells || cells.length < 2) return [];
  const pts = cells.map((c) => cellToWorld(passGrid, c.x, c.y));
  const out = [];
  let anchor = 0;
  while (anchor < pts.length - 1) {
    let furthest = anchor + 1;
    for (let i = anchor + 2; i < pts.length; i += 1) {
      const paintFree = hasLineOfSight(passGrid, pts[anchor].x, pts[anchor].z, pts[i].x, pts[i].z);
      if (!paintFree) {
        continue;
      }
      const hop = Math.hypot(pts[i].x - pts[anchor].x, pts[i].z - pts[anchor].z);
      const flatEnough = !legBlockedByGrade(groundAt, pts[anchor].x, pts[anchor].z, pts[i].x, pts[i].z)
        && ascentAlongLine(groundAt, pts[anchor].x, pts[anchor].z, pts[i].x, pts[i].z) <= CLIMB_DETOUR_ASCENT;
      // The final approach hop is exempt (hilltop goals stay reachable),
      // but only when short: a long jump to the goal must stay flat or the
      // whole detour collapses back into one climbing chord.
      const isGoal = i === pts.length - 1;
      if ((isGoal && hop <= FINAL_APPROACH_HOP) || flatEnough) {
        furthest = i;
      }
    }
    out.push(pts[furthest]);
    anchor = furthest;
  }
  return out;
}

// Full route: null means "go straight" (no grid, flat free straight, or no
// route). Otherwise world waypoints from start to goal.
export function findSquadPath(from, to, opts = {}) {
  const passGrid = _gridOf(opts);
  if (!passGrid) return null;
  const groundAt = _groundOf(opts);
  if (sgbPassBlockedAt(passGrid, from.x, from.z) === false
    && sgbPassBlockedAt(passGrid, to.x, to.z) === false
    && hasLineOfSight(passGrid, from.x, from.z, to.x, to.z, groundAt)
    && ascentAlongLine(groundAt, from.x, from.z, to.x, to.z) <= CLIMB_DETOUR_ASCENT) {
    return null;
  }
  const startCell = worldToCell(passGrid, from.x, from.z);
  const goalCell = worldToCell(passGrid, to.x, to.z);
  if (!startCell || !goalCell) return null;
  const start = nearestFreeCell(passGrid, startCell.x, startCell.y);
  const goal = nearestFreeCell(passGrid, goalCell.x, goalCell.y);
  if (!start || !goal) return null;
  const g = passGrid.grid;
  const slopePenalty = opts.slopePenalty ?? DEFAULT_SLOPE_PENALTY;
  const slopeCap = opts.slopeCap ?? DEFAULT_SLOPE_CAP;
  const cells = astar(start, goal, {
    isBlocked: (cx, cy) => {
      const w = cellToWorld(passGrid, cx, cy);
      return !worldToCell(passGrid, w.x, w.z) || sgbPassBlockedAt(passGrid, w.x, w.z);
    },
    cost: (nx, ny, px, py) => {
      if (!groundAt || !slopePenalty) return 0;
      const a = cellToWorld(passGrid, px, py);
      const b = cellToWorld(passGrid, nx, ny);
      const rise = Math.max(0, groundAt(b.x, b.z) - groundAt(a.x, a.z));
      return Math.min(slopeCap, (slopePenalty * rise) / g.cellWorld);
    },
    maxExpand: opts.maxExpand ?? DEFAULT_MAX_EXPAND,
  });
  if (!cells || cells.length < 2) return null;
  const smooth = smoothPathCells(passGrid, cells, groundAt);
  if (sgbPassBlockedAt(passGrid, from.x, from.z)) {
    // Starting inside closed paint: the mover is NOT at the route start, so
    // the chord to a smoothed far waypoint is unverified and can cross the
    // wall. Lead with the snapped-start exit — the verified leg chain
    // begins there, and the exit chord is the minimal wall crossing.
    const exit = cellToWorld(passGrid, start.x, start.y);
    smooth.unshift({ x: exit.x, z: exit.z });
  }
  smooth.push({ x: to.x, z: to.z });
  return smooth;
}

// Snap a ground-order destination off closed paint onto the nearest free
// cell center. Returns null when the destination is already free, the grid
// is missing, or nothing free is in reach: the caller keeps the original
// destination unchanged.
export function snapOrderToFree(x, z, passGrid = null) {
  const grid = passGrid ?? _gridOf({});
  if (!grid || !sgbPassBlockedAt(grid, x, z)) return null;
  const cell = worldToCell(grid, x, z);
  if (!cell) return null;
  const free = nearestFreeCell(grid, cell.x, cell.y);
  if (!free) return null;
  return cellToWorld(grid, free.x, free.y);
}

// Per-tick route target for a ground mover (squad, APC, vehicle, builder):
// the current waypoint, or null when heading straight at the order. Rebuilds
// only when the order changes; drops reached waypoints as the mover advances.
// Route state lives on the mover component (local only, recomputed
// deterministically, nothing extra to sync).
export function updateMoverRoute(mover, from, order, opts = {}) {
  // Separate cache per tag so a pursuit route never thrashes a move-order
  // route on the same component (and back) every tick.
  const pathKey = opts.tag ? `_astarPath_${opts.tag}` : '_astarPath';
  const keyKey = opts.tag ? `_astarKey_${opts.tag}` : '_astarKey';
  // keyPrecision: pursuit targets move constantly — rebuild only when the
  // target meaningfully moved (pass cell granularity for pursuits).
  const kp = opts.keyPrecision ?? 0.1;
  if (_routingMode !== 'astar') {
    mover[pathKey] = null;
    mover[keyKey] = null;
    return null;
  }
  if (!order || !from) {
    mover[pathKey] = null;
    mover[keyKey] = null;
    return null;
  }
  const key = Math.round(order.x / kp) + ',' + Math.round(order.z / kp);
  if (!mover[pathKey] || mover[keyKey] !== key) {
    mover[keyKey] = key;
    mover[pathKey] = findSquadPath(
      { x: from.x, z: from.z },
      { x: order.x, z: order.z },
      opts,
    ) || [];
  }
  const grid = _gridOf(opts);
  const standingBlocked = !!grid && sgbPassBlockedAt(grid, from.x, from.z);
  if (!mover[pathKey].length && standingBlocked) {
    // No route while standing on closed paint (disconnected pocket, A*
    // giveup): step out to the nearest free cell instead of straight at the
    // goal — straight from inside a wall drills through it. Once out, the
    // empty path rebuilds into a real route on the next tick.
    const cell = worldToCell(grid, from.x, from.z);
    const free = cell && nearestFreeCell(grid, cell.x, cell.y);
    if (free) {
      const w = cellToWorld(grid, free.x, free.y);
      mover[pathKey] = [{ x: w.x, z: w.z }];
    }
  }
  while (mover[pathKey].length) {
    const wp = mover[pathKey][0];
    // Standing on closed paint: never drop the exit waypoint — walking to
    // the nearest free cell first is what gets out with minimal crossing.
    if (Math.hypot(wp.x - from.x, wp.z - from.z) < WAYPOINT_REACH && !standingBlocked) {
      mover[pathKey].shift();
    } else {
      return wp;
    }
  }
  return null;
}

export function updateSquadRoute(squad, opts = {}) {
  return updateMoverRoute(squad, squad.position, squad.moveOrder ?? squad.moveTarget, opts);
}

// Painter edits (<map>_path_edits.json) layered over the SGB-derived grid:
// path.json itself must keep matching the SGB bytes exactly (sgb-path test),
// so hand paint lives in the sidecar file and is applied after load/before
// bake. Only 2/3/7 in-bounds cells apply; anything else is ignored.
// Returns the number of applied edits.
export function applyPathEdits(passGrid, edits) {
  if (!passGrid || !passGrid.grid || !Array.isArray(passGrid.rows) || !Array.isArray(edits)) {
    return 0;
  }
  const g = passGrid.grid;
  let applied = 0;
  for (const e of edits) {
    if (!e || !Number.isInteger(e.c) || !Number.isInteger(e.r) || ![2, 3, 7].includes(e.v)) {
      continue;
    }
    if (e.c < 0 || e.r < 0 || e.c >= g.sizeX || e.r >= g.sizeZ) {
      continue;
    }
    passGrid.rows[e.r][e.c] = e.v;
    applied += 1;
  }
  return applied;
}

// True when the mover stands on closed paint with an active route (order,
// pursuit, or escape): steering deflects only spiral inside the wall, so a
// routed caller skips them and walks straight at the route exit. Unrouted
// movers keep the spiral (it pushes grazers out sideways instead of
// drilling through) — see the sgb-ground tests.
export function exitsStraight(mover, x, z) {
  const grid = _gridOf({});
  if (!grid || !sgbPassBlockedAt(grid, x, z)) return false;
  return Object.keys(mover).some(
    (k) => k.startsWith('_astarPath') && Array.isArray(mover[k]) && mover[k].length,
  );
}

// Hard step guard for routed movers: while any route (order or pursuit) still
// has waypoints, a step that would land on closed paint slides along the
// wall or stops — follower wobble can no longer undo the route. Without an
// active route (straight fallback, arrival dash, giveup escape) or when
// already standing on closed paint, the step passes through unchanged.
export function clampStepToRoute(mover, fromX, fromZ, dx, dz) {
  const passGrid = (typeof window !== 'undefined') ? window.__sgbPassGrid : undefined;
  let routing = false;
  for (const key of Object.keys(mover)) {
    if (key.startsWith('_astarPath') && mover[key] && mover[key].length) {
      routing = true;
      break;
    }
  }
  if (!routing || !passGrid || sgbPassBlockedAt(passGrid, fromX, fromZ)) {
    return [dx, dz];
  }
  if (!sgbPassBlockedAt(passGrid, fromX + dx, fromZ + dz)) {
    return [dx, dz];
  }
  if (!sgbPassBlockedAt(passGrid, fromX + dx, fromZ)) {
    return [dx, 0];
  }
  if (!sgbPassBlockedAt(passGrid, fromX, fromZ + dz)) {
    return [0, dz];
  }
  return [0, 0];
}
