// Builds models/ig/infantry/guardsmen_lasgun_mesh.glb from guardsmen.glb:
// a full copy with every mesh hidden except `guardsmen_lasgun` (their `mesh`
// references are stripped; nodes, skin, and animations stay intact).
// The lasgun node additionally gets a baked rotation so the barrel points
// along -Z in viewmodel space. Run: node scripts/extract-lasgun-mesh-glb.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC_PATH = path.join(rootDir, 'models', 'ig', 'infantry', 'guardsmen.glb');
const OUT_PATH = path.join(rootDir, 'models', 'ig', 'infantry', 'guardsmen_lasgun_mesh.glb');

const GUN_NODE = 'guardsmen_lasgun';
const MUZZLE_MARKER = 'marker_lasgun_muzzle';

function readGltf(file) {
  if (file.readUInt32LE(0) !== 0x46546c67) throw new Error('not a GLB');
  const jsonLength = file.readUInt32LE(12);
  const json = JSON.parse(file.subarray(20, 20 + jsonLength).toString('utf8'));
  const binLength = file.readUInt32LE(20 + jsonLength);
  const bin = file.subarray(20 + jsonLength + 8, 20 + jsonLength + 8 + binLength);
  return { json, bin };
}

function assembleGlb(json, bin) {
  const jsonBytes = Buffer.from(JSON.stringify(json), 'utf8');
  const jsonPad = (4 - (jsonBytes.length % 4)) % 4;
  const binPad = (4 - (bin.length % 4)) % 4;
  const total = 12 + 8 + jsonBytes.length + jsonPad + 8 + bin.length + binPad;
  const out = Buffer.alloc(total);
  out.writeUInt32LE(0x46546c67, 0);
  out.writeUInt32LE(2, 4);
  out.writeUInt32LE(total, 8);
  out.writeUInt32LE(jsonBytes.length + jsonPad, 12);
  out.writeUInt32LE(0x4e4f534a, 16);
  jsonBytes.copy(out, 20);
  // The spec pads the JSON chunk with spaces (0x20); NUL bytes break parsers.
  out.fill(0x20, 20 + jsonBytes.length, 20 + jsonBytes.length + jsonPad);
  out.writeUInt32LE(bin.length + binPad, 20 + jsonBytes.length + jsonPad);
  out.writeUInt32LE(0x004e4942, 24 + jsonBytes.length + jsonPad);
  Buffer.from(bin).copy(out, 28 + jsonBytes.length + jsonPad);
  return out;
}

function localMatrix(node) {
  const m = new THREE.Matrix4();
  const t = node.translation || [0, 0, 0];
  const r = node.rotation || [0, 0, 0, 1];
  const s = node.scale || [1, 1, 1];
  m.compose(
    new THREE.Vector3(t[0], t[1], t[2]),
    new THREE.Quaternion(r[0], r[1], r[2], r[3]),
    new THREE.Vector3(s[0], s[1], s[2]),
  );
  return m;
}

function worldMatrices(json) {
  const cache = new Map();
  const parentOf = new Map();
  json.nodes.forEach((node, i) => {
    for (const child of node.children || []) parentOf.set(child, i);
  });
  const world = (i) => {
    if (cache.has(i)) return cache.get(i);
    const local = localMatrix(json.nodes[i]);
    const parent = parentOf.get(i);
    const result = parent === undefined ? local : world(parent).clone().multiply(local);
    cache.set(i, result);
    return result;
  };
  return world;
}

const file = fs.readFileSync(SRC_PATH);
const { json, bin } = readGltf(file);

const gunIndex = json.nodes.findIndex((n) => n.name === GUN_NODE);
const markerIndex = json.nodes.findIndex((n) => n.name === MUZZLE_MARKER);
if (gunIndex < 0) throw new Error(`${GUN_NODE} node not found`);
if (markerIndex < 0) throw new Error(`${MUZZLE_MARKER} node not found`);

// Bind-pose muzzle direction in the lasgun's local space, measured from the
// muzzle marker through the mesh center.
const world = worldMatrices(json);
const markerPos = new THREE.Vector3().setFromMatrixPosition(world(markerIndex));
const gunWorld = world(gunIndex);
const muzzleLocal = markerPos.clone().applyMatrix4(gunWorld.clone().invert());
const posAcc = json.accessors[json.meshes[json.nodes[gunIndex].mesh].primitives[0].attributes.POSITION];
const posView = json.bufferViews[posAcc.bufferView];
const posOff = (posView.byteOffset || 0) + (posAcc.byteOffset || 0);
const positions = new Float32Array(bin.buffer.slice(bin.byteOffset + posOff, bin.byteOffset + posOff + posAcc.count * 12));
const min = new THREE.Vector3(Infinity, Infinity, Infinity);
const max = new THREE.Vector3(-Infinity, -Infinity, -Infinity);
for (let i = 0; i < positions.length; i += 3) {
  min.set(Math.min(min.x, positions[i]), Math.min(min.y, positions[i + 1]), Math.min(min.z, positions[i + 2]));
  max.set(Math.max(max.x, positions[i]), Math.max(max.y, positions[i + 1]), Math.max(max.z, positions[i + 2]));
}
const center = min.clone().add(max).multiplyScalar(0.5);
const muzzleDir = muzzleLocal.clone().sub(center).normalize();
const align = new THREE.Quaternion().setFromUnitVectors(muzzleDir, new THREE.Vector3(0, 0, -1));
const up = new THREE.Vector3(0, 1, 0).applyQuaternion(align);
// R_z(φ) sends (ux, uy) to (0, +r) exactly when φ = atan2(ux, uy): the minus
// sign here used to roll the gun the wrong way (off by twice the angle).
const roll = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.atan2(up.x, up.y));
const rotation = roll.multiply(align);
// Recenter on the origin and face downrange: p' = R * (p - C).
const offset = center.clone().applyQuaternion(rotation).negate();

// Hide every mesh except the lasgun. Only the `mesh` links are stripped —
// nodes, the skin, and the animations stay untouched and reversible.
let hidden = 0;
json.nodes.forEach((node, i) => {
  if (i !== gunIndex && node.mesh !== undefined) {
    delete node.mesh;
    hidden++;
  }
});
const gunNode = json.nodes[gunIndex];
if (gunNode.mesh === undefined) throw new Error('lasgun node lost its mesh');
gunNode.rotation = rotation.toArray();
gunNode.translation = offset.toArray();

const out = assembleGlb(json, bin);
fs.writeFileSync(OUT_PATH, out);
console.log(`wrote ${path.relative(rootDir, OUT_PATH)} (${(out.length / 1024).toFixed(1)} KB, ${hidden} meshes hidden)`);
