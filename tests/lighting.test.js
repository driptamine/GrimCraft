import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { attachGroundShadowOverlay, setGroundShadowsVisible } from '../src/render/ground-shadows.js';
import { childMeshes, disposeObj } from '../src/render/three-helpers.js';
import {
  bindLighting, applyObjectLighting, lightingMode, setLightingMode,
  shadowsEnabled, setShadowsEnabled, LIGHTING_STORAGE_KEY, SHADOWS_STORAGE_KEY,
  updateSunShadowCamera,
} from '../src/render/lighting.js';

const saved = new Map();
globalThis.localStorage = { getItem: key => saved.get(key) ?? null, setItem: (key, value) => saved.set(key, value) };

test('all quality tiers show real shadows unless explicitly disabled', () => {
  assert.equal(shadowsEnabled('low'), true);
  assert.equal(shadowsEnabled('high'), true);
  setShadowsEnabled(true);
  assert.equal(shadowsEnabled('low'), true);
  assert.equal(saved.get(SHADOWS_STORAGE_KEY), 'on');
  setShadowsEnabled(false);
  assert.equal(shadowsEnabled('high'), false);
});

test('DE lighting switches live, shades new models and restores Classic rendering', () => {
  const scene = new THREE.Scene();
  for (const [name, intensity] of [['amb', .55], ['sun', 1.8], ['fill', .45], ['rim', .28]]) {
    const light = name === 'amb' ? new THREE.HemisphereLight(0xffffff, 0x333333, intensity) : new THREE.DirectionalLight(0xffffff, intensity);
    light.name = name;scene.add(light);
  }
  const model = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial());model.castShadow = true;scene.add(model);
  const blob = new THREE.Mesh(new THREE.CircleGeometry(), new THREE.MeshBasicMaterial({ opacity: .55, transparent: true }));blob.name = 'blobshadow';scene.add(blob);
  const renderer = { toneMapping: THREE.NoToneMapping, toneMappingExposure: 1, shadowMap: {} };
  const originalEnvironment = new THREE.CubeTexture();scene.environment = originalEnvironment;
  setLightingMode('classic');setShadowsEnabled(true);bindLighting(scene, renderer, 'high');
  const baseline = scene.getObjectByName('sun').intensity;
  setLightingMode('definitive');
  assert.equal(lightingMode(), 'definitive');assert.equal(saved.get(LIGHTING_STORAGE_KEY), 'definitive');
  assert.ok(scene.getObjectByName('sun').intensity > baseline);
  assert.notEqual(scene.environment, originalEnvironment);assert.equal(scene.environment.isCubeTexture, true);
  assert.equal(scene.environment.images.length, 6);
  assert.equal(renderer.toneMapping, THREE.ACESFilmicToneMapping);
  assert.equal(model.receiveShadow, true);assert.equal(blob.material.opacity, 0);
  assert.equal(scene.getObjectByName('sun').shadow.mapSize.x, 2048);
  const reinforcement = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial());reinforcement.castShadow = true;
  applyObjectLighting(reinforcement);assert.equal(reinforcement.receiveShadow, true);scene.add(reinforcement);
  setShadowsEnabled(false);
  assert.equal(renderer.shadowMap.enabled, false);assert.equal(scene.getObjectByName('sun').castShadow, false);
  setLightingMode('classic');
  assert.equal(scene.environment, originalEnvironment);assert.equal(renderer.toneMapping, THREE.NoToneMapping);
  assert.equal(model.receiveShadow, false);assert.equal(reinforcement.receiveShadow, false);
  assert.equal(blob.material.opacity, 0, 'turning off shadows also hides the old blobs');
  setShadowsEnabled(true);assert.equal(blob.material.opacity, 0, 'Classic also uses silhouettes instead of circles');
  assert.equal(scene.getObjectByName('sun').intensity, baseline);
});

test('silhouettes keep natural proportions when the camera moves to elevated terrain', () => {
  const sun = new THREE.DirectionalLight(), target = new THREE.Vector3(1000, 24, -700);
  updateSunShadowCamera(sun, target, 30);
  sun.updateMatrixWorld();sun.shadow.updateMatrices(sun);
  const direction = target.clone().sub(sun.position).normalize();
  const head = target.clone().add(new THREE.Vector3(0, 3, 0));
  const shadowTip = head.clone().addScaledVector(direction, 3 / -direction.y);
  assert.ok(Math.abs(shadowTip.y - target.y) < 1e-8);
  assert.ok(shadowTip.distanceTo(target) > 3 && shadowTip.distanceTo(target) < 4.5, 'silhouette length stays close to model height');
  for (const point of [target, head, shadowTip]) {
    const projected = point.clone().project(sun.shadow.camera);
    assert.ok(Math.abs(projected.x) < 1 && Math.abs(projected.y) < 1 && Math.abs(projected.z) < 1, 'body and shadow remain inside the moving shadow camera');
  }
});

test('lighting survives renderer changes and respects terrain brightness', () => {
  const scene = new THREE.Scene(), sun = new THREE.DirectionalLight();sun.name = 'sun';scene.add(sun);
  const renderer = { toneMapping: THREE.NoToneMapping, toneMappingExposure: 1, shadowMap: {} };
  scene.userData.lightingBrightness = .5;
  bindLighting(scene, renderer, 'medium');setLightingMode('definitive');
  assert.equal(sun.intensity / scene._sunBase, .5);
  const replacement = { toneMapping: THREE.LinearToneMapping, toneMappingExposure: 1.3, shadowMap: {} };
  bindLighting(scene, replacement, 'high');
  assert.equal(replacement.toneMapping, THREE.ACESFilmicToneMapping);assert.equal(replacement.shadowMap.enabled, true);
  setLightingMode('classic');
  assert.equal(replacement.toneMapping, THREE.LinearToneMapping);assert.equal(replacement.toneMappingExposure, 1.3);
  assert.equal(sun.intensity / scene._sunBase, .5);
});

test('dense silhouettes follow terrain, survive texture painting and obey the shadow switch', () => {
  const scene = new THREE.Scene(), ground = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshStandardMaterial());
  ground.position.set(10, 3, -4);ground.rotation.x = -Math.PI / 2;scene.add(ground);
  attachGroundShadowOverlay(ground);attachGroundShadowOverlay(ground);
  const [overlay] = ground.children;
  assert.equal(ground.children.length, 1);assert.equal(overlay.geometry, ground.geometry);
  assert.equal(overlay.material.isShadowMaterial, true);assert.ok(overlay.material.opacity >= .8);
  assert.equal(overlay.castShadow, false);assert.equal(overlay.receiveShadow, true);
  assert.equal(overlay.material.depthWrite, false);assert.ok(overlay.renderOrder > -80000);
  assert.deepEqual(childMeshes(scene), [ground], 'terrain painters and model walkers never repaint the shadow receiver');
  scene.updateMatrixWorld();
  const sample = new THREE.Vector3(1, 2, 0);
  assert.ok(ground.localToWorld(sample.clone()).distanceTo(overlay.localToWorld(sample.clone())) < 1e-8);
  const hits = new THREE.Raycaster(new THREE.Vector3(10, 20, -4), new THREE.Vector3(0, -1, 0)).intersectObject(ground, true);
  assert.ok(hits.length > 0);assert.ok(hits.every(hit => hit.object === ground));
  setGroundShadowsVisible(scene, false);assert.equal(overlay.visible, false);
  const second = new THREE.Mesh(new THREE.PlaneGeometry(), new THREE.MeshStandardMaterial());scene.add(second);
  attachGroundShadowOverlay(second);assert.equal(second.children[0].visible, false);
  setGroundShadowsVisible(scene, true);assert.equal(overlay.visible, true);assert.equal(second.children[0].visible, true);
  let disposed = 0;ground.geometry.addEventListener('dispose', () => disposed++);
  disposeObj(overlay);assert.equal(disposed, 0, 'receiver does not own the shared ground geometry');
  disposeObj(ground);assert.equal(disposed, 1);
});
