import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';

register('./node-esm-hooks.mjs', import.meta.url);
globalThis.window = {};
globalThis.document = { getElementById: () => null };

const { flashHitmarker } = await import('../src/input/markers.js');
const { playHitCrunch } = await import('../src/audio.js');

describe('hit feedback', () => {
  it('flashes the hitmarker X and hides it again', async () => {
    const el = { style: {} };
    const origGet = globalThis.document.getElementById;
    globalThis.document.getElementById = (id) => (id === 'fps-hitmarker' ? el : null);
    try {
      assert.equal(flashHitmarker(5), true);
      assert.equal(el.style.display, 'block');
      await new Promise((resolve) => setTimeout(resolve, 25));
      assert.equal(el.style.display, 'none');
    } finally {
      globalThis.document.getElementById = origGet;
    }
  });

  it('no-ops without a hitmarker element or audio context', () => {
    assert.equal(flashHitmarker(5), false);
    assert.equal(playHitCrunch(), false);
  });
});
