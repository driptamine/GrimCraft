/**
 * Custom cursors from assets/cursor_icons (*.tga).
 *
 * Browsers cannot use .tga as a CSS cursor, so each icon is parsed and
 * rasterized to a PNG data URL at boot, then applied via canvas/body style.
 * parseTga + resolveCursor are pure (node-tested); the DOM/fetch parts run
 * only in the browser.
 */

export const CURSOR_FILES = {
  default: 'default.tga',
  capture: 'modal_capturepoint.tga',
  repair: 'modal_repair.tga',
  teleport: 'modal_teleport.tga',
  droppod: 'modal_droppod.tga',
  load: 'modal_load.tga',
};

const CURSOR_DIR = '/assets/cursor_icons';

// NOTE: call import.meta.glob unconditionally (see maps-menu.js) — vite
// replaces it statically at build time; in node the call throws and we fall
// back to an empty map.
let _cursorUrlMap: Record<string, string> = {};
try {
  _cursorUrlMap = import.meta.glob('/assets/cursor_icons/*.tga', { as: 'url', eager: true });
} catch (_) {
  _cursorUrlMap = {};
}

export function cursorAssetUrl(file: string): string | null {
  return _cursorUrlMap[`${CURSOR_DIR}/${file}`] || null;
}

// Minimal TGA reader: uncompressed truecolor (type 2), 24/32 bpp.
// Returns top-down RGBA bytes regardless of the file's origin flag.
export function parseTga(buffer: ArrayBuffer | Uint8Array): { width: number; height: number; rgba: Uint8ClampedArray<ArrayBuffer> } {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  if (bytes.length < 18) {
    throw new Error('tga too short');
  }
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const idLength = view.getUint8(0);
  const colorMapType = view.getUint8(1);
  const imageType = view.getUint8(2);
  const width = view.getUint16(12, true);
  const height = view.getUint16(14, true);
  const bpp = view.getUint8(16);
  const descriptor = view.getUint8(17);
  if (imageType !== 2 || colorMapType !== 0) {
    throw new Error(`unsupported tga type=${imageType} colormap=${colorMapType}`);
  }
  if (bpp !== 24 && bpp !== 32) {
    throw new Error(`unsupported tga bpp=${bpp}`);
  }
  const channels = bpp / 8;
  let offset = 18 + idLength;
  const rgba = new Uint8ClampedArray(width * height * 4);
  const topDown = (descriptor & 0x20) !== 0;
  for (let row = 0; row < height; row++) {
    const dstRow = topDown ? row : height - 1 - row;
    for (let col = 0; col < width; col++) {
      const src = offset + (row * width + col) * channels;
      const dst = (dstRow * width + col) * 4;
      rgba[dst] = bytes[src + 2];
      rgba[dst + 1] = bytes[src + 1];
      rgba[dst + 2] = bytes[src];
      rgba[dst + 3] = channels === 4 ? bytes[src + 3] : 255;
    }
  }
  return { width, height, rgba };
}

// Flat XZ proximity check: is the ground point (x, z) inside the hover
// circle around (cx, cz)? Pure (node-tested); drives the capture cursor
// when the cursor navigates into a point's POINT_HOVER_RADIUS.
export function withinHoverRadius(x: number, z: number, cx: number, cz: number, radius: number): boolean {
  const dx = x - cx;
  const dz = z - cz;
  return dx * dx + dz * dz <= radius * radius;
}

export interface HoverState {
  kind: string;
  damaged?: boolean;
}

// Hover -> cursor name. `hover` is null or { kind, damaged? } with kind one
// of 'sp' | 'repairable' | 'loadable'. Returns null when the active mode owns
// the cursor (crosshair) and must not be overridden.
export function resolveCursor({ modal = null, buildMode = null, pendingCommand = null, hover = null, infantrySelected = false }: {
  modal?: string | null;
  buildMode?: unknown;
  pendingCommand?: string | null;
  hover?: HoverState | null;
  infantrySelected?: boolean;
} = {}): string | null {
  if (modal && CURSOR_FILES[modal as keyof typeof CURSOR_FILES]) {
    return modal;
  }
  if (buildMode) {
    return null;
  }
  if (pendingCommand === 'repair') {
    return hover?.kind === 'repairable' && hover.damaged ? 'repair' : null;
  }
  if (pendingCommand) {
    return null;
  }
  if (!hover) {
    return 'default';
  }
  if (hover.kind === 'sp') {
    return 'capture';
  }
  if (hover.kind === 'loadable' && infantrySelected) {
    return 'load';
  }
  return 'default';
}

const _cssCache: Record<string, string> = {};

function _rasterize(name: string, parsed: { width: number; height: number; rgba: Uint8ClampedArray<ArrayBuffer> }): void {
  const canvas = document.createElement('canvas');
  canvas.width = parsed.width;
  canvas.height = parsed.height;
  const ctx = canvas.getContext('2d')!;
  ctx.putImageData(new ImageData(parsed.rgba, parsed.width, parsed.height), 0, 0);
  // DoW cursor hotspots are all 0,0 (see cursorlist.lua).
  _cssCache[name] = `url("${canvas.toDataURL()}") 0 0`;
}

export function cursorCss(name: string, fallback = 'auto'): string {
  return _cssCache[name] ? `${_cssCache[name]}, ${fallback}` : fallback;
}

export async function preloadCursors(): Promise<void> {
  for (const [name, file] of Object.entries(CURSOR_FILES)) {
    if (_cssCache[name]) {
      continue;
    }
    try {
      const url = cursorAssetUrl(file);
      if (!url) {
        continue;
      }
      const res = await fetch(url);
      if (!res.ok) {
        continue;
      }
      _rasterize(name, parseTga(await res.arrayBuffer()));
    } catch (err) {
      console.warn(`[cursors] ${file} failed to load, using fallback`, err);
    }
  }
  if (_cssCache.default && typeof document !== 'undefined') {
    document.body.style.cursor = cursorCss('default', 'default');
  }
}

// Modal override for command modes without a world-hover trigger
// (teleport/jump and drop-pod targeting, once those abilities land).
let _modalCursor: string | null = null;

export function setModalCursor(name: string | null): void {
  if (name !== null && !CURSOR_FILES[name as keyof typeof CURSOR_FILES]) {
    console.warn(`[cursors] unknown modal cursor ${name}`);
    return;
  }
  _modalCursor = name;
}

export function getModalCursor(): string | null {
  return _modalCursor;
}
