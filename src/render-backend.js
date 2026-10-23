/**
 * Pure render-backend selection logic (WebGL / WebGPU toggle).
 *
 * Deliberately free of DOM/three.js imports so it stays unit-testable in
 * node. scene.js owns the live renderer; game.js owns the async switch.
 */
export const BACKEND_WEBGL = 'webgl';
export const BACKEND_WEBGPU = 'webgpu';
export const BACKEND_STORAGE_KEY = 'grimcraft.renderBackend';

export function isWebGPUSupported(nav) {
  return !!nav?.gpu;
}

export function readStoredBackend(storage) {
  try {
    const value = storage?.getItem?.(BACKEND_STORAGE_KEY);
    return value === BACKEND_WEBGL || value === BACKEND_WEBGPU ? value : null;
  } catch (_) {
    return null;
  }
}

export function writeStoredBackend(storage, backend) {
  try {
    storage?.setItem?.(BACKEND_STORAGE_KEY, backend);
  } catch (_) {
    // Private mode / sandbox: persistence is best-effort.
  }
}

export function resolveBootBackend({ stored = null, supportsWebGPU = false } = {}) {
  if (stored === BACKEND_WEBGPU && supportsWebGPU) {
    return BACKEND_WEBGPU;
  }
  return BACKEND_WEBGL;
}

export function nextBackend(current, supportsWebGPU) {
  if (current === BACKEND_WEBGL && supportsWebGPU) {
    return BACKEND_WEBGPU;
  }
  return BACKEND_WEBGL;
}

export function backendButtonState({ backend, supportsWebGPU, switching, error = '' } = {}) {
  if (switching) {
    return { label: 'SWITCHING…', disabled: true, title: 'Switching renderer…' };
  }
  const failed = error ? ` — last switch failed: ${error}` : '';
  if (backend === BACKEND_WEBGPU) {
    return { label: 'WEBGPU', disabled: false, title: `Renderer: WebGPU — click to switch to WebGL${failed}` };
  }
  if (!supportsWebGPU) {
    return { label: 'WEBGL ONLY', disabled: true, title: 'Renderer: WebGL — WebGPU not supported by this browser' };
  }
  return { label: 'WEBGL', disabled: false, title: `Renderer: WebGL — click to switch to WebGPU${failed}` };
}
