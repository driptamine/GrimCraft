// Steering avoidance over the SGB passability grid + heightfield. Pure: no
// engine imports so plain `node --test` can cover it. Moved here from
// src/sgb-surface.js (which re-exports these names); the ground-seating
// helpers stayed there next to the surface math.
//
// Soldiers used to walk at y=0 along straight lines, sliding through
// Alvarus hills (up to +7). Movers deflect around steep uphill faces.
// Calibrated on the real 6p_alvarus heightfield (cellSize 2): slopes over a
// 2-unit probe are gentle almost everywhere; 0.5+ is hill-flank only, while
// a parameter sweep on an analytic hill (peak slope 0.73) showed 0.5 skirts
// at 60-70% height with zero deflects on rolling (<=0.45) terrain.

// Passability-grid value for open ground (see <map>_path.json legend).
export const PASS_OPEN = 2;

// Slope (rise/run over HILL_PROBE_DIST) above which uphill is a hill flank.
export const HILL_MAX_SLOPE = 0.5;
// Look-ahead for the slope probes, in world units (one heightfield cell).
export const HILL_PROBE_DIST = 2.0;
// Within this of the goal movers go straight: hilltop goals (points on
// hills, capture slots) stay reachable; the final climb is visual only.
export const HILL_RELEASE_DIST = 6.0;
// Soldier slots sit close and move with the squad: near-field release so
// formations still settle (micro-climbs only); routing is the squad's job.
export const HILL_SLOT_RELEASE_DIST = 1.5;
// Side-probe deflection (radians) when the straight probe is too steep.
// cos60 = 0.5 keeps forward progress while skirting the flank.
export const HILL_DEFLECT_RAD = Math.PI / 3;
// Hysteresis: keep the current avoid side unless the other is better by this.
export const HILL_SIDE_STICK = 0.12;
// Both sides worse than this => surrounded: hold the current flank (spiral
// out) instead of climbing straight through. HILL_GIVEUP_ESCAPE bounds the
// spiral: after traveling this far without escaping (a closed ring, e.g. a
// crater rim), push straight through rather than orbit forever.
export const HILL_GIVEUP_SLOPE = 1.2;
export const HILL_GIVEUP_ESCAPE = 12;

const _tap = { x: 0, z: 0 };

function _surfY(toLocal, rootY, sampleHeight, x, z) {
  const local = toLocal(x, z, _tap);
  return sampleHeight(local.x, local.z) + rootY;
}

// True when the world point sits on closed paint (blocked/fringe/unknown).
// Out-of-grid reads free: map bounds already clamp movers, so no phantom
// walls. passGrid is the parsed <map>_path.json doc ({rows, grid}).
export function sgbPassBlockedAt(passGrid, x, z) {
  if (!passGrid || !passGrid.rows || !passGrid.grid) return false;
  const g = passGrid.grid;
  const c = Math.floor((x - g.originX) / g.cellWorld);
  const r = Math.floor((z - g.originZ) / g.cellWorld);
  if (c < 0 || r < 0 || c >= g.sizeX || r >= g.sizeZ) return false;
  return passGrid.rows[r][c] !== PASS_OPEN;
}

// Deflect the unit dir (dx, dz) around steep uphill and closed paint. Writes
// the adjusted unit dir into out ({x, z}), tracks the avoid side on
// memory._avoidSide (-1/0/+1; memory may be null). distToGoal under
// releaseDist goes straight so hilltop/closed-cell goals stay reachable.
// passGrid (nullable <map>_path.json doc) adds paint avoidance: a closed
// ahead probe deflects onto a free flank. When surrounded (both flanks past
// giveup slope, or all three probes closed), the mover holds its flank and
// spirals out — taking flank A deterministically on first contact — pushing
// straight only after HILL_GIVEUP_ESCAPE of travel without escaping (closed
// ring) or for stateless callers. Never freezes.
export function sgbAvoidUphill(toLocal, rootY, sampleHeight, x, z, dx, dz, distToGoal, releaseDist, memory, out, passGrid = null) {
  const len = Math.hypot(dx, dz) || 1;
  const nx = dx / len;
  const nz = dz / len;
  out.x = nx;
  out.z = nz;
  const hasSample = typeof sampleHeight === 'function';
  if (!hasSample && !passGrid) return false;
  if (distToGoal < releaseDist) {
    if (memory) memory._avoidSide = 0;
    return false;
  }
  const px = x + nx * HILL_PROBE_DIST;
  const pz = z + nz * HILL_PROBE_DIST;
  const straightBlocked = sgbPassBlockedAt(passGrid, px, pz);
  let h0 = 0;
  let straightSlope = -Infinity;
  if (hasSample) {
    h0 = _surfY(toLocal, rootY, sampleHeight, x, z);
    straightSlope = (_surfY(toLocal, rootY, sampleHeight, px, pz) - h0) / HILL_PROBE_DIST;
  }
  if (!straightBlocked && straightSlope <= HILL_MAX_SLOPE) {
    if (memory) memory._avoidSide = 0;
    return false;
  }
  // Steep uphill and/or closed paint ahead: probe both flanks at +/-60
  // (rotation preserves unit length).
  const c = Math.cos(HILL_DEFLECT_RAD);
  const s = Math.sin(HILL_DEFLECT_RAD);
  const ax = nx * c - nz * s;
  const az = nx * s + nz * c;
  const bx = nx * c + nz * s;
  const bz = -nx * s + nz * c;
  const sa = hasSample
    ? (_surfY(toLocal, rootY, sampleHeight, x + ax * HILL_PROBE_DIST, z + az * HILL_PROBE_DIST) - h0) / HILL_PROBE_DIST
    : -Infinity;
  const sb = hasSample
    ? (_surfY(toLocal, rootY, sampleHeight, x + bx * HILL_PROBE_DIST, z + bz * HILL_PROBE_DIST) - h0) / HILL_PROBE_DIST
    : -Infinity;
  const blockA = sgbPassBlockedAt(passGrid, x + ax * HILL_PROBE_DIST, z + az * HILL_PROBE_DIST);
  const blockB = sgbPassBlockedAt(passGrid, x + bx * HILL_PROBE_DIST, z + bz * HILL_PROBE_DIST);
  const prev = memory ? memory._avoidSide || 0 : 0;
  const slopeGiveup = sa > HILL_GIVEUP_SLOPE && sb > HILL_GIVEUP_SLOPE;
  const paintGiveup = straightBlocked && blockA && blockB;
  if (slopeGiveup || paintGiveup) {
    // First contact (no flank held yet) still takes a deterministic flank:
    // going straight here would drill through wide zones/faces instead of
    // skirting them. Stateless callers (no memory) go straight.
    const side = prev !== 0 ? prev : -1;
    if (memory) {
      if (memory._avoidGx === undefined) {
        memory._avoidGx = x;
        memory._avoidGz = z;
      }
      const traveled = Math.hypot(x - memory._avoidGx, z - memory._avoidGz);
      if (traveled < HILL_GIVEUP_ESCAPE) {
        const keepA = side < 0;
        memory._avoidSide = side;
        out.x = keepA ? ax : bx;
        out.z = keepA ? az : bz;
        return true;
      }
      memory._avoidSide = 0;
      memory._avoidGx = undefined;
      memory._avoidGz = undefined;
    }
    return false;
  }
  if (memory) {
    memory._avoidGx = undefined;
    memory._avoidGz = undefined;
  }
  let pickA;
  if (prev < 0) pickA = sa <= sb + HILL_SIDE_STICK;
  else if (prev > 0) pickA = sa + HILL_SIDE_STICK < sb;
  else pickA = sa <= sb;
  if (straightBlocked && blockA !== blockB) pickA = !blockA;
  if (memory) memory._avoidSide = pickA ? -1 : 1;
  out.x = pickA ? ax : bx;
  out.z = pickA ? az : bz;
  return true;
}
