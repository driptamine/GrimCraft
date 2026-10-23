// Pure camera-orbit parameter helpers — no DOM, no three.js, safe for node tests.
// The camera is an orbit rig: position is derived from alpha (yaw, rad),
// beta (pitch from +Y, rad), radius (distance) and target (Vector3 look point).
// The panel shows degrees; these helpers convert and clamp against live limits.

export const RAD2DEG = 180 / Math.PI;
export const DEG2RAD = Math.PI / 180;

// Slider span for target Y (world up). Kept wide enough for SGB relief;
// pan input resets target.y to 0 (see tickCamera), the slider re-applies after.
export const TARGET_Y_MIN = -10;
export const TARGET_Y_MAX = 60;

export function radToDeg(rad) {
  return rad * RAD2DEG;
}

export function degToRad(deg) {
  return deg * DEG2RAD;
}

// Normalize any yaw angle to [0, 360) degrees for the slider.
export function normAlphaDeg(alphaRad) {
  const deg = radToDeg(alphaRad) % 360;
  return deg < 0 ? deg + 360 : deg;
}

function num(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

// Clamp a beta value (radians) to the camera's live pitch limits.
export function clampBetaRad(betaRad, cam) {
  const lo = num(cam?.lowerBetaLimit, 0.15);
  const hi = num(cam?.upperBetaLimit, 1.38);
  return Math.max(lo, Math.min(hi, num(betaRad, lo)));
}

// Clamp a radius value to the camera's live zoom limits.
export function clampRadius(radius, cam) {
  const lo = num(cam?.lowerRadiusLimit, 6);
  const hi = num(cam?.upperRadiusLimit, 800);
  return Math.max(lo, Math.min(hi, num(radius, lo)));
}

// Clamp a target X/Z value to the live pan bounds.
export function clampTargetXZ(value, panBound) {
  const half = Math.max(0, num(panBound, 0));
  return Math.max(-half, Math.min(half, num(value, 0)));
}

export function clampTargetY(value) {
  return Math.max(TARGET_Y_MIN, Math.min(TARGET_Y_MAX, num(value, 0)));
}
