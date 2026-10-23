// Manual editing tools for `guardsmen_lasgun_mesh.glb` (and any GLB).
// glTF has no "hidden" flag, so hiding = stripping the `mesh` link from a
// node (nodes, skins, and animations stay intact and reversible from source).
//
//   node scripts/glb-mesh-tool.mjs list <file.glb>
//   node scripts/glb-mesh-tool.mjs isolate <src.glb> <dst.glb> --keep <name...>
//   node scripts/glb-mesh-tool.mjs set-transform <file.glb> --node <name>
//       [--pos x,y,z] [--rot x,y,z,w] [--scale x,y,z|s]
//
// `isolate` always regenerates from a source file, so to undo manual edits
// just re-run it. Examples:
//   node scripts/glb-mesh-tool.mjs list models/ig/infantry/guardsmen.glb
//   node scripts/glb-mesh-tool.mjs isolate models/ig/infantry/guardsmen.glb \
//       models/ig/infantry/guardsmen_lasgun_mesh.glb --keep guardsmen_lasgun
//   node scripts/glb-mesh-tool.mjs set-transform \
//       models/ig/infantry/guardsmen_lasgun_mesh.glb \
//       --node guardsmen_lasgun --rot 0,0,0,1
import fs from 'node:fs';

export function readGlb(filePath) {
  const file = fs.readFileSync(filePath);
  if (file.readUInt32LE(0) !== 0x46546c67) throw new Error(`${filePath}: not a GLB`);
  if (file.readUInt32LE(4) !== 2) throw new Error(`${filePath}: unsupported glTF version`);
  const jsonLength = file.readUInt32LE(12);
  const json = JSON.parse(file.subarray(20, 20 + jsonLength).toString('utf8'));
  const binLength = file.readUInt32LE(20 + jsonLength);
  const bin = file.subarray(20 + jsonLength + 8, 20 + jsonLength + 8 + binLength);
  return { json, bin };
}

export function writeGlb(filePath, json, bin) {
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
  fs.writeFileSync(filePath, out);
  return out.length;
}

function parentsOf(json) {
  const parentOf = new Map();
  json.nodes.forEach((node, i) => {
    for (const child of node.children || []) parentOf.set(child, i);
  });
  return parentOf;
}

export function listGlb(filePath) {
  const { json } = readGlb(filePath);
  const parentOf = parentsOf(json);
  const lines = [];
  const walk = (i, depth) => {
    const node = json.nodes[i];
    const tags = [];
    if (node.mesh !== undefined) tags.push(`mesh ${node.mesh}`);
    if (node.skin !== undefined) tags.push(node.mesh !== undefined ? 'skinned' : 'skinned, hidden');
    if (!node.children?.length && node.mesh === undefined && node.skin === undefined) tags.push('empty');
    lines.push(`${'  '.repeat(depth)}${i} ${node.name || '(unnamed)'}${tags.length ? ` [${tags.join(', ')}]` : ''}`);
    for (const child of node.children || []) walk(child, depth + 1);
  };
  json.nodes.forEach((_, i) => {
    if (!parentOf.has(i)) walk(i, 0);
  });
  return lines.join('\n');
}

// Copy src -> dst keeping meshes only on kept nodes (exact names) and their
// descendants. Everything else loses its `mesh` link. Returns hidden count.
export function isolateMeshes(srcPath, dstPath, keepNames) {
  const { json, bin } = readGlb(srcPath);
  const keep = new Set(keepNames);
  const parentOf = parentsOf(json);
  const keptAlive = new Set();
  const isKept = (i) => {
    let c = i;
    while (c !== undefined) {
      if (keep.has(json.nodes[c].name)) return true;
      c = parentOf.get(c);
    }
    return false;
  };
  let hidden = 0;
  json.nodes.forEach((node, i) => {
    if (node.mesh === undefined) return;
    if (isKept(i)) {
      keptAlive.add(node.name);
    } else {
      delete node.mesh;
      hidden++;
    }
  });
  const missing = [...keep].filter((name) => !json.nodes.some((n) => n.name === name));
  if (missing.length) throw new Error(`nodes not found: ${missing.join(', ')}`);
  writeGlb(dstPath, json, bin);
  return { hidden, kept: [...keptAlive] };
}

function parseVec(str, size, flag) {
  if (str === undefined) return undefined;
  const parts = str.split(',').map(Number);
  if (parts.length !== size || parts.some((v) => !Number.isFinite(v))) {
    throw new Error(`${flag} expects ${size} comma-separated numbers, got "${str}"`);
  }
  return parts;
}

// Set a node's TRS in place. At least one of --pos/--rot/--scale required.
export function setNodeTransform(filePath, { node, pos, rot, scale }) {
  const { json, bin } = readGlb(filePath);
  const matches = json.nodes
    .map((n, i) => ({ n, i }))
    .filter(({ n }) => n.name === node);
  if (matches.length === 0) throw new Error(`node "${node}" not found`);
  if (matches.length > 1) {
    console.warn(`warning: ${matches.length} nodes named "${node}", editing index ${matches[0].i}`);
  }
  const target = matches[0].n;
  if (target.matrix) throw new Error(`node "${node}" uses a baked matrix; delete it first or edit the matrix directly`);
  const translation = parseVec(pos, 3, '--pos');
  const rotation = parseVec(rot, 4, '--rot');
  let scaling;
  if (scale !== undefined) {
    scaling = scale.includes(',') ? parseVec(scale, 3, '--scale') : [Number(scale), Number(scale), Number(scale)];
    if (scaling.some((v) => !Number.isFinite(v))) throw new Error(`--scale expects a number or x,y,z, got "${scale}"`);
  }
  if (!translation && !rotation && !scaling) throw new Error('nothing to set: pass --pos, --rot, or --scale');
  if (translation) target.translation = translation;
  if (rotation) target.rotation = rotation;
  if (scaling) target.scale = scaling;
  writeGlb(filePath, json, bin);
  return matches[0].i;
}

function usage() {
  console.log(`usage:
  node scripts/glb-mesh-tool.mjs list <file.glb>
  node scripts/glb-mesh-tool.mjs isolate <src.glb> <dst.glb> --keep <name...>
  node scripts/glb-mesh-tool.mjs set-transform <file.glb> --node <name> [--pos x,y,z] [--rot x,y,z,w] [--scale x,y,z|s]`);
}

function flagValue(args, flag) {
  const i = args.indexOf(flag);
  if (i < 0 || i + 1 >= args.length) return undefined;
  return args[i + 1];
}

async function main() {
  const [, , cmd, ...rest] = process.argv;
  try {
    if (cmd === 'list') {
      const [file] = rest;
      if (!file) throw new Error('list needs <file.glb>');
      console.log(listGlb(file));
    } else if (cmd === 'isolate') {
      const [src, dst] = rest;
      const keep = flagValue(rest, '--keep');
      if (!src || !dst || !keep) throw new Error('isolate needs <src.glb> <dst.glb> --keep <name...>');
      const { hidden, kept } = isolateMeshes(src, dst, keep.split(',').map((s) => s.trim()).filter(Boolean));
      console.log(`wrote ${dst} (${hidden} meshes hidden, kept: ${kept.join(', ') || 'none'})`);
    } else if (cmd === 'set-transform') {
      const [file] = rest;
      const node = flagValue(rest, '--node');
      if (!file || !node) throw new Error('set-transform needs <file.glb> --node <name>');
      const index = setNodeTransform(file, {
        node,
        pos: flagValue(rest, '--pos'),
        rot: flagValue(rest, '--rot'),
        scale: flagValue(rest, '--scale'),
      });
      console.log(`updated node ${index} (${node}) in ${file} (undo: re-run isolate)`);
    } else {
      usage();
      process.exitCode = cmd ? 1 : 0;
    }
  } catch (error) {
    console.error(`error: ${error.message}`);
    process.exitCode = 1;
  }
}

const invokedAsScript = process.argv[1] && import.meta.url.endsWith(encodeURI(process.argv[1].split(/[\\/]/).pop()));
if (invokedAsScript) await main();
