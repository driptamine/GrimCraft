// Pure per-decal world-size mapping for SGB decals. No engine imports so
// plain `node --test` can cover it (sgb-decals.js itself needs Vite/DOM).
//
// The SGB DATAENTY chunk stores a per-decal `size` float (~0.02–0.11).
// Chaos taint keeps the legacy flat size byte-for-byte — it renders as
// huge ground sheets and must not change. Every other decal maps
// proportionally, with the same calibration as the layout-driven path
// (size 0.05 ≈ 25 world units at the default decal scale 6).
const CHAOS_MATCH = 'chaos';

export function isChaosDecal(path) {
  return String(path || '').includes(CHAOS_MATCH);
}

export const ALVARUS_DECAL_STORE = '/maps/6p_alvarus/decals/';

// Ordered decal texture stores for a map key (an .sgb path like
// 'maps/6p_parmenie/6p_parmenie.sgb', or anything else): the map's own
// decals/ dir first, then the alvarus store, which doubles as the shared
// biome-asset pool — refs are global art/ paths, so a shared file is the
// same asset on any map.
// Stable stacking for overlapping decals. Without it three.js re-sorts
// the 324 transparent sheets by origin depth every frame and overlaps swap
// draw order during any camera motion = flicker. Ground stain first, mid
// rubble, crater details on top.
export function decalLayer(path) {
  if (isChaosDecal(path)) return 0;
  if (String(path || '').includes('crater')) return 2;
  return 1;
}

export function decalStoreDirs(mapKey) {
  const dirs = [];
  const m = String(mapKey || '').match(/maps\/([^/]+)/);
  if (m && m[1] !== '6p_alvarus') dirs.push(`/maps/${m[1]}/decals/`);
  dirs.push(ALVARUS_DECAL_STORE);
  return dirs;
}

export function decalBaseSize(path, sizeRaw) {
  if (isChaosDecal(path)) {
    return Math.max(0.5, sizeRaw) / 0.05;
  }
  return sizeRaw * 1000 / 12;
}

// Flat ground orientation for a decal plane (PlaneGeometry faces +Z).
// Under three.js Euler XYZ composition (M = Rx·Ry·Rz) the yaw MUST be the
// Z component: Rz spins the quad in its own plane first, then Rx(-90°)
// lays it flat. Yaw in Y tilts the plane (normal becomes (sinψ, cosψ, 0))
// and steep angles stick the decal into the sky — see chaos_taint_02.
export function decalFlatRotation(angle) {
  const a = Number(angle);
  return { x: -Math.PI / 2, y: 0, z: (Number.isFinite(a) ? a : 0) + Math.PI };
}

// Terrain drape for a decal-local vertex. The decal mesh transform is
// M = T·Rx(-90°)·Rz(yaw)·S, so a local point maps to:
//   worldX = centerX + (lx*scaleX)*cos(yaw) - (ly*scaleY)*sin(yaw)
//   worldZ = centerZ - ((lx*scaleX)*sin(yaw) + (ly*scaleY)*cos(yaw))
// Local +Z maps to world +Y, hence the returned local Z is simply the
// terrain height relative to the decal center plus the lift.
export function drapeDecalLocalZ(lx, ly, { scaleX, scaleY, yaw, centerX, centerZ, centerH, sampleHeight, lift = 0.08 } = {}) {
  const vx = lx * scaleX;
  const vy = ly * scaleY;
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);
  const worldX = centerX + vx * c - vy * s;
  const worldZ = centerZ - (vx * s + vy * c);
  return sampleHeight(worldX, worldZ) - centerH + lift;
}
