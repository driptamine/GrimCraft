import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import * as THREE from 'three';
import * as cameraLock from '../src/render/camera-lock.js';
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
    tag, tagName:tag.toUpperCase(), style: {}, children: [], listeners: {}, parent: null, dataset: {}, attributes:{},
    textContent: '', type: '', value: '', min: '', max: '', step: '', id: '',
    append(...children) { for (const child of children) { child.parent = this; this.children.push(child); } },
    remove() { if (this.parent) this.parent.children.splice(this.parent.children.indexOf(this), 1); this.parent = null; },
    addEventListener(name, callback) { this.listeners[name] = callback; },
    setAttribute(name, value) { this.attributes[name] = value; },
    focus() { this.focused=true; },select() { this.selected=true; },
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
    if (name.endsWith('/camera-lock.js')) return cameraLock;
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

function byId(f,id) {
  const find=node=>node.id===id?node:(node.children||[]).map(find).find(Boolean);
  const found=find(toolbarOf(f));assert.ok(found,`control ${id} exists`);return found;
}
function input(f,id,value,commit=true) {
  const node=byId(f,id);node.value=String(value);node.listeners.input();if(commit)node.listeners.change?.();return node;
}
function click(f,id) { byId(f,id).listeners.click(); }
function tick(f) { for(const callback of f.callbacks)callback(); }
beforeEach(resetPlasmaCloudTuning);

describe('plasma editor',()=>{
  it('selects each numbered cloud and synchronizes precise inputs and sliders',()=>{
    const f=fixture();f.togglePlasmaPuffPreview();
    for(let index=0;index<PLASMA_CLOUD_PUFF_COUNT;index++){
      click(f,`plasma-puff-${index+1}`);
      assert.equal(byId(f,`plasma-puff-${index+1}`).attributes['aria-pressed'],'true');
      assert.equal(Number(byId(f,'plasma-puff-size').value),PLASMA_CLOUD_PUFF_SIZES[index]);
      assert.equal(Number(byId(f,'plasma-puff-position').value),Math.round(PLASMA_CLOUD_PUFF_SPREAD[index]*100));
    }
    input(f,'plasma-puff-size-number',.42);
    assert.equal(plasmaCloudTuning.sizes[6],.42);assert.equal(Number(byId(f,'plasma-puff-size').value),.42);
    input(f,'plasma-puff-position',85);assert.equal(plasmaCloudTuning.spread[6],.85);
    assert.equal(Number(byId(f,'plasma-puff-position-number').value),85);
    const preview=f.state.scene.getObjectByName('plasma_cloud_puff_preview');
    assert.equal(preview.children[6].getObjectByName('plasma_puff_selection').visible,true);
  });

  it('groups a slider drag into one undo, supports redo, and records reversed shapes',()=>{
    const f=fixture();f.togglePlasmaPuffPreview();
    input(f,'plasma-puff-size',.22,false);input(f,'plasma-puff-size',.32,false);input(f,'plasma-puff-size',.45);
    assert.equal(plasmaCloudTuning.sizes[0],.45);
    click(f,'plasma-editor-undo');assert.equal(plasmaCloudTuning.sizes[0],PLASMA_CLOUD_PUFF_SIZES[0]);
    assert.equal(byId(f,'plasma-editor-undo').disabled,true);
    click(f,'plasma-editor-redo');assert.equal(plasmaCloudTuning.sizes[0],.45);
    const sizes=[...plasmaCloudTuning.sizes],spread=[...plasmaCloudTuning.spread];
    click(f,'plasma-editor-reverse');assert.deepEqual(Array.from(plasmaCloudTuning.sizes),[...sizes].reverse());assert.deepEqual(Array.from(plasmaCloudTuning.spread),spread);
    click(f,'plasma-editor-undo');assert.deepEqual(Array.from(plasmaCloudTuning.sizes),sizes);
    input(f,'plasma-beam-width-number',2);assert.equal(byId(f,'plasma-editor-redo').disabled,true,'new edits clear redo');
  });

  it('pauses and scrubs the preview without moving clouds or altering weapon parameters',()=>{
    const f=fixture();f.togglePlasmaPuffPreview();
    const values=JSON.stringify(plasmaCloudTuning);
    input(f,'plasma-preview-time',40);
    const root=f.state.scene.getObjectByName('plasma_cloud_puff_preview'),beam=root.children[0].getObjectByName('plasma_cloud_blaster');
    const before=beam.position.clone(),clouds=root.children.map(puff=>puff.position.clone());tick(f);tick(f);
    assert.deepEqual(beam.position,before,'paused preview stays at the chosen frame');
    assert.equal(JSON.stringify(plasmaCloudTuning),values);assert.equal(byId(f,'plasma-editor-undo').disabled,true);
    click(f,'plasma-editor-play');tick(f);assert.notDeepEqual(beam.position,before);
    assert.ok(root.children.every((puff,index)=>puff.position.equals(clouds[index])));
    click(f,'plasma-editor-restart');assert.equal(Number(byId(f,'plasma-preview-time').value),0);
  });

  it('resets without closing and can undo reset or return to the opening snapshot',()=>{
    const f=fixture();plasmaCloudTuning.sizes[0]=.23;f.togglePlasmaPuffPreview();
    input(f,'plasma-puff-size-number',.42);input(f,'plasma-beam-width',2.5);
    click(f,'plasma-editor-reset');assert.deepEqual(plasmaCloudTuning.sizes,[...PLASMA_CLOUD_PUFF_SIZES]);assert.equal(f.isPlasmaPuffPreviewOpen(),true);
    click(f,'plasma-editor-undo');assert.equal(plasmaCloudTuning.sizes[0],.42);assert.equal(plasmaCloudTuning.blasterWidth,2.5);
    click(f,'plasma-editor-restore');assert.equal(plasmaCloudTuning.sizes[0],.23);assert.equal(plasmaCloudTuning.blasterWidth,1);
    assert.equal(f.isPlasmaPuffPreviewOpen(),true);
  });

  it('imports valid JSON as one undoable change and rejects invalid input without partially changing settings',()=>{
    const f=fixture();f.togglePlasmaPuffPreview();
    const original=JSON.stringify(plasmaCloudTuning),config=JSON.parse(original);config.sizes[2]=.44;config.blasterWidth=2;
    const text=byId(f,'plasma-tuning-values');text.value=JSON.stringify(config);text.listeners.input();click(f,'plasma-editor-import');
    assert.equal(plasmaCloudTuning.sizes[2],.44);assert.equal(plasmaCloudTuning.blasterWidth,2);
    click(f,'plasma-editor-undo');assert.equal(JSON.stringify(plasmaCloudTuning),original);
    for(const invalid of ['not json',JSON.stringify({...config,sizes:[.5]}),JSON.stringify({...config,blasterWidth:99})]){
      text.value=invalid;text.listeners.input();click(f,'plasma-editor-import');assert.equal(JSON.stringify(plasmaCloudTuning),original);
      assert.ok(byId(f,'plasma-editor-status').textContent.length>10);
    }
  });
});
