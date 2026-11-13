# Oasis of Sharr layout

`layout.json` is extracted from `8p_oasis_of_sharr.sgb` in the same format as
Alvarus and Mortalis. It preserves 1024 terrain tiles (32 × 32), 5 detail
textures, 913 decal placements of 15 types, and 569 entity records.

The game automatically loads this layout, applies each tile's original
texture, and drapes the available decals over the terrain. Positions, sizes
and rotations remain in SGB coordinates under the existing map root transform.
Gameplay spawn and point positions continue to use `8p_oasis_of_sharr.json`.

Rebuild the layout and grayscale heightmap while keeping the runtime PNGs:

```sh
node --import tsx scripts/extract-sgb-layout.mjs maps/8p_oasis_of_sharr/8p_oasis_of_sharr.sgb
```

Only the PNG assets used by the map are stored in `textures/` and `decals/`.
Duplicate TGA/DDS sources and unused exports have been removed. To import
new source textures from an external asset pack, pass
`--assets-dir /path/to/source-pack` to the extractor.
