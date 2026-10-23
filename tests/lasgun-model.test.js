import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const file = readFileSync(join(root, 'models', 'ig', 'infantry', 'guardsmen_lasgun_mesh.glb'));

function parseGltf() {
  assert.equal(file.readUInt32LE(0), 0x46546c67, 'GLB magic');
  assert.equal(file.readUInt32LE(4), 2, 'glTF version');
  const jsonLength = file.readUInt32LE(12);
  const gltf = JSON.parse(file.subarray(20, 20 + jsonLength).toString('utf8'));
  const binLength = file.readUInt32LE(20 + jsonLength);
  const bin = file.subarray(20 + jsonLength + 8, 20 + jsonLength + 8 + binLength);
  return { gltf, bin };
}

function readFloats(bin, gltf, accessorIndex, itemSize) {
  const accessor = gltf.accessors[accessorIndex];
  const view = gltf.bufferViews[accessor.bufferView];
  assert.ok(view.byteOffset + view.byteLength <= bin.length, 'view inside bin');
  const offset = (view.byteOffset || 0) + (accessor.byteOffset || 0);
  return new Float32Array(
    bin.buffer.slice(bin.byteOffset + offset, bin.byteOffset + offset + accessor.count * itemSize * 4),
  );
}

function gunMatrix(gltf) {
  const gun = gltf.nodes.find((n) => n.name === 'guardsmen_lasgun');
  assert.ok(gun, 'lasgun node present');
  let matrix;
  if (gun.matrix) {
    matrix = new THREE.Matrix4().fromArray(gun.matrix);
  } else {
    assert.ok(gun.rotation && gun.translation, 'baked TRS transform');
    matrix = new THREE.Matrix4().compose(
      new THREE.Vector3(...gun.translation),
      new THREE.Quaternion(...gun.rotation),
      new THREE.Vector3(1, 1, 1),
    );
  }
  assert.ok(matrix.elements.every(Number.isFinite), 'finite transform');
  return matrix;
}

describe('guardsmen_lasgun_mesh.glb', () => {
  it('hides every mesh except guardsmen_lasgun', () => {
    const { gltf } = parseGltf();
    const withMesh = gltf.nodes.filter((n) => n.mesh !== undefined);
    assert.equal(withMesh.length, 1, `only the lasgun stays visible, got ${withMesh.length}`);
    assert.equal(withMesh[0].name, 'guardsmen_lasgun');
    assert.equal(withMesh[0].mesh, 18);
    assert.equal(gltf.nodes.length, 78, 'hierarchy untouched');
  });

  it('keeps the skin, material, and texture of the real gun', () => {
    const { gltf, bin } = parseGltf();
    const gun = gltf.nodes.find((n) => n.name === 'guardsmen_lasgun');
    assert.equal(gun.skin, 0, 'skinned bind pose kept');
    const prim = gltf.meshes[18].primitives[0];
    assert.deepEqual(
      Object.keys(prim.attributes).sort(),
      ['JOINTS_0', 'NORMAL', 'POSITION', 'TEXCOORD_0', 'WEIGHTS_0'],
      'full skinned attributes',
    );
    assert.equal(gltf.accessors[prim.attributes.POSITION].count, 388);
    const mat = gltf.materials[prim.material];
    assert.equal(mat.name, 'ig_guardsmen');
    const image = gltf.images[gltf.textures[mat.pbrMetallicRoughness.baseColorTexture.index].source];
    assert.equal(image.name, 'ig_guardsmen');
    const view = gltf.bufferViews[image.bufferView];
    assert.deepEqual(
      [bin[view.byteOffset + 1], bin[view.byteOffset + 2], bin[view.byteOffset + 3]],
      [0x50, 0x4e, 0x47],
      'PNG signature',
    );
  });

  it('bakes the bind pose so the barrel points along -Z, upright', () => {
    const { gltf, bin } = parseGltf();
    const matrix = gunMatrix(gltf);
    const e = matrix.elements;
    // Bind-up must stay up with no sideways lean: R_z(φ) sends (ux, uy) to
    // (0, +r) exactly when φ = atan2(ux, uy) — the old negated sign rolled
    // the gun sideways in the viewmodel.
    assert.ok(Math.abs(e[4]) < 0.05, `no sideways lean, got x=${e[4]}`);
    assert.ok(e[5] > 0.5, `top stays up, got y=${e[5]}`);
    const prim = gltf.meshes[18].primitives[0];
    const positions = readFloats(bin, gltf, prim.attributes.POSITION, 3);
    const v = new THREE.Vector3();
    let minZ = Infinity;
    let size = 0;
    for (let i = 0; i < positions.length; i += 3) {
      v.set(positions[i], positions[i + 1], positions[i + 2]).applyMatrix4(matrix);
      minZ = Math.min(minZ, v.z);
      size = Math.max(size, Math.abs(v.x), Math.abs(v.y), Math.abs(v.z));
    }
    assert.ok(minZ < -0.3, `muzzle reaches downrange, got ${minZ}`);
    assert.ok(size > 0.4 && size < 2.5, `rifle-sized, got ${size}`);
  });

  it('is wired as the persistent FPS viewmodel', () => {
    const fps = readFileSync(join(root, 'src', 'camera-fps.js'), 'utf8');
    assert.ok(fps.includes("LASGUN_MODEL_PATH = 'models/ig/infantry/guardsmen_lasgun_mesh.glb'"), 'viewmodel path pinned');
    assert.ok(fps.includes('preloadLasgunViewmodel'), 'lazy cached loader');
    const game = readFileSync(join(root, 'src', 'game.js'), 'utf8');
    assert.ok(game.includes('preloadLasgunViewmodel()'), 'preloaded at boot');
  });
});
