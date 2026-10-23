import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';

register('./node-esm-hooks.mjs', import.meta.url);
globalThis.document = { getElementById: () => null, querySelector: () => null, querySelectorAll: () => [] };
const { areSgbDecalsVisible, toggleSgbDecals } = await import('../src/sgb-decals.js');

describe('sgb decals master toggle', () => {
  it('starts shown, toggle flips it back and forth', () => {
    assert.equal(areSgbDecalsVisible(), true);
    toggleSgbDecals();
    assert.equal(areSgbDecalsVisible(), false);
    toggleSgbDecals();
    assert.equal(areSgbDecalsVisible(), true);
  });
});
