export const CHUNKY_HEADER_SIZE = 24;

export function createChunkReader(data) {
  const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
  const view = new DataView(
    bytes.buffer,
    bytes.byteOffset,
    bytes.byteLength
  );
  let offset = 0;

  function ensure(n) {
    if (offset + n > bytes.byteLength) {
      throw new RangeError(
        `Unexpected EOF at ${offset}; requested ${n} bytes, size=${bytes.byteLength}`
      );
    }
  }

  function available(required) {
    return Math.min(required, bytes.byteLength - offset);
  }

  function skip(n) {
    offset += available(n);
  }

  return {
    get position() {
      return offset;
    },

    get size() {
      return bytes.byteLength;
    },

    hasData() {
      return offset < bytes.byteLength;
    },

    ensure,
    available,
    skip,

    skipChunky() {
      skip(CHUNKY_HEADER_SIZE);
    },

    readU8() {
      if (available(1) < 1) return 0;
      const v = view.getUint8(offset);
      offset += 1;
      return v;
    },

    readI8() {
      if (available(1) < 1) return 0;
      const v = view.getInt8(offset);
      offset += 1;
      return v;
    },

    readU16() {
      if (available(2) < 2) return 0;
      const v = view.getUint16(offset, true);
      offset += 2;
      return v;
    },

    readI16() {
      if (available(2) < 2) return 0;
      const v = view.getInt16(offset, true);
      offset += 2;
      return v;
    },

    readU32() {
      if (available(4) < 4) return 0;
      const v = view.getUint32(offset, true);
      offset += 4;
      return v;
    },

    readI32() {
      if (available(4) < 4) return 0;
      const v = view.getInt32(offset, true);
      offset += 4;
      return v;
    },

    readFloat() {
      if (available(4) < 4) return 0;
      const v = view.getFloat32(offset, true);
      offset += 4;
      return v;
    },

    readData(size) {
      const n = available(size);
      const result = bytes.slice(offset, offset + n);
      offset += n;
      return result;
    },

    readString() {
      const length = this.readU32();
      if (!length) return "";
      return new TextDecoder("utf-8").decode(this.readData(length));
    },

    readStringUTF16() {
      const length = this.readU32();
      if (!length) return "";
      return new TextDecoder("utf-16le").decode(this.readData(length * 2));
    },

    readFixedAscii(length) {
      return new TextDecoder("ascii")
        .decode(this.readData(length))
        .replace(/\0+$/, "");
    },

    readHeader(expected = "") {
      if (!this.hasData()) return null;

      const typeid = this.readFixedAscii(8);

      if (!typeid.startsWith("FOLD") && !typeid.startsWith("DATA")) {
        throw new Error(`Invalid SGB typeid "${typeid}" at ${offset - 8}`);
      }

      const version = this.readU32();
      const size = this.readU32();
      const name = this.readString();

      if (expected && typeid !== expected) {
        throw new Error(`Expected ${expected}, got ${typeid}`);
      }

      return { typeid, version, size, name };
    },
  };
}

export function isChunky(data) {
  const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
  if (bytes.length < 32) return false;

  const magic = new TextDecoder("ascii")
    .decode(bytes.slice(0, 12));

  if (magic !== "Relic Chunky") return false;

  const typeid = new TextDecoder("ascii")
    .decode(bytes.slice(24, 32));

  return typeid.startsWith("DATA") || typeid.startsWith("FOLD");
}