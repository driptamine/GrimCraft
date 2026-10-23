import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readInputSource } from './input-src.mjs';
import { readMeshesSource } from './meshes-src.mjs';
import { readSystemsSource } from './systems-src.mjs';

register('./node-esm-hooks.mjs', import.meta.url);
globalThis.window = {};
globalThis.document = { getElementById: () => null, querySelector: () => null };
const { default: chaos } = await import('../src/factions/chaos.js');

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

function glbClipNames(modelPath) {
  const buf = fs.readFileSync(path.join(ROOT, modelPath));
  assert.equal(buf.subarray(0, 4).toString('ascii'), 'glTF', 'valid GLB magic');
  const jsonLen = buf.readUInt32LE(12);
  const json = JSON.parse(buf.subarray(20, 20 + jsonLen).toString('utf8'));
  return new Set((json.animations || []).map((a) => a.name));
}

describe('chaos bloodthirster', () => {
  const unit = chaos.units?.find((u) => u.name === 'bloodthirster');

  it('is registered with a model on disk', () => {
    assert.ok(unit, 'units entry exists');
    assert.equal(unit.model, 'models/chaos/infantry/bloodthirster.glb');
    assert.ok(fs.existsSync(path.join(ROOT, unit.model)), 'GLB exists on disk');
    assert.ok(unit.hiddenNodes.includes('independant_bloodthirster_axe'), 'duplicate axe is hidden');
    assert.equal(unit.canFly, true);
  });

  it('maps every combat clip to a real animation in the GLB', () => {
    const clips = glbClipNames(unit.model);
    for (const key of ['idle', 'run', 'firing', 'moveFiring', 'flyLaunch', 'flyIdle', 'flyLand', 'die_normal_1']) {
      assert.ok(unit.animations[key], `${key} is mapped`);
      assert.ok(clips.has(unit.animations[key]), `${key} -> ${unit.animations[key]} exists in the GLB`);
    }
  });

  it('fights in melee: axe swing on the firing slot, short range, tough', () => {
    assert.equal(unit.animations.firing, 'melee_1');
    assert.ok(unit.attackRange <= 6, `melee range, got ${unit.attackRange}`);
    assert.ok(unit.hp >= 1000, `greater-daemon hp, got ${unit.hp}`);
  });

  it('is trainable from the greater circle grid order with a real icon', () => {
    const circle = chaos.structures.find((s) => s.type === 'greater_sacrificial_circle');
    assert.ok(circle, 'circle config exists');
    const item = circle.production.find((p) => p?.name === 'bloodthirster');
    assert.ok(item, 'bloodthirster is in the production order');
    assert.equal(item.cost, 400);
    assert.equal(item.time, 12);
    assert.ok(item.icon.endsWith('bloodthirster_icon.png'));
    const buf = fs.readFileSync(path.join(ROOT, item.icon));
    assert.equal(buf.subarray(1, 4).toString(), 'PNG');
    assert.equal(buf.readUInt32BE(16), 242);
    assert.equal(buf.readUInt32BE(20), 242);
  });

  it('the greater circle spawns as a training building', () => {
    const input = readInputSource();
    assert.ok(
      input.includes("|| type === 'greater_sacrificial_circle') {"),
      'input places it as a building',
    );
    const systems = readSystemsSource();
    assert.ok(
      systems.includes("type === 'infantry_command' || type === 'greater_sacrificial_circle') {"),
      'build completion creates a building',
    );
    const entities = fs.readFileSync(path.join(ROOT, 'src/entities.js'), 'utf8');
    assert.ok(
      entities.includes("type === 'greater_sacrificial_circle' ? (() => makeConfigStructureMesh(type, position, team, meta))"),
      'completion builds the config structure, not the HQ fallback',
    );
  });

  it('building grid falls back to the own production order', () => {
    const jsx = fs.readFileSync(path.join(ROOT, 'src/hud/components/ActionsGrid.jsx'), 'utf8');
    const grid = jsx.slice(jsx.indexOf('function BuildingActions'), jsx.indexOf('function MultiBuildingActions'));
    assert.ok(grid.includes('getStructureConfig(factionKey, building?.type)'), 'reads the own order');
    assert.ok(grid.includes('.filter((p) => p && typeof p === \'object\' && p.name)'), 'skips legacy strings');
    assert.ok(grid.includes('barracksProduction.length === 0 && ownProduction.length > 0'), 'fallback only when barracks empty');
    assert.ok(grid.includes('if (isBarracks && !useOwn) {'), 'generic trio suppressed on own orders');
  });
});

describe('bloodthirster training pipeline', () => {
  it('ticks the circle queue into exactly one daemon squad', async () => {
    const THREE = await import('three');
    const sceneMod = await import('../src/scene.js');
    const headless = new THREE.Scene();
    headless._registerShadows = () => {};
    sceneMod.__setSceneCameraForTests(headless, { target: new THREE.Vector3() });
    const { setModelSource, MODEL_SOURCE_PROCEDURAL, MODEL_SOURCE_GLB } = await import('../src/model-source.js');
    const { World } = await import('../src/ecs.js');
    const { systemBuilding } = await import('../src/systems.js');
    const { makeHpBar } = await import('../src/meshes.js');
    setModelSource(MODEL_SOURCE_PROCEDURAL);
    try {
      const world = new World();
      const id = world.createEntity([]);
      const rally = new THREE.Vector3(50, 0, 60);
      world.add(id, 'building', {
        type: 'greater_sacrificial_circle',
        team: 'red',
        faction: 'chaos',
        hp: 400,
        maxHp: 400,
        position: new THREE.Vector3(0, 0, 0),
        queue: [{ type: 'bloodthirster', progress: 0, total: 12 }],
        constructing: false,
        constructProgress: 0,
        constructTime: 5,
        rallyPoint: rally,
      });
      world.add(id, 'mesh', { root: new THREE.Group(), hpBar: makeHpBar(4, 'red') });
      const squads = () => world.query('squad');

      systemBuilding(world, 5);
      assert.equal(squads().length, 0, 'nothing spawns mid-queue');
      systemBuilding(world, 5);
      assert.equal(squads().length, 0, 'still training');
      systemBuilding(world, 5);
      assert.equal(squads().length, 1, 'one squad completes');
      const squad = world.get(squads()[0], 'squad');
      assert.equal(squad.unitType, 'bloodthirster');
      assert.equal(squad.team, 'red');
      assert.equal(squad.faction, 'chaos');
      assert.equal(squad.attackRange, 5);
      assert.deepEqual(squad.moveOrder, rally);
      const alive = squad.soldiers.filter((s) => s !== null && world.has(s, 'soldier'));
      assert.equal(alive.length, 1, 'single-daemon squad');
      const daemon = world.get(alive[0], 'soldier');
      assert.equal(daemon.maxHp, 1500);
      assert.equal(daemon.hp, 1500);
      assert.equal(world.get(id, 'building').queue.length, 0, 'queue consumed');
      systemBuilding(world, 5);
      assert.equal(squads().length, 1, 'no duplicate spawn');
    } finally {
      setModelSource(MODEL_SOURCE_GLB);
    }
  });

  it('completing construction builds the circle, not the HQ fallback', async () => {
    const THREE = await import('three');
    const sceneMod = await import('../src/scene.js');
    const headless = new THREE.Scene();
    headless._registerShadows = () => {};
    sceneMod.__setSceneCameraForTests(headless, { target: new THREE.Vector3() });
    const { World } = await import('../src/ecs.js');
    const { systemBuilding } = await import('../src/systems.js');
    const { makeHpBar } = await import('../src/meshes.js');
    const world = new World();
    // Exercise the real factory wiring from createBuildingEntity.
    const { createBuildingEntity } = await import('../src/entities.js');
    const realId = createBuildingEntity(world, 'greater_sacrificial_circle', new THREE.Vector3(100, 0, 100), 'red', 'chaos');
    const realMesh = world.get(realId, 'mesh');
    assert.ok(realMesh._meshFactory, 'completion factory is set');
    world.get(realId, 'building').constructProgress = 4.9;
    world.get(realId, 'building').constructTime = 5;
    systemBuilding(world, 0.5);
    assert.equal(world.get(realId, 'building').constructing, false);
    assert.equal(world.get(realId, 'mesh').root.name, 'struct_greater_sacrificial_circle');
  });
});

describe('bloodthirster flight', () => {
  it('registers the fly animation slots without matching fly_launch_continue', () => {
    const src = readMeshesSource();
    for (const slot of ['flyLaunch', 'flyIdle', 'flyLand']) {
      assert.ok(src.includes(`root._animGroups.${slot} =`), `${slot} registered`);
    }
    assert.ok(src.includes('/^fly[_-]?launch$/'), 'launch matcher is anchored');
  });

  it('flies a full takeoff-cruise-land sortie and holds fire while airborne', async () => {
    const THREE = await import('three');
    const sceneMod = await import('../src/scene.js');
    const headless = new THREE.Scene();
    headless._registerShadows = () => {};
    sceneMod.__setSceneCameraForTests(headless, { target: new THREE.Vector3() });
    const { World } = await import('../src/ecs.js');
    const { systemSquad, systemSoldier } = await import('../src/systems.js');
    const { createSquadEntity } = await import('../src/entities.js');
    const { factionContainers } = await import('../src/factions.js');
    factionContainers.chaos = factionContainers.chaos || {};
    factionContainers.chaos.soldier = {
      scene: (() => {
        const g = new THREE.Group();
        g.add(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial()));
        return g;
      })(),
      animations: [],
      _hiddenNodes: null,
    };
    const world = new World();
    // Red daemon: plain bullets (blue would fire the beam component instead).
    const daemonId = createSquadEntity(world, 'red', 0, 0, 1, 'bloodthirster', 'chaos');
    createSquadEntity(world, 'blue', 3, 0, 2, null, 'chaos');
    const squad = world.get(daemonId, 'squad');
    const soldierId = squad.soldiers.find((sid) => sid !== null);
    const dt = 1 / 60;
    // Grounded control: an enemy in melee range draws fire.
    for (let f = 0; f < 30; f++) {
      systemSoldier(world, dt);
      systemSquad(world, dt);
    }
    const groundedShots = world.query('bullet').filter((id) => world.get(id, 'bullet')?.team === 'red').length;
    assert.ok(groundedShots > 0, 'grounded daemon fires');
    // Launch: fly across the map while a foe stays in range.
    squad.flyOrder = new THREE.Vector3(40, 0, 0);
    squad.stopped = false;
    let maxAlt = 0;
    let maxY = 0;
    let frames = 0;
    for (; frames < 600; frames++) {
      systemSoldier(world, dt);
      systemSquad(world, dt);
      const sol = world.get(soldierId, 'soldier');
      maxAlt = Math.max(maxAlt, sol.flyAlt || 0);
      maxY = Math.max(maxY, world.get(soldierId, 'mesh').root.position.y);
      if (!world.get(daemonId, 'squad').flyOrder && (sol._flyStage || 0) === 0 && frames > 30) {
        break;
      }
    }
    assert.ok(maxAlt > 5, `climbed, got ${maxAlt}`);
    assert.ok(maxY > 5, `mesh left the ground, got ${maxY}`);
    const done = world.get(daemonId, 'squad');
    assert.equal(done.flyOrder, null);
    assert.equal(done.stopped, true);
    assert.equal(world.get(soldierId, 'soldier').flyAlt, 0);
    const landed = Math.hypot(done.position.x - 40, done.position.z - 0);
    assert.ok(landed < 4, `landed on target, off by ${landed}`);
    const airShots = world.query('bullet').filter((id) => world.get(id, 'bullet')?.team === 'red').length;
    assert.equal(airShots, groundedShots, 'no shots fired while airborne');
  });

  it('FLY button arms targeting; RMB/Q/ESC wire the order lifecycle', () => {
    const jsx = fs.readFileSync(path.join(ROOT, 'src/hud/components/ActionsGrid.jsx'), 'utf8');
    const squadView = jsx.slice(jsx.indexOf('function SquadActions'), jsx.indexOf('function HQActions'));
    assert.ok(squadView.includes('cfg?.canFly'), 'button shows for fly-capable squads');
    assert.ok(squadView.includes('label="FLY"'), 'FLY button exists');
    assert.ok(squadView.includes('armFlyTargeting()'), 'button arms targeting');
    const input = readInputSource();
    assert.ok(input.includes('export function armFlyTargeting()'), 'arming exported');
    assert.ok(input.includes('export function cancelFlyTargeting()'), 'cancel exported');
    assert.ok(input.includes('if (_flyArmed) {'), 'RMB issues the fly order while armed');
    assert.ok(input.includes('squad.flyOrder = destination;'), 'fly order set from click');
    const q = input.slice(input.indexOf("event.code === 'KeyQ'"), input.indexOf("event.code === 'KeyL'"));
    assert.ok(q.includes('squad.flyOrder = null;'), 'Q cancels flight');
    const move = input.slice(input.indexOf('const active = selSquads.filter'), input.indexOf('const activeApcs'));
    assert.ok(move.includes('squad.flyOrder = null;'), 'ground move cancels flight');
    const esc = input.slice(input.indexOf("event.code === 'Escape'"), input.indexOf("event.code === 'AltLeft'"));
    assert.ok(esc.includes('cancelFlyTargeting()'), 'ESC disarms');
  });
});
