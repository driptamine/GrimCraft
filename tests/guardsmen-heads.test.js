import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import * as THREE from 'three';

register('./node-esm-hooks.mjs', import.meta.url);
globalThis.window = {};
globalThis.document = { getElementById: () => null };
const sceneMod = await import('../src/scene.js');
const headlessScene = new THREE.Scene();
headlessScene._registerShadows = () => {};
sceneMod.__setSceneCameraForTests(headlessScene, { target: new THREE.Vector3() });
const { applyGuardsmanHead } = await import('../src/meshes/soldiers.js');

function guardsmanHeads() {
  const root = new THREE.Group();
  root.name = 'soldier_clone';
  for (let i = 1; i <= 4; i++) {
    const head = new THREE.Group();
    head.name = `guardsmen_head0${i}`;
    head.visible = false;
    root.add(head);
  }
  const body = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial());
  body.name = 'guard_body';
  root.add(body);
  return root;
}

function visibleHeads(root) {
  const out = [];
  root.traverse((child) => {
    if (/^guardsmen_head0[1-4]$/.test(child.name) && child.visible) out.push(child.name);
  });
  return out;
}

describe('guardsmen head variety', () => {
  it('shows exactly one head, stable per soldier id', () => {
    for (let id = 0; id < 8; id++) {
      const root = guardsmanHeads();
      const pick = applyGuardsmanHead(root, id);
      assert.equal(pick, id % 4);
      assert.deepEqual(visibleHeads(root), [`guardsmen_head0${(id % 4) + 1}`]);
    }
    // Same id twice: same head (reinforce/upgrades keep it).
    const a = guardsmanHeads();
    const b = guardsmanHeads();
    assert.equal(applyGuardsmanHead(a, 5), applyGuardsmanHead(b, 5));
  });

  it('cycles without an id and ignores headless hierarchies', () => {
    const picks = new Set();
    for (let i = 0; i < 4; i++) picks.add(applyGuardsmanHead(guardsmanHeads(), undefined));
    assert.equal(picks.size, 4);
    const plain = new THREE.Group();
    assert.equal(applyGuardsmanHead(plain, 3), -1);
  });
});
