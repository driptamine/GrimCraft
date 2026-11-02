import * as THREE from 'three';

import { createChunkReader, isChunky } from './sgb-reader.js';
import { createRshParser } from './rsh.js';
import { createRtxParser } from './rtx.js';
import { mkEmptyMesh, loadTexture } from '../three-helpers.js';

export const NUM_BONE_SLOTS = 4;

function worldTransform() {
  // Matches the WhmParser world axis convention.
  return new THREE.Matrix4().set(-1, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1);
}

export function createWhmParser(mod = null, scene = null) {
  const rootScene = scene || null;
  const rshParser = createRshParser(rootScene);
  const rtxParser = createRtxParser(rootScene);

  const meshes = {};
  const loadedMaterials = {};
  const internalTextures = {};
  const usedFiles = [];

  function ensure(condition, message, args = []) {
    if (condition) return;
    if (typeof console !== 'undefined') console.warn(message, ...args);
  }

  function readVec3(reader) {
    return new THREE.Vector3(reader.readFloat(), reader.readFloat(), reader.readFloat());
  }

  function readVec2(reader) {
    return new THREE.Vector2(reader.readFloat(), reader.readFloat());
  }

  function skipBbox(reader) {
    reader.skip(61);
  }

  function readBbox(reader) {
    reader.readU8(); // bbox_flag
    const res = { center: readVec3(reader), size: readVec3(reader), rotation: [readVec3(reader), readVec3(reader), readVec3(reader)] };
    return res;
  }

  function loadAllMaterials(reader, chunks) {
    for (const item of chunks.get('DATASSHR') || []) CH_DATASSHR(item[1]);
    for (const item of chunks.get('FOLDSTXT') || []) internalTextures[item[0].name.toLowerCase()] = CH_FOLDSTXT(item[0].name);
    for (const item of chunks.get('FOLDTXTR') || []) internalTextures[item[0].name.toLowerCase()] = rtxParser.CH_FOLDTXTR(item[1]);
    for (const item of chunks.get('FOLDSHDR') || []) {
      const header = item[0];
      const materialInfo = rshParser.CH_FOLDSHDR(item[1], internalTextures);
      loadedMaterials[header.name.toLowerCase()] = createMaterial(materialInfo);
    }
  }

  function CH_FOLDSTXT(texturePath) {
    const fullPath = `${texturePath}.rtx`;
    usedFiles.push(fullPath);
    if (!mod || typeof mod.locateData !== 'function') return null;
    const data = mod.locateData(fullPath);
    if (!data) { ensure(false, 'cannot find texture %s', [fullPath]); return null; }
    return rtxParser.parse(data.readBytes());
  }

  function createMaterial(info) {
    if (!rootScene) return null;
    const material = new THREE.MeshStandardMaterial();
    if (!info || !info.channels) return material;
    for (const channel of info.channels) {
      const image = info.channels[channel];
      if (!image) continue;
      if (channel === 0 && image.kind === 'tga') {
        const tex = loadTexture(image.url);
        material.map = tex;
      }
    }
    return material;
  }

  function CH_DATASSHR(reader) {
    // Material reference is loaded through loadAllMaterials; here we only record usage.
    const materialPath = reader.readString();
    usedFiles.push(`${materialPath}.rsh`);
  }

  function CH_DATADATA(reader, listChunk) {
    const numMeshes = reader.readU32();
    for (let i = 0; i < numMeshes; i++) {
      const meshName = reader.readString();
      const meshPath = reader.readString();
      const parentIdx = reader.readI32();
      if (meshPath === '') continue;
      const filename = `${meshPath}.whm`;
      usedFiles.push(filename);
      let data = null;
      if (mod && typeof mod.locateData === 'function') data = mod.locateData(filename);
      if (!data) { ensure(false, 'cannot find model %s', [filename]); continue; }
      const xrefReader = createChunkReader(data.readBytes());
      xrefReader.skipChunky();
      let chunk = xrefReader.readHeader();
      if (chunk && chunk.typeid === 'DATAFBIF') { xrefReader.skip(chunk.size); chunk = xrefReader.readHeader('FOLDRSGM'); }
      const chunkMap = {};
      while (xrefReader.hasData()) {
        const current = xrefReader.readHeader();
        if (!current) return;
        (chunkMap[current.typeid] = chunkMap[current.typeid] || []).push([current, xrefReader]);
      }
      loadAllMaterials(xrefReader, chunkMap);
      for (const item of chunkMap['FOLDMSGR'] || []) {
        const header = item[0];
        if (header.name.toLowerCase() === meshName.toLowerCase()) CH_FOLDMSGR(item[1], header);
      }
    }
  }

  function parseMeshData(reader, meshName) {
    reader.readHeader('DATADATA');
    reader.skip(8);
    const numPolygons = reader.readU32();
    reader.skip(4);
    const numSkinBones = reader.readU32();

    const idxToBoneName = {};
    for (let i = 0; i < numSkinBones; i++) {
      const boneName = reader.readString();
      const boneIdx = reader.readU32();
      idxToBoneName[boneIdx] = boneName;
    }

    const numVertices = reader.readU32();
    const vertexSizeId = reader.readU32();

    const vertices = [];
    for (let i = 0; i < numVertices; i++) vertices.push(readVec3(reader));

    const skinVerts = [];
    if (numSkinBones) {
      for (let i = 0; i < numVertices; i++) {
        let weightLast = 1.0;
        const weights = [];
        for (let slot = 0; slot < NUM_BONE_SLOTS - 1; slot++) {
          const wi = reader.readFloat();
          weightLast -= wi;
          weights.push(wi);
        }
        weights.push(weightLast);
        const bones = [];
        for (let slot = 0; slot < NUM_BONE_SLOTS; slot++) {
          const boneIdx = reader.readU8();
          bones.push(boneIdx === 255 ? '' : (idxToBoneName[boneIdx] || ''));
        }
        skinVerts.push({ weights, bones });
      }
    }

    const normals = [];
    for (let i = 0; i < numVertices; i++) normals.push(readVec3(reader));

    const uvs = [];
    for (let i = 0; i < numVertices; i++) uvs.push(readVec2(reader));

    const unkBytes = reader.readI32();
    ensure(unkBytes === 0, 'mesh %s: unexpected non-zero data', [meshName]);

    const numMaterials = reader.readU32();
    const materials = [];
    const matFaceArray = [];
    for (let m = 0; m < numMaterials; m++) {
      const materialPath = reader.readString();
      materials.push(materialPath);
      const numFaces = reader.readU32();
      const matFaces = [];
      for (let f = 0; f < numFaces / 3; f++) {
        const x = reader.readU16();
        const z = reader.readU16();
        const y = reader.readU16();
        matFaces.push(x, y, z);
      }
      matFaceArray.push(matFaces);
      const dataMinVertexIdx = reader.readU16();
      const dataVertexCnt = reader.readU16();
      const bytesZero = reader.readI32();
      ensure(bytesZero === 0, 'mesh %s:%s non-zero flags', [meshName, materialPath]);
    }

    const numShadowVertices = reader.readU32();
    for (let i = 0; i < numShadowVertices; i++) reader.readVec3();

    if (vertexSizeId !== 5) {
      const numShadowFaces = reader.readU32();
      for (let i = 0; i < numShadowFaces; i++) {
        reader.readVec3();
        reader.readU32(); reader.readU32(); reader.readU32();
      }
      const numShadowEdges = reader.readU32();
      for (let i = 0; i < numShadowEdges; i++) {
        reader.readU32(); reader.readU32(); reader.readU32(); reader.readU32();
        reader.readVec3(); reader.readVec3();
      }
    }

    reader.readHeader('DATABVOL');
    skipBbox(reader);

    return { meshName, vertices, normals, uvs, matFaceArray, materials, numPolygons, skinVerts, shadowVertices: null };
  }

  function CH_FOLDMSGR(reader, header) {
    reader.readHeader('DATADATA');
    const meshData = parseMeshData(reader, header.name);
    if (meshData) meshes[header.name.toLowerCase()] = meshData;
    while (reader.hasData()) {
      const chunk = reader.readHeader();
      if (!chunk) return;
      if (chunk.typeid === 'DATABVOL') { skipBbox(reader); return; }
      reader.skip(chunk.size);
    }
  }

  function parse(data) {
    const reader = createChunkReader(data);
    reader.skipChunky();
    let currentChunk = reader.readHeader('FOLDMSGR');
    if (!currentChunk) return null;

    const chunkMap = {};
    while (reader.hasData()) {
      currentChunk = reader.readHeader();
      if (!currentChunk) return null;
      const header = { typeid: currentChunk.typeid, name: currentChunk.name, size: currentChunk.size };
      (chunkMap[currentChunk.typeid] = chunkMap[currentChunk.typeid] || []).push([currentChunk, reader]);
    }

    for (const item of chunkMap['FOLDMSGR'] || []) {
      const header = item[0];
      if (header.name === '') continue;
      CH_FOLDMSGR(item[1], header);
    }
    return new Map(Object.entries(meshes));
  }

  function createThreeModel(meshData, name) {
    if (!rootScene) return null;
    const mesh = mkEmptyMesh(name);
    const verts = meshData.vertices.flatMap((v) => [v.x, v.y, v.z]);
    const normals = meshData.normals.flatMap((v) => [v.x, v.y, v.z]);
    const uvs = meshData.uvs.flatMap((v) => [v.u, v.v]);
    const indices = [];
    for (const faces of meshData.matFaceArray) indices.push(...faces);
    const geometry = new THREE.BufferGeometry();
    const positionAttribute = new THREE.Float32BufferAttribute(verts, 3);
    const normalAttribute = new THREE.Float32BufferAttribute(normals, 3);
    const uvAttribute = new THREE.Float32BufferAttribute(uvs, 2);
    geometry.setAttribute('position', positionAttribute);
    geometry.setAttribute('normal', normalAttribute);
    geometry.setAttribute('uv', uvAttribute);
    geometry.setIndex(indices);
    mesh.geometry = geometry;
    return { mesh, vertexBuffer: positionAttribute, normalBuffer: normalAttribute, uvBuffer: uvAttribute, indices };
  }

  return {
    parse,
    parseMeshData,
    createThreeModel,
    get meshes() { return new Map(Object.entries(meshes)); },
    get usedFiles() { return [...usedFiles]; },
  };
}
