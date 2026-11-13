import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import * as THREE from 'three';
import * as cameraLock from '../src/render/camera-lock.js';
import { createPlasmaPuffPreview, findPlasmaPuffPreviewCenter } from '../src/render/plasma-puff-preview.js';
import { makePlasmaCloudPuffMesh } from '../src/fx/plasma-cloud-puff.js';
import * as puffFx from '../src/fx/plasma-cloud-puff.js';
import * as blasterFx from '../src/fx/plasma-cloud-blaster.js';
import { World } from '../src/core/ecs.js';

describe('plasma projectile preview', () => {
  it('loops the attached clouds indefinitely without moving the preview origin', () => {
    const scene = new THREE.Scene();
    const preview = createPlasmaPuffPreview(scene, new THREE.Vector3(10, 2, 20), new THREE.Vector3(-1, 0, 0));
    assert.equal(preview.root.children.length, 7);
    const positions = preview.root.children.map((puff) => puff.position.clone());
    const initialWisps = preview.root.children.map((puff) => puff.children[0].position.clone());
    for (const delta of [0.1, 4, 60, 3600]) {
      preview.update(delta);
      assert.equal(preview.root.parent, scene, 'samples do not expire like live bullets');
      for (const [index, puff] of preview.root.children.entries()) {
        assert.deepEqual(puff.position, positions[index], 'no projectile travel at any age');
        assert.ok(puff.scale.x <= 1.27, 'preview remains compact after long inspection');
      }
    }
    assert.ok(preview.root.children.every((puff, index) => puff.children[0].position.distanceTo(initialWisps[index]) > 0));
    assert.equal(new Set(preview.root.children.map((puff) => puff.userData.puffVariant)).size, 7);
    preview.dispose();
    assert.equal(scene.children.length, 0);
  });

  it('cleans up without disposing shared resources used by live projectiles', () => {
    const scene = new THREE.Scene();
    const live = makePlasmaCloudPuffMesh(0);
    scene.add(live);
    const preview = createPlasmaPuffPreview(scene, new THREE.Vector3(), new THREE.Vector3(1, 0, 0));
    const material = live.children[0].material;
    let disposed = false;
    material.addEventListener('dispose', () => { disposed = true; });
    assert.equal(preview.root.children[0].children[0].material, material);
    preview.dispose();
    assert.equal(disposed, false);
    assert.equal(live.parent, scene);
  });

  it('shows all three beam stages while the seven clouds stay attached to the moving core', () => {
    const scene = new THREE.Scene();
    const preview = createPlasmaPuffPreview(scene, new THREE.Vector3(10, 2, 20), new THREE.Vector3(1, 0, 0));
    const carrier = preview.root.children[0];
    const beam = carrier.getObjectByName('plasma_cloud_blaster');
    const positions = preview.root.children.map((puff) => puff.position.clone());
    assert.equal(beam.visible, true);
    preview.update(1.1);
    carrier.updateMatrixWorld(true);
    const earlyLength = new THREE.Box3().setFromObject(beam).getSize(new THREE.Vector3()).x;
    preview.update(0.4);
    assert.equal(beam.visible, true);
    const position = beam.getWorldPosition(new THREE.Vector3());
    assert.ok(position.x > positions[0].x, 'beam moves from A toward B');
    carrier.updateMatrixWorld(true);
    const laterLength = new THREE.Box3().setFromObject(beam).getSize(new THREE.Vector3()).x;
    assert.ok(Math.abs(earlyLength - 1.85 * 0.2) < 1e-6);
    assert.ok(Math.abs(laterLength - 1.85 * 0.4) < 1e-6);
    preview.update(1.3);
    carrier.updateMatrixWorld(true);
    const longLength = new THREE.Box3().setFromObject(beam).getSize(new THREE.Vector3()).x;
    assert.ok(Math.abs(longLength - 1.85 * 0.6) < 1e-6);
    assert.ok(preview.root.children.every((puff, index) => puff.position.equals(positions[index])));
    preview.dispose();
  });

  it('keeps cloud centers and the selected marker on the beam when scrubbing and changing its length', () => {
    const scene=new THREE.Scene(),preview=createPlasmaPuffPreview(scene,new THREE.Vector3(2,1,3),new THREE.Vector3(-1,0,0));
    preview.select(6);
    for(const lengthScale of [.2,1,2.5]){
      puffFx.plasmaCloudTuning.blasterLength=lengthScale;
      for(const time of [0,.8,1.7,2.8,3.99,4.1]){
        preview.setTime(time);scene.updateMatrixWorld(true);
        const beam=preview.root.getObjectByName('plasma_cloud_blaster'),start=beam.getWorldPosition(new THREE.Vector3());
        const end=beam.localToWorld(new THREE.Vector3(0,0,.65)),direction=end.clone().sub(start),length=direction.length();direction.normalize();
        for(const puff of preview.root.children){
          const center=puff.children[0].getWorldPosition(new THREE.Vector3()).sub(start),along=center.dot(direction);
          assert.ok(along>=-.03&&along<=length+.03);assert.ok(center.addScaledVector(direction,-along).length()<.08);
        }
        const marker=preview.root.getObjectByName('plasma_puff_selection');
        assert.ok(marker.getWorldPosition(new THREE.Vector3()).distanceTo(end)<1e-5,'selected tip marker follows the cloud at the end of the beam');
      }
    }
    puffFx.resetPlasmaCloudTuning();preview.dispose();
  });
});

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

function findByText(root, text) {
  if (root.textContent === text) return root;
  for (const child of root.children || []) {
    const found = findByText(child, text);
    if (found) return found;
  }
  return null;
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
    if (name.endsWith('/render/plasma-puff-preview.js')) return { createPlasmaPuffPreview, findPlasmaPuffPreviewCenter };
    if (name.endsWith('/fx/plasma-cloud-puff.js')) return puffFx;
    if (name.endsWith('/fx/plasma-cloud-blaster.js')) return blasterFx;
    throw new Error(`Unexpected import ${name}`);
  } });
  const source = readFileSync(new URL('../src/ui/plasma-puff-preview.ts', import.meta.url), 'utf8');
  vm.runInContext(ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  }).outputText, context);
  return { ...context.exports, state, callbacks, body, listeners, squadId, soldierId, soldierRoot };
}

describe('projectile preview controls', () => {
  it('focuses and zooms the camera, then restores the previous view on closing', () => {
    const f = fixture();
    const camera = f.state.camera;
    const saved = { target: camera.target.clone(), alpha: camera.alpha, beta: camera.beta, radius: camera.radius, lowerRadiusLimit: camera.lowerRadiusLimit };
    f.togglePlasmaPuffPreview();
    assert.equal(f.isPlasmaPuffPreviewOpen(), true);
    assert.equal(camera.radius, 4);
    assert.equal(camera.lowerRadiusLimit, 1.5);
    assert.equal(camera.target.y, 6.2, 'samples sit at weapon height above the local terrain');
    assert.ok(Math.hypot(camera.target.x - f.soldierRoot.position.x, camera.target.z - f.soldierRoot.position.z) <= 4, 'camera focuses beside selected guardsmen, not its previous target');
    const samples = f.state.scene.getObjectByName('plasma_cloud_puff_preview').children;
    assert.ok(samples.every((sample) => Math.hypot(sample.position.x - 30, sample.position.z - 40) < 5), 'all seven samples stand near guardsmen');
    assert.equal(f.callbacks.size, 1);
    assert.equal(f.body.children[0].id, 'plasma-puff-preview-toolbar');
    for (const tick of f.callbacks) tick();
    camera.alpha += 1;
    camera.radius = 2;
    findByText(f.body.children[0], 'Готово').listeners.click();
    assert.equal(f.isPlasmaPuffPreviewOpen(), false);
    assert.deepEqual(camera.target, saved.target);
    for (const key of ['alpha', 'beta', 'radius', 'lowerRadiusLimit']) assert.equal(camera[key], saved[key], key);
    assert.equal(f.callbacks.size, 0);
    assert.equal(f.body.children.length, 0);
    assert.equal(f.state.scene.children.length, 0);
  });

  it('holds the preview camera pose while editing and releases the lock on close or world replacement', () => {
    const f=fixture(),camera=f.state.camera;
    f.togglePlasmaPuffPreview();assert.equal(cameraLock.isCameraLocked(camera),true);
    const expected={target:camera.target.clone(),alpha:camera.alpha,beta:camera.beta,radius:camera.radius};
    camera.target.set(200,0,-200);camera.alpha+=1;camera.beta=.1;camera.radius=100;
    assert.equal(cameraLock.enforceCameraLock(camera),true);
    assert.deepEqual(camera.target,expected.target);assert.equal(camera.alpha,expected.alpha);assert.equal(camera.beta,expected.beta);assert.equal(camera.radius,expected.radius);
    f.togglePlasmaPuffPreview();assert.equal(cameraLock.isCameraLocked(camera),false);
    camera.target.x=42;assert.equal(cameraLock.enforceCameraLock(camera),false);assert.equal(camera.target.x,42);
    f.togglePlasmaPuffPreview();assert.equal(cameraLock.isCameraLocked(camera),true);
    f.state.world={};for(const tick of f.callbacks)tick();assert.equal(cameraLock.isCameraLocked(camera),false);
  });

  it('chooses a free row beside guardsmen instead of placing samples on buildings, structures, or airfields', () => {
    const f = fixture();
    const obstacles = [];
    for (const [kind, x, z] of [['building', 30, 42.5], ['structure', 25, 40], ['airfield', 35, 40]]) {
      const id = f.state.world.createEntity([]);
      const position = new THREE.Vector3(x, 5, z);
      const root = new THREE.Mesh(new THREE.BoxGeometry(6, 6, 6), new THREE.MeshBasicMaterial());
      root.position.copy(position);
      f.state.world.add(id, kind, { hp: 100, position });
      f.state.world.add(id, 'mesh', { root });
      obstacles.push({ x, z });
    }
    const right = new THREE.Vector3(1, 0, 0);
    const center = findPlasmaPuffPreviewCenter(f.state.world, [f.squadId], right, () => 5);
    assert.ok(center, 'finds an alternative side of the squad');
    assert.ok(Math.hypot(center.x - 30, center.z - 40) <= 8, 'keeps the preview near guardsmen');
    const preview = createPlasmaPuffPreview(f.state.scene, center, right);
    for (const sample of preview.root.children) {
      assert.ok(obstacles.every((obstacle) => Math.abs(sample.position.x - obstacle.x) > 3.9 || Math.abs(sample.position.z - obstacle.z) > 3.9), 'every sample clears every footprint including a safety margin');
      assert.equal(sample.position.y, 6.2);
    }
    preview.dispose();
  });

  it('does not fall back to the camera target when selected guardsmen are dead or uncommandable', () => {
    const f = fixture();
    f.state.world.get(f.soldierId, 'soldier').hp = 0;
    f.togglePlasmaPuffPreview();
    assert.equal(f.isPlasmaPuffPreviewOpen(), false);
    f.state.world.get(f.soldierId, 'soldier').hp = 100;
    f.state.world.get(f.squadId, 'squad').team = 'red';
    f.togglePlasmaPuffPreview();
    assert.equal(f.isPlasmaPuffPreviewOpen(), false);
    assert.equal(f.state.camera.radius, 35);
    assert.equal(f.state.scene.children.length, 0);
  });

  it('closes with Esc and removes previews on a world change without overwriting the new view', () => {
    const f = fixture();
    f.togglePlasmaPuffPreview();
    f.listeners.keydown({ code: 'Escape' });
    assert.equal(f.isPlasmaPuffPreviewOpen(), false);
    assert.equal(f.listeners.keydown, undefined);
    f.togglePlasmaPuffPreview();
    f.state.world = {};
    f.state.camera.target.set(70, 0, 80);
    f.state.camera.radius = 55;
    for (const tick of f.callbacks) tick();
    assert.equal(f.isPlasmaPuffPreviewOpen(), false);
    assert.deepEqual(f.state.camera.target, new THREE.Vector3(70, 0, 80));
    assert.equal(f.state.camera.radius, 55);
    assert.equal(f.callbacks.size, 0);
    assert.equal(f.body.children.length, 0);
    assert.equal(f.state.scene.children.length, 0);
  });
});
