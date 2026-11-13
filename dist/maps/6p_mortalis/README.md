# Mortalis layout

`layout.json` is extracted from `6p_mortalis.sgb`, using the same terrain,
decal and entity fields as Alvarus. It contains 256 terrain tiles (16 × 16),
5 detail textures, 288 decals of 10 types, and 296 entity records.

The game loads the five terrain textures according to `terrain.texture_indices.rows[z][x]`
and drapes the decals over the SGB heightfield. Coordinates stay local to
the SGB terrain; the existing map root applies rotation and mirroring once.
The entity records describe the original map; gameplay continues to use
the existing `mortalis.json` point and spawn configuration.

Rebuild the layout and grayscale heightmap while keeping the runtime PNGs:

```sh
node --import tsx scripts/extract-sgb-layout.mjs maps/6p_mortalis/6p_mortalis.sgb
```

Only the PNG assets used by the map are stored in `textures/` and `decals/`.
Duplicate TGA/DDS sources and unused exports have been removed. To import
new source textures from an external asset pack, pass
`--assets-dir /path/to/source-pack` to the extractor.
