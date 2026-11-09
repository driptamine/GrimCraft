import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as THREE from 'three';
import { findNodesByName } from '../src/render/three-helpers.js';

function glbNodeNames(url) {
  const buf = readFileSync(url);
  const jsonLen = buf.readUInt32LE(12);
  const json = JSON.parse(buf.subarray(20, 20 + jsonLen).toString('utf8'));
  return (json.nodes || []).map((n) => n.name);
}

describe('planter banner', () => {
  it('guardsmen.glb carries the banner prop nodes', () => {
    const names = glbNodeNames(new URL('../models/ig/infantry/guardsmen.glb', import.meta.url));
    assert.ok(names.includes('guard_banner'));
    assert.ok(names.includes('guard_banner_rod'));
  });

  it('findNodesByName collects banner nodes incl. loader dedupe suffixes', () => {
    const root = new THREE.Group();
    root.name = 'guardsman';
    const banner = new THREE.Mesh(new THREE.BufferGeometry());
    banner.name = 'guard_banner';
    const rod = new THREE.Mesh(new THREE.BufferGeometry());
    rod.name = 'guard_banner_rod';
    const rodDedupe = new THREE.Mesh(new THREE.BufferGeometry());
    rodDedupe.name = 'guard_banner_rod_1';
    const nested = new THREE.Group();
    nested.name = 'arm';
    const nestedBanner = new THREE.Mesh(new THREE.BufferGeometry());
    nestedBanner.name = 'guard_banner_2';
    nested.add(nestedBanner);
    const body = new THREE.Mesh(new THREE.BufferGeometry());
    body.name = 'body';
    const lookalike = new THREE.Mesh(new THREE.BufferGeometry());
    lookalike.name = 'guard_banner_pole';
    root.add(banner, rod, rodDedupe, nested, body, lookalike);
    const found = findNodesByName(root, ['guard_banner', 'guard_banner_rod']);
    assert.deepEqual(
      found.map((n) => n.name).sort(),
      ['guard_banner', 'guard_banner_2', 'guard_banner_rod', 'guard_banner_rod_1'],
    );
  });

  it('findNodesByName tolerates missing roots and models without banners', () => {
    assert.deepEqual(findNodesByName(null, ['guard_banner']), []);
    const root = new THREE.Group();
    assert.deepEqual(findNodesByName(root, ['guard_banner']), []);
  });
});

// Load real geometry/animation without fetching textures in the headless test.
async function loadCaptureModel(relativePath) {
  const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
  globalThis.ProgressEvent ??= class ProgressEvent {};
  const file = readFileSync(new URL(relativePath, import.meta.url));
  const jsonLength = file.readUInt32LE(12);
  const json = JSON.parse(file.subarray(20, 20 + jsonLength).toString());
  json.buffers[0].uri = `data:application/octet-stream;base64,${file.subarray(28 + jsonLength).toString('base64')}`;
  delete json.images;
  delete json.textures;
  json.materials = [];
  for (const mesh of json.meshes) for (const primitive of mesh.primitives) delete primitive.material;
  return new GLTFLoader().parseAsync(JSON.stringify(json), '');
}

function posedRingCenter(model, name, top) {
  model.updateMatrixWorld(true);
  model.traverse((node) => { if (node.isSkinnedMesh) node.skeleton.update(); });
  let mesh;
  model.traverse((node) => { if (node.isMesh && node.name.startsWith(name)) mesh = node; });
  assert.ok(mesh, name);
  const vertices = Array.from({ length: mesh.geometry.attributes.position.count }, (_, i) =>
    mesh.getVertexPosition(i, new THREE.Vector3()).applyMatrix4(mesh.matrixWorld));
  const end = (top ? Math.max : Math.min)(...vertices.map((v) => v.y));
  return new THREE.Box3().setFromPoints(vertices.filter((v) => Math.abs(v.y - end) < 0.01)).getCenter(new THREE.Vector3());
}

it('animated planter rod meets the real centerpost socket from every approach direction', async () => {
  const { captureSlotTarget, planterPlantYaw } = await import('../src/entities/soldier-aim.js');
  const guard = await loadCaptureModel('../models/ig/infantry/guardsmen.glb');
  const point = await loadCaptureModel('../models/points/strategic_point.glb');
  const pose = (asset, name, progress) => {
    const clip = asset.animations.find((clip) => clip.name === name);
    const mixer = new THREE.AnimationMixer(asset.scene);
    const action = mixer.clipAction(clip);
    action.setLoop(THREE.LoopOnce, 1);
    action.clampWhenFinished = true;
    action.play();
    mixer.setTime(clip.duration * progress);
  };
  pose(guard, 'flag_plant_1', 0.99996);
  pose(point, 'captured_raise', 0.2);
  const socket = posedRingCenter(point.scene, 'stratetgic_point_centerpost', true);
  for (let i = 0; i < 16; i++) {
    const angle = i * Math.PI / 8;
    const target = captureSlotTarget({ isPlanter: true, slotX: 0, slotZ: 0,
      centerX: 0, centerZ: 0, soldierX: Math.sin(angle) * 10, soldierZ: Math.cos(angle) * 10 });
    guard.scene.position.set(target.x, 0, target.z);
    guard.scene.rotation.y = planterPlantYaw({ soldierX: target.x, soldierZ: target.z, centerX: 0, centerZ: 0 });
    const rod = posedRingCenter(guard.scene, 'guard_banner_rod', false);
    assert.ok(Math.hypot(rod.x - socket.x, rod.z - socket.z) < 0.005, `approach ${i}: rod aligns with socket`);
  }
});
