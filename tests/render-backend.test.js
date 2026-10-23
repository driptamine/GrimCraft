import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  BACKEND_STORAGE_KEY,
  isWebGPUSupported,
  readStoredBackend,
  writeStoredBackend,
  resolveBootBackend,
  nextBackend,
  backendButtonState,
} from '../src/render-backend.js';

function memStorage(initial = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => { map.set(key, String(value)); },
  };
}

describe('render backend selection', () => {
  it('detects WebGPU support from navigator', () => {
    assert.equal(isWebGPUSupported(undefined), false);
    assert.equal(isWebGPUSupported(null), false);
    assert.equal(isWebGPUSupported({}), false);
    assert.equal(isWebGPUSupported({ gpu: {} }), true);
  });

  it('reads and writes the stored backend defensively', () => {
    assert.equal(readStoredBackend(memStorage({ [BACKEND_STORAGE_KEY]: 'webgpu' })), 'webgpu');
    assert.equal(readStoredBackend(memStorage({})), null);
    assert.equal(readStoredBackend(memStorage({ [BACKEND_STORAGE_KEY]: 'vulkan' })), null);
    assert.equal(readStoredBackend(undefined), null);
    assert.equal(readStoredBackend({ getItem() { throw new Error('denied'); } }), null);
    const storage = memStorage();
    writeStoredBackend(storage, 'webgpu');
    assert.equal(readStoredBackend(storage), 'webgpu');
    writeStoredBackend({ setItem() { throw new Error('denied'); } }, 'webgl');
    writeStoredBackend(undefined, 'webgl');
  });

  it('boots the stored backend only when supported', () => {
    assert.equal(resolveBootBackend({ stored: 'webgpu', supportsWebGPU: true }), 'webgpu');
    assert.equal(resolveBootBackend({ stored: 'webgpu', supportsWebGPU: false }), 'webgl');
    assert.equal(resolveBootBackend({ stored: 'webgl', supportsWebGPU: true }), 'webgl');
    assert.equal(resolveBootBackend({ stored: null, supportsWebGPU: true }), 'webgl');
    assert.equal(resolveBootBackend({}), 'webgl');
    assert.equal(resolveBootBackend(), 'webgl');
  });

  it('toggles between backends, never to unsupported WebGPU', () => {
    assert.equal(nextBackend('webgl', true), 'webgpu');
    assert.equal(nextBackend('webgl', false), 'webgl');
    assert.equal(nextBackend('webgpu', true), 'webgl');
    assert.equal(nextBackend('webgpu', false), 'webgl');
  });

  it('derives button label, disabled and title', () => {
    assert.deepEqual(
      backendButtonState({ backend: 'webgl', supportsWebGPU: true, switching: false, error: '' }),
      { label: 'WEBGL', disabled: false, title: 'Renderer: WebGL — click to switch to WebGPU' },
    );
    const gpu = backendButtonState({ backend: 'webgpu', supportsWebGPU: true, switching: false, error: '' });
    assert.equal(gpu.label, 'WEBGPU');
    assert.equal(gpu.disabled, false);
    const busy = backendButtonState({ backend: 'webgl', supportsWebGPU: true, switching: true, error: '' });
    assert.equal(busy.label, 'SWITCHING…');
    assert.equal(busy.disabled, true);
    const unsupported = backendButtonState({ backend: 'webgl', supportsWebGPU: false, switching: false, error: '' });
    assert.equal(unsupported.label, 'WEBGL ONLY');
    assert.equal(unsupported.disabled, true);
    const failed = backendButtonState({ backend: 'webgl', supportsWebGPU: true, switching: false, error: 'no adapter' });
    assert.match(failed.title, /no adapter/);
  });
});
