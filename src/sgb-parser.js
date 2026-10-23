import * as THREE from 'three';

import { createChunkReader, isChunky } from './sgb-reader.js';
import { mkGroup, mkEmptyMesh } from './three-helpers.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export function createSgbParser(scene = null) {
  const rootScene = scene;
  let numTilesX = 0;
  let numTilesZ = 0;
  let cellSize = 0;
  let centerCellIdxX = 0;
  let centerCellIdxZ = 0;
  let tileSize = 0;

  const tiles = [];
  const decals = [];
  const detailTexturePaths = new Map();
  const decalLinks = new Map();

  let heightData = null;
  let heightScale = 0;
  let heightSizeX = 0;
  let heightSizeZ = 0;
  let numCellsX = 0;
  let numCellsZ = 0;
  let numTileCells = 0;
  let tileTextureRepeat = 1;

  function parse(buffer) {
    const reader = createChunkReader(buffer);

    if (!isChunky(buffer)) {
      throw new Error(
        "This file does not look like a Relic Chunky/SGB file."
      );
    }

    reader.skipChunky();

    reader.readHeader("FOLDSCEN");
    reader.readHeader("DATAWMHD");

    const mapData = {
      numPlayers: reader.readU32(),
      mapSize: reader.readU32(),
      modName: reader.readString(),
      mapName: reader.readStringUTF16(),
      scenarioName: reader.readStringUTF16()
    };

    reader.skip(4);
    reader.readHeader("FOLDWSTC");

    loadTerrain(reader);

    mapData.detailTextures = Array.from(
      detailTexturePaths,
      ([index, path]) => ({ index, path }),
    );
    mapData.tileTextureRepeat = tileTextureRepeat;
    mapData.decalLinks = Array.from(
      decalLinks,
      ([id, path]) => ({ id, path }),
    );
    mapData.decals = decals.slice();

    return mapData;
  }

  function loadTerrain(reader) {
    reader.readHeader("FOLDTERR");
    reader.readHeader("FOLDTFAC");
    reader.readHeader("DATAVDAT");

    centerCellIdxX = reader.readU32();
    centerCellIdxZ = reader.readU32();
    cellSize = reader.readFloat();

    reader.skip(4);

    heightScale = reader.readFloat();

    reader.skip(4);

    numCellsX = reader.readU32();
    numCellsZ = reader.readU32();

    reader.skip(8);

    numTileCells = reader.readU32();
    tileSize = cellSize * numTileCells;

    tileTextureRepeat = reader.readU32();

    reader.skip(6);

    reader.readHeader("FOLDCHAN");
    reader.readHeader("DATAHMAP");

    heightSizeX = reader.readU32();
    heightSizeZ = reader.readU32();
    heightData = reader.readData(heightSizeX * heightSizeZ);

    reader.readHeader("DATATTYP");

    reader.skip(4);

    const footfallSizeX = reader.readU32();
    const footfallSizeZ = reader.readU32();
    reader.skip(footfallSizeX * footfallSizeZ);

    const coverSizeX = reader.readU32();
    const coverSizeZ = reader.readU32();
    reader.skip(coverSizeX * coverSizeZ);

    reader.readHeader("DATAIMAP");

    const imapSizeX = reader.readU32();
    const imapSizeZ = reader.readU32();
    reader.skip(imapSizeX * imapSizeZ);

    reader.readHeader("DATADETT");

    const numTiles = reader.readU32();

    numTilesX = numCellsX / numTileCells;
    numTilesZ = numCellsZ / numTileCells;

    const detailIndexData = reader.readData(numTiles * 4);

    reader.readHeader("DATADSHD");

    const numDetailTextures = reader.readU32();

    for (let i = 0; i < numDetailTextures; i++) {
      const path = reader.readString();
      const index = reader.readI32();
      detailTexturePaths.set(index, path);
    }

    let chunk = reader.readHeader("DATAEFFC");
    reader.skip(chunk.size);

    chunk = reader.readHeader("DATAHRZN");
    reader.skip(chunk.size);

    reader.readHeader("FOLDDECL");
    reader.readHeader("DATASMAP");

    const numDecalLinks = reader.readU32();

    for (let i = 0; i < numDecalLinks; i++) {
      const path = reader.readString();
      const id = reader.readI32();
      decalLinks.set(id, path);
    }

    reader.readHeader("DATAENTY");

    const numDecals = reader.readU32();

    for (let i = 0; i < numDecals; i++) {
      decals.push({
        id: reader.readU32(),
        decalIdx: reader.readI32(),
        x: reader.readFloat(),
        z: reader.readFloat(),
        size: reader.readFloat(),
        angle: reader.readFloat()
      });
    }

    createTiles({
      heightData,
      heightSizeX,
      numCellsX,
      numCellsZ,
      numTileCells,
      heightScale
    });

    console.log({
      numCellsX,
      numCellsZ,
      heightSizeX,
      heightSizeZ,
      numTileCells,
      numTiles: `${numTilesX} × ${numTilesZ}`,
      cellSize,
      tileSize,
      heightScale,
      tileTextureRepeat,
      detailTexturePaths,
      decals: decals.length
    });
  }

  function createTiles({
    heightData,
    heightSizeX,
    numCellsX,
    numCellsZ,
    numTileCells,
    heightScale
  }) {
    const vertexCount =
      (numTileCells + 1) * (numTileCells + 1);

    const basePositions = new Float32Array(vertexCount * 3);
    const uv2 = new Float32Array(vertexCount * 2);

    let index = 0;
    const uv2Step = 1 / (numTileCells + 1);

    // Same vertex order as the original Godot parser.
    for (let cellX = 0; cellX <= numTileCells; cellX++) {
      let posZ = 0;
      let posV2 = 1;

      for (let cellZ = 0; cellZ <= numTileCells; cellZ++) {
        basePositions[index * 3] =
          cellX * cellSize;

        basePositions[index * 3 + 1] = 0;

        basePositions[index * 3 + 2] = posZ;

        uv2[index * 2] =
          cellX * uv2Step;

        uv2[index * 2 + 1] =
          posV2;

        index++;
        posZ += cellSize;
        posV2 -= uv2Step;
      }
    }

    const indices = [];

    let cellIndex = 0;

    for (let cellX = 0; cellX < numTileCells; cellX++) {
      for (let cellZ = 0; cellZ < numTileCells; cellZ++) {
        indices.push(
          cellIndex,
          cellIndex + numTileCells + 1,
          cellIndex + 1,

          cellIndex + 1,
          cellIndex + numTileCells + 1,
          cellIndex + numTileCells + 2
        );

        cellIndex++;
      }

      cellIndex++;
    }

    const uvPositionsX = new Float32Array(numCellsX + 1);
    const uvStepX = 1 / (numCellsX + 1);

    for (let i = 0; i < numCellsX; i++) {
      uvPositionsX[i + 1] =
        uvPositionsX[i] + uvStepX;
    }

    const uvPositionsZ = new Float32Array(numCellsZ + 1);
    const uvStepZ = 1 / (numCellsZ + 1);

    uvPositionsZ[0] = 1;

    for (let i = 0; i < numCellsZ; i++) {
      uvPositionsZ[i + 1] =
        uvPositionsZ[i] - uvStepZ;
    }

    const hmapRowOffset =
      numCellsX - numTileCells;

    // One shared material for all tiles: identical gray DoubleSide, painted
    // uniformly later (same texture on every tile), so sharing only cuts
    // material instances and state changes (1024 -> 1 on 8p maps).
    const tileMaterial = new THREE.MeshStandardMaterial();
    tileMaterial.color = new THREE.Color(0.35, 0.35, 0.35);
    tileMaterial.side = THREE.DoubleSide;

    let tileIndex = 0;

    for (let tileX = 0; tileX < numTilesX; tileX++) {
      for (let tileZ = 0; tileZ < numTilesZ; tileZ++) {
        const positions =
          new Float32Array(basePositions);

        let hmapPosition =
          (tileZ * heightSizeX + tileX) *
          numTileCells;

        // IMPORTANT:
        // This preserves the transposed heightmap access
        // from the original Godot implementation.
        for (let cellZ = 0; cellZ <= numTileCells; cellZ++) {
          let vertexIndex = cellZ;

          for (let cellX = 0; cellX <= numTileCells; cellX++) {
            positions[vertexIndex * 3 + 1] =
              heightData[hmapPosition] *
              heightScale;

            vertexIndex += numTileCells + 1;
            hmapPosition++;
          }

          hmapPosition += hmapRowOffset;
        }

        const uvs =
          new Float32Array(vertexCount * 2);

        let uvIndex = 0;
        let uvIndexX = tileX * numTileCells;
        let uvIndexZ = tileZ * numTileCells;

        for (let cellX = 0; cellX <= numTileCells; cellX++) {
          for (let cellZ = 0; cellZ <= numTileCells; cellZ++) {
            uvs[uvIndex * 2] =
              uvPositionsX[uvIndexX];

            uvs[uvIndex * 2 + 1] =
              uvPositionsZ[uvIndexZ];

            uvIndex++;
            uvIndexZ++;
          }

          uvIndexX++;
          uvIndexZ -= numTileCells + 1;
        }

        const mesh =
          mkEmptyMesh(`SGB_Tile_${tileIndex}`);

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        if (uv2) {
          geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(uv2, 2));
        }
        geometry.setIndex(indices);
        geometry.computeVertexNormals();
        // Dawn of War winding is clockwise-front; DoubleSide keeps every tile
        // visible under three.js counter-clockwise front faces.
        mesh.geometry = geometry;

        mesh.material = tileMaterial;

        tiles.push({
          mesh,
          tileX,
          tileZ
        });

        tileIndex++;
      }
    }
  }

  function createThreeMap(parent = null) {
    const root =
      mkGroup("SGB_Map");

    if (parent) parent.add(root);

    const centerOffsetX =
      cellSize *
      centerCellIdxX -
      cellSize / 2;

    const centerOffsetZ =
      cellSize *
      centerCellIdxZ -
      cellSize / 2;

    for (const tile of tiles) {
      tile.mesh.position.x =
        -centerOffsetX +
        tile.tileX * tileSize;

      tile.mesh.position.z =
        -centerOffsetZ +
        tile.tileZ * tileSize;
    }

    // Merge 4x4 tile groups into single meshes: 1024 draw calls -> 64 on 8p
    // maps. Chunks stay small enough for frustum culling and raycast pruning
    // (a single merged mesh would force full-geometry triangle tests per hover).
    // Names keep the SGB_Tile prefix so ground picking still matches.
    const BLOCK = 4;
    const sharedMat = tiles.length ? tiles[0].mesh.material : null;
    const blocks = new Map();
    for (const tile of tiles) {
      const key = `${Math.floor(tile.tileX / BLOCK)}:${Math.floor(tile.tileZ / BLOCK)}`;
      tile.mesh.geometry.translate(tile.mesh.position.x, 0, tile.mesh.position.z);
      if (!blocks.has(key)) {
        blocks.set(key, []);
      }
      blocks.get(key).push(tile.mesh.geometry);
    }
    for (const [key, geos] of blocks) {
      const merged = mergeGeometries(geos, false);
      const mesh = mkEmptyMesh(`SGB_Tile_b${key.replace(':', '_')}`);
      mesh.geometry = merged;
      mesh.material = sharedMat;
      root.add(mesh);
    }

    // The merge above copies the translated geometry into the blocks; drop
    // the unmerged originals (mkEmptyMesh auto-attached them to the default
    // scene) so the terrain renders exactly once, under the mirrored root.
    // The material is shared with the blocks and must survive.
    for (const tile of tiles) {
      if (tile.mesh.parent) {
        tile.mesh.parent.remove(tile.mesh);
      }
      tile.mesh.geometry.dispose();
    }

    return root;
  }

  function sampleHeight(worldX, worldZ) {
    if (!heightData) {
      return 0;
    }
    const centerOffsetX = cellSize * centerCellIdxX - cellSize / 2;
    const centerOffsetZ = cellSize * centerCellIdxZ - cellSize / 2;
    const gx = Math.min(numCellsX, Math.max(0, (worldX + centerOffsetX) / cellSize));
    const gz = Math.min(numCellsZ, Math.max(0, (worldZ + centerOffsetZ) / cellSize));
    const x0 = Math.floor(gx);
    const z0 = Math.floor(gz);
    const x1 = Math.min(numCellsX, x0 + 1);
    const z1 = Math.min(numCellsZ, z0 + 1);
    const tx = gx - x0;
    const tz = gz - z0;
    const h = (x, z) => heightData[z * heightSizeX + x] * heightScale;
    return (
      h(x0, z0) * (1 - tx) * (1 - tz) +
      h(x1, z0) * tx * (1 - tz) +
      h(x0, z1) * (1 - tx) * tz +
      h(x1, z1) * tx * tz
    );
  }

  return {
    get numTilesX() {
      return numTilesX;
    },
    get numTilesZ() {
      return numTilesZ;
    },
    get cellSize() {
      return cellSize;
    },
    get tileSize() {
      return tileSize;
    },
    parse,
    createThreeMap,
    sampleHeight
  };
}