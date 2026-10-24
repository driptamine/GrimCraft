// R2 image loader: HUD icons referenced as relative `assets/...` paths are
// fetched (CORS, same as .glb models) and served to <img> as blob URLs.
// Why not plain <img src>: cross-origin <img> requests are opaque
// (response.ok === false), so the service worker refuses to cache them and
// they re-download on every launch. Through fetch() they land in MODELS_CACHE
// like everything else from R2: download once, reuse offline.
// Pure fetch logic (node-testable fetch part aside); the React wrapper lives
// in hud/bits.jsx.
import { assetUrl } from './assets.js';

const _blobCache = new Map(); // resolved URL -> blob: URL
const _inflight = new Map(); // resolved URL -> Promise<string>

export function r2ImageUrl(src, fetchImpl = fetch) {
  const url = assetUrl(src);
  if (!url || typeof url !== 'string') {
    return Promise.resolve(src);
  }
  if (_blobCache.has(url)) {
    return Promise.resolve(_blobCache.get(url));
  }
  if (_inflight.has(url)) {
    return _inflight.get(url);
  }
  const pending = fetchImpl(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.blob();
    })
    .then((blob) => {
      const objectUrl = URL.createObjectURL(blob);
      _blobCache.set(url, objectUrl);
      _inflight.delete(url);
      return objectUrl;
    })
    .catch(() => {
      // Offline with nothing cached (or any failure): fall back to the raw
      // URL so behavior is no worse than a plain <img>.
      _inflight.delete(url);
      return url;
    });
  _inflight.set(url, pending);
  return pending;
}

export function _resetR2ImageCacheForTests() {
  _blobCache.clear();
  _inflight.clear();
}
