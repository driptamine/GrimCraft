// Model source toggle: GLB files from models/ vs procedural built-in meshes.
// Zero-dependency leaf module: safe to import from anywhere, including
// main-menu.js (no import cycle possible). Procedural mode reuses the exact
// same fallback branches the factories take when a GLB fails to load.

export const MODEL_SOURCE_GLB = 'glb';
export const MODEL_SOURCE_PROCEDURAL = 'procedural';
export const MODEL_SOURCE_STORAGE_KEY = 'grimcraft-models';

// Pure resolution (node-testable): explicit URL param wins, then the stored
// preference, then the default.
export function resolveModelSource({ query = '', stored = '' } = {}) {
  const q = String(query || '').toLowerCase();
  if (q === MODEL_SOURCE_PROCEDURAL || q === MODEL_SOURCE_GLB) return q;
  const s = String(stored || '').toLowerCase();
  if (s === MODEL_SOURCE_PROCEDURAL || s === MODEL_SOURCE_GLB) return s;
  return MODEL_SOURCE_GLB;
}

let _source = null;

function _readInputs() {
  let query = '';
  let stored = '';
  try {
    if (typeof window !== 'undefined' && window.location) {
      query = new URLSearchParams(window.location.search).get('models') || '';
    }
  } catch (_) { /* ignore malformed URLs */ }
  try {
    if (typeof localStorage !== 'undefined') {
      stored = localStorage.getItem(MODEL_SOURCE_STORAGE_KEY) || '';
    }
  } catch (_) { /* storage unavailable */ }
  return { query, stored };
}

export function modelSource() {
  if (!_source) {
    _source = resolveModelSource(_readInputs());
  }
  return _source;
}

export function setModelSource(value) {
  const next = value === MODEL_SOURCE_PROCEDURAL ? MODEL_SOURCE_PROCEDURAL : MODEL_SOURCE_GLB;
  _source = next;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(MODEL_SOURCE_STORAGE_KEY, next);
    }
  } catch (_) { /* storage unavailable */ }
  return next;
}

export function useProceduralModels() {
  return modelSource() === MODEL_SOURCE_PROCEDURAL;
}
