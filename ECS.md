<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="color-scheme" content="dark">
<style>
  :root { color-scheme: dark; }
  body {
    background: #0d1117;
    color: #e6edf3;
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
    line-height: 1.6;
    max-width: 900px;
    margin: 40px auto;
    padding: 0 24px;
  }
  a { color: #58a6ff; }
  h1, h2, h3, h4 { color: #f0f6fc; border-bottom: 1px solid #30363d; padding-bottom: 0.3em; }
  h1 { font-size: 1.8em; }
  h2 { font-size: 1.4em; }
  h3 { font-size: 1.15em; }
  code { background: #161b22; color: #ffa657; padding: 0.2em 0.4em; border-radius: 4px; font-size: 0.9em; }
  pre { background: #161b22; border: 1px solid #30363d; border-radius: 6px; padding: 16px; overflow-x: auto; }
  pre code { background: none; padding: 0; color: #e6edf3; }
  table { border-collapse: collapse; width: 100%; margin: 12px 0; }
  th, td { border: 1px solid #30363d; padding: 8px 12px; text-align: left; }
  th { background: #161b22; color: #f0f6fc; font-weight: 600; }
  tr:nth-child(even) { background: #0d1117; }
  tr:nth-child(odd) { background: #151b23; }
  hr { border: none; border-top: 1px solid #30363d; margin: 24px 0; }
  blockquote { color: #8b949e; border-left: 3px solid #30363d; padding-left: 16px; margin: 12px 0; }
  ul, ol { padding-left: 24px; }
  ::-webkit-scrollbar { width: 10px; }
  ::-webkit-scrollbar-track { background: #0d1117; }
  ::-webkit-scrollbar-thumb { background: #30363d; border-radius: 5px; }
</style>
</head>
<body>

<!-- markdown content -->



### Proposed ECS-native structure

```
js/
├── ecs.js                     ← ECS engine (unchanged)
├── game.js                    ← Game loop, boot
│
├── components/                ← Component schemas (extracted from entities.js)
│   ├── soldier.js
│   ├── squad.js
│   ├── builder.js
│   ├── building.js
│   ├── structure.js
│   ├── strategicPoint.js
│   ├── bullet.js
│   ├── apc.js
│   ├── airfield.js
│   ├── jet.js
│   ├── missile.js
│   └── particle.js
│
├── systems/                   ← One file per system (split from systems.js)
│   ├── systemSoldier.js
│   ├── systemSquad.js
│   ├── systemBuilder.js
│   ├── systemBuilding.js
│   ├── systemStructure.js
│   ├── systemApc.js
│   ├── systemStrategicPoint.js
│   ├── systemBullet.js
│   ├── systemLaserBullet.js
│   ├── systemPlasmaBullet.js
│   ├── systemGrenade.js
│   ├── systemParticle.js
│   ├── systemAirfield.js
│   ├── systemJet.js
│   ├── systemMissile.js
│   ├── systemGoldIncome.js
│   ├── systemAI.js
│   ├── systemWinCheck.js
│   └── _initSystems.js        ← Registration order
│
├── entities/                  ← Factory functions (split from entities.js)
│   ├── soldier-factory.js
│   ├── squad-factory.js
│   ├── builder-factory.js
│   ├── building-factory.js
│   ├── structure-factory.js
│   ├── strategic-point-factory.js
│   ├── bullet-factory.js
│   ├── apc-factory.js
│   ├── airfield-factory.js
│   ├── jet-factory.js
│   ├── missile-factory.js
│   └── grenade-factory.js
│
├── meshes/                    ← One file per mesh family (split from meshes.js)
│   ├── soldier-mesh.js
│   ├── building-meshes.js     ← HQ, Barracks
│   ├── structure-meshes.js    ← Tower, Turret, ThermoGen, TowerBase
│   ├── projectile-meshes.js   ← Bullet, Laser, Plasma, Grenade, Missile
│   ├── vehicle-meshes.js      ← APC, Jet, Airfield
│   ├── strategic-point-mesh.js
│   └── ui-meshes.js           ← HpBar, SelRing, Ghost, RallyMarkers
│
├── input/                     ← Split by concern (from input.js)
│   ├── camera-control.js      ← tickCamera, edge scroll, orbit
│   ├── selection.js           ← doClickSelect, doBoxSelect, clearSelection
│   ├── selection-visuals.js   ← setSquadSelected, setBuildingSelected, rally markers
│   ├── commands.js            ← issueRightClick, placeBuild, demolish
│   ├── markers.js             ← spawnMoveMarker, spawnAttackMarker, range circles
│   ├── build-ghost.js         ← Ghost mesh lifecycle
│   └── input-init.js          ← setupPointerEvents, initInput
│
├── hud/                       ← Split by panel (from hud.js)
│   ├── hud-core.js            ← updateHUD, btn, setPortraitIcon
│   ├── hud-builder.js         ← renderBuilderHUD
│   ├── hud-building.js        ← renderBuildingHUD
│   ├── hud-squad.js           ← renderSquadHUD
│   ├── hud-default.js         ← renderDefaultHUD
│   ├── hud-minimap.js         ← updateMinimap
│   ├── hud-capture.js         ← updateCaptureProgressBars
│   └── hud-topbar.js          ← updateTopBar
│
├── shared/                    ← Isolated utilities (unchanged)
│   ├── factions.js
│   ├── mat-cache.js
│   ├── model-upload.js
│   └── terrain-upload.js
│
├── scene.js                   ← Scene bootstrap, globals → to be slimmed
├── multiplayer.js             ← Networking (unchanged)
└── nodes-panel.js             ← Debug panel (unchanged)
```

---

## World (`ecs.js`)

The `World` class is the central registry. It owns all entities, their tags, their components, and the system pipeline.

| Method | Purpose |
|--------|---------|
| `createEntity(tags)` | Returns a new integer ID, optionally assigned tags |
| `destroyEntity(id)` | Queues an entity for deferred destruction (applied at end of tick) |
| `add(id, name, data)` | Attaches a component `name` with value `data` to entity `id` |
| `get(id, name)` | Retrieves a component by entity ID and component name |
| `has(id, name)` | Checks if an entity has a component |
| `remove(id, name)` | Removes a component from an entity |
| `hasTag(id, tag)` | Checks tag membership |
| `addTag(id, tag)` / `removeTag(id, tag)` | Mutates tags |
| `query(...names)` | Finds all entity IDs that have **every** listed component (intersection query) |
| `addSystem(fn)` | Registers a system function `(world, deltaTime) => void` |
| `tick(deltaTime)` | Runs every registered system in order, then flushes destroyed entities |

### Query strategy

`query(...names)` picks the smallest component store among the requested names first, then filters by ownership of the remaining components. This means queries for rare components are fast.

---

## Tags

Tags are lightweight labels on entities, defined in `js/scene.js:140`:

| Tag | Applied to |
|-----|-----------|
| `squad` | Squad entities |
| `soldier` | Individual soldiers |
| `builder` | Builder/worker units |
| `building` | HQ, Barracks |
| `structure` | Towers, Turrets, Power Plants |
| `bullet` | Projectiles |
| `grenade` | Grenades |
| `particle` | Visual effects |
| `strategicPoint` | Capture points |

Tags are used for quick type-checks (`world.hasTag(id, TAG.soldier)`) and can be combined with queries for entity filtering.

---

## Components

Each entity gets one or more **component objects** indexed by string name. Below are all component schemas.

### `soldier` (per individual soldier inside a squad)

```js
{
  squadId,                    // parent squad entity ID
  formIdx,                 // position index in squad formation (0 = leader)
  hp: 100 | 150,              // 150 if isSuperior (formIdx === 0)
  maxHp: 100 | 150,
  attackCooldown: 0,          // timer until next shot
  attackRate: 1.2-1.7,       // attacks per second
  walkTime: 0 - 2π,          // walk cycle phase for leg animation
  flashTimer: 0,              // >0 while damage flash is visible
  scatter: null,              // temporary offset during movement
  stagger: 0,                 // hit reaction
  isGrenadier: false,
  isSuperior: false,           // squad leader
  moveSpeed: 5.8-8.0,
  idlePhase: 0 - 2π,         // idle breathing phase
  idleYawOffset: -0.04-0.04,  // slight rotation variation
}
```

### `squad` (the squad itself)

```js
{
  team: 'blue' | 'red',
  position: Vector3,          // squad center
  facing: Vector3,            // movement direction
  visualFacing: Vector3,      // smoothed facing for rendering
  speed: 5.5-7.0,
  attackRange: 22-26,
  detectionRange: 40,
  grenadeCd: 0,               // cooldown before next grenade volley
  grenadeReloadTime: 3,
  idleTime: 0,                // time since last order (for grenade readiness)
  reinforceQueue: [],         // { formIdx, progress } pending reinforcements
  reinforceProgress: 0,
  grenadeQueue: [],           // { solId, progress } pending grenade upgrades
  grenadeProgress: 0,
  moveOrder: Vector3 | null,  // destination
  stopped: false,
  selected: false,
  autoChase: boolean,         // true for enemy squads
  projectileType: 'bullet',
  soldiers: Array(13),        // array of soldier entity IDs (null = empty slot)
  forcedTarget: null,         // enemy squad ID when attack-ordered
  forcedSoldierId: null,      // specific soldier target
  autoReinforce: false,
}
```

### `builder` (worker unit)

```js
{
  team: 'blue' | 'red',
  hp: 60,
  maxHp: 60,
  speed: 7,
  moveTarget: Vector3 | null,
  buildTarget: { type, position, pendingEntityId } | null,
  buildTargetSP: entityId | null, // strategic point for listening post
  buildProgress: 0,
  isBuilding: false,
  walkTime: 0,
  selected: false,
}
```

### `building` (HQ, Barracks)

```js
{
  type: 'hq' | 'barracks',
  position: Vector3,
  team: 'blue' | 'red',
  hp: 2000 | 400,
  maxHp: 2000 | 400,
  queue: [],                  // training queue: [{ type, progress, total }]
  selected: false,
  rallyPoint: Vector3 | null,
  constructing: true,
  constructProgress: 0,
  constructTime: 0 | 8 | 5,  // 0 = pre-built (HQ)
}
```

### `structure` (Tower, TowerBase, GunTurret, ThermoGen)

```js
{
  type: 'tower' | 'towerBase' | 'gunTurret' | 'thermoGen',
  position: Vector3,
  hp: number,
  maxHp: number,
  attackRange: number,
  attackRate: number,
  attackCd: 0,
  goldTimer: 0,
  energyTimer: 0,
  pulseT: 0,
  selected: false,
  constructing: true,
  constructProgress: 0,
  constructTime: 5 | 6 | 7,
}
```

### `strategicPoint` (capture point)

```js
{
  position: Vector3,
  owner: null | 'blue' | 'red',
  captureProgress: 0,
  captureRadius: 2.5,
  hasListeningPost: false,
  hasTowerBase: false,
  goldTimer: 0,
  lpMesh: null,
}
```

### `bullet` / `laserBullet` (projectiles)

```js
{
  team: 'blue' | 'red',
  targetId: number,
  ownerRef: number,
  vx, vy, vz: number,         // velocity components
  damage: 8-13 | 12-18,
  age: 0,
}
```

### `grenade` (ballistic grenade)

```js
{
  team: 'blue' | 'red',
  ownerSoldierId: number,
  vx, vy, vz: number,
  age: 0,
  blastR: 5.5,
  blastDmg: 30,
  scatterF: 9,
}
```

### `apc` (armored transport)

```js
{
  team: 'blue',
  position: Vector3,
  hp: 500,
  maxHp: 500,
  speed: 4.5,
  attackRange: 30,
  attackCd: 0,
  attackRate: 1.5,
  moveOrder: Vector3 | null,
  selected: false,
  detectionRange: 38,
  laserPulse: 0,
  passengers: [],              // squad/builder entity IDs
  maxPassengers: 2,
  playerControlled: true,
  projectileType: 'laser',
}
```

### `airfield` (aircraft production)

```js
{
  position: Vector3,
  hp: number,
  maxHp: number,
  queue: [],                   // [{ type, progress, total }]
  selected: false,
  constructing: true,
  constructProgress: 0,
  constructTime: 10,
  beaconT: 0,
  rallyPoint: Vector3 | null,
}
```

### `jet` (fighter aircraft)

```js
{
  team: 'blue',
  hp: 250,
  maxHp: 250,
  position: Vector3,
  orbitAngle: number,
  orbitR: number,
  orbitSpeed: number,
  attackCd: 0,
  attackRate: 1.0,
  strafeCd: 0,
  strafe: null,
  bankAngle: 0,
  selected: false,
  flameT: 0,
  shootFlashT: 0,
  waitOrders: true,
  patrolMode: 'orbit' | 'attack' | 'hold',
  holdPos: Vector3,
  forcedTargetSqId: null,
}
```

### `missile` (homing missile)

```js
{
  team: 'blue' | 'red',
  targetSqId: number,
  targetSoldierId: null,
  vx, vy, vz: 0,
  damage: 45,
  age: 0,
}
```

### `mesh` (shared visual component)

Every visible entity also has a `mesh` component. The shape varies by entity type:

| Entity type | `mesh` contains |
|---|---|
| soldier | `root`, `hpBar`, `reloadBar` |
| squad | `hpBar`, `reinBar`, `grenadeSetupBar` (no `root`) |
| builder | `root` |
| building | `root`, `scaffold`, `constructBar`, `hpBar`, `_realMeshBuilt`, `_meshFactory` |
| structure | same as building |
| airfield | `root`, `scaffold`, `constructBar`, `hpBar`, `prodBar`, `_realMeshBuilt`, `_meshFactory` |
| bullet/laser/plasma | `root` |
| grenade | `root` |
| apc | `root`, `hpBar` |
| jet | `root`, `hpBar` |
| missile | `root` |
| strategicPoint | `root`, `capRing`, `gem`, `gemMat`, etc. (full visual group) |

---

## Systems (`systems.js`)

Systems are pure functions `(world, deltaTime) => void` registered via `world.addSystem()`. They query for entities with specific component combinations and update them each frame.

### Registration order (`_initSystems`)

```
systemSoldier      → damage flash, HP bars, reload bars
systemSquad        → movement, combat, formation, reinforce, grenades
systemBuilder      → builder movement, construction
systemBuilding     → building construction progress, training queue
systemStructure    → tower/turret attack, gold/energy income
systemApc          → APC movement, turret, firing, death
systemStrategicPoint → gem animation, gold income
systemBullet       → bullet physics, collision
systemLaserBullet  → laser projectile physics
systemPlasmaBullet → plasma projectile physics
systemGrenade      → grenade physics, explosion
systemParticle     → particle life cycle
systemAirfield     → construction, beacon, jet production
systemJet          → movement, patrol, strafe, missiles
systemMissile      → missile homing, explosion
systemGoldIncome   → passive gold income
```

### Additional systems (called separately, not in the main ECS pipeline)

```
systemAI           → enemy squad auto-spawning (called from game.js per game logic)
systemWinCheck     → defeat condition (called from game.js per game logic)
```

---

## Systems (not part of ECS, but game-loop-level)

These live outside the ECS `world.tick()` but run inside the same render loop in `game.js`:

- `tickCamera(deltaTime)` — edge-scroll camera movement (input.js)
- Scene render (`scene.render()`)
- Grid visibility updates
- Top bar + minimap + capture progress bar updates (HUD)

---

## Game Loop (`game.js`)

```
→ scene.onBeforeRenderObservable
   tickCamera(deltaTime)
   world.tick(deltaTime)          ← runs all ECS systems in order
   systemAI(world)                 ← enemy squad spawner
   systemWinCheck(world)           ← defeat condition
   updateTopBar()
   updateCaptureProgressBars()
   scene.render()
```

The ECS tick is roughly 60% (by system count) of the per-frame work.

---

## Constants

Defined in `js/scene.js`:

| Constant | Value | Purpose |
|----------|-------|---------|
| `PLAYER` | `'blue'` | Player team identifier |
| `SQUAD_MAX` | `13` | Max soldiers per squad |
| `FORMATION` | `Vector2[]` | Soldier formation offsets (indexed by formIdx) |
| `JET_ALT` | `14` | Jet flight altitude |
| `JET_SPEED` | `10` | Jet movement speed |
| `ARENA` | `85` | Half the arena size (clamp boundary) |
| `COSTS` | `{ barracks: 150, squad: 100, ... }` | Gold costs for each unit/structure |
| `PROD_TIME` | `{ squad: 3, builder: 2, jet: 12 }` | Production times in seconds |

<!-- /markdown content -->

</body>
</html>
