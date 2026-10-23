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