// Generates models/ig/projectiles/plasma_bolt.glb - a compact Soulstorm-style
// plasma pistol bolt: tablet/capsule white-hot core, electric-blue shell,
// transparent halo and three jagged tendril strips. Forward axis is +Z.
// Run: node scripts/generate-plasma-bolt.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const outPath = join(rootDir, 'models', 'ig', 'projectiles', 'plasma_bolt.glb');

function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Tablet / capsule: straight cylinder mid-section with hemisphere caps, axis +Z.
function buildCapsule(radius, cylLength, capSegs = 4, sideSegs = 6, lonSegs = 14) {
  // Profile rings from the bottom pole to the top pole: [ringRadius, z, normalZ].
  const profile = [];
  for (let k = 0; k <= capSegs; k++) {
    const a = -Math.PI / 2 + (k / capSegs) * (Math.PI / 2);
    profile.push([radius * Math.cos(a), -cylLength / 2 + radius * Math.sin(a), Math.sin(a)]);
  }
  for (let s = 1; s <= sideSegs; s++) {
    profile.push([radius, -cylLength / 2 + (s / sideSegs) * cylLength, 0]);
  }
  for (let k = 1; k <= capSegs; k++) {
    const a = (k / capSegs) * (Math.PI / 2);
    profile.push([radius * Math.cos(a), cylLength / 2 + radius * Math.sin(a), Math.sin(a)]);
  }
  const positions = [];
  const normals = [];
  const uvs = [];
  const indices = [];
  const ringCount = profile.length;
  for (let j = 0; j < ringCount; j++) {
    const [ringR, z, nz] = profile[j];
    const nxy = Math.sqrt(Math.max(0, 1 - nz * nz));
    for (let ix = 0; ix <= lonSegs; ix++) {
      const u = ix / lonSegs;
      const phi = u * Math.PI * 2;
      const cx = Math.cos(phi);
      const cy = Math.sin(phi);
      positions.push(cx * ringR, cy * ringR, z);
      normals.push(cx * nxy, cy * nxy, nz);
      uvs.push(u, j / (ringCount - 1));
    }
  }
  for (let j = 0; j < ringCount - 1; j++) {
    for (let ix = 0; ix < lonSegs; ix++) {
      const a = j * (lonSegs + 1) + ix;
      const b = a + lonSegs + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  return { positions, normals, uvs, indices };
}

// Jagged tendril hugging the tablet body: flat mid-section, pinched ends.
function buildTendril(seed, halfLength = 0.26, points = 14) {
  const rand = mulberry32(seed);
  const phase = rand() * Math.PI * 2;
  const turns = 1.1 + rand() * 0.7;
  const positions = [];
  for (let i = 0; i < points; i++) {
    const t = i / (points - 1);
    const z = (t * 2 - 1) * halfLength;
    const envelope = 0.02 + 0.05 * Math.pow(Math.sin(Math.PI * t), 0.5);
    const angle = phase + t * turns * Math.PI * 2 + (rand() - 0.5) * 0.9;
    const r = envelope * (0.75 + rand() * 0.5);
    positions.push(Math.cos(angle) * r, Math.sin(angle) * r, z);
  }
  return { positions };
}

const chunks = []; // { data: Float32Array|Uint16Array, target }
function pushFloat(array, target) {
  const data = new Float32Array(array);
  chunks.push({ data, target, componentType: 5126 });
  return chunks.length - 1;
}
function pushUShort(array, target) {
  const data = new Uint16Array(array);
  chunks.push({ data, target, componentType: 5123 });
  return chunks.length - 1;
}

const bufferViews = [];
const accessors = [];
let byteLength = 0;
function addAccessor(chunkIndex, count, type, min, max) {
  const chunk = chunks[chunkIndex];
  const byteOffset = byteLength;
  const length = chunk.data.byteLength;
  bufferViews.push({
    buffer: 0,
    byteOffset,
    byteLength: length,
    ...(chunk.target ? { target: chunk.target } : {}),
  });
  byteLength += length;
  accessors.push({
    bufferView: bufferViews.length - 1,
    componentType: chunk.componentType,
    count,
    type,
    ...(min ? { min, max } : {}),
  });
  return accessors.length - 1;
}
function minMax(flat, stride = 3) {
  const min = [Infinity, Infinity, Infinity].slice(0, stride);
  const max = [-Infinity, -Infinity, -Infinity].slice(0, stride);
  for (let i = 0; i < flat.length; i += stride) {
    for (let k = 0; k < stride; k++) {
      const v = flat[i + k];
      if (v < min[k]) min[k] = v;
      if (v > max[k]) max[k] = v;
    }
  }
  return { min, max };
}

const ARRAY_BUFFER = 34962;
const ELEMENT_ARRAY_BUFFER = 34963;
const meshes = [];
function addCapsuleMesh(name, radius, cylLength, material) {
  const geo = buildCapsule(radius, cylLength);
  const count = geo.positions.length / 3;
  const { min, max } = minMax(geo.positions, 3);
  const pos = addAccessor(pushFloat(geo.positions, ARRAY_BUFFER), count, 'VEC3', min, max);
  const nrm = addAccessor(pushFloat(geo.normals, ARRAY_BUFFER), count, 'VEC3');
  const uv = addAccessor(pushFloat(geo.uvs, null), count, 'VEC2');
  const idx = addAccessor(pushUShort(geo.indices, ELEMENT_ARRAY_BUFFER), geo.indices.length, 'SCALAR');
  meshes.push({
    name,
    primitives: [{ attributes: { POSITION: pos, NORMAL: nrm, TEXCOORD_0: uv }, indices: idx, material }],
  });
}
function addTendrilMesh(name, seed, material) {
  const geo = buildTendril(seed);
  const count = geo.positions.length / 3;
  const { min, max } = minMax(geo.positions, 3);
  const pos = addAccessor(pushFloat(geo.positions, ARRAY_BUFFER), count, 'VEC3', min, max);
  meshes.push({
    name,
    primitives: [{ attributes: { POSITION: pos }, mode: 1, material }],
  });
}

// 0 core, 1 shell, 2 halo, 3 tendril.
addCapsuleMesh('bolt_core', 0.04, 0.26, 0);
addCapsuleMesh('bolt_shell', 0.065, 0.32, 1);
addCapsuleMesh('bolt_halo', 0.11, 0.36, 2);
addTendrilMesh('tendril_01', 0xB07, 3);
addTendrilMesh('tendril_02', 0xE77, 3);
addTendrilMesh('tendril_03', 0x1C4, 3);

const gltf = {
  asset: { version: '2.0', generator: 'grimcraft-generate-plasma-bolt' },
  scene: 0,
  scenes: [{ name: 'plasma_bolt', nodes: [0, 1, 2, 3, 4, 5] }],
  nodes: [
    { name: 'bolt_core', mesh: 0 },
    { name: 'bolt_shell', mesh: 1 },
    { name: 'bolt_halo', mesh: 2 },
    { name: 'tendril_01', mesh: 3 },
    { name: 'tendril_02', mesh: 4 },
    { name: 'tendril_03', mesh: 5 },
  ],
  meshes,
  materials: [
    {
      name: 'bolt_core_mat',
      pbrMetallicRoughness: { baseColorFactor: [0.02, 0.05, 0.07, 1], metallicFactor: 0, roughnessFactor: 0.4 },
      emissiveFactor: [2.4, 3.1, 3.4],
    },
    {
      name: 'bolt_shell_mat',
      pbrMetallicRoughness: { baseColorFactor: [0.02, 0.09, 0.25, 1], metallicFactor: 0, roughnessFactor: 0.35 },
      emissiveFactor: [0.4, 1.1, 3.0],
    },
    {
      name: 'bolt_halo_mat',
      pbrMetallicRoughness: { baseColorFactor: [0.05, 0.25, 0.8, 0.32], metallicFactor: 0, roughnessFactor: 0.9 },
      emissiveFactor: [0.12, 0.45, 1.5],
      alphaMode: 'BLEND',
      doubleSided: true,
    },
    {
      name: 'tendril_mat',
      pbrMetallicRoughness: { baseColorFactor: [0.0, 0.15, 0.3, 1], metallicFactor: 0, roughnessFactor: 0.5 },
      emissiveFactor: [0.6, 1.7, 2.6],
    },
  ],
  buffers: [{ byteLength }],
  bufferViews,
  accessors,
};

const jsonBytes = Buffer.from(JSON.stringify(gltf), 'utf8');
const jsonPad = (4 - (jsonBytes.length % 4)) % 4;
const jsonPadded = Buffer.concat([jsonBytes, Buffer.alloc(jsonPad, 0x20)]);
const binBuffers = chunks.map((c) => Buffer.from(c.data.buffer, c.data.byteOffset, c.data.byteLength));
const binLength = binBuffers.reduce((n, b) => n + b.length, 0);
const binPad = (4 - (binLength % 4)) % 4;
const totalLength = 12 + 8 + jsonPadded.length + 8 + binLength + binPad;
const out = Buffer.alloc(totalLength);
let o = 0;
out.writeUInt32LE(0x46546c67, o); o += 4; // glTF
out.writeUInt32LE(2, o); o += 4;
out.writeUInt32LE(totalLength, o); o += 4;
out.writeUInt32LE(jsonPadded.length, o); o += 4;
out.writeUInt32LE(0x4e4f534a, o); o += 4; // JSON
jsonPadded.copy(out, o); o += jsonPadded.length;
out.writeUInt32LE(binLength + binPad, o); o += 4;
out.writeUInt32LE(0x004e4942, o); o += 4; // BIN
for (const b of binBuffers) { b.copy(out, o); o += b.length; }

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, out);
console.log(`wrote ${outPath} (${out.length} bytes, ${meshes.length} meshes)`);
