import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  classifyGPU, pixelRatioForTier, isQualityLevel, resolveQualityTier,
  nextQualityTier, qualityShadowsEnabled, qualityAntialiasEnabled,
  createDynamicResolution,
} from '../src/three-helpers.js';

describe('gpu quality tier', () => {
  it('classifies Intel integrated GPUs as low tier', () => {
    assert.equal(classifyGPU('Intel Iris Pro OpenGL Engine'), 'low');
    assert.equal(classifyGPU('Intel(R) HD Graphics 6000'), 'low');
    assert.equal(classifyGPU('Intel(R) UHD Graphics 630'), 'low');
  });

  it('keeps discrete and non-Intel GPUs on high tier', () => {
    assert.equal(classifyGPU('Intel Arc A770 Graphics'), 'high');
    assert.equal(classifyGPU('Apple M1 Pro'), 'high');
    assert.equal(classifyGPU('NVIDIA GeForce RTX 3060'), 'high');
    assert.equal(classifyGPU('AMD Radeon Pro 5600M'), 'high');
  });

  it('defaults unknown/empty renderer strings to high tier', () => {
    assert.equal(classifyGPU(''), 'high');
    assert.equal(classifyGPU(null), 'high');
    assert.equal(classifyGPU(undefined), 'high');
  });

  it('forces pixelRatio 1 on low tier regardless of devicePixelRatio', () => {
    assert.equal(pixelRatioForTier('low', 2), 1);
    assert.equal(pixelRatioForTier('low', 1), 1);
  });

  it('caps pixelRatio at 2 on high tier', () => {
    assert.equal(pixelRatioForTier('high', 2), 2);
    assert.equal(pixelRatioForTier('high', 3), 2);
    assert.equal(pixelRatioForTier('high', 1), 1);
  });
});

describe('render quality levels', () => {
  it('maps medium pixelRatio between low and high', () => {
    assert.equal(pixelRatioForTier('medium', 2), 1.5);
    assert.equal(pixelRatioForTier('medium', 3), 1.5);
    assert.equal(pixelRatioForTier('medium', 1), 1);
  });

  it('validates quality level names', () => {
    assert.equal(isQualityLevel('low'), true);
    assert.equal(isQualityLevel('medium'), true);
    assert.equal(isQualityLevel('HIGH'), true);
    assert.equal(isQualityLevel('auto'), false);
    assert.equal(isQualityLevel('banana'), false);
    assert.equal(isQualityLevel(''), false);
  });

  it('resolves query over stored over auto', () => {
    assert.equal(
      resolveQualityTier({ query: 'medium', stored: 'low', gpu: 'Intel Iris' }),
      'medium',
    );
    assert.equal(resolveQualityTier({ stored: 'high', gpu: 'Intel Iris' }), 'high');
    assert.equal(
      resolveQualityTier({ stored: 'medium', gpu: 'NVIDIA GeForce' }),
      'medium',
    );
  });

  it('auto-detects low/high from the GPU name, never medium', () => {
    assert.equal(resolveQualityTier({ gpu: 'Intel Iris Pro OpenGL Engine' }), 'low');
    assert.equal(resolveQualityTier({ gpu: 'NVIDIA GeForce RTX 3060' }), 'high');
    assert.equal(resolveQualityTier({}), 'high');
  });

  it('cycles low -> medium -> high -> low', () => {
    assert.equal(nextQualityTier('low'), 'medium');
    assert.equal(nextQualityTier('medium'), 'high');
    assert.equal(nextQualityTier('high'), 'low');
    assert.equal(nextQualityTier('banana'), 'low');
  });

  it('enables shadows and antialias on every tier except low', () => {
    for (const tier of ['medium', 'high']) {
      assert.equal(qualityShadowsEnabled(tier), true);
      assert.equal(qualityAntialiasEnabled(tier), true);
    }
    assert.equal(qualityShadowsEnabled('low'), false);
    assert.equal(qualityAntialiasEnabled('low'), false);
  });
});

describe('dynamic resolution', () => {
  it('starts at the tier cap and holds while healthy', () => {
    const dyn = createDynamicResolution(2);
    assert.equal(dyn.ratio(), 2);
    for (let i = 0; i < 400; i++) {
      assert.equal(dyn.tick(60), null);
    }
    assert.equal(dyn.ratio(), 2);
  });

  it('steps down after sustained slowness and never below 1', () => {
    const dyn = createDynamicResolution(2);
    assert.equal(dyn.tick(60), null);
    for (let i = 0; i < 59; i++) {
      dyn.tick(20);
    }
    assert.equal(dyn.tick(20), 1.5);
    assert.equal(dyn.ratio(), 1.5);
    for (let i = 0; i < 120; i++) {
      dyn.tick(10);
    }
    assert.equal(dyn.ratio(), 1);
  });

  it('steps back up after sustained headroom, never above the cap', () => {
    const dyn = createDynamicResolution(1.5);
    for (let i = 0; i < 60; i++) {
      dyn.tick(20);
    }
    assert.equal(dyn.ratio(), 1.25);
    for (let i = 0; i < 300; i++) {
      dyn.tick(60);
    }
    assert.equal(dyn.ratio(), 1.5);
    for (let i = 0; i < 600; i++) {
      dyn.tick(60);
    }
    assert.equal(dyn.ratio(), 1.5);
  });

  it('stays put in the hysteresis band', () => {
    const dyn = createDynamicResolution(2);
    for (let i = 0; i < 600; i++) {
      assert.equal(dyn.tick(45), null);
    }
    assert.equal(dyn.ratio(), 2);
  });
});
