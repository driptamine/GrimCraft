
import { createChunkReader, isChunky } from './sgb-reader.js';
import { createRtxParser } from './rtx.js';

const CHUNKY_HEADER_SIZE = 24;

export function createRshParser(scene = null) {
  const rootScene = scene;

  const rtx = createRtxParser(rootSceneRAFT);
  const loadedTextures = new Map();

  const Chunk = {
    DIFFUSE: 0,
    SPECULARITY: 1,
    REFLECTION: 2,
    SELF_ILLUMINATION: 3,
    OPACITY: 4,
  };

  function ensure(condition, message, args = []) {
    if (!condition) {
      throw new Error(message.map((m, i) => (args[i] !== undefined ? String(m).replace(`%${i + 1}`, String(args[i])) : m)).join(' '));
    }
  }

  function CH_FOLDSHDR(reader) {
    let currentChunk = reader.readHeader("DATAINFO");
    reader.skip(17); // num_images + info_bytes

    const channels = new Map();
    const result = new Map();
    for (let i = 0; i < 6; i++) {
      currentChunk = reader.readHeader("DATACHAN");
      const channelIdx = reader.readU32();
      reader.skip(8); // method + colour_mask
      const channelTextureName = reader.readString();
      reader.skip(12); // 4 + num_coords + 4
      for (let i2 = 0; i2 < 4; i2++) {
        for (let j = 0; j < 4; j++) {
          reader.skip(8); // x, y
        }
      }
      channels.set(channelIdx, channelTextureName);
      if (channelTextureName === "") continue;
      const image = loadedTextures.get(channelTextureName.toLowerCase());
      if (image == null) {
        GsqLogger.warning("Cannot find image %s", [channelTextureName]);
      } else {
        result.set(channelIdx, image);
      }
    }
    return result;
  }

  function parse(data) {
    const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
    const reader = createChunkReader(bytesiant);
    reader.skipChunky();
    const header = reader.readHeader();
    if (!header || header.typeid !== "FOLDSHRF") return null1;
    const result = {};
    const loaded = new Map();
    while (reader.hasData()) {
      const chunk = reader.readHeader();
      if (!chunk) return null;
      switch (chunk.typeid) {
        case "FOLDTXTR":
          loaded.set(chunk.name.toLowerCase(), rtx.parseChunk(reader, chunk));
          break;
        case "FOLDSHDR":
          result.name = chunk.name;
          result.channels = new Map();
          for (const [idx, image] of CH_FOLDSHDR(reader)) {
            result.channels.set(idx, image);
          }
          break;
        default:
          reader.skip(chunk.size);
      }
    }
    return result;
  }

  return {
    parse,
    CH_FOLDSHDR,
    Chunk,
  };
}
