/**
 * HUD API bridge.
 *
 * The game code still drives the HUD through imperative calls:
 *   btn, updateHUD, updateTopBar, updateMinimap, updateCaptureProgressBars
 *
 * All of these now just bump the corresponding channel in ./hud/store.js.
 * The actual rendering is done by the React components in ./hud/, mounted
 * by ./hud/index.jsx into #topbar-root, #hud-root and #capBarsContainer.
 *
 * Keeping this module's exported names stable means game.js / input.js /
 * entities.js / systems.js / multiplayer.js don't need to change.
 */
import { bump } from './hud/store.js';

/**
 * Legacy button helper — no-op. React renders action buttons now.
 */
export function btn() {
  return null;
}

/**
 * Re-renders the main HUD (portrait, info, reinforce, actions, right panel).
 */
export function updateHUD() {
  bump('hud');
}

/**
 * Re-renders the top bar and refreshes the minimap (the old updateTopBar
 * delegated to updateMinimap too).
 */
export function updateTopBar() {
  bump('topbar');
  bump('minimap');
}

/**
 * Redraws the minimap canvas.
 */
export function updateMinimap() {
  bump('minimap');
}

/**
 * Repositions the 3D-projected capture progress bars.
 */
export function updateCaptureProgressBars() {
  bump('capture');
}
