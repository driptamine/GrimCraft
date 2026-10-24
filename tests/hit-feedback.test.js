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

  it('generates the crunch noise buffer once and reuses it per shot', () => {
    let createBufferCalls = 0;
    const stubParam = () => ({ setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} });
    const stubNode = () => {
      const node = { start: () => {}, stop: () => {} };
      node.connect = () => node;
      return node;
    };
    class StubAudioContext {
      constructor() {
        this.sampleRate = 48000;
        this.currentTime = 0;
        this.destination = {};
        this.state = 'running';
      }
      createGain() {
        return { gain: stubParam(), connect: () => {} };
      }
      createBuffer(channels, len, rate) {
        createBufferCalls += 1;
        return { getChannelData: () => new Float32Array(len), sampleRate: rate };
      }
      createBufferSource() {
        return { ...stubNode(), set buffer(_) {} };
      }
      createBiquadFilter() {
        return { ...stubNode(), type: '', frequency: stubParam() };
      }
      createOscillator() {
        return { ...stubNode(), type: '', frequency: stubParam() };
      }
    }
    const origWindow = globalThis.window;
    globalThis.window = { AudioContext: StubAudioContext };
    try {
      assert.equal(playHitCrunch(), true);
      assert.equal(playHitCrunch(), true);
      assert.equal(createBufferCalls, 1);
    } finally {
      globalThis.window = origWindow;
    }
  });
});
