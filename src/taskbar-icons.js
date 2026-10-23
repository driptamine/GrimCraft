/**
 * Selection-panel stat icons from assets/taskbar_icons (*.tga).
 *
 * Browsers cannot render .tga in an <img>, so each icon is parsed with the
 * shared parseTga reader and rasterized to a PNG data URL at boot, exactly
 * like the cursors (see cursors.js). Components read the cached URL with
 * taskbarIconUrl() and fall back to an emoji glyph until it is ready.
 */

import { parseTga } from './cursors.js';
import { bump } from './hud/store.js';

export const TASKBAR_ICON_FILES = {
  squadsize: 'icon_squadsize.tga',
  rangedamage: 'icon_rangedamage.tga',
  numberofupgrades: 'icon_numberofupgrades.tga',
  meleedamage: 'icon_meleedamage.tga',
};

const TASKBAR_DIR = '/assets/taskbar_icons';

// NOTE: call import.meta.glob unconditionally (see maps-menu.js) — vite
// replaces it statically at build time; in node the call throws and we fall
// back to an empty map.
let _taskbarUrlMap = {};
try {
  _taskbarUrlMap = import.meta.glob('/assets/taskbar_icons/*.tga', { as: 'url', eager: true });
} catch (_) {
  _taskbarUrlMap = {};
}

export function taskbarAssetUrl(file) {
  return _taskbarUrlMap[`${TASKBAR_DIR}/${file}`] || null;
}

const _urlCache = {};

export function taskbarIconUrl(name) {
  return _urlCache[name] || null;
}

export async function preloadTaskbarIcons() {
  if (typeof document === 'undefined') {
    return;
  }
  for (const [name, file] of Object.entries(TASKBAR_ICON_FILES)) {
    if (_urlCache[name]) {
      continue;
    }
    try {
      const url = taskbarAssetUrl(file);
      if (!url) {
        continue;
      }
      const res = await fetch(url);
      if (!res.ok) {
        continue;
      }
      const parsed = parseTga(await res.arrayBuffer());
      const canvas = document.createElement('canvas');
      canvas.width = parsed.width;
      canvas.height = parsed.height;
      const ctx = canvas.getContext('2d');
      ctx.putImageData(new ImageData(parsed.rgba, parsed.width, parsed.height), 0, 0);
      _urlCache[name] = canvas.toDataURL();
    } catch (err) {
      console.warn(`[taskbar-icons] ${file} failed to load, using fallback`, err);
    }
  }
  bump('hud');
}
