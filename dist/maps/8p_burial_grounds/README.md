# Burial Grounds layout

`layout.json` is extracted from `8p_burial_grounds.sgb` in the same format as
Alvarus, Mortalis and Oasis of Sharr. It contains 1024 terrain tiles (32 × 32),
5 detail textures, 1180 decals of 17 types, and 1204 entity records.

The game loads the original tile texture assignments and drapes every decal
over the terrain using its SGB position, size and rotation. Gameplay spawn
and point positions continue to use `8p_burial_grounds.json`.

Rebuild the layout and grayscale heightmap while keeping the runtime PNGs:

```sh
node --import tsx scripts/extract-sgb-layout.mjs maps/8p_burial_grounds/8p_burial_grounds.sgb
```

Only the PNG assets used by the map are stored in `textures/` and `decals/`.
Duplicate TGA/DDS sources and unused exports have been removed. To import
new source textures from an external asset pack, pass
`--assets-dir /path/to/source-pack` to the extractor.
