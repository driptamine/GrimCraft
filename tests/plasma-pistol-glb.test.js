import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const file = readFileSync(join(here, '..', 'models', 'ig', 'weapons', 'plasma_pistol.glb'));

function parseGltf() {
  assert.equal(file.readUInt32LE(0), 0x46546c67);
  const jsonLength = file.readUInt32LE(12);
  const gltf = JSON.parse(file.subarray(20, 20 + jsonLength).toString('utf8'));
  const binLength = file.readUInt32LE(20 + jsonLength);
  const bin = file.subarray(20 + jsonLength + 8, 20 + jsonLength + 8 + binLength);
  return { gltf, bin };
}

function readVec3Array(gltf, bin, accessorIndex) {
  const accessor = gltf.accessors[accessorIndex];
  const view = gltf.bufferViews[accessor.bufferView];
  const offset = (view.byteOffset || 0) + (accessor.byteOffset || 0);
  return new Float32Array(
    bin.buffer.slice(bin.byteOffset + offset, bin.byteOffset + offset + accessor.count * 12),
  );
}

function readIndexArray(gltf, bin, accessorIndex) {
  const accessor = gltf.accessors[accessorIndex];
  const view = gltf.bufferViews[accessor.bufferView];
  const offset = (view.byteOffset || 0) + (accessor.byteOffset || 0);
  const size = accessor.componentType === 5125 ? 4 : 2;
  const slice = bin.buffer.slice(bin.byteOffset + offset, bin.byteOffset + offset + accessor.count * size);
  return accessor.componentType === 5125 ? new Uint32Array(slice) : new Uint16Array(slice);
}

describe('plasma_pistol.glb', () => {
  it('ships the pistol, the glow_pistol chamber mesh and both markers', () => {
    const { gltf } = parseGltf();
    const names = gltf.nodes.map((n) => n.name);
    for (const want of ['guardsmen_plasma_pistol', 'glow_pistol', 'glow_pistol_halo', 'marker_plasma_glow', 'marker_plasma_muzzle', 'glow_pistol_light']) {
      assert.ok(names.includes(want), `node ${want}`);
    }
    assert.deepEqual(gltf.meshes.map((m) => m.name), ['guardsmen_plasma_pistol', 'glow_pistol', 'glow_pistol_halo']);
    for (const mesh of gltf.meshes) {
      assert.equal(mesh.primitives.length, 1);
      assert.ok(mesh.primitives[0].indices !== undefined);
    }
  });

  it('glow_pistol is a hot blue emissive subset of the chamber', () => {
    const { gltf, bin } = parseGltf();
    const glowPrim = gltf.meshes[1].primitives[0];
    const mat = gltf.materials[glowPrim.material];
    assert.equal(mat.name, 'glow_pistol_mat');
    assert.ok(mat.emissiveFactor[2] > mat.emissiveFactor[0], 'blue-dominant emissive');
    assert.ok(mat.emissiveFactor[2] > 2.5, 'HDR-hot chamber');
    assert.equal(mat.extensions?.KHR_materials_emissive_strength?.emissiveStrength, 2.0);
    const glowIdx = readIndexArray(gltf, bin, glowPrim.indices);
    assert.ok(glowIdx.length > 0, 'non-empty chamber mesh');
    // Rounded box over the chamber: smooth subdivided volume, far smaller
    // than the whole pistol by bounding volume.
    const glowPosAcc = gltf.accessors[glowPrim.attributes.POSITION];
    assert.ok(glowPosAcc.count > 150, 'subdivided rounded volume');
    const pistolPosAcc = gltf.accessors[gltf.meshes[0].primitives[0].attributes.POSITION];
    const volume = (acc) => (acc.max[0] - acc.min[0]) * (acc.max[1] - acc.min[1]) * (acc.max[2] - acc.min[2]);
    assert.ok(volume(glowPosAcc) < volume(pistolPosAcc) * 0.5, 'glow volume fits inside the gun');
    // Indices reference real verts.
    const glowPos = gltf.accessors[glowPrim.attributes.POSITION];
    for (const vi of glowIdx) {
      assert.ok(vi < glowPos.count, 'glow index in range');
    }
    // The chamber mesh wraps the glow marker.
    const positions = readVec3Array(gltf, bin, glowPrim.attributes.POSITION);
    const marker = gltf.nodes.find((n) => n.name === 'marker_plasma_glow').translation;
    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < positions.length; i += 3) {
      for (let k = 0; k < 3; k++) {
        min[k] = Math.min(min[k], positions[i + k]);
        max[k] = Math.max(max[k], positions[i + k]);
      }
    }
    for (let k = 0; k < 3; k++) {
      assert.ok(marker[k] >= min[k] - 1e-6 && marker[k] <= max[k] + 1e-6, 'marker inside glow bounds');
    }
  });

  it('halo shell and chamber light mimic the in-game spill', () => {
    const { gltf } = parseGltf();
    const haloPrim = gltf.meshes[2].primitives[0];
    const haloMat = gltf.materials[haloPrim.material];
    assert.equal(haloMat.name, 'glow_pistol_halo_mat');
    assert.equal(haloMat.alphaMode, 'BLEND');
    assert.ok(haloMat.pbrMetallicRoughness.baseColorFactor[3] < 1, 'translucent shell');
    assert.ok(haloMat.emissiveFactor[2] > haloMat.emissiveFactor[0], 'blue halo emissive');
    const lights = gltf.extensions?.KHR_lights_punctual?.lights || [];
    assert.equal(lights.length, 1);
    assert.equal(lights[0].type, 'point');
    assert.ok(lights[0].color[2] >= lights[0].color[0], 'blue-ish spill');
    assert.ok(lights[0].intensity > 0 && lights[0].range > 0);
    const lightNode = gltf.nodes.find((n) => n.name === 'glow_pistol_light');
    assert.equal(lightNode.extensions?.KHR_lights_punctual?.light, 0);
  });

  it('pistol keeps its original textured material', () => {
    const { gltf } = parseGltf();
    const mat = gltf.materials[gltf.meshes[0].primitives[0].material];
    assert.equal(mat.name, 'ig_guardsmen');
    assert.ok(mat.pbrMetallicRoughness.baseColorTexture, 'base color kept');
    assert.ok(mat.emissiveTexture, 'emissive map kept');
    // Base color and emissive share one PNG in the source: two texture slots,
    // one embedded image, every index resolving.
    assert.equal((gltf.textures || []).length, 2);
    assert.equal((gltf.images || []).length, 1);
    for (const tex of gltf.textures) {
      assert.ok(tex.source < gltf.images.length, 'texture image resolves');
    }
  });
});
