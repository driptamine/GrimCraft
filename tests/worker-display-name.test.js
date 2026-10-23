import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';

register('./node-esm-hooks.mjs', import.meta.url);
globalThis.document = { getElementById: () => null };
const { workerDisplayName } = await import('../src/hud/data.js');

describe('worker display name', () => {
  it('shows the faction worker name, chaos builder is Heretic', () => {
    assert.equal(workerDisplayName('chaos'), 'HERETIC');
    assert.equal(workerDisplayName('orks'), 'GROTS');
    assert.equal(workerDisplayName('ig'), 'TECH PRIEST ENGINSEER');
    assert.equal(workerDisplayName('necrons'), 'BUILDER SCARAB');
    assert.equal(workerDisplayName('space marines'), 'SERVITOR');
    assert.equal(workerDisplayName('eldar'), 'BONESINGER');
    assert.equal(workerDisplayName('tau'), 'EARTH CASTE BUILDER');
  });

  it('falls back to BUILDER for unknown factions', () => {
    assert.equal(workerDisplayName('bogus'), 'BUILDER');
    assert.equal(workerDisplayName(undefined), 'BUILDER');
    assert.equal(workerDisplayName(null), 'BUILDER');
  });
});
