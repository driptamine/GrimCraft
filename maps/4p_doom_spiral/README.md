# Doom Spiral layout

`layout.json` is extracted from `4p_doom_spiral.sgb` in the same format as
Alvarus, Mortalis and Oasis of Sharr. It contains 256 terrain tiles (16 × 16),
3 referenced detail textures, 424 decals of 15 types, and 375 entity records.

The game loads the original tile texture assignments and drapes every decal
over the terrain using its SGB position, size and rotation. Gameplay spawn
and point positions continue to use `4p_doom_spiral.json`.

The original SGB leaves 140 tiles at texture index 0 without a detail texture
reference. The renderer covers those tiles with `terrain.ground_texture`
(`jungle_ground_01`) as the base ground layer. The raw index 0 remains intact
in the layout. The remaining 116 tiles use their original referenced textures.

Rebuild the layout and grayscale heightmap while keeping the runtime PNGs:

```sh
node --import tsx scripts/extract-sgb-layout.mjs maps/4p_doom_spiral/4p_doom_spiral.sgb
```

Only the PNG assets used by the map are stored in `textures/` and `decals/`.
Duplicate TGA/DDS sources and unused exports have been removed. To import
new source textures from an external asset pack, pass
`--assets-dir /path/to/source-pack` to the extractor.
