# Codebase Architecture: Assessment & Suggestions

Date: 2026-10-12. Scope: `src/` (~26k LOC), `tests/` (89 files, 514 tests),
repo root hygiene. Method: static inspection + test/build runs, no profiler.

## Progress log

- 2026-10-12 — **A1 done**: `src/systems.js` (3050 lines) split into
  `src/systems/{terrain,combat,squad,builder,structures,points,projectiles,vehicles,air,meta}.js`
  plus an 11-line barrel preserving all 28 exports. Pure move, no logic
  edits; text-asserting suites now read via `tests/systems-src.mjs`.
  Suite 514/514, `vite build` clean. Next: A2 (`meshes.js`), A3 (`input.js`).
- 2026-10-12 — **A2 done**: `src/meshes.js` (2221 lines) split into
  `src/meshes/{common,soldiers,hud,buildings,points,vehicles,ghost}.js` plus
  an 8-line barrel preserving all 43 exports. Dynamic `import('./…')` paths
  rewritten to `../…`; suites read via `tests/meshes-src.mjs`. 514/514.
- 2026-10-12 — **A3 done**: `src/input.js` (2149 lines) split into
  `src/input/{camera,selection,markers,build-ghost,orders,events}.js` plus
  an 8-line barrel preserving all 47 exports. Cross-module `let` writes from
  `events.js` converted to `setX` mutators (matching the `scene.js`
  convention) — ESM imports are read-only and rollup rejects direct
  assignment. Suites read via `tests/input-src.mjs`. 514/514, build clean.

## Verdict: 6/10 — a working hobby RTS with good habits and three god files

This is not a bad codebase. It boots, builds, and holds 514 green tests. The
weaknesses are concentrated and fixable: three oversized files, one global-state
hub, and scattered single/multiplayer branching. Nothing here requires a
rewrite; the highest-value work is extraction, not redesign.

### What is genuinely good

- **Real ECS core.** `src/ecs.js` (103 lines) is small and honest; systems take
  `(world, deltaTime)`. The world-stub pattern in `tests/capture-sequence` and
  `tests/capture-decay` proves simulation logic is testable without a browser.
- **Test culture.** 514 tests, and recent behavior changes ship with regression
  tests. The React HUD migration finished cleanly: `src/hud.js` is 51 lines of
  channel bumps, components read live state via `useSyncExternalStore`.
- **Pure helpers extracted for testability.** `soldier-aim.js` (capture math,
  decay, slot targets) and the `meshes.js` predicates (`canPlaceListeningPost`,
  `nextStrategicPointAnim`, `shouldShowCaptureFlag`) keep rules out of the
  frame loop and under test.
- **Data-driven factions.** `src/factions/*.js` + `buildOrder` grids drive the
  build menu generically; per-faction tests pin each grid.

## Ranked issues (evidence-linked)

### 1. Three god files hold ~30% of all source

| File | LOC | Symptom |
|---|---|---|
| `src/systems.js` | 3050 | `systemSquad` alone spans ~700 lines (406–1108): movement, capture ticking, planter/guard anims, facing, scatter, stagger, daemons |
| `src/meshes.js` | 2221 | Mesh factories mixed with game rules (LP placement rule, capture anim state machine, flag wiring) |
| `src/input.js` | 2149 | DOM events + selection + box select + ghost placement + order issuing in one module |

Every new feature lands in one of these three, so merge conflicts, review
load, and accidental coupling all concentrate there.

### 2. `scene.js` is a global-state hub (111 exports, 24 importers)

Mutable `export let` singletons (`world`, `requisition`, `selSquads`,
`buildMode`, camera, renderer, …) plus `window.*` globals
(`window._multiplayerMode` is checked **38 times** across `src/`). Consequences:

- Any module can mutate game state from anywhere; data flow is untraceable.
- Tests must stub `globalThis.window` / `document` to import simulation code.
- `scene.js` can never be split without touching all 24 importers at once.

### 3. Single/multiplayer branching is sprinkled, not separated

`if (!window._multiplayerMode)` guards sit inside individual systems
(capture decay, construction, production, …). The two modes share a call
graph but diverge per-line, so neither path can be reasoned about alone and
multiplayer regressions hide behind flags the test suite rarely sets.

### 4. Duplicated per-type systems and setters

- Projectiles: `systemBullet`, `systemLaserBullet`, `systemBeam`,
  `systemReaperBullet`, `systemBlasterBullet`, `systemPlasmaBullet`,
  `systemMissile`, `systemGrenade` (+ `makeBulletMesh`,
  `makeLaserBulletMesh`, `makePlasmaBulletMesh`, …). Each repeats an
  integrate → collide → despawn loop with slightly different damage hooks.
- Selection: `setSquadSelected`, `setBuildingSelected`, `setApcSelected`,
  `setVehicleSelected`, `setJetSelected`, `_setAirfieldSelected` in
  `src/input.js` (lines 270–372) are six near-identical functions.

### 5. Simulation and presentation are interleaved

Systems update HP bars, gem colors, flag visibility, and anim scrubbing
inline (`systemStrategicPoint`, `_strategicPointUpdateOwner`). That forces
the node test stubs to carry mesh dummies and makes headless balance sims
or a dedicated server build painful.

### 6. Inconsistent faction namespacing

Most factions share generic structure types (`listening_post`), but Tau uses
`tau_listening_post`, `tau_plasma_generator`, … This already forced
type-name special-casing in HUD code; every new generic structure risks the
same `type === 'x' || type === 'tau_x'` sprawl. (`dark-eldar.js` at 26 lines
vs `ig.js` at 600 also suggests uneven faction completeness.)

### 7. Many tests assert source text, not behavior

A large share of the suite greps file contents (`src.includes(...)`) instead
of executing logic. These tests break on renames, pass on dead code, and
cannot catch logic errors. The behavioral world-stub tests
(`capture-sequence`, `capture-decay`, 511→514 passing) prove the better
pattern already works — it just isn't the default.

### 8. Repo hygiene: no git, root clutter, build output in-tree

- No `.git/` and no `.gitignore` — no history, no branching, no blame.
- Root holds `out.tiff` (3.3 MB), `grimcraft.html` + `grimcraft-bak.html`
  (~400 KB each, apparently near-duplicates), `.DS_Store`, and stale
  migration/anims HTML explorers.
- `dist/` build output sits in the working tree.
- `ECS.md` is actually an HTML file with an `.md` extension.

### 9. Missing guardrails

No linter, no formatter, no type checking (plain JS, minimal JSDoc).
Team identity is stringly typed (`'blue'`/`'red'` literals everywhere);
a `TEAMS` const or typedef would catch typos at edit time.

## Suggestions, ordered by value ÷ effort

### A. Split the god files along existing seams (high value, medium effort)

The seams already exist as top-level functions — no redesign needed:

1. `systems.js` → `src/systems/*.js`, one file per system
   (`squad.js`, `soldier.js`, `builder.js`, `building.js`, `structure.js`,
   `strategic-point.js`, `projectiles.js`, `air.js`, …), keeping the
   `systemX(world, deltaTime)` signature and re-exporting from
   `src/systems.js` during transition. First cut: extract `systemSquad`'s
   capture/anim helpers (they already live half in `soldier-aim.js`).
2. `meshes.js` → `mesh-factories/` (pure geometry) vs `point-rules.js`
   (placement rules, anim state machines). Rules stay unit-tested; factories
   stay dumb.
3. `input.js` → `selection.js`, `orders.js` (right-click issuing),
   `build-ghost.js`, `camera-keys.js`. Collapse the six `set*Selected`
   functions into one `setSelected(world, id, type, value)` with a
   per-type ring/marker table.
4. `ActionsGrid.jsx` (926 lines) → one file per view; the per-view
   functions (`BuilderActions`, `HQActions`, …) already define the split.

Do these as pure file moves first (no logic changes), one PR each, with the
test suite green between moves.

### B. Contain global state without a big bang (high value, low effort)

- Freeze `scene.js` exports: no new `export let`; new state goes into a
  `createGameState()` object owned by `game.js` and passed down.
- Replace the 38 `window._multiplayerMode` reads with one imported
  `isMultiplayer()` accessor, then pass `mode` into systems as a parameter.
  This alone makes the mode matrix visible and greppable.
- Long term: introduce a `GameContext { world, scene, camera, state, net }`
  struct so systems stop importing singletons. Do not attempt this before
  (A); the god-file split shrinks each import surface first.

### C. Unify projectiles behind one system (medium value, low effort)

Replace the eight projectile systems with a single
`systemProjectile(world, dt)` driven by a per-type config table
(`{ speed, damage, vsInfantry, trail, impact }`). Keep the distinct mesh
factories. This deletes hundreds of lines of near-identical traversal code
and makes adding a weapon a data entry, not a new system.

### D. Separate simulation from presentation (high value, high effort)

Rule: systems mutate components only; a `render-sync` pass (or the existing
per-frame mesh updates, relocated) copies component state to meshes/HP
bars/flags. Start with `systemStrategicPoint` + `_strategicPointUpdateOwner`
(gem/ring/flag updates move to a `syncPointVisuals` helper). Payoff:
headless sims, faster tests without mesh dummies, and a future server build.

### E. Normalize faction structure types (medium value, low effort)

Pick one scheme: either every faction prefixes (`tau_listening_post` →
keep, others gain prefixes) or none does (Tau drops the prefix). The
second is less churn. Either way, add a test asserting all `buildOrder`
entries resolve in `structures`, `icons`, and `COSTS` for every faction
(the marines test already does this — generalize it to a loop).

### F. Shift new tests from grep to behavior (medium value, low effort)

Adopt the rule: new tests execute code (world-stub pattern from
`capture-sequence`/`capture-decay`); `src.includes` assertions are allowed
only for wiring that cannot run in node (JSX structure, CSS). When touching
an old grep test, convert it opportunistically. No mass rewrite.

### G. Hygiene sprint (low value, 30 minutes)

1. `git init`, add `.gitignore` (`node_modules/`, `dist/`, `.DS_Store`,
   `*.tiff`, local `.env`), make the first commit.
2. Move explorers and backups (`grimcraft*.html`, `animations-tree-*`,
   `migration-phases.*`, `out.tiff`, `bulk-extract.js`, `temp-extract.js`)
   to `archive/` or delete them.
3. Rename `ECS.md` → `ECS.html` (or convert to real Markdown).
4. Add `TEAMS = { PLAYER: 'blue', ENEMY: 'red' }` and use it in new code.

### H. Adopt minimal guardrails (low value, low effort)

Prettier + a one-command `npm run check` (tests + build). Skip ESLint
strictness and TypeScript for now — the codebase earns more from (A)–(C)
than from type migration, and premature TS conversion of god files just
freezes them in place.

## What NOT to do

- **No rewrite.** The game works, the ECS shape is sound, tests are green.
  Rewrites discard the 514 tests that are this repo's best asset.
- **No TypeScript migration yet.** It pays off after the splits (A), not
  before.
- **No engine/framework swap.** Three.js + React HUD is a reasonable stack
  for this game; the problems are file organization, not technology.
- **No multiplayer refactor before (B).** The mode branching must become
  visible (one accessor) before it can be redesigned (two drivers).
