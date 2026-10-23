import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import * as THREE from 'three';
import { setDefaultScene } from '../src/three-helpers.js';

register('./node-esm-hooks.mjs', import.meta.url);
globalThis.document = { getElementById: () => null };
const { makeHpBar, updateHpBar } = await import('../src/meshes.js');

const WIDTH = 4;

function edges(bar) {
  const half = (WIDTH * bar._fg.scale.x) / 2;
  return { left: bar._fg.position.x - half, right: bar._fg.position.x + half };
}

describe('hp/progress bars', () => {
  it('updateHpBar anchors the full end at +X (screen-left) and depletes right-to-left visually', () => {
    const scene = new THREE.Scene();
    setDefaultScene(scene);
    const bar = makeHpBar(WIDTH, 'blue');

    updateHpBar(bar, 1);
    assert.equal(bar._fg.scale.x, 1);
    assert.equal(bar._fg.position.x, 0);
    assert.deepEqual(edges(bar), { left: -WIDTH / 2, right: WIDTH / 2 });

    // Half health: right edge (+X, screen-left) stays pinned, left end retreats.
    updateHpBar(bar, 0.5);
    assert.equal(bar._fg.scale.x, 0.5);
    assert.ok(bar._fg.position.x > 0, `fg shifts toward +X, got ${bar._fg.position.x}`);
    const half = edges(bar);
    assert.equal(half.right, WIDTH / 2);
    assert.equal(half.left, 0);

    updateHpBar(bar, 0.25);
    assert.equal(edges(bar).right, WIDTH / 2);

    // Empty: sliver survives at the anchored end instead of vanishing.
    updateHpBar(bar, 0);
    assert.equal(bar._fg.scale.x, 0.001);
    assert.equal(bar._fg.position.x, WIDTH / 2);
  });
});
