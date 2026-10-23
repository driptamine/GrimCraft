import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  resolveModelSource, setModelSource, useProceduralModels,
  MODEL_SOURCE_GLB, MODEL_SOURCE_PROCEDURAL,
} from '../src/model-source.js';

describe('model source toggle', () => {
  it('defaults to GLB when nothing is set', () => {
    assert.equal(resolveModelSource(), MODEL_SOURCE_GLB);
    assert.equal(resolveModelSource({}), MODEL_SOURCE_GLB);
    assert.equal(resolveModelSource({ query: '', stored: '' }), MODEL_SOURCE_GLB);
  });

  it('prefers the stored value over the default', () => {
    assert.equal(resolveModelSource({ stored: 'procedural' }), MODEL_SOURCE_PROCEDURAL);
    assert.equal(resolveModelSource({ stored: 'glb' }), MODEL_SOURCE_GLB);
  });

  it('lets the URL query override the stored value', () => {
    assert.equal(
      resolveModelSource({ query: 'procedural', stored: 'glb' }),
      MODEL_SOURCE_PROCEDURAL,
    );
    assert.equal(
      resolveModelSource({ query: 'glb', stored: 'procedural' }),
      MODEL_SOURCE_GLB,
    );
  });

  it('ignores unknown values and falls back to GLB', () => {
    assert.equal(resolveModelSource({ query: 'banana' }), MODEL_SOURCE_GLB);
    assert.equal(resolveModelSource({ stored: 'banana' }), MODEL_SOURCE_GLB);
  });

  it('matches values case-insensitively', () => {
    assert.equal(resolveModelSource({ query: 'Procedural' }), MODEL_SOURCE_PROCEDURAL);
    assert.equal(resolveModelSource({ stored: 'GLB' }), MODEL_SOURCE_GLB);
  });

  it('setModelSource validates and flips useProceduralModels', () => {
    assert.equal(setModelSource('procedural'), MODEL_SOURCE_PROCEDURAL);
    assert.equal(useProceduralModels(), true);
    assert.equal(setModelSource('glb'), MODEL_SOURCE_GLB);
    assert.equal(useProceduralModels(), false);
    assert.equal(setModelSource('banana'), MODEL_SOURCE_GLB);
    assert.equal(useProceduralModels(), false);
  });
});
