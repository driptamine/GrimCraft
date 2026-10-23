// Pure SGB surface helpers. No engine imports so plain `node --test` can
// cover them: the caller supplies a world->local mapper, the terrain root Y
// offset and the bilinear height sampler.
//
// Strategic points spawn at y=0 (flat gameplay plane) while the rendered
// SGB surface sits at sampleHeight+rootY (alvarus: -0.1..+7 at the points),
// so hill points bury 3-7 units deep and read as "hidden by decals" — the
// decal sheets on the bump are just the visible covering layer. A fixed
// lift cannot work (burial varies per point); each point seats onto the
// max surface height under its own footprint instead.

// Half-width of the point/relic base taps (models are ~7 wide).
export const POINT_SNAP_HALF = 3.2;
// Resting lift: clears the +0.08 decal sheets without a visible float.
export const POINT_SNAP_LIFT = 0.15;

const _tap = { x: 0, z: 0 };

// World Y for a model base at world (x, z): max rendered surface height
// over the center + 4 footprint corners, plus the resting lift.
// toLocal(tx, tz, out) maps world taps into terrain-local coords (handles
// the root yaw/mirror); sampleHeight(lx, lz) is the local heightfield;
// rootY is the terrain root offset. Y is preserved by yaw/mirror, so the
// rendered height is sample + rootY.
//
// Steering avoidance moved to pathfinding/avoid.js; re-exported here so
// existing importers keep working.
export {
  PASS_OPEN,
  sgbPassBlockedAt,
  HILL_MAX_SLOPE,
  HILL_PROBE_DIST,
  HILL_RELEASE_DIST,
  HILL_SLOT_RELEASE_DIST,
  HILL_DEFLECT_RAD,
  HILL_SIDE_STICK,
  HILL_GIVEUP_SLOPE,
  HILL_GIVEUP_ESCAPE,
  sgbAvoidUphill,
} from '../pathfinding/avoid.js';

// Feet height at world (x, z): center-tap surface + rootY. 0 without terrain
// (flat maps keep the exact old behavior).
export function sgbGroundY(toLocal, rootY, sampleHeight, x, z) {
  if (typeof sampleHeight !== 'function') return 0;
  const local = toLocal(x, z, _tap);
  return sampleHeight(local.x, local.z) + rootY;
}

export function sgbSurfaceSnapY(toLocal, rootY, sampleHeight, x, z) {
  const taps = [
    [x, z],
    [x - POINT_SNAP_HALF, z - POINT_SNAP_HALF],
    [x + POINT_SNAP_HALF, z - POINT_SNAP_HALF],
    [x - POINT_SNAP_HALF, z + POINT_SNAP_HALF],
    [x + POINT_SNAP_HALF, z + POINT_SNAP_HALF],
  ];
  let max = -Infinity;
  for (const [tx, tz] of taps) {
    const local = toLocal(tx, tz, _tap);
    const h = sampleHeight(local.x, local.z) + rootY;
    if (h > max) max = h;
  }
  return max + POINT_SNAP_LIFT;
}
