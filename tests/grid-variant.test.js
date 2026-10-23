import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { register } from 'node:module';

register('./node-esm-hooks.mjs', import.meta.url);
globalThis.window = {};
globalThis.document = { getElementById: () => null };
const sceneMod = await import('../src/scene.js');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function fakeScene() {
  return {
    _gridMicroMesh: { visible: true },
    _gridZoomMesh: { visible: false },
    _gridMacroMeshes: [{ visible: true }, { visible: true }],
  };
}

describe('grid variants', () => {
  it('variant 1 shows classic micro lines, variant 2 the zoom-out cells', () => {
    const scene = fakeScene();
    sceneMod.__setSceneCameraForTests(scene, {});
    sceneMod.setGridVariant(1);
    assert.equal(sceneMod._gridVariant, 1);
    assert.equal(scene._gridMicroMesh.visible, true);
    assert.equal(scene._gridZoomMesh.visible, false);
    assert.ok(scene._gridMacroMeshes.every((m) => m.visible), 'macro ribbons stay in both variants');
    sceneMod.setGridVariant(2);
    assert.equal(sceneMod._gridVariant, 2);
    assert.equal(scene._gridMicroMesh.visible, false);
    assert.equal(scene._gridZoomMesh.visible, true);
    assert.ok(scene._gridMacroMeshes.every((m) => m.visible));
  });

  it('toggleGridVariant cycles STD -> FINE -> NO-GRID -> STD', () => {
    const scene = fakeScene();
    sceneMod.__setSceneCameraForTests(scene, {});
    sceneMod.setGridVariant(1);
    sceneMod.toggleGridVariant();
    assert.equal(sceneMod._gridVariant, 2);
    assert.equal(scene._gridZoomMesh.visible, true);
    sceneMod.toggleGridVariant();
    assert.equal(sceneMod._gridVariant, 3);
    assert.equal(scene._gridMicroMesh.visible, false);
    assert.equal(scene._gridZoomMesh.visible, false);
    sceneMod.toggleGridVariant();
    assert.equal(sceneMod._gridVariant, 1);
    assert.equal(scene._gridMicroMesh.visible, true);
  });

  it('variant 3 hides micro, zoom and macro meshes', () => {
    const scene = fakeScene();
    sceneMod.__setSceneCameraForTests(scene, {});
    sceneMod.setGridVariant(3);
    assert.equal(sceneMod._gridVariant, 3);
    assert.equal(scene._gridMicroMesh.visible, false);
    assert.equal(scene._gridZoomMesh.visible, false);
    assert.ok(scene._gridMacroMeshes.every((m) => !m.visible), 'macro ribbons hidden in no-grid');
    sceneMod.toggleGrid(); // off
    sceneMod.toggleGrid(); // on: variant preserved, still hidden
    assert.equal(sceneMod._gridVariant, 3);
    assert.ok(scene._gridMacroMeshes.every((m) => !m.visible));
  });

  it('top bar labels the third mode NO-GRID', () => {
    const src = fs.readFileSync(path.join(root, 'src/hud/components/TopBar.jsx'), 'utf8');
    assert.ok(src.includes("_gridVariant === 3 ? '▦ GRID: NO-GRID'"), 'no-grid label for variant 3');
  });

  it('no-grid is the default variant', () => {
    const src = fs.readFileSync(path.join(root, 'src/scene.js'), 'utf8');
    assert.match(src, /export let _gridVariant = 3;/);
  });

  it('setGridVariant clamps bad input to variant 1', () => {
    const scene = fakeScene();
    sceneMod.__setSceneCameraForTests(scene, {});
    sceneMod.setGridVariant(99);
    assert.equal(sceneMod._gridVariant, 1);
    assert.equal(scene._gridMicroMesh.visible, true);
  });

  it('hide/show preserves the active variant', () => {
    const scene = fakeScene();
    sceneMod.__setSceneCameraForTests(scene, {});
    sceneMod.setGridVariant(2);
    sceneMod.toggleGrid(); // off
    assert.equal(scene._gridZoomMesh.visible, false);
    assert.ok(scene._gridMacroMeshes.every((m) => !m.visible));
    sceneMod.toggleGrid(); // on
    assert.equal(scene._gridZoomMesh.visible, true);
    assert.equal(scene._gridMicroMesh.visible, false);
    assert.ok(scene._gridMacroMeshes.every((m) => m.visible));
  });
});
