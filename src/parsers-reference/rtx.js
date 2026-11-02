import * as THREE from 'three';
import { TGALoader } from 'three/addons/loaders/TGALoader.js';
import { DDSLoader } from 'three/addons/loaders/DDSLoader.js';
import { createChunkReader, isChunky } from './sgb-reader.js';

const _tgaLoader = new TGALoader();
const _ddsLoader = new DDSLoader();

const TGA_HEADER_SIZE = 18;
const DDS_HEADER_SIZE = 124;

function fourCCString(code) {
  switch (code) {
    case 8: return "DXT1";
    case 10: return "DXT3";
    case 11: return "DXT5";
    default: return null;
  }
}

export function createRtxParser(scene = null) {
  const rootScene = scene || null;

  function createTgaData(data, dataSize, width, height, grayscale = false) {
    const res = createChunkReader(data);
    res.skipChunky();

    // Build a TGA container from raw pixel data.
    // https://www.paulbourke.net/dataformats/tga/
    const out = [];
    out.push(0);                            // ID length: none
    out.push(0);                            // no colour map
    out.push(grayscale ? 3 : 2);            // uncompressed (3=grayscale, 2=true colour)
    out.push(0, 0, 0, 0, 0, 0, 0, 0, 32);   // colour map spec: none
    out.push(0, 0);                          // X-origin
    out.push(0, 0);                          // Y-origin
    out.push(width & 0xff, width >> 8);      // width
    out.push(height & 0xff, height >> 8);    // height
    out.push(grayscale ? 8 : 32);            // pixel depth
    out.push(0);                             // image descriptor

    const body = res.readData(dataSize);
    return new Uint8Array([...out, ...body]);
  }

  function createDdsData(data, dataSize, width, height, numMips, imageFormat, imageData, useMipmaps) {
    const res = createChunkReader(data);
    res.skipChunky();

    const fourCC = imageFormat in { 8: "", 10: "", 11: "" } ? fourCCString(imageFormat) : null;
    if (!fourCC) {
      throw new Error(`RtxParser: unknown DDS image format ${imageFormat}`);
    }

    // DDS header (little-endian).
    const dwFlags = 0x00001007 | (useMipmaps ? 0x00020000 : 0);
    const caps = 0x401008;
    const out = [];
    out.push(..."DDS ".split("").map((c) => c.charCodeAt(0)));
    out.push(124 & 0xff, (124 >> 8) & 0xff, 0, 0);        // dwSize
    out.push(dwFlags & 0xff, (dwFlags >> 8) & 0xff, (dwFlags >> 16) & 0xff, (dwFlags >> 24) & 0xff);
    out.push(height & 0xff, (height >> 8) & 0xff, (height >> 16) & 0xff, (height >> 24) & 0xff);
    out.push(width & 0xff, (width >> 8) & 0xff, (width >> 16) & 0xff, (width >> 24) & 0xff);
    out.push(0, 0, 0, 0);                                   // linear size = 0
    out.push(0, 0, 0, 0);                                   // depth
    out.push(numMips & 0xff, (numMips >> 8) & 0xff, (numMips >> 16) & 0xff, (numMips >> 24) & 0xff);
    for (let i = 0; i < 11; i++) out.push(0, 0, 0, 0);      // reserved1
    out.push(32 & 0xff, 0, 0, 0);                           // pixel format size
    out.push(4, 0, 0, 0);                                   // DDPF_FOURCC
    out.push(...fourCC.split("").map((c) => c.charCodeAt(0)));
    for (let i = 0; i < 5; i++) out.push(0, 0, 0, 0);       // rgb bit masks
    out.push(caps & 0xff, (caps >> 8) & 0xff, (caps >> 16) & 0xff, (caps >> 24) & 0xff);
    for (let i = 0; i < 12; i++) out.push(0);               // caps2..caps4 + reserved2

    const body = imageData || res.readData(dataSize);
    return new Uint8Array([...out, ...body]);
  }

  function CH_FOLDTXTR(reader) {
    // FOLDTXTR - Texture Folder
    while (reader.hasData()) {
      const currentChunk = reader.readHeader();
      if (!currentChunk) return null;
      if (currentChunk.typeid === "DATAHEAD") {
        reader.skip(currentChunk.size);
      } else if (currentChunk.typeid === "DATAINFO") {
        reader.skip(currentChunk.size);
      } else if (currentChunk.typeid === "FOLDIMAG") {
        break;
      } else {
        reader.skip(currentChunk.size);
      }
    }

    const attr = reader.readHeader("DATAATTR");
    if (!attr) return null;

    const imageFormat = reader.readI32();
    const width = reader.readU32();
    const height = reader.readU32();
    const numMips = reader.readU32();

    const data = reader.readHeader("DATADATA");
    if (!data) return null;

    let buffer;
    if (imageFormat === 0 || imageFormat === 2) {
      // Uncompressed TGA.
      buffer = createTgaData(reader, data.size, width, height);
      return {
        kind: "tga",
        width,
        height,
        data: buffer,
      };
    }

    buffer = createDdsData(reader, data.size, width, height, numMips, imageFormat, null, true);
    return {
      kind: "dds",
      width,
      height,
      numMips,
      imageFormat,
      data: buffer,
    };
  }

  function createThreeTexture(info, name = "RtxTexture") {
    if (!rootScene) return null;
    const bytes = info.data instanceof Uint8Array ? info.data : new Uint8Array(info.data);
    const parsed = info.kind === "tga" ? _tgaLoader.parse(bytes.buffer) : _ddsLoader.parse(bytes.buffer, true);
    const texture = new THREE.Texture();
    texture.image = parsed.image;
    texture.mipmaps = parsed.mipmaps || [];
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    texture.name = name;
    return texture;
  }

  function parse(data) {
    const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
    const reader = createChunkReader(bytes);
    reader.skipChunky();
    const header = reader.readHeader("FOLDTXTR");
    if (!header) return null;
    return CH_FOLDTXTR(reader);
  }

  return {
    parse,
    createTgaData,
    createDdsData,
    CH_FOLDTXTR,
    createThreeTexture,
    isChunky,
  };
}
