// Copy animation clips (by name prefix) from one GLB into another,
// retargeting channels by bone NODE NAME. Used to give Dark Reapers the
// melee family from eldar/Guardian.glb: both share the bip01 skeleton,
// guardian-only prop nodes are skipped.
//
// Usage:
//   node tools/copy-melee-clips.mjs <src.glb> <dst.glb> [PREFIX]
// Backs up <dst.glb> to <dst.glb.bak next to itself (refuses to run twice
// without restoring, so the backup never gets overwritten).
import fs from 'node:fs';

const COMP_COUNT = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT2: 4, MAT3: 9, MAT4: 16 };
const COMP_BYTES = { 5120: 1, 5121: 1, 5122: 2, 5123: 2, 5125: 4, 5126: 4 };

function readGlb(path) {
  const buf = fs.readFileSync(path);
  if (buf.readUInt32LE(0) !== 0x46546c67) throw new Error(`${path}: not a GLB`);
  const jsonLen = buf.readUInt32LE(12);
  const json = JSON.parse(buf.slice(20, 20 + jsonLen).toString('utf8'));
  let bin = Buffer.alloc(0);
  const binOff = 20 + jsonLen;
  if (binOff + 8 <= buf.length) {
    const chunkLen = buf.readUInt32LE(binOff);
    const chunkType = buf.readUInt32LE(binOff + 4);
    if (chunkType === 0x004e4942) bin = buf.slice(binOff + 8, binOff + 8 + chunkLen);
  }
  if ((json.buffers || []).length !== 1) throw new Error(`${path}: expected exactly one buffer`);
  return { json, bin };
}

function writeGlb(path, json, bin) {
  const jsonBytes = Buffer.from(JSON.stringify(json), 'utf8');
  const jsonPad = (4 - (jsonBytes.length % 4)) % 4;
  const binPad = (4 - (bin.length % 4)) % 4;
  const total = 12 + 8 + jsonBytes.length + jsonPad + (bin.length ? 8 + bin.length + binPad : 0);
  const out = Buffer.alloc(total);
  out.writeUInt32LE(0x46546c67, 0);
  out.writeUInt32LE(2, 4);
  out.writeUInt32LE(total, 8);
  out.writeUInt32LE(jsonBytes.length + jsonPad, 12);
  out.writeUInt32LE(0x4e4f534a, 16);
  jsonBytes.copy(out, 20);
  out.fill(0x20, 20 + jsonBytes.length, 20 + jsonBytes.length + jsonPad);
  if (bin.length) {
    const off = 20 + jsonBytes.length + jsonPad;
    out.writeUInt32LE(bin.length + binPad, off);
    out.writeUInt32LE(0x004e4942, off + 4);
    bin.copy(out, off + 8);
    out.fill(0, off + 8 + bin.length, off + 8 + bin.length + binPad);
  }
  fs.writeFileSync(path, out);
}

const [srcPath, dstPath, prefix = 'MELEE'] = process.argv.slice(2);
if (!srcPath || !dstPath) {
  console.error('usage: node tools/copy-melee-clips.mjs <src.glb> <dst.glb> [PREFIX]');
  process.exit(1);
}
const bakPath = `${dstPath}.bak`;
if (fs.existsSync(bakPath)) {
  console.error(`refusing: backup already exists at ${bakPath} (restore it first)`);
  process.exit(1);
}

const src = readGlb(srcPath);
const dst = readGlb(dstPath);
fs.copyFileSync(dstPath, bakPath);
console.log(`backup: ${bakPath} (${fs.statSync(bakPath).size} bytes)`);

const dstNameToIndex = new Map(dst.json.nodes.map((n, i) => [n.name, i]));
const binParts = [dst.bin];
let binLen = dst.bin.length;
const align4 = () => { while (binLen % 4) { binParts.push(Buffer.from([0])); binLen += 1; } };

function copyBytes(srcAcc, srcBv) {
  const start = srcBv.byteOffset + (srcAcc.byteOffset || 0);
  return Buffer.from(src.bin.slice(start, start + srcBv.byteLength));
}

let copiedAnims = 0;
let skippedChannels = 0;
for (const anim of src.json.animations || []) {
  if (!anim.name.startsWith(prefix)) continue;
  const accRemap = new Map();
  const sampRemap = new Map();
  const copyAccessor = (srcAccIdx) => {
    if (accRemap.has(srcAccIdx)) return accRemap.get(srcAccIdx);
    const srcAcc = src.json.accessors[srcAccIdx];
    const srcBv = src.json.bufferViews[srcAcc.bufferView];
    const bytes = copyBytes(srcAcc, srcBv);
    align4();
    const newBvIdx = dst.json.bufferViews.length;
    const bv = { buffer: 0, byteOffset: binLen, byteLength: bytes.length };
    if (srcBv.byteStride !== undefined) bv.byteStride = srcBv.byteStride;
    if (srcBv.target !== undefined) bv.target = srcBv.target;
    dst.json.bufferViews.push(bv);
    binParts.push(bytes);
    binLen += bytes.length;
    const acc = {
      bufferView: newBvIdx,
      componentType: srcAcc.componentType,
      count: srcAcc.count,
      type: srcAcc.type,
    };
    if (srcAcc.normalized !== undefined) acc.normalized = srcAcc.normalized;
    if (srcAcc.min !== undefined) acc.min = srcAcc.min;
    if (srcAcc.max !== undefined) acc.max = srcAcc.max;
    dst.json.accessors.push(acc);
    const newIdx = dst.json.accessors.length - 1;
    accRemap.set(srcAccIdx, newIdx);
    return newIdx;
  };
  const copySampler = (srcSampIdx) => {
    if (sampRemap.has(srcSampIdx)) return sampRemap.get(srcSampIdx);
    const s = anim.samplers[srcSampIdx];
    const idx = newSamplers.length;
    newSamplers.push({
      interpolation: s.interpolation || 'LINEAR',
      input: copyAccessor(s.input),
      output: copyAccessor(s.output),
    });
    sampRemap.set(srcSampIdx, idx);
    return idx;
  };
  const newSamplers = [];
  const newChannels = [];
  for (const ch of anim.channels || []) {
    const nodeName = src.json.nodes[ch.target.node]?.name;
    if (nodeName === undefined || !dstNameToIndex.has(nodeName)) {
      skippedChannels += 1;
      continue;
    }
    newChannels.push({
      sampler: copySampler(ch.sampler),
      target: { node: dstNameToIndex.get(nodeName), path: ch.target.path },
    });
  }
  if (!newChannels.length) {
    console.log(`skip ${anim.name}: no mappable channels`);
    continue;
  }
  dst.json.animations.push({ name: anim.name, channels: newChannels, samplers: newSamplers });
  copiedAnims += 1;
  console.log(`+ ${anim.name}: ${newChannels.length} channels`);
}

writeGlb(dstPath, dst.json, Buffer.concat(binParts));
console.log(`wrote ${dstPath} (${fs.statSync(dstPath).size} bytes), ${copiedAnims} clips, ${skippedChannels} prop channels skipped`);
