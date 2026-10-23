import * as THREE from 'three';

// Build-ghost placement math. Kept free of DOM/scene singletons so it stays
// unit-testable in node. The ghost always sits at y=0, so intersecting the
// mouse ray with the y=0 math plane is O(1) and equivalent in placement to a
// full-scene ground raycast (whose y the caller discards anyway).
const _plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const _raycaster = new THREE.Raycaster();

export function screenToNDC(sx, sy, rect, out) {
  out.set(
    ((sx - rect.left) / rect.width) * 2 - 1,
    -((sy - rect.top) / rect.height) * 2 + 1,
  );
  return out;
}

// Returns `out` (a point on the y=0 plane) or null when the ray is parallel
// to the plane or points away from it.
export function intersectGroundPlane(ndc, camera, out) {
  _raycaster.setFromCamera(ndc, camera);
  return _raycaster.ray.intersectPlane(_plane, out) ? out : null;
}

// Clamps x/z into the playable square; writes into `out` ({x, z}).
export function clampGhostPos(x, z, bounds, out, margin = 4) {
  const lo = -bounds + margin;
  const hi = bounds - margin;
  out.x = Math.max(lo, Math.min(hi, x));
  out.z = Math.max(lo, Math.min(hi, z));
  return out;
}
