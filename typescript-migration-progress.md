# TypeScript migration — progress

Living tracker for the incremental JS→TS migration (plan: [typescript-migration.md](./typescript-migration.md)).
Update this file every time a module is migrated: move the row from Queue to Done.

## Done

| File | Test | Notes |
|------|------|-------|
| `src/boot-timer.ts` | `tests/boot-timer.test.ts` | Phase 1 start. Pure logic, `NowFn` injection. |
| `src/r2-progress.ts` | `tests/r2-progress.test.ts` | Typed `R2FileState` / `R2Snapshot` / `R2CacheProbeResult` / listener. Test fakes for `globalThis.caches` go through `Record<string, unknown>`. |
| `src/assets.ts` | `tests/asset-url.test.ts` | Typed `modelUrl` / `assetUrl` (`string \| null` — the test passes `null`). Fetch stubs cast `as unknown as typeof fetch` (matches `r2ImageUrl(src, fetchImpl = fetch)`). |
| `src/ecs.ts` | — (covered by suites using `World`) | Typed `World`: `EntityId`, `SystemFunction`, `Map<string, Map<EntityId, unknown>>` stores, generic `add<T>`. No dedicated test — behavior pinned by existing suites (touch-controls, bullet-routing, etc.). |
| `src/camera-params.ts` | — (covered by `camera-panel.test.js`) | Pure orbit helpers; `CameraLimits` structural interface, `unknown` inputs with `num()` fallback. |
| `src/decal-size.ts` | `tests/decal-size.test.ts` | `DecalFlatRotation` / `DrapeOptions` interfaces; test callbacks annotated (`(x: number, z: number)` etc.). |

## Infrastructure (done, supports all future renames)

- Toolchain: `typescript@5.9.3`, `@types/three@0.186.0`, `tsx`, `tsconfig.json` (`strict`, `allowJs`, `checkJs: false`), `src/vite-env.d.ts`, scripts `typecheck` / `test:ts`.
- `tests/node-esm-hooks.mjs`: resolves `.js`→`.ts` siblings and transpiles via repo TS so plain `node --test` runs mid-migration. `assets` branch neutralizes `import.meta.env.*` AND transpiles `.ts` (raw annotations broke node import).
- `tests/register-hooks.mjs` + `npm test` runs `node --import ./tests/register-hooks.mjs`: per-file `register()` executes too late for static imports, so 13 test files broke on the first rename. Global install fixes current and future renames.
- `src/nodes-panel.js`: bare top-level `setInterval` moved into `initNodesPanelAutoRefresh()` called at game boot (was keeping every `node --test` child alive). Not a migration change — testability fix found during migration.
- Import spellings stay `.js` everywhere (Vite + tsc + hooks all resolve to `.ts` siblings).

## Conventions for the next files

- One module + its test per commit; behavior identical, types only.
- Test helpers: `(rel: string) => ...` for file readers; `globalThis` fakes via `Record<string, unknown>`; fetch fakes cast to `typeof fetch`.
- Prefer `unknown` over `any`; isolate untypable lookups in a `*Untyped` helper with `// TODO(ts)`.
- After each rename: `npm run test:ts`, `npx tsc --noEmit`, full `npm test`, `npm run build`, commit, push, watch deploy, verify live bundle hash.

## Queue (plan order: leaves first, hubs last)

- [x] `src/camera-params.js`, `src/decal-size.js` (+ `tests/decal-size.test.js`)
- [ ] Three.js utils: `three-helpers.js`, `merge-static.js`, `merge-skinned.js`, `gltf-models.js`, `model-upload.js`, `mat-cache.js`, `grid-helper.js`
- [ ] Data + config: `factions/*.js`, `factions.js`, `maps-menu.js`, `teamcolour.js`, `meshes/*` (+ shared types file)
- [ ] Input layer: `input/camera.js`, `input/selection.js`, `input/markers.js`, `input/orders.js`, `input/events.js`, `input/touch-controls.js`, `input.js`
- [ ] HUD: `hud/bits.jsx` → `.tsx`, `hud/primitives.jsx`, components, `hud.js`
- [ ] Core loop (last): `scene.js`, `systems/*`, `entities.js`, `game.js`, `multiplayer.js`, `camera-fps.js`, `main-menu.js`

## Gates (must stay green)

- `npx tsc --noEmit` → exit 0, zero errors, zero `@ts-nocheck`.
- `npm run test:ts` → all pass.
- `npm test` → all pass, runner exits on its own.
- `npm run build` → success; live bundle hash matches `dist/`.
