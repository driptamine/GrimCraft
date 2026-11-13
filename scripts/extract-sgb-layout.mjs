// node --import tsx scripts/extract-sgb-layout.mjs maps/6p_mortalis/6p_mortalis.sgb
// External source asset packs: add --assets-dir /path/to/source-pack
// Extract authored terrain, decals and entities; make lossless browser PNGs
// from the supplied TGAs without changing their colors or alpha channel.
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { deflateSync } from 'node:zlib';
import { TGALoader } from 'three/addons/loaders/TGALoader.js';
import { createChunkReader, isChunky } from '../src/maps/sgb-reader.ts';

function chunksIn(bytes, prefix = '') {
  const reader = createChunkReader(bytes);
  const chunks = [];
  while (reader.hasData()) {
    const header = reader.readHeader();
    reader.ensure(header.size);
    const data = reader.readData(header.size);
    const path = `${prefix}/${header.typeid}`;
    chunks.push({ ...header, path, data });
    if (header.typeid.startsWith('FOLD')) chunks.push(...chunksIn(data, path));
  }
  return chunks;
}

export function extractSgbLayout(bytes, sourceName) {
  if (!isChunky(bytes)) throw new Error('Expected a Relic Chunky SGB');
  const chunks = chunksIn(bytes.subarray(24));
  const chunk = (suffix) => {
    const found = chunks.find((entry) => entry.path.endsWith(suffix));
    if (!found) throw new Error(`Missing SGB chunk: ${suffix}`);
    return createChunkReader(found.data);
  };
  const header = chunk('/DATAWMHD');
  const metadata = { num_players: header.readU32(), map_size: header.readU32(), mod_name: header.readString(), map_name: header.readStringUTF16(), scenario_name: header.readStringUTF16() };
  const dimensions = chunk('/DATAVDAT');
  const center = [dimensions.readU32(), dimensions.readU32()];
  const cellSize = dimensions.readFloat();
  dimensions.skip(4);
  const heightScale = dimensions.readFloat();
  dimensions.skip(4);
  const cells = [dimensions.readU32(), dimensions.readU32()];
  dimensions.skip(8);
  const tileCells = dimensions.readU32();
  const repeat = dimensions.readU32();
  const heightmap = chunk('/DATAHMAP');
  const size = [heightmap.readU32(), heightmap.readU32()];
  const heightData = heightmap.readData(size[0] * size[1]);
  const tiles = chunk('/DATADETT');
  const textureIndices = Array.from({ length: tiles.readU32() }, () => tiles.readU32());
  const tileGrid = cells.map((count) => count / tileCells);
  if (textureIndices.length !== tileGrid[0] * tileGrid[1]) throw new Error('Detail tile count does not match terrain dimensions');
  const detail = chunk('/DATADSHD');
  const detailTextures = Array.from({ length: detail.readU32() }, () => {
    const path = detail.readString();
    const index = detail.readI32();
    return { index, path, file: `textures/${basename(path)}.png`, tile_count: textureIndices.filter((value) => value === index).length };
  });
  const decalLinks = chunk('/FOLDDECL/DATASMAP');
  const decalPaths = new Map(Array.from({ length: decalLinks.readU32() }, () => {
    const path = decalLinks.readString();
    return [decalLinks.readI32(), path];
  }));
  const placements = chunk('/FOLDDECL/DATAENTY');
  const decals = Array.from({ length: placements.readU32() }, () => {
    const id = placements.readU32();
    const ref = decalPaths.get(placements.readI32());
    if (!ref) throw new Error(`Unknown decal reference for ${id}`);
    return { id, ref, x: placements.readFloat(), z: placements.readFloat(), size_raw: placements.readFloat(), rotation_rad: placements.readFloat() };
  });
  const blueprintsChunk = chunk('/DATAEBPT');
  const blueprints = Array.from({ length: blueprintsChunk.readU32() }, () => blueprintsChunk.readString());
  const entities = chunks.filter((entry) => entry.path.endsWith('/FOLDENTL/FOLDENTY/DATAENTI')).map((entry) => {
    const reader = createChunkReader(entry.data);
    const id = reader.readU32();
    const blueprintPath = blueprints[reader.readU32()];
    const transform = Array.from({ length: 12 }, () => reader.readFloat());
    if (!blueprintPath) throw new Error(`Unknown entity blueprint for ${id}`);
    return { id, blueprint: basename(blueprintPath.replaceAll('\\', '/')).replace(/\.rgd$/i, ''), x: transform[9], y: transform[10], z: transform[11], rotation: transform.slice(0, 9) };
  });
  const layout = {
    map: sourceName,
    source: { file: sourceName, coordinates: 'SGB terrain-local X/Z; the game applies its map root rotation and mirror once.' },
    metadata,
    terrain: {
      heightmap_file: `${basename(sourceName, '.sgb')}_heightmap.png`, size,
      encoding: '8-bit gray; rows are local z, columns are local x; height = byte * height_scale',
      world_half_extent: cells[0] * cellSize / 2, height_scale: heightScale, cell_size: cellSize,
      num_cells: cells, center_cell_idx: center, num_tile_cells: tileCells, tile_texture_repeat: repeat,
      local_origin: center.map((index) => -(cellSize * index - cellSize / 2)),
      ground_texture: [...detailTextures].sort((a, b) => b.tile_count - a.tile_count)[0]?.path,
      detail_textures: detailTextures,
      texture_indices: { size: tileGrid, order: 'rows[z][x], DATADETT row-major', rows: Array.from({ length: tileGrid[1] }, (_, row) => textureIndices.slice(row * tileGrid[0], (row + 1) * tileGrid[0])) },
    },
    decals, entities,
  };
  return { layout, heightData };
}

// PNG filter 0, grayscale or RGBA; source pixels are top-to-bottom as in
// TGALoader's decoded data. Alpha is retained byte-for-byte for decals.
export function encodePng(width, height, pixels, channels) {
  function crc32(bytes) {
    let crc = 0xffffffff;
    for (const byte of bytes) {
      crc ^= byte;
      for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }
  function pngChunk(name, data) {
    const type = Buffer.from(name);
    const chunk = Buffer.alloc(data.length + 12);
    chunk.writeUInt32BE(data.length, 0);
    type.copy(chunk, 4);
    Buffer.from(data).copy(chunk, 8);
    chunk.writeUInt32BE(crc32(chunk.subarray(4, -4)), chunk.length - 4);
    return chunk;
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = channels === 1 ? 0 : 6;
  const stride = width * channels;
  const scanlines = Buffer.alloc(height * (stride + 1));
  for (let row = 0; row < height; row++) Buffer.from(pixels.subarray(row * stride, (row + 1) * stride)).copy(scanlines, row * (stride + 1) + 1);
  return Buffer.concat([Buffer.from('89504e470d0a1a0a', 'hex'), pngChunk('IHDR', header), pngChunk('IDAT', deflateSync(scanlines)), pngChunk('IEND', Buffer.alloc(0))]);
}

function* tgaFiles(folder, relative = '') {
  for (const entry of readdirSync(join(folder, relative), { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.name.startsWith('.')) continue;
    const path = join(relative, entry.name);
    if (entry.isDirectory()) yield* tgaFiles(folder, path);
    else if (entry.isFile() && /\.tga$/i.test(entry.name)) yield path;
  }
}

export function writeSgbLayout(sourcePath, { assetsDir = dirname(sourcePath) } = {}) {
  const folder = dirname(sourcePath);
  const { layout, heightData } = extractSgbLayout(readFileSync(sourcePath), basename(sourcePath));
  writeFileSync(join(folder, 'layout.json'), JSON.stringify(layout, null, 2) + '\n');
  writeFileSync(join(folder, layout.terrain.heightmap_file), encodePng(...layout.terrain.size, heightData, 1));
  const loader = new TGALoader();
  for (const dir of ['textures', 'decals']) {
    const assetDir = join(assetsDir, dir);
    if (!existsSync(assetDir)) continue;
    for (const file of tgaFiles(assetDir)) {
      const bytes = readFileSync(join(assetDir, file));
      const image = loader.parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
      const output = join(folder, dir, file.replace(/\.tga$/i, '.png'));
      mkdirSync(dirname(output), { recursive: true });
      writeFileSync(output, encodePng(image.width, image.height, image.data, 4));
    }
  }
  console.log(`${join(folder, 'layout.json')}: ${layout.terrain.detail_textures.length} textures, ${layout.decals.length} decals, ${layout.entities.length} entities`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const [, , source, ...options] = process.argv;
  if (!source || (options.length && (options.length !== 2 || options[0] !== '--assets-dir'))) throw new Error('Usage: node --import tsx scripts/extract-sgb-layout.mjs <map.sgb> [--assets-dir <folder>]');
  writeSgbLayout(resolve(source), options.length ? { assetsDir: resolve(options[1]) } : {});
}
