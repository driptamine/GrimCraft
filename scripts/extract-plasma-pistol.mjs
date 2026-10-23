// Extracts the plasma pistol out of models/ig/infantry/guardsmen.glb into a
// standalone models/ig/weapons/plasma_pistol.glb with two meshes:
//   - guardsmen_plasma_pistol (original geometry + original material/textures)
//   - glow_pistol (rounded box fitted over the chamber near marker_plasma_glow,
//     hot emissive, long axis aligned with the barrel)
// The pistol is rigid-weighted to bone_ig_hand_weapon_r, so vertices are
// baked by that joint's inverse-bind matrix: the file lives in hand-bone
// space and can be parented straight under the bone. Marker nodes are copied
// with their bone-local transforms for muzzle/chamber anchors.
// Run: node scripts/extract-plasma-pistol.mjs
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcPath = join(rootDir, 'models', 'ig', 'infantry', 'guardsmen.glb');
const outPath = join(rootDir, 'models', 'ig', 'weapons', 'plasma_pistol.glb');

const PISTOL_MESH = 19;
const GLOW_RADIUS = 0.08;

const src = readFileSync(srcPath);
const srcJsonLen = src.readUInt32LE(12);
const srcJson = JSON.parse(src.subarray(20, 20 + srcJsonLen).toString('utf8').trim());
const srcBinLen = src.readUInt32LE(20 + srcJsonLen);
const srcBin = src.subarray(20 + srcJsonLen + 8, 20 + srcJsonLen + 8 + srcBinLen);

const COMP = { 5120: 1, 5121: 1, 5122: 2, 5123: 2, 5125: 4, 5126: 4 };
const NCOMP = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT2: 4, MAT3: 9, MAT4: 16 };

function readAccessor(json, bin, index) {
  const acc = json.accessors[index];
  const view = json.bufferViews[acc.bufferView];
  if (view.byteStride) {
    throw new Error(`interleaved accessor ${index} not supported`);
  }
  const base = (view.byteOffset || 0) + (acc.byteOffset || 0);
  const n = acc.count * NCOMP[acc.type];
  const buf = bin.buffer.slice(bin.byteOffset + base, bin.byteOffset + base + n * COMP[acc.componentType]);
  let array;
  if (acc.componentType === 5126) array = new Float32Array(buf);
  else if (acc.componentType === 5123) array = new Uint16Array(buf);
  else if (acc.componentType === 5125) array = new Uint32Array(buf);
  else throw new Error(`componentType ${acc.componentType} not supported`);
  return { array, count: acc.count, type: acc.type, componentType: acc.componentType };
}

// ibm = inverse-bind matrix of bone_ig_hand_weapon_r (joint driving the pistol).
const skin = srcJson.skins[0];
const boneNodeIndex = srcJson.nodes.findIndex((n) => n.name === 'bone_ig_hand_weapon_r');
const jointIndex = skin.joints.indexOf(boneNodeIndex);
const ibmAll = readAccessor(srcJson, srcBin, skin.inverseBindMatrices);
const ibm = Array.from(ibmAll.array.subarray(jointIndex * 16, jointIndex * 16 + 16));

function mulMat4Point(m, p) {
  const [x, y, z] = p;
  const w = m[3] * x + m[7] * y + m[11] * z + m[15];
  return [
    (m[0] * x + m[4] * y + m[8] * z + m[12]) / w,
    (m[1] * x + m[5] * y + m[9] * z + m[13]) / w,
    (m[2] * x + m[6] * y + m[10] * z + m[14]) / w,
  ];
}

function invertMat4(m) {
  const inv = new Array(16);
  const [a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33] = m;
  const b00 = a00 * a11 - a01 * a10;
  const b01 = a00 * a12 - a02 * a10;
  const b02 = a00 * a13 - a03 * a10;
  const b03 = a01 * a12 - a02 * a11;
  const b04 = a01 * a13 - a03 * a11;
  const b05 = a02 * a13 - a03 * a12;
  const b06 = a20 * a31 - a21 * a30;
  const b07 = a20 * a32 - a22 * a30;
  const b08 = a20 * a33 - a23 * a30;
  const b09 = a21 * a32 - a22 * a31;
  const b10 = a21 * a33 - a23 * a31;
  const b11 = a22 * a33 - a23 * a32;
  let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  if (!det) throw new Error('singular inverse-bind matrix');
  det = 1 / det;
  inv[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  inv[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  inv[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  inv[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  inv[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  inv[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  inv[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  inv[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  inv[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  inv[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  inv[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  inv[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  inv[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  inv[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  inv[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  inv[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
  return inv;
}

// Normal matrix = upper 3x3 of (ibm^-1)^T, but ibm already maps bind->joint;
// normals need (ibm^-1)^T applied... equivalently transpose of inverse(ibm).
const ibmInv = invertMat4(ibm);
function xformNormal(n) {
  const [x, y, z] = n;
  const nx = ibmInv[0] * x + ibmInv[1] * y + ibmInv[2] * z;
  const ny = ibmInv[4] * x + ibmInv[5] * y + ibmInv[6] * z;
  const nz = ibmInv[8] * x + ibmInv[9] * y + ibmInv[10] * z;
  const inv = 1 / (Math.hypot(nx, ny, nz) || 1);
  return [nx * inv, ny * inv, nz * inv];
}

const prim = srcJson.meshes[PISTOL_MESH].primitives[0];
const posAttr = readAccessor(srcJson, srcBin, prim.attributes.POSITION);
const nrmAttr = readAccessor(srcJson, srcBin, prim.attributes.NORMAL);
const uvAttr = readAccessor(srcJson, srcBin, prim.attributes.TEXCOORD_0);
const idxAttr = readAccessor(srcJson, srcBin, prim.indices);
const vCount = posAttr.count;

// Bake pistol verts into hand-bone space.
const bakedPos = new Float32Array(vCount * 3);
const bakedNrm = new Float32Array(vCount * 3);
for (let i = 0; i < vCount; i++) {
  const p = mulMat4Point(ibm, [posAttr.array[i * 3], posAttr.array[i * 3 + 1], posAttr.array[i * 3 + 2]]);
  bakedPos.set(p, i * 3);
  const n = xformNormal([nrmAttr.array[i * 3], nrmAttr.array[i * 3 + 1], nrmAttr.array[i * 3 + 2]]);
  bakedNrm.set(n, i * 3);
}

// Chamber = triangles near the glow marker (already bone-local: child of the bone).
const glowNode = srcJson.nodes.find((n) => n.name === 'marker_plasma_glow');
const glowLocal = glowNode.translation;
const muzzleNode = srcJson.nodes.find((n) => n.name === 'marker_plasma_muzzle');
const muzzleLocal = muzzleNode.translation;
const idx = idxAttr.array;
const triCount = idx.length / 3;
let radius = GLOW_RADIUS;
let picked = [];
for (let attempt = 0; attempt < 4 && picked.length === 0; attempt++) {
  picked = [];
  for (let t = 0; t < triCount; t++) {
    const cx = (bakedPos[idx[t * 3] * 3] + bakedPos[idx[t * 3 + 1] * 3] + bakedPos[idx[t * 3 + 2] * 3]) / 3;
    const cy = (bakedPos[idx[t * 3] * 3 + 1] + bakedPos[idx[t * 3 + 1] * 3 + 1] + bakedPos[idx[t * 3 + 2] * 3 + 1]) / 3;
    const cz = (bakedPos[idx[t * 3] * 3 + 2] + bakedPos[idx[t * 3 + 1] * 3 + 2] + bakedPos[idx[t * 3 + 2] * 3 + 2]) / 3;
    if (Math.hypot(cx - glowLocal[0], cy - glowLocal[1], cz - glowLocal[2]) <= radius) {
      picked.push(t);
    }
  }
  radius *= 1.5;
}
radius /= 1.5;
if (!picked.length) {
  throw new Error('no chamber triangles found near marker_plasma_glow');
}

// Chamber frame from the picked triangles: bbox center, barrel direction
// (grip marker -> muzzle marker) and extents along / across the barrel.
const _sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const _dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const _cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const _norm = (a) => {
  const inv = 1 / (Math.hypot(a[0], a[1], a[2]) || 1);
  return [a[0] * inv, a[1] * inv, a[2] * inv];
};
const chamberVerts = [];
for (const t of picked) {
  for (let k = 0; k < 3; k++) {
    const vi = idx[t * 3 + k];
    chamberVerts.push([bakedPos[vi * 3], bakedPos[vi * 3 + 1], bakedPos[vi * 3 + 2]]);
  }
}
const chamberCenter = [0, 1, 2].map(
  (k) => chamberVerts.reduce((s, v) => s + v[k], 0) / chamberVerts.length,
);
const barrelDir = _norm(_sub(muzzleLocal, glowLocal));
const basisU = _norm(_cross(barrelDir, [0, 1, 0]));
const basisV = _cross(barrelDir, basisU);
let tMin = Infinity;
let tMax = -Infinity;
let uMax = 0;
let vMax = 0;
for (const v of chamberVerts) {
  const d = _sub(v, chamberCenter);
  const t = _dot(d, barrelDir);
  tMin = Math.min(tMin, t);
  tMax = Math.max(tMax, t);
  uMax = Math.max(uMax, Math.abs(_dot(d, basisU)));
  vMax = Math.max(vMax, Math.abs(_dot(d, basisV)));
}
// Slightly proud of the surface so the glowing cell reads over the gun body.
const halfExtents = [
  Math.max(0.02, ((tMax - tMin) / 2) * 1.15),
  Math.max(0.02, uMax * 1.2),
  Math.max(0.02, vMax * 1.2),
];

// Rounded box as a superellipsoid (exponent -> 0 is a box, 1 an ellipsoid).
function buildRoundedBox(center, bx, by, bz, a, e = 0.3, nEta = 14, nOmega = 20) {
  const ce = (th) => Math.sign(Math.cos(th)) * Math.pow(Math.abs(Math.cos(th)), e);
  const se = (th) => Math.sign(Math.sin(th)) * Math.pow(Math.abs(Math.sin(th)), e);
  const point = (eta, om) => [
    a[0] * ce(eta) * ce(om),
    a[1] * ce(eta) * se(om),
    a[2] * se(eta),
  ];
  const gPos = [];
  const gNrm = [];
  const gUv = [];
  const gIdx = [];
  const h = 1e-3;
  for (let iy = 0; iy <= nEta; iy++) {
    const eta = -Math.PI / 2 + (iy / nEta) * Math.PI;
    for (let ix = 0; ix <= nOmega; ix++) {
      const om = -Math.PI + (ix / nOmega) * Math.PI * 2;
      const p = point(eta, om);
      const dEta = _sub(point(Math.min(Math.PI / 2, eta + h), om), point(Math.max(-Math.PI / 2, eta - h), om));
      const dOm = _sub(point(eta, om + h), point(eta, om - h));
      let n = _norm(_cross(dOm, dEta));
      if (_dot(n, p) < 0) n = [-n[0], -n[1], -n[2]];
      // Local X -> barrel, Y -> U, Z -> V, then translate to the chamber.
      gPos.push(
        center[0] + bx[0] * p[0] + by[0] * p[1] + bz[0] * p[2],
        center[1] + bx[1] * p[0] + by[1] * p[1] + bz[1] * p[2],
        center[2] + bx[2] * p[0] + by[2] * p[1] + bz[2] * p[2],
      );
      gNrm.push(
        bx[0] * n[0] + by[0] * n[1] + bz[0] * n[2],
        bx[1] * n[0] + by[1] * n[1] + bz[1] * n[2],
        bx[2] * n[0] + by[2] * n[1] + bz[2] * n[2],
      );
      gUv.push(ix / nOmega, iy / nEta);
    }
  }
  for (let iy = 0; iy < nEta; iy++) {
    for (let ix = 0; ix < nOmega; ix++) {
      const r0 = iy * (nOmega + 1) + ix;
      const r1 = r0 + nOmega + 1;
      gIdx.push(r0, r1, r0 + 1, r1, r1 + 1, r0 + 1);
    }
  }
  return { gPos, gNrm, gUv, gIdx };
}

const { gPos, gNrm, gUv, gIdx } = buildRoundedBox(
  chamberCenter, barrelDir, basisU, basisV, halfExtents,
);
// Outer halo shell: same rounded box, scaled up — fake volumetric glow that
// reads in any viewer, no post-processing needed.
const haloHalf = halfExtents.map((v) => v * 1.7);
const halo = buildRoundedBox(chamberCenter, barrelDir, basisU, basisV, haloHalf, 0.35, 10, 14);
const hPos = halo.gPos;
const hNrm = halo.gNrm;
const hUv = halo.gUv;
const hIdx = halo.gIdx;

// ---- Assemble the output GLB ----
const outBinParts = [];
const outBufferViews = [];
const outAccessors = [];
let outBinLen = 0;
function pushData(u8, target) {
  const pad = (4 - (u8.length % 4)) % 4;
  const viewIndex = outBufferViews.length;
  outBufferViews.push({ buffer: 0, byteOffset: outBinLen, byteLength: u8.length, ...(target ? { target } : {}) });
  outBinParts.push(u8);
  if (pad) outBinParts.push(new Uint8Array(pad));
  outBinLen += u8.length + pad;
  return viewIndex;
}
function pushAccessor(viewIndex, componentType, count, type, min, max) {
  outAccessors.push({ bufferView: viewIndex, componentType, count, type, ...(min ? { min, max } : {}) });
  return outAccessors.length - 1;
}
function minMax(arr, stride) {
  const min = new Array(stride).fill(Infinity);
  const max = new Array(stride).fill(-Infinity);
  for (let i = 0; i < arr.length; i += stride) {
    for (let k = 0; k < stride; k++) {
      const v = arr[i + k];
      if (v < min[k]) min[k] = v;
      if (v > max[k]) max[k] = v;
    }
  }
  return { min, max };
}
const f32 = (a) => new Uint8Array(new Float32Array(a).buffer);
const u16 = (a) => new Uint8Array(new Uint16Array(a).buffer);
const u32 = (a) => new Uint8Array(new Uint32Array(a).buffer);

const ARRAY = 34962;
const ELEMENT = 34963;
// Pistol geometry (baked positions/normals, original uvs/indices).
const pistolPosMM = minMax(bakedPos, 3);
const pistolPosAcc = pushAccessor(pushData(f32(bakedPos), ARRAY), 5126, vCount, 'VEC3', pistolPosMM.min, pistolPosMM.max);
const pistolNrmAcc = pushAccessor(pushData(f32(bakedNrm), ARRAY), 5126, vCount, 'VEC3');
const pistolUvAcc = pushAccessor(pushData(f32(Array.from(uvAttr.array)), ARRAY), 5126, vCount, 'VEC2');
const pistolIdxBytes = idxAttr.componentType === 5125 ? u32(Array.from(idx)) : u16(Array.from(idx));
const pistolIdxAcc = pushAccessor(pushData(pistolIdxBytes, ELEMENT), idxAttr.componentType, idx.length, 'SCALAR');
// Glow geometry.
const glowPosArr = new Float32Array(gPos);
const glowPosMM = minMax(glowPosArr, 3);
const glowPosAcc = pushAccessor(pushData(f32(glowPosArr), ARRAY), 5126, glowPosArr.length / 3, 'VEC3', glowPosMM.min, glowPosMM.max);
const glowNrmAcc = pushAccessor(pushData(f32(new Float32Array(gNrm)), ARRAY), 5126, gPos.length / 3, 'VEC3');
const glowUvAcc = pushAccessor(pushData(f32(new Float32Array(gUv)), ARRAY), 5126, gPos.length / 3, 'VEC2');
const glowIdxArr = new Uint32Array(gIdx);
const glowIdxAcc = pushAccessor(pushData(new Uint8Array(glowIdxArr.buffer), ELEMENT), 5125, gIdx.length, 'SCALAR');
// Halo shell geometry.
const haloPosArr = new Float32Array(hPos);
const haloPosMM = minMax(haloPosArr, 3);
const haloPosAcc = pushAccessor(pushData(f32(haloPosArr), ARRAY), 5126, haloPosArr.length / 3, 'VEC3', haloPosMM.min, haloPosMM.max);
const haloNrmAcc = pushAccessor(pushData(f32(new Float32Array(hNrm)), ARRAY), 5126, hPos.length / 3, 'VEC3');
const haloUvAcc = pushAccessor(pushData(f32(new Float32Array(hUv)), ARRAY), 5126, hPos.length / 3, 'VEC2');
const haloIdxAcc = pushAccessor(pushData(new Uint8Array(new Uint32Array(hIdx).buffer), ELEMENT), 5125, hIdx.length, 'SCALAR');

// Copy the pistol material + its texture/image/sampler chain.
const srcMat = srcJson.materials[prim.material];
const texRemap = new Map();
const imgRemap = new Map();
const smpRemap = new Map();
const outImages = [];
const outSamplers = [];
const outTextures = [];
function copyImage(srcIndex) {
  if (imgRemap.has(srcIndex)) return imgRemap.get(srcIndex);
  const img = srcJson.images[srcIndex];
  const view = srcJson.bufferViews[img.bufferView];
  const slice = srcBin.subarray(view.byteOffset || 0, (view.byteOffset || 0) + view.byteLength);
  const outView = pushData(new Uint8Array(slice), null);
  outImages.push({ bufferView: outView, mimeType: img.mimeType, ...(img.name ? { name: img.name } : {}) });
  imgRemap.set(srcIndex, outImages.length - 1);
  return outImages.length - 1;
}
function copySampler(srcIndex) {
  if (srcIndex === undefined || srcIndex === null) return undefined;
  if (smpRemap.has(srcIndex)) return smpRemap.get(srcIndex);
  outSamplers.push({ ...srcJson.samplers[srcIndex] });
  smpRemap.set(srcIndex, outSamplers.length - 1);
  return outSamplers.length - 1;
}
function copyTexture(srcIndex) {
  if (texRemap.has(srcIndex)) return texRemap.get(srcIndex);
  const tex = srcJson.textures[srcIndex];
  const out = { source: copyImage(tex.source) };
  const smp = copySampler(tex.sampler);
  if (smp !== undefined) out.sampler = smp;
  if (tex.name) out.name = tex.name;
  outTextures.push(out);
  texRemap.set(srcIndex, outTextures.length - 1);
  return outTextures.length - 1;
}
function copyTexRef(ref) {
  if (!ref) return ref;
  const out = { ...ref, index: copyTexture(ref.index) };
  return out;
}
const pistolMat = JSON.parse(JSON.stringify(srcMat));
if (pistolMat.pbrMetallicRoughness) {
  for (const k of Object.keys(pistolMat.pbrMetallicRoughness)) {
    if (/Texture$/.test(k)) pistolMat.pbrMetallicRoughness[k] = copyTexRef(pistolMat.pbrMetallicRoughness[k]);
  }
}
for (const k of ['normalTexture', 'occlusionTexture', 'emissiveTexture']) {
  if (pistolMat[k]) pistolMat[k] = copyTexRef(pistolMat[k]);
}

const outJson = {
  asset: { version: '2.0', generator: 'grimcraft-extract-plasma-pistol' },
  scene: 0,
  scenes: [{ name: 'plasma_pistol', nodes: [0, 1, 2, 3, 4, 5] }],
  nodes: [
    { name: 'guardsmen_plasma_pistol', mesh: 0 },
    { name: 'glow_pistol', mesh: 1 },
    { name: 'glow_pistol_halo', mesh: 2 },
    { name: 'marker_plasma_glow', translation: [...glowLocal] },
    { name: 'marker_plasma_muzzle', translation: [...muzzleLocal] },
    {
      name: 'glow_pistol_light',
      translation: [...chamberCenter],
      extensions: { KHR_lights_punctual: { light: 0 } },
    },
  ],
  meshes: [
    {
      name: 'guardsmen_plasma_pistol',
      primitives: [{
        attributes: { POSITION: pistolPosAcc, NORMAL: pistolNrmAcc, TEXCOORD_0: pistolUvAcc },
        indices: pistolIdxAcc,
        material: 0,
      }],
    },
    {
      name: 'glow_pistol',
      primitives: [{
        attributes: { POSITION: glowPosAcc, NORMAL: glowNrmAcc, TEXCOORD_0: glowUvAcc },
        indices: glowIdxAcc,
        material: 1,
      }],
    },
    {
      name: 'glow_pistol_halo',
      primitives: [{
        attributes: { POSITION: haloPosAcc, NORMAL: haloNrmAcc, TEXCOORD_0: haloUvAcc },
        indices: haloIdxAcc,
        material: 2,
      }],
    },
  ],
  materials: [
    pistolMat,
    {
      name: 'glow_pistol_mat',
      pbrMetallicRoughness: { baseColorFactor: [0.0, 0.02, 0.05, 1.0], metallicFactor: 0, roughnessFactor: 0.4 },
      emissiveFactor: [2.2, 3.4, 4.2],
      doubleSided: true,
      extensions: { KHR_materials_emissive_strength: { emissiveStrength: 2.0 } },
    },
    {
      name: 'glow_pistol_halo_mat',
      pbrMetallicRoughness: { baseColorFactor: [0.1, 0.3, 0.9, 0.3], metallicFactor: 0, roughnessFactor: 0.9 },
      emissiveFactor: [0.5, 1.1, 2.2],
      alphaMode: 'BLEND',
      doubleSided: true,
    },
  ],
  buffers: [{ byteLength: outBinLen }],
  bufferViews: outBufferViews,
  accessors: outAccessors,
  extensions: {
    KHR_lights_punctual: {
      lights: [{
        name: 'glow_pistol_light',
        type: 'point',
        color: [0.4, 0.75, 1.0],
        intensity: 3.0,
        range: 1.6,
      }],
    },
  },
};
if (outImages.length) outJson.images = outImages;
if (outSamplers.length) outJson.samplers = outSamplers;
if (outTextures.length) outJson.textures = outTextures;
outJson.extensionsUsed = [...new Set([
  ...(srcJson.extensionsUsed || []),
  'KHR_materials_emissive_strength',
  'KHR_lights_punctual',
])];

const jsonBytes = Buffer.from(JSON.stringify(outJson), 'utf8');
const jsonPad = (4 - (jsonBytes.length % 4)) % 4;
const jsonPadded = Buffer.concat([jsonBytes, Buffer.alloc(jsonPad, 0x20)]);
const totalBin = Buffer.concat(outBinParts.map((p) => Buffer.from(p.buffer, p.byteOffset, p.byteLength)));
const totalLength = 12 + 8 + jsonPadded.length + 8 + totalBin.length;
const out = Buffer.alloc(totalLength);
let o = 0;
out.writeUInt32LE(0x46546c67, o); o += 4;
out.writeUInt32LE(2, o); o += 4;
out.writeUInt32LE(totalLength, o); o += 4;
out.writeUInt32LE(jsonPadded.length, o); o += 4;
out.writeUInt32LE(0x4e4f534a, o); o += 4;
jsonPadded.copy(out, o); o += jsonPadded.length;
out.writeUInt32LE(totalBin.length, o); o += 4;
out.writeUInt32LE(0x004e4942, o); o += 4;
totalBin.copy(out, o);

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, out);
console.log(`wrote ${outPath} (${out.length} bytes)`);
console.log(`pistol tris: ${triCount}, chamber tris picked: ${picked.length} (radius ${radius.toFixed(3)})`);
console.log(`glow rounded box: half extents ${halfExtents.map((v) => v.toFixed(3)).join(' x ')}, center ${chamberCenter.map((v) => v.toFixed(3)).join(',')}, tris: ${gIdx.length / 3}`);
