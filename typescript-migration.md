# Migration plan: JavaScript → TypeScript

Incremental, no big-bang rewrite. The game keeps shipping from `.js`/`.jsx`
the whole way; TypeScript pays for itself file by file (`tsc --noEmit` as a
second CI gate next to `node --test`).

## 0. Baseline (today)

- 256 source files (`src/`, `scripts/`, `tests/`), ~30k lines, ESM (`"type": "module"`).
- Biggest modules: `multiplayer.js` (1112), `entities.js` (1097), `scene.js` (1069), `systems/squad.js` (1059), `ActionsGrid.jsx` (926).
- Path aliases: none — all imports are relative, which survives the migration untouched.
- No `tsconfig.json`, no `typescript` dep. Vite 6 + `@vitejs/plugin-react` already understand `.ts`/`.tsx` once the files exist (esbuild strips types, no typecheck at build).

## 1. Tooling (one-time, ~30 min)

1. `npm i -D typescript @types/three @types/node @types/react @types/react-dom`
2. Add `tsconfig.json` (strict, but `allowJs: true` + `checkJs: false` at first so nothing breaks):
   ```json
   {
     "compilerOptions": {
       "target": "ES2022",
       "module": "ESNext",
       "moduleResolution": "bundler",
       "jsx": "react-jsx",
       "strict": true,
       "allowJs": true,
       "checkJs": false,
       "noEmit": true,
       "skipLibCheck": true,
       "types": ["node"]
     },
     "include": ["src", "scripts", "tests", "vite.config.js"]
   }
   ```
3. Add scripts: `"typecheck": "tsc --noEmit"`. Wire it into `.github/workflows/deploy-netlify.yml` **after** `npm ci`, next to tests — but keep it non-blocking for the first 2 phases (`|| echo` / `continue-on-error`) until the error count hits zero.
4. Tests keep running as-is: `node --test` cannot execute `.ts`. Rule: a test file is renamed to `.test.ts` only together with the module it covers, and run via `tsx` (`npm i -D tsx`, `"test:ts": "tsx --test tests/*.test.ts"`). Mixed `.js`/`.ts` suites coexist until the end.

## 2. Order: leaves first, hubs last

Migrate bottom-up so each file's imports are already typed when you get to it:

1. **Pure leaf modules** (no imports or only stdlib): `boot-timer.js`, `r2-progress.js`, `assets.js`, `ecs.js`, `camera-params.js`, `decal-size.js`.
2. **Three.js utilities**: `three-helpers.js`, `merge-static.js`, `merge-skinned.js`, `gltf-models.js`, `model-upload.js`, `mat-cache.js`, `grid-helper.js`. Three ships its own types; `three/addons/*` resolve via `@types/three`.
3. **Data + config**: `factions/*.js`, `factions.js`, `maps-menu.js`, `teamcolour.js`, `meshes/*`. Mostly shape work — define shared types (`SquadConfig`, `StructureConfig`, `FactionKey`) in `factions/types.ts` once.
4. **Input layer**: `input/camera.js`, `input/selection.js`, `input/markers.js`, `input/orders.js`, `input/events.js`, `input/touch-controls.js`, `input.js`.
5. **HUD (`.jsx` → `.tsx`)**: `hud/bits.jsx`, `hud/primitives.jsx`, then components, then `hud.js`. Linaria has bundled types; React 19 types via `@types/react`.
6. **Core loop (last)**: `scene.js`, `systems/*`, `entities.js`, `game.js`, `multiplayer.js`, `camera-fps.js`, `main-menu.js`. These have the widest types (`World`, `Scene`, `Camera`) — do them when everything they touch is typed.

Per file: rename → fix `tsc` errors in that file only → run `node --test` subset → commit. One file (or one small cluster) per commit; never mix a migration rename with behavior changes.

## 3. Patterns to apply while migrating

- **World/ECS access**: type the component maps once (`components/squad.ts` etc.) instead of `any`-ing `world.get`. If a dynamic lookup resists typing, isolate it in a `*Untyped` helper with a `// TODO(ts)` marker rather than sprinkling `any`.
- **`import.meta.env`**: add `src/vite-env.d.ts` with `/// <reference types="vite/client" />` on day one.
- **`import.meta.glob`**: type as `Record<string, string>` at the call site; do not fight the generic overloads.
- **Node test hooks** (`tests/node-esm-hooks.mjs`): keep as `.mjs` until the end; it operates on source text, types don't matter. Installed globally via `tests/register-hooks.mjs` (`node --import` in the `test` script) because per-file `register()` runs too late for static imports — every renamed `.js`→`.ts` module must resolve in static chains from day one.
- **Scripts** (`scripts/*.mjs`, `bulk-extract.js` at root): migrate last or never — they're dev tools. If migrated, run them with `tsx`, not `tsc` emit.
- **`dist/` stays ignored output**; nothing changes in deploy (Netlify builds from source).

## 4. Strictness ramp

- Phase A (files 1–2): `strict: true` globally, but `// @ts-nocheck` at the top of freshly renamed files you haven't cleaned yet. The gate is "error count only goes down" — track with `tsc --noEmit 2>&1 | grep -c error`.
- Phase B (files 3–5): remove `nocheck` headers cluster by cluster; forbid new ones (grep in CI).
- Phase C (core loop): enable `noUncheckedIndexedAccess` and fix the fallout in one pass — this is where the real bugs hide (off-by-one in squad arrays, optional chaining gaps).
- Finish: flip the workflow `typecheck` step to blocking, delete the error-count tracker.

## 5. What can go wrong

- **Three.js version drift**: `@types/three` must match `three@0.186.x` exactly; pin both.
- **Linaria + TS**: `styled()` over custom components (like `R2Img`) needs the props type threaded through; prefer plain style props for one-off cases.
- **Circular imports surface as type cycles**: `factions.js` ↔ `meshes/points.js` already coexist at runtime; if `tsc` complains, extract shared string constants (like `SP_MODEL_PATHS`) into a leaf module — same fix the runtime already uses for `modelUrl`.
- **Test doubles**: fake worlds/scenes in tests need the same interfaces — put shared fakes in `tests/fakes.ts` once 3+ test files need them.

## 6. Done when

- `tsc --noEmit` is a blocking CI step with zero errors and zero `ts-nocheck`.
- `node --test` is fully replaced by `tsx --test` (or all tests ported to `.ts`).
- `allowJs: false`, `checkJs` irrelevant; no `.js` source files left under `src/`.
