/**
 * External store powering the React HUD.
 *
 * The game still drives the HUD through imperative calls (updateHUD,
 * updateTopBar, updateMinimap, updateCaptureProgressBars). Those functions
 * now just bump a per-channel ticker here; React components subscribe to a
 * channel via useSyncExternalStore and read the live world/selection state
 * directly from scene.js during render.
 */

const tickers = { hud: 0, topbar: 0, minimap: 0, capture: 0 };
const listeners = { hud: new Set(), topbar: new Set(), minimap: new Set(), capture: new Set() };

export function bump(channel) {
  tickers[channel] = (tickers[channel] || 0) + 1;
  const set = listeners[channel];
  if (set) {
    set.forEach((cb) => cb());
  }
}

export function getTicker(channel) {
  return tickers[channel] || 0;
}

export function subscribeChannel(channel, cb) {
  let set = listeners[channel];
  if (!set) {
    set = listeners[channel] = new Set();
  }
  set.add(cb);
  return () => {
    if (listeners[channel]) {
      listeners[channel].delete(cb);
    }
  };
}

/**
 * Build-structure submenu toggle for the builder HUD. Previously a module
 * flag in hud.js; lives here so React components can read it.
 */
export let buildMenuOpen = false;

export function setBuildMenuOpen(value) {
  if (buildMenuOpen !== value) {
    buildMenuOpen = value;
    bump('hud');
  }
}

/**
 * Toggle: when ON, player infantry stops taking damage.
 */
export let infantryImmortal = false;

export function setInfantryImmortal(value) {
  if (infantryImmortal !== value) {
    infantryImmortal = value;
    bump('topbar');
  }
}

/**
 * Rolling FPS meter fed by the frame loop; TopBar reads getFps().
 * Recomputes over a fixed window (default 500ms) instead of per-frame
 * instantaneous values so the readout is stable.
 */
export function createFpsMeter(windowMs = 500) {
  const span = Math.max(1, windowMs);
  let frames = 0;
  let windowStart = null;
  let fps = 0;
  return {
    get fps() {
      return fps;
    },
    tick(nowMs) {
      if (windowStart === null) {
        windowStart = nowMs;
      }
      frames += 1;
      const elapsed = nowMs - windowStart;
      if (elapsed >= span) {
        fps = Math.round((frames * 1000) / elapsed);
        frames = 0;
        windowStart = nowMs;
      }
      return fps;
    },
  };
}

const _fpsMeter = createFpsMeter();

export function tickFps(nowMs) {
  return _fpsMeter.tick(nowMs);
}

export function getFps() {
  return _fpsMeter.fps;
}

// HUD refresh cadence: topbar/minimap/capture bars re-render every 3rd frame
// (~20Hz) instead of every frame. Numbers and bars don't need 60Hz, and each
// bump runs ECS queries plus a React re-render.
export function hudDue(frameNo) {
  return frameNo % 3 === 0;
}
