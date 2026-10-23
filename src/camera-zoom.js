/**
 * Camera zoom math. Pure, no engine imports.
 *
 * Wheel zoom is multiplicative so one notch moves the same relative distance
 * at any radius; the result is clamped to the active radius limits.
 */
export const MIN_ZOOM_RADIUS = 6;
export const MAX_ZOOM_RADIUS = 800;
export const DEFAULT_CAMERA_RADIUS = 55;
// Default orbit orientation, stored in radians (Backspace reset view).
export const DEFAULT_CAMERA_ALPHA = (315 * Math.PI) / 180;
export const DEFAULT_CAMERA_BETA = (50 * Math.PI) / 180;
const WHEEL_STEP = 1.0012;

export function applyZoom(radius, deltaY, min = MIN_ZOOM_RADIUS, max = MAX_ZOOM_RADIUS) {
  // Reversed: scroll down zooms in, scroll up zooms out.
  const next = radius * Math.pow(WHEEL_STEP, -deltaY);
  return Math.max(min, Math.min(max, next));
}
