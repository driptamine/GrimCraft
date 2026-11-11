import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import * as THREE from 'three';
import { World } from '../src/core/ecs.js';
import {
  PLASMA_CLOUD_PUFF_COUNT, PLASMA_CLOUD_PUFF_SIZES, PLASMA_CLOUD_PUFF_SPREAD,
  plasmaCloudTuning, resetPlasmaCloudTuning,
} from '../src/fx/plasma-cloud-puff.js';
import * as puffFx from '../src/fx/plasma-cloud-puff.js';
import * as blasterFx from '../src/fx/plasma-cloud-blaster.js';
import * as puffPreview from '../src/render/plasma-puff-preview.js';

function element(tag = 'div') {
  return {
    tag, style: {}, children: [], listeners: {}, parent: null, dataset: {},
    textContent: '', type: '', value: '', min: '', max: '', step: '', id: '',
    append(...children) { for (const child of children) { child.parent = this; this.children.push(child); } },
    remove() { if (this.parent) this.parent.children.splice(this.parent.children.indexOf(this), 1); this.parent = null; },
    addEventListener(name, callback) { this.listeners[name] = callback; },
    setAttribute(name, value) { this.dataset[name] = value; },
  };
}

function fixture() {
  const camera = new THREE.PerspectiveCamera(60, 1.6, 0.1, 1000);
  Object.assign(camera, { target: new THREE.Vector3(2, 0, 3), alpha: -1.2, beta: 0.6, radius: 35, lowerRadiusLimit: 6 });
  camera.position.set(0, 20, -20);
  camera.lookAt(camera.target);
  const callbacks = new Set();
  const world = new World();
  const squadId = world.createEntity([]);
  const soldierId = world.createEntity([]);
  const soldierRoot = new THREE.Group();
  soldierRoot.position.set(30, 5, 40);
  world.add(soldierId, 'soldier', { hp: 100, squadId });
  world.add(soldierId, 'mesh', { root: soldierRoot });
  world.add(squadId, 'squad', {
    team: 'blue', faction: 'ig', unitType: 'guardsmen',
    soldiers: [soldierId], position: soldierRoot.position.clone(), facing: new THREE.Vector3(0, 0, 1),
  });
  const state = {
    scene: new THREE.Scene(), world, camera, selSquads: [squadId],
    canCommand: (team) => team === 'blue', BUILDING_BOUNDS: {}, STRUCTURE_BOUNDS: {}, AIRFIELD_BOUNDS: 8,
    addBeforeRender: (callback) => { callbacks.add(callback); return callback; },
    removeBeforeRender: (callback) => callbacks.delete(callback),
    getDeltaTime: () => 1 / 60,
  };
  const body = element();
  const listeners = {};
  const context = vm.createContext({ exports: {}, document: { body, createElement: element }, window: {
    addEventListener: (name, callback) => { listeners[name] = callback; },
    removeEventListener: (name, callback) => { if (listeners[name] === callback) delete listeners[name]; },
  }, require(name) {
    if (name === 'three') return THREE;
    if (name.endsWith('/scene.js')) return state;
    if (name.endsWith('/hud.js')) return { updateHUD() {} };
    if (name.endsWith('/terrain.js')) return { _groundAt: () => 5 };
    if (name.endsWith('/camera-fps.js')) return { setCameraMode() {} };
    if (name.endsWith('/render/plasma-puff-preview.js')) return puffPreview;
    if (name.endsWith('/fx/plasma-cloud-puff.js')) return puffFx;
    if (name.endsWith('/fx/plasma-cloud-blaster.js')) return blasterFx;
    throw new Error(`Unexpected import ${name}`);
  } });
  const source = readFileSync(new URL('../src/ui/plasma-puff-preview.ts', import.meta.url), 'utf8');
  vm.runInContext(ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  }).outputText, context);
  return { ...context.exports, state, callbacks, body, listeners };
}

function toolbarOf(f) {
  return f.body.children[0];
}

function sliderInputs(f) {
  const sliders = toolbarOf(f).children.find((child) => child.id === 'plasma-puff-tuning');
  const inputs = [];
  const walk = (node) => {
    if (node.type === 'range') inputs.push(node);
    for (const child of node.children || []) walk(child);
  };
  walk(sliders);
  return { sliders, inputs };
}

function inputByLabel(f, label) {
  const { sliders, inputs } = sliderInputs(f);
  for (let i = 0; i < sliders.children.length; i += 3) {
    if (sliders.children[i].textContent === label) return { input: inputs[i / 3], readout: sliders.children[i + 2] };
  }
  return null;
}

function setSlider(f, label, value) {
  const found = inputByLabel(f, label);
  assert.ok(found, `slider ${label} exists`);
  found.input.value = String(value);
  found.input.listeners.input();
  return found;
}

beforeEach(() => {
  resetPlasmaCloudTuning();
});

describe('plasma puff tuning sliders', () => {
  it('exposes one size and one position slider per puff plus beam controls', () => {
    const f = fixture();
    f.togglePlasmaPuffPreview();
    const { inputs } = sliderInputs(f);
    assert.equal(inputs.length, PLASMA_CLOUD_PUFF_COUNT * 2 + 2);
    for (let index = 0; index < PLASMA_CLOUD_PUFF_COUNT; index++) {
      const size = inputByLabel(f, `П${index + 1} размер`);
      assert.equal(size.input.min, '0.05');
      assert.equal(size.input.max, '0.5');
      assert.equal(size.input.value, String(PLASMA_CLOUD_PUFF_SIZES[index]));
      const pos = inputByLabel(f, `П${index + 1} поз`);
      assert.equal(pos.input.min, '0');
      assert.equal(pos.input.max, '1.2');
      assert.equal(pos.input.value, String(PLASMA_CLOUD_PUFF_SPREAD[index]));
    }
    assert.equal(inputByLabel(f, 'Луч длина').input.value, '1');
    assert.equal(inputByLabel(f, 'Луч ширина').input.value, '1');
  });

  it('a size slider retunes the puff immediately in the live preview', () => {
    const f = fixture();
    f.togglePlasmaPuffPreview();
    const before = inputByLabel(f, 'П1 размер');
    assert.equal(before.readout.textContent, '0.15');
    setSlider(f, 'П1 размер', 0.5);
    assert.equal(plasmaCloudTuning.sizes[0], 0.5);
    assert.equal(inputByLabel(f, 'П1 размер').readout.textContent, '0.50');
    for (const tick of f.callbacks) tick();
    const sample = f.state.scene.getObjectByName('plasma_cloud_puff_preview').children[0];
    const width = sample.children[0].scale.x / sample.scale.x;
    assert.ok(width > 0.4 && width < 0.6, `sprite follows the slider, got ${width}`);
  });

  it('a position slider moves the sample along the row', () => {
    const f = fixture();
    f.togglePlasmaPuffPreview();
    const preview = f.state.scene.getObjectByName('plasma_cloud_puff_preview');
    const pathLength = (PLASMA_CLOUD_PUFF_COUNT - 1) * 0.55;
    setSlider(f, 'П1 поз', 0.9);
    assert.equal(plasmaCloudTuning.spread[0], 0.9);
    for (const tick of f.callbacks) tick();
    const first = preview.children[0].position;
    const last = preview.children[PLASMA_CLOUD_PUFF_COUNT - 1].position;
    assert.ok(Math.abs(first.distanceTo(last) - (0.9 - PLASMA_CLOUD_PUFF_SPREAD[6]) * pathLength) < 0.05);
    assert.equal(first.y, 6.2, 'row stays level');
  });

  it('beam sliders scale the blaster without touching the damage path', () => {
    const f = fixture();
    f.togglePlasmaPuffPreview();
    for (const tick of f.callbacks) tick();
    const carrier = f.state.scene.getObjectByName('plasma_cloud_puff_preview').children[0];
    const beam = carrier.getObjectByName('plasma_cloud_blaster');
    carrier.updateMatrixWorld(true);
    const base = new THREE.Box3().setFromObject(beam);
    const baseLength = base.max.z - base.min.z;
    const baseWidth = base.max.x - base.min.x;
    setSlider(f, 'Луч длина', 2);
    setSlider(f, 'Луч ширина', 2);
    for (const tick of f.callbacks) tick();
    carrier.updateMatrixWorld(true);
    const scaled = new THREE.Box3().setFromObject(beam);
    assert.ok(Math.abs((scaled.max.z - scaled.min.z) / baseLength - 2) < 0.1);
    assert.ok(Math.abs((scaled.max.x - scaled.min.x) / baseWidth - 2) < 0.1);
  });

  it('reset restores every default and closes nothing by itself', () => {
    const f = fixture();
    f.togglePlasmaPuffPreview();
    setSlider(f, 'П3 размер', 0.42);
    setSlider(f, 'Луч ширина', 2.5);
    const toolbar = toolbarOf(f);
    const reset = toolbar.children.find((child) => child.textContent === 'Сброс');
    reset.listeners.click();
    assert.deepEqual(plasmaCloudTuning.sizes, [...PLASMA_CLOUD_PUFF_SIZES]);
    assert.deepEqual(plasmaCloudTuning.spread, [...PLASMA_CLOUD_PUFF_SPREAD]);
    assert.equal(plasmaCloudTuning.blasterLength, 1);
    assert.equal(plasmaCloudTuning.blasterWidth, 1);
    assert.equal(f.isPlasmaPuffPreviewOpen(), false, 'reset also closes the preview');
  });
});
