const MODEL_BASE = (import.meta.env.VITE_MODEL_BASE || '').replace(/\/+$/, '');

export function modelUrl(path) {
  if (!path) {
    return path;
  }
  if (MODEL_BASE) {
    const clean = String(path).replace(/^\/+/, '');
    return `${MODEL_BASE}/${clean}`;
  }
  return path;
}

// UI images (HUD portraits, build-menu and command icons) are referenced as
// relative `assets/...` paths and are NOT bundled by vite (no glob covers
// them), so production serves them from R2 while dev keeps local files.
const ASSET_BASE = (import.meta.env.VITE_ASSET_BASE || '').replace(/\/+$/, '');

export function assetUrl(path) {
  if (!path || typeof path !== 'string' || !path.includes('/')) {
    return path;
  }
  if (/^(https?:|data:|blob:)/.test(path) || path.startsWith('/') || !ASSET_BASE) {
    return path;
  }
  return `${ASSET_BASE}/${path.replace(/^\/+/, '')}`;
}