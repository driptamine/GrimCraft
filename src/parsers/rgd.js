import { createChunkReader, isChunky } from './sgb-reader.js';

export const DataType = Object.freeze({
  FLOAT: 0,
  INTEGER: 1,
  BOOL: 2,
  STRING: 3,
  WSTRING: 4,
  TABLE: 100,
  NO_DATA: 254,
});

const DEFAULT_HASH_DICT_PATH = "src/parsers/RGD_DIC.TXT";

export function buildHashDict(text) {
  const dict = new Map();
  const lines = text.split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq < 0) continue;
    const code = line.slice(0, eq).trim();
    const token = line.slice(eq + 1).trim();
    const value = Number.parseInt(code, 16);
    if (Number.isNaN(value)) continue;
    dict.set(value, token);
  }
  return dict;
}

async function loadText(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`RgdParser: failed to load hash dict "${url}": ${res.status} ${res.statusText}`);
  }
  return res.text();
}

export function createRgdParser(opts = {}) {
  const hashDictUrl = opts.hashDictUrl || DEFAULT_HASH_DICT_PATH;
  let cachedDict = opts.hashDict || null;
  let dictPromise = null;

  async function getHashDict() {
    if (cachedDict) return cachedDict;
    if (!dictPromise) {
      dictPromise = (async () => {
        const text = await loadText(hashDictUrl);
        cachedDict = buildHashDict(text);
        return cachedDict;
      })();
    }
    return dictPromise;
  }

  function encodeKey(hash, decodeHashes, dict) {
    return decodeHashes && dict ? dict.get(hash) ?? hash : hash;
  }

  function readEntry(reader, type_, dataSize, decodeHashes, dict) {
    const origPos = reader.position;
    let result = null;

    switch (type_) {
      case DataType.TABLE: {
        const numEntries = reader.readU32();
        const headerSize = 4 + numEntries * 12;
        const entries = [];
        for (let i = 0; i < numEntries; i++) {
          const hash_ = reader.readU32();
          const entryType_ = reader.readU32();
          const offset = reader.readU32();
          entries.push([hash_, entryType_, offset]);
        }
        entries.sort((a, b) => a[2] - b[2]);

        result = {};
        if (numEntries) {
          if (entries[0][2] !== 0) {
            throw new Error(`RgdParser: first entry offset must be 0, got ${entries[0][2]}`);
          }
          for (let idx = 0; idx < numEntries; idx++) {
            const entry = entries[idx];
            const entryEnd = idx < entries.length - 1 ? entries[idx + 1][2] : dataSize - headerSize;
            const key = encodeKey(entry[0], decodeHashes, dict);
            result[key] = readEntry(reader, entry[1], entryEnd - entry[2], decodeHashes, dict);
          }
        }
        break;
      }
      case DataType.STRING:
        result = new TextDecoder("ascii")
          .decode(reader.readData(dataSize))
          .replace(/\0+$/, "");
        break;
      case DataType.WSTRING:
        result = new TextDecoder("utf-16le")
          .decode(reader.readData(dataSize))
          .replace(/\0+$/, "");
        break;
      case DataType.FLOAT:
        result = reader.readFloat();
        break;
      case DataType.INTEGER:
        result = reader.readI32();
        break;
      case DataType.BOOL:
        result = reader.readU8() !== 0;
        break;
      case DataType.NO_DATA:
      default:
        result = null;
    }

    const target = origPos + dataSize;
    const delta = target - reader.position;
    if (delta > 0) {
      reader.skip(delta);
    } else if (delta < 0) {
      throw new Error(`RgdParser: entry overran bounds by ${-delta} bytes (size ${dataSize})`);
    }
    return result;
  }

  function parseSync(data, decodeHashes = true, dict = null) {
    const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
    const reader = createChunkReader(bytes);
    reader.skipChunky();
    const header = reader.readHeader("DATAAEGD");
    if (!header) return null;
    reader.readU32();
    const dataSize = reader.readU32();
    return readEntry(reader, DataType.TABLE, dataSize, decodeHashes, dict);
  }

  async function parse(data, decodeHashes = true) {
    const dict = decodeHashes ? await getHashDict() : null;
    return parseSync(data, decodeHashes, dict);
  }

  async function loadHashDict(url) {
    const text = await loadText(url || hashDictUrl);
    cachedDict = buildHashDict(text);
    dictPromise = null;
    return cachedDict;
  }

  return {
    parse,
    parseSync,
    buildHashDict,
    getHashDict,
    loadHashDict,
    DataType,
    isChunky,
  };
}