# FPS Optimization Plan

Date: 2026-10-12. Scope: frame-time in the running game (`src/`, React HUD,
Three.js renderer). Method: static inspection; no browser profile was
available in this session, so every expected impact below is an estimate
until the measurement step is run.

## Where we are (already done — do not redo)

| Item | Evidence | Effect |
|---|---|---|
| Static geometry merge (structures/HQ per material) | `src/merge-static.js`, wired in `src/factions.js` | HQ 180 prims → 6 calls (−97%); 8 HQ scene −91% |
| Skinned merge (soldiers, non-switchable parts) | `src/merge-skinned.js`, wired in `src/factions.js` | Infantry 13 calls/fighter before; lower after |
| Quality tiers | `src/scene.js` (`qualityTier`, `applyRendererSettings`) | Low tier: no shadow maps, DPR 1 |
| Pixel-ratio caps | `src/three-helpers.js` (`pixelRatioForTier`) | low 1, medium ≤1.5, high ≤2 |
| HUD cadence for topbar/minimap/capture bars | `src/hud/store.js` (`hudDue`, every 3rd frame ≈ 20 Hz) | Those panels skip 2 of 3 frames |
| Shadow map 1024², PCFSoft | `src/scene.js` | Bounded shadow cost |

Remaining budget-eaters are CPU-side scans, per-frame HUD re-renders, mixer
updates, and the unmerged remainder (vehicles, points, per-shot effects).

## Step 0 — Measure first (blocking; everything else follows data)

1. Read the existing FPS meter (`src/hud/store.js` `getFps`, shown in
   TopBar) and add transient `renderer.info.render.calls` /
   `.triangles` + JS frame time to the TopBar (behind `?debug=1`).
2. A/B the documented toggles before changing code:
   - `?models=procedural` vs GLB (`src/model-source.js`) — isolates
     draw-call cost from simulation cost.
   - `?quality=low|medium|high` — isolates fill/shadow cost.
3. In Chrome: Performance panel, 10 s capture mid-battle. Split the frame
   into script / shadow pass / main pass / React commit. Record baselines
   (avg + 1% low FPS, draw calls, JS ms) in this file before any fix.

Without this, P0–P3 ordering is guesswork. CPU fixes (P0) help only if
script time dominates; draw-call work (P1) helps only if GPU/pass time
dominates.

## P0 — Enemy search: kill the per-frame sqrt storm

**Problem.** `findClosestEnemySoldier` (`src/systems/combat.js`) scans every
enemy soldier with `fromPos.distanceTo(...)` (a sqrt per soldier) for every
squad, every frame (call sites in `src/systems/squad.js`). Cost grows
S squads × N soldiers with full sqrt + per-call `world.query('squad')`
allocation.

**Fix (result-identical, no gameplay change).**
1. Compare `distanceToSquared`; take one `Math.sqrt` for the winner only.
2. Hoist the `world.query('squad')` out of the per-squad call: compute the
   squad list once per `systemSquad` tick and pass it in (keep the old
   signature as a wrapper so other callers/tests are untouched).
3. Only if still hot (Step 0 decides): stagger recomputation per squad
   (every 3rd frame, rotating) while the current target stays alive and in
   range. This is the only behavior-touching step — target switches may
   lag up to 50 ms; gate it behind a test that asserts identical winners
   on static scenes.

**Risk.** Low. Squared comparisons pick the same winner; formation/scatter
means no safe distance pre-check exists (soldiers can be arbitrarily far
from their squad center), so do **not** add a radius early-out unless it
uses a generous margin and a fallback full scan.

**Verify.** Node micro-benchmark: stub world, 40 squads × 10 soldiers,
time 1 000 calls before/after; winner identity must match the old
implementation on randomized scenes. Then in-game Step 0 numbers.

**Landed 2026-10-12.** Squared comparisons + hoisted squad list
(`src/systems/combat.js`, `src/systems/squad.js`). Benchmark: 800/800
identical winners on randomized scenes; 37.2 ms → 16.0 ms per 1 000 scans
(**2.33×**). Suite 537/537, build clean. In-game Step 0 numbers still open.

## P0 — HUD re-renders every frame while any queue is active

**Problem.** The frame loop calls `updateHUD()` whenever any production or
reinforce queue exists (`src/game.js`), which bumps the `hud` channel and
re-renders the whole HUDApp every frame — including `ActionsGrid`, which
runs ECS queries (e.g. `world.query('strategicPoint')`) during render.
Queue bars do not need 60 Hz.

**Fix.** Route the queue-driven bump through the existing cadence: only
call `updateHUD()` on `hudDue(frameNo)` frames (20 Hz, same as topbar), or
when a queue actually completes. Event-driven `updateHUD()` calls from
input/systems stay as they are.

**Risk.** Low. Queue progress bars update at 20 Hz instead of 60 Hz;
selections/costs still refresh instantly via event-driven bumps.

**Verify.** React profiler or a render counter: HUD renders/sec while a
barracks queue runs (expect ~60 → ~20). Step 0 JS ms should drop.

**Landed 2026-10-12.** Queue bump (and its ECS queries) gated on
`hudDue(_frameNo)` in `src/game.js`; completion bumps from the production
systems are untouched. Suite 537/537, build clean. In-game render-count
check still open (needs a browser run).

## P1 — Mixer updates for every soldier, every frame

**Problem.** `updateMixers` (`src/gltf-models.js`) updates every registered
`AnimationMixer` each frame (with a per-mixer try/catch). Each mixer update
recomputes skeleton bone matrices on CPU. One-shot completion is driven by
mixer `finished` events — so **never skip mixer updates outright**:
freezing offscreen mixers would stall capture one-shots (flag plants) and
anything waiting on `_currentAnim` clearing.

**Fix (safe variants, pick after Step 0).**
1. Distance throttle: mixers whose root is far outside the camera frustum
   update every 2nd–4th frame with scaled `deltaTime` (progression
   preserved, cost divided). Frustum test from root position + generous
   radius; 1-frame-stale `matrixWorld` is fine.
2. Cap: process a rotating subset per frame when mixer count exceeds a
   threshold (e.g. 120), again with scaled delta.

**Risk.** Medium. Animation phase visibly coarser offscreen (invisible to
the player if the frustum margin is generous); onscreen units untouched.
One-shots still finish, just with coarser time steps while offscreen.

**Verify.** Counts: mixers updated/frame before/after at fixed camera;
scripted offscreen capture sequence still completes (capture-sequence test
pattern); Step 0 script ms.

**Landed 2026-10-12.** Frustum test per `updateMixers(dt, camera)` call
(`src/gltf-models.js`; `src/game.js` passes the camera): offscreen mixers
update every 4th frame with 4× delta, onscreen full rate, no-camera path
unchanged. Real-frustum test proves identical progressed time on/offscreen
(0.4 s over 8 ticks) and offscreen one-shot completion; `mixerThrottleStep`
unit-tested; phase map cleaned on unregister. Suite 542/542, build clean.
In-game script-ms check still open.

## P1 — Remaining draw calls: vehicles, points, per-shot effects

**Problem.** Merging covered structures/HQ and soldiers. Deliberately
unmerged: vehicles and strategic points (clip-driven parts, runtime node
lookups — see `src/merge-static.js` header), plus one mesh per projectile/
bolt/missile and glow sprites per shot. Known per-model cost (this
session's GLB count): `grey_knight.glb` 3 calls, `bloodthirster.glb` 12
calls, `models/dark eldar/infantry/raider.glb` 304 primitives
(`performance.md`).

**Fix.**
1. Vehicles: apply the static-merge path to vehicle containers where no
   node is toggled at runtime (per-model audit; keep animated/weapon nodes
   separate). Reuse `mergeGeometries` approach from `src/sgb-parser.js`.
2. Projectiles/bolts: if Step 0 shows many per-shot draws, pool + instance
   bolt meshes (InstancedMesh per projectile type) instead of one Mesh per
   shot. This is the largest single change here — only with data.
3. Points: leave alone (clip-scrubbed rise, banner nodes, ground plane
   patching all rely on per-node access).

**Risk.** Medium (1: hidden-node semantics; 2: system rewrite).
Shadows double all of the above (shadow pass) — on the low tier this is
already moot (shadows off).

**Verify.** `renderer.info.render.calls` at a fixed battle scene
before/after; per-model primitive counts via the GLB counting script
(pattern from `scripts/merge-benchmark.mjs`).

**Landed 2026-10-12 (audit + partial).** Audit: all faction `vehicles: {}`
are empty (vehicles are procedural, few prims each) and `loadUnitContainers`
already skinned-merges every faction unit — no unmerged vehicle GLBs
remain; points stay unmerged per the non-goals. Landed the bounded win:
one shared `BufferGeometry` per projectile type (bullet/laser/plasma/
grenade) plus one for hit particles (`src/meshes/soldiers.js`,
`src/systems/combat.js`, `mkSharedMesh` in `src/three-helpers.js`) —
per-shot geometry allocation/upload goes from N to 1 per type with zero
visual change (materials untouched: beams fade per-shot opacity, so only
geometry is shared; `disposeObj`'s `userData.shared` guard keeps the
shared geos alive). Covered by `tests/projectile-sharing.test.js`.
Suite 542/542, build clean. InstancedMesh pooling for bolts stays parked
pending Step 0 data.

## P2 — Fill rate: resolution and shadows

**Problem.** High tier allows DPR 2 (4× pixels of DPR 1) with PCFSoft
shadows over a ±150 shadow camera at 1024².

**Fix (taste/quality calls, cheap to try after Step 0).**
1. High tier DPR cap 2 → 1.5 (same as medium) if fill-bound; or dynamic
   resolution: drop one DPR step when FPS < target for sustained 1 s,
   restore when headroom returns.
2. Shadow camera: follow the camera target with a tighter frustum
   (e.g. ±90) instead of a static ±150, raising effective texel density
   at the same 1024² — or raise to 2048 only on high if texel shimmer
   matters more than fill.

**Risk.** Low–medium (visual softness vs. smoothness tradeoff; user-visible,
so confirm with the Step 0 A/B toggles first).

**Verify.** Step 0 FPS + GPU time at DPR 2/1.5/1 on the same scene.

**Landed 2026-10-12.** Self-tuning ladder instead of fixed caps:
`createDynamicResolution(cap)` (`src/three-helpers.js`, unit-tested in
`tests/gpu-tier.test.js`) steps DPR down [2 → 1.5 → 1.25 → 1] after ~1 s
under 30 FPS and back up after ~5 s over 55 FPS, never above the tier cap
or below 1; the frame loop applies changes via setPixelRatio + setSize
(`src/game.js`, pinned in `tests/frame-loop.test.js`). Shadow frustum
follows the camera target, sized to the zoom radius (tight ±90 up close,
today's ±150 at far zoom) instead of a static box. Suite 554/554, build
clean. In-game FPS confirmation still open.

## P2 — Allocation hygiene in hot paths

**Problem.** `world.query(...)` allocates a fresh array per call and runs
every frame in several systems (e.g. `world.query('building')` in the
frame loop, per-squad queries in `systemSquad`). Individually small;
collectively GC pressure at 60 Hz.

**Fix.** Reuse scratch arrays where the ECS query implementation allows
(filled-and-returned pattern), or hoist invariant queries out of per-entity
loops. Do not redesign the ECS for this — measure GC in the Step 0 profile
first; skip if minor GC is not visible.

**Risk.** Low, but easy to over-engineer — last priority in P2.

**Verify.** Chrome heap profile (allocation timeline) before/after.

**Landed 2026-10-12.** Squared comparisons in builder aggro
(`src/systems/builder.js`, covered by `tests/builder-aggro.test.js`);
APC/vehicle rosters hoisted to one query per `systemBullet` tick with
squared hit checks (covered by `tests/bullet-routing.test.js`); particle
color `clone()` → `copy()` plus shared color/offset consts at hot call
sites (`src/systems/combat.js`, `src/systems/builder.js`; snapshot
semantics covered by `tests/projectile-sharing.test.js`). Pure
restructures, no behavior change. Suite 554/554, build clean.

## Explicit non-goals

- **Do not merge strategic points or toggleable soldier parts** — runtime
  code looks nodes up by name (capture anims, banners, weapon swaps).
- **Do not freeze/skip mixer updates** to save CPU — one-shot completion
  (flag plants, capture clips) depends on mixer `finished` events.
- **Do not add a distance early-out to enemy search without a fallback** —
  scatter/capture states put soldiers far from squad centers.
- **No engine/renderer swap** (WebGL/WebGPU backends both exist); the
  bottleneck is scene composition and CPU scans, not the API.

## Verification checklist (per landed item)

- [ ] Step 0 baselines recorded (FPS avg/1%, draw calls, JS ms) before the change.
- [ ] Same scene re-measured after; numbers written into the item's row.
- [ ] `npm test` green; new behavior covered by the nearest maintained test.
- [ ] `npm run build` clean.
- [ ] No gameplay-visible change (retargeting, anims, queue bars) beyond
  what the item describes.
