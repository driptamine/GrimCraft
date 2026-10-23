
import { createChunkReader, isChunky } from './sgb-reader.js';
import { createRtxParser } from './rtx.js';

export const TeamcolorChannel = {
  DEFAULT: -1,
  PRIMARY: 0,
  SECONDARY: 1,
  TRIM: 2,
  WEAPONS: 3,
  EYES: 4,
  DIRT: 5,
};

export const NUM_TEAMCOLOR_CHANNELS = 6;

export function createWtpParser(mod = null, scene = null) {
  const rootScene = scene || null;
  const rtxParser = createRtxParser(rootScene);

  const channels = {};
  const usedFiles = [];

  function ensure(condition, message, args = []) {
    if (condition) return;
    if (typeof console !== 'undefined') console.warn(message, ...args);
  }

  function parse(data) {
    const reader = createChunkReader(data);
    reader.skipChunky();

    let currentChunk = reader.readHeader('FOLDTPAT');
    if (!currentChunk) return null;

    currentChunk = reader.readHeader('DATAINFO');
    if (!currentChunk) return null     ;
    const width = reader.readU32();
    const height = reader.readU32();

    const result = { width, height, channels: {} };
    while (reader.hasData()) {
      currentChunk = reader.readHeader();
      if (!currentChunk) return null;
      if (currentChunk.typeid === 'DATAPTLD') {
        const layerIn = reader.readU32();
        const dataSize = reader.readU32();
        const imageData = rtxParser.createTgaData(reader.stream, dataSize, width, height, true);
        result.channels[layerIn] = { width, height, data: imageData, kind: 'tga' };
      } else if (currentChunk.typeid === 'FOLDIMAG') {
        currentChunk = reader.readHeader('DATAATTR');
        if (!currentChunk) return null;
        const imageFormat = reader.readU32();
        const imageWidth = reader.readU32();
        const imageHeight = reader.readU32();
        const numMips = reader.readU32();
        currentChunk = reader.readHeader('DATADATA');
        if (!currentChunk) return null;
        const imageData = rtxParser.createTgaData(reader.stream, currentChunk.size, imageWidth, imageHeight, false);
        result.channels[TeamcolorChannel.DEFAULT] = { width: imageWidth, height: imageHeight, data: imageData, kind: 'tga' };
      } else {
        reader.skip(currentChunk.size);
      }
    }
    return result;
  }

  return {
    parse,
    TeamcolorChannel,
    get usedFiles() { return [...usedFiles]; },
  };
}
