import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as THREE from 'three';
import { buildConstructionTimeline, createConstructionAnimation } from '../src/render/construction-animation.js';
import { constructionWorkPosition } from '../src/core/structure-footprint.js';
function standOutside(root, site) {
  const point = constructionWorkPosition(site, { x: site.position.x + 20, z: site.position.z - 20 });
  root.position.set(point.x, 0, point.z);
}
const phases = JSON.parse(fs.readFileSync(new URL('../animations/ig/structures/structures.json', import.meta.url))).infantry_command.phases;
function fixture(config = phases) {
  const root = new THREE.Group(), bones = {};
  for (const name of ['bunker', 'scaffolding_01', 'scaffolding_02', 'scaffolding_03', 'crate_a_01', 'crate_a_02', 'arm', 'arm_02', 'arm_03']) {
    const bone = new THREE.Group();bone.name = name;root.add(bone);bones[name] = bone;
  }
  const position = (name, start, end = start) => new THREE.VectorKeyframeTrack(`${name}.position`, [0, 1], [0, start, 0, 0, end, 0]);
  const clips = Object.values(config).flat().map(name => {
    const tracks = Object.keys(bones).map(bone => position(bone, 0));
    const moving = name === 'build_air_drop_01' ? position('scaffolding_01', 10, 0)
      : name === 'build_air_drop_02' ? position('scaffolding_02', 10, 0)
      : name === 'build_air_drop_03' ? position('scaffolding_03', 10, 0)
      : name === 'build_arm_a_l_01' ? position('arm', 0, 1)
      : name === 'build_arm_a_l_02' ? position('arm_02', 0, 1)
      : name === 'build_arm_a_l_03' ? position('arm_03', 0, 1)
      : name === 'build_sink_boxes_01' ? position('crate_a_01', 1, -1)
      : name === 'build_sink_boxes_02' ? position('crate_a_02', 1, -1)
      : name === 'build_bunker_rise' ? position('bunker', -3, 0) : null;
    if (moving) tracks[tracks.findIndex(track => track.name === moving.name)] = moving;
    if (name === 'build_placement') for (const track of tracks) { track.times = new Float32Array([0]);track.values = new Float32Array([0, 0, 0]); }
    return new THREE.AnimationClip(name, name === 'build_placement' ? 0 : 1, tracks);
  });
  const timeline = buildConstructionTimeline(clips, Object.fromEntries(Object.entries(config).reverse()));
  const mixer = new THREE.AnimationMixer(root);let completed = 0;
  const player = createConstructionAnimation({ rootNodes: [root], mixer }, timeline, () => completed++);
  return { root, bones, clips, timeline, mixer, player, completed: () => completed };
}

test('all 26 clips form paired phases in numeric order and retain the authored starting pose', () => {
  const { player, timeline, bones } = fixture();
  assert.deepEqual(timeline.phases.map(phase => phase.key), ['placement', 'delivery', ...Array.from({ length: 11 }, (_, index) => `phase_${index + 1}`)]);
  assert.equal(player.phase, 'placement');assert.equal(timeline.clip.duration, 12);
  assert.equal(bones.bunker.position.y, -3, 'bunker waits underground until the final rise');
  assert.equal(bones.scaffolding_01.position.y, 10);assert.equal(bones.scaffolding_02.position.y, 10);
});
test('both deliveries and assembly groups animate simultaneously', () => {
  const { player, bones } = fixture();
  player.seekConstruction(0, .5);
  assert.equal(bones.scaffolding_01.position.y, 5);assert.equal(bones.scaffolding_02.position.y, 5);
  player.seek(1.5 / 12);
  assert.equal(bones.arm.position.y, .5);assert.equal(bones.arm_02.position.y, .5);
  assert.ok(bones.bunker.position.y > -3, 'bunker starts rising alongside the first assembly phase');
  player.seek(11.5 / 12);
  assert.equal(bones.crate_a_01.position.y, 0);assert.equal(bones.crate_a_02.position.y, 0);
  assert.ok(bones.bunker.position.y > -1 && bones.bunker.position.y < 0, 'bunker keeps rising while the crates sink');
});
test('a paired phase waits for its longer clip before the next assembly step', () => {
  const { clips, root, bones } = fixture();
  const secondDrop = clips.find(clip => clip.name === 'build_air_drop_02');
  secondDrop.duration = 2;secondDrop.tracks.find(track => track.name === 'scaffolding_02.position').times[1] = 2;
  const timeline = buildConstructionTimeline(clips, phases);
  assert.equal(timeline.clip.duration, 13);assert.equal(timeline.phases[2].start, 2);
  const player = createConstructionAnimation({ rootNodes: [root], mixer: new THREE.AnimationMixer(root) }, timeline, () => {});
  player.seek(1 / 13);
  assert.equal(bones.scaffolding_01.position.y, 0);assert.equal(bones.scaffolding_02.position.y, 5);
  assert.equal(bones.arm.position.y, 0);assert.equal(bones.arm_02.position.y, 0);
  player.seek(2.5 / 13);
  assert.equal(bones.arm.position.y, .5);assert.equal(bones.arm_02.position.y, .5);
});
test('completed parts remain in place across unrelated clips and progress can resume mid-build', () => {
  const { player, bones, mixer } = fixture();
  player.seekConstruction(.5, 1);
  assert.equal(player.phase, 'phase_6');assert.equal(bones.scaffolding_02.position.y, 0);
  assert.equal(bones.scaffolding_01.position.y, 0);assert.equal(bones.crate_a_01.position.y, 1);
  assert.equal(bones.arm.position.y, 1);assert.equal(bones.bunker.position.y, -1.5);
  mixer.update(10);assert.equal(bones.bunker.position.y, -1.5, 'global mixer ticks do not advance construction twice');
  player.seekConstruction(0, .5);assert.equal(bones.scaffolding_01.position.y, 5);assert.equal(bones.scaffolding_02.position.y, 5);
  player.seekConstruction(.5, 1);assert.equal(bones.bunker.position.y, -1.5);
});
test('completion bakes the final building pose and stays stable after retiring animation', () => {
  const { player, bones, mixer, completed } = fixture();
  player.finish();player.finish();
  assert.equal(player.phase, 'phase_11');assert.equal(bones.bunker.position.y, 0);
  assert.equal(bones.crate_a_01.position.y, -1);assert.equal(completed(), 1);
  mixer.update(30);assert.equal(bones.bunker.position.y, 0);assert.equal(bones.crate_a_01.position.y, -1);
});
test('unavailable construction clips leave the normal fallback available', () => {
  assert.equal(buildConstructionTimeline([], phases), null);
  const { clips } = fixture();assert.equal(buildConstructionTimeline(clips.slice(0, -1), phases), null);
  assert.equal(buildConstructionTimeline(clips.filter(clip => clip.name !== 'build_bunker_rise'), phases), null);
});
test('single-clip phase configurations still play sequentially', () => {
  const { clips } = fixture();
  const sequential = { placement: phases.placement };
  Object.values(phases).slice(1).flat().forEach((name, index) => sequential[`phase_${index + 1}`] = name);
  const timeline = buildConstructionTimeline(clips, sequential);
  assert.equal(timeline.clip.duration, 25);assert.equal(timeline.phases.length, 26);
});

test('delivery precedes worker arrival, the worker builds until completion, and replicas restore both stages', async () => {
  globalThis.window = { addEventListener() {} };
  globalThis.document = { getElementById: () => null, querySelector: () => null };
  const sceneModule = await import('../src/core/scene.js');
  const scene = new THREE.Scene();scene._registerShadows = () => {};
  sceneModule.__setSceneCameraForTests(scene, { target: new THREE.Vector3() });
  const { World } = await import('../src/core/ecs.js');
  const { factionContainers, FACTIONS } = await import('../src/factions.js');
  const { setModelSource, MODEL_SOURCE_GLB } = await import('../src/render/model-source.js');
  const { createBuildingEntity, updateBuildingConstructionVisual, _finishConstruction } = await import('../src/entities/entities.js');
  const { disposeMeshComponent } = await import('../src/systems/combat.js');
  const { systemBuilding } = await import('../src/systems/structures.js');
  const { systemBuilder } = await import('../src/systems/builder.js');
  setModelSource(MODEL_SOURCE_GLB);
  const data = fixture(), material = new THREE.MeshStandardMaterial(), body = new THREE.Mesh(new THREE.BoxGeometry(), material);body.name = 'body';data.root.add(body);
  const crate = new THREE.Mesh(new THREE.BoxGeometry(), material);crate.name = 'crate_test';data.root.add(crate);
  const previous = factionContainers.ig.structures.infantry_command;
  factionContainers.ig.structures.infantry_command = { scene: data.root, animations: data.clips, meshes: [body, crate], _hiddenNodes: FACTIONS.ig.structures.find(entry => entry.type === 'infantry_command').hiddenNodes, dispose() {} };
  try {
    const world = new World();sceneModule.setWorld(world);
    const id = createBuildingEntity(world, 'infantry_command', new THREE.Vector3(7, 0, 9), 'blue', 'ig');
    const component = world.get(id, 'building'), mesh = world.get(id, 'mesh');
    const animated = mesh.root;animated.position.y = 13;component.pendingWorker = true;
    assert.equal(updateBuildingConstructionVisual(world, id, component), true);
    assert.equal(mesh.scaffold, null);assert.equal(animated.position.y, 13);
    assert.equal(animated.getObjectByName('body').material.transparent, false);
    assert.equal(animated.getObjectByName('crate_test').visible, true, 'construction props are shown during assembly');
    systemBuilding(world, .5);
    assert.equal(animated.getObjectByName('scaffolding_01').position.y, 5);
    assert.equal(animated.getObjectByName('scaffolding_02').position.y, 5);
    assert.equal(component.constructProgress, 0, 'delivery advances while the worker is walking');
    systemBuilding(world, .5);systemBuilding(world, 2);
    assert.equal(animated.getObjectByName('scaffolding_02').position.y, 0);
    assert.equal(animated.getObjectByName('bunker').position.y, -3, 'landed site waits for the worker');
    assert.equal(component.constructProgress, 0);

    const workerId = world.createEntity([]), workerRoot = new THREE.Group(), played = [];
    standOutside(workerRoot, component);workerRoot._playAnim = name => played.push(name);
    const worker = { team: 'blue', hp: 100, repairTarget: null, buildTarget: { type: component.type, position: component.position.clone(), pendingEntityId: id }, buildTargetSP: null, isBuilding: false, buildProgress: 0, moveTarget: component.position.clone() };
    world.add(workerId, 'builder', worker);world.add(workerId, 'mesh', { root: workerRoot });
    for (let tick = 0; tick < 41; tick++) { systemBuilder(world, .1);systemBuilding(world, .1); }
    assert.equal(worker.isBuilding, true, 'worker keeps building beyond the old three-second preparation');
    assert.equal(played.at(-1), 'build');assert.equal(component.pendingWorker, false);
    assert.equal(component.constructing, true);assert.ok(animated.getObjectByName('bunker').position.y > -3);
    for (let tick = 0; tick < 50 && component.constructing; tick++) { systemBuilder(world, .1);systemBuilding(world, .1); }
    systemBuilder(world, .1);
    assert.equal(worker.isBuilding, false);assert.equal(worker.buildTarget, null);assert.equal(played.at(-1), 'idle');
    assert.equal(mesh.root, animated);assert.equal(component.constructing, false);assert.equal(mesh._realMeshBuilt, true);
    assert.equal(animated.getObjectByName('crate_test').visible, false);assert.equal(mesh.constructBar, null);
    disposeMeshComponent(mesh);

    const { applySkirmishSnapshot, initReplicaSystems } = await import('../src/net/skirmish-state.js');
    const replicaWorld = new World();sceneModule.setWorld(replicaWorld);initReplicaSystems(replicaWorld);
    const state = { schema: 2, tick: 1, players: [], entities: [{ id: 301,
      components: { building: { type: 'infantry_command', team: 'blue', faction: 'ig', position: { $v: [7, 0, 9] }, hp: 400, maxHp: 400, constructing: true, constructProgress: 0, constructTime: 8, pendingWorker: true, deliveryProgress: .5, deliveryTime: 1 }, networkOwner: { id: 1 } },
      transform: { p: [7, 0, 9], r: [0, 0, 0], s: [1, 1, 1], visible: true },
    }] };
    applySkirmishSnapshot(replicaWorld, state, 1);
    const replicaMesh = replicaWorld.get(301, 'mesh'), replicaRoot = replicaMesh.root;
    assert.equal(replicaMesh._constructionAnimation.phase, 'delivery', 'late join restores the delivery before worker arrival');
    assert.equal(replicaRoot.getObjectByName('scaffolding_02').position.y, 5);
    replicaWorld.tick(.05);assert.equal(replicaWorld.get(301, 'building').deliveryProgress, .5, 'render interpolation does not advance authoritative delivery');
    const replicated = state.entities[0].components.building;
    replicated.deliveryProgress = 1;replicated.pendingWorker = false;replicated.constructProgress = 4;state.tick++;
    applySkirmishSnapshot(replicaWorld, state, 1);
    assert.equal(replicaMesh._constructionAnimation.phase, 'phase_6');
    assert.equal(replicaRoot.getObjectByName('bunker').position.y, -1.5);
    replicaWorld.tick(.05);assert.equal(replicaWorld.get(301, 'building').constructProgress, 4, 'render interpolation does not advance authoritative gameplay');
    replicated.pendingWorker = true;state.tick++;
    applySkirmishSnapshot(replicaWorld, state, 1);replicaWorld.tick(.1);
    assert.equal(replicaRoot.getObjectByName('bunker').position.y, -1.5, 'paused network construction keeps its current pose');
    assert.equal(replicaWorld.get(301, 'building').constructProgress, 4);
    replicated.pendingWorker = false;
    state.tick++;state.entities[0].components.building.constructing = false;state.entities[0].components.building.constructProgress = 8;
    applySkirmishSnapshot(replicaWorld, state, 1);
    assert.equal(replicaMesh.root, replicaRoot);assert.equal(replicaMesh._realMeshBuilt, true);
    assert.equal(replicaMesh._constructionAnimation.phase, 'phase_11');assert.equal(replicaRoot.getObjectByName('crate_test').visible, false);
    disposeMeshComponent(replicaMesh);
  } finally { factionContainers.ig.structures.infantry_command = previous; }
});

for (const type of ['listening_post', 'mechanized', 'mars_pattern', 'plasma_generator', 'tactica_control', 'hq', 'hq-anim']) {
  test(`${type}: delivery, assembly, worker animation and multiplayer completion`, async () => {
    globalThis.window = { addEventListener() {} };
    globalThis.document = { getElementById: () => null, querySelector: () => null };
    const sceneModule = await import('../src/core/scene.js');
    const scene = new THREE.Scene();scene._registerShadows = () => {};
    sceneModule.__setSceneCameraForTests(scene, { target: new THREE.Vector3() });
    const { World } = await import('../src/core/ecs.js');
    const { factionContainers, FACTIONS } = await import('../src/factions.js');
    const entities = await import('../src/entities/entities.js');
    const { systemBuilder } = await import('../src/systems/builder.js');
    const { systemBuilding, systemStructure } = await import('../src/systems/structures.js');
    const { applySkirmishSnapshot } = await import('../src/net/skirmish-state.js');
    const { disposeMeshComponent } = await import('../src/systems/combat.js');
    const config = FACTIONS.ig.structures.find(entry => entry.type === type);
    const data = fixture(config.animations.phases);
    const crate = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial());crate.name = 'crate_test';data.root.add(crate);
    const modelType = type === 'hq' ? 'hq-anim' : type;
    const previous = factionContainers.ig.structures[modelType];
    factionContainers.ig.structures[modelType] = { scene: data.root, animations: data.clips, meshes: [crate], _hiddenNodes: config.hiddenNodes, dispose() {} };
    try {
      const world = new World();sceneModule.setWorld(world);
      const pointId = world.createEntity([]);
      world.add(pointId, 'strategicPoint', { position: new THREE.Vector3(), owner: 'blue', hasListeningPost: false, lpTier: 0 });
      const kind = ['plasma_generator', 'tactica_control'].includes(type) ? 'structure' : 'building';
      let orderedPostId;
      if (type === 'listening_post') {
        sceneModule.setRequisition(500);
        const orderingWorkerId = world.createEntity([]), orderingRoot = new THREE.Group();orderingRoot.position.set(40, 0, 0);orderingRoot._playAnim = () => {};
        const orderingWorker = { faction: 'ig', team: 'blue', hp: 100, speed: 7, walkTime: 0, buildTargetSP: pointId, buildTarget: null, isBuilding: false, buildProgress: 0, moveTarget: null, repairTarget: null, stance: 'stand' };
        world.add(orderingWorkerId, 'builder', orderingWorker);world.add(orderingWorkerId, 'mesh', { root: orderingRoot });
        systemBuilder(world, .01);
        orderedPostId = orderingWorker.buildTarget.pendingEntityId;
        assert.equal(sceneModule.requisition, 440, 'post costs are paid once at placement');
        assert.equal(orderingWorker.isBuilding, false, 'delivery starts before the distant worker can build');
        world.destroyEntity(orderingWorkerId);world._flushDestroyed();
      }
      const id = type === 'listening_post' ? orderedPostId
        : kind === 'structure' ? entities.createStructureEntity(world, type, new THREE.Vector3(), 'ig', 'blue')
        : entities.createBuildingEntity(world, type, new THREE.Vector3(), 'blue', 'ig');
      const component = world.get(id, kind), mesh = world.get(id, 'mesh'), root = mesh.root;
      component.pendingWorker = true;
      if (type === 'hq' || type === 'hq-anim') {
        await new Promise(resolve => setTimeout(resolve, 150));
        assert.equal(component.constructing, true, 'a placed HQ must not use the starting-base completion timer');
        assert.equal(mesh._realMeshBuilt, false);assert.equal(component.hp, 2000);
        assert.ok(component.production.some(unit => unit.name === 'builder'), 'animated HQ retains normal HQ production');
      }
      const tickStructure = () => (kind === 'structure' ? systemStructure : systemBuilding)(world, .5);
      tickStructure();
      const drops = config.animations.phases.delivery;
      for (const drop of drops) assert.equal(root.getObjectByName(`scaffolding_${drop.slice(-2)}`).position.y, 5);
      assert.equal(component.constructProgress, 0);assert.equal(mesh.scaffold, null);
      tickStructure();assert.equal(component.constructProgress, 0);
      if (type === 'listening_post') {
        assert.equal(world.get(pointId, 'strategicPoint').hasListeningPost, false);
        assert.equal(entities.createListeningPostConstruction(world, pointId, 'blue', 'ig'), id, 'second order reuses the active site');
      }
      const workerId = world.createEntity([]), workerRoot = new THREE.Group(), animations = [];
      standOutside(workerRoot, component);workerRoot._playAnim = name => animations.push(name);
      const worker = { team: 'blue', hp: 100, repairTarget: null, buildTarget: { type, position: new THREE.Vector3(), pendingEntityId: id }, buildTargetSP: null, isBuilding: false, buildProgress: 0, moveTarget: new THREE.Vector3() };
      world.add(workerId, 'builder', worker);world.add(workerId, 'mesh', { root: workerRoot });
      for (let tick = 0; tick < 8; tick++) { systemBuilder(world, .5);tickStructure(); }
      assert.equal(worker.isBuilding, true);assert.equal(animations.at(-1), 'build');
      assert.equal(component.constructing, true);assert.ok(root.getObjectByName('bunker').position.y > -3);
      const pausedProgress = component.constructProgress, pausedHeight = root.getObjectByName('bunker').position.y;
      worker.buildTarget = null;worker.isBuilding = false;workerRoot.position.set(30, 0, 0);
      for (let tick = 0; tick < 6; tick++) tickStructure();
      assert.equal(component.pendingWorker, true);assert.equal(component.constructProgress, pausedProgress, 'a departed worker cannot leave automatic construction running');
      assert.equal(root.getObjectByName('bunker').position.y, pausedHeight, 'construction pose must freeze instead of restarting');
      assert.equal(mesh.root, root);assert.equal(component.deliveryProgress, component.deliveryTime);
      worker.buildTarget = { type, position: new THREE.Vector3(), pendingEntityId: id };
      standOutside(workerRoot, component);worker.moveTarget = workerRoot.position.clone();
      systemBuilder(world, .5);tickStructure();
      assert.ok(component.constructProgress > pausedProgress, 'returning to the site resumes the saved progress');
      for (let tick = 0; tick < 40 && component.constructing; tick++) { systemBuilder(world, .5);tickStructure(); }
      systemBuilder(world, .1);
      assert.equal(mesh.root, root);assert.equal(mesh._realMeshBuilt, true);assert.equal(worker.isBuilding, false);
      assert.equal(root.getObjectByName('crate_test').visible, false);
      if (type === 'listening_post') {
        const point = world.get(pointId, 'strategicPoint');
        assert.equal(point.hasListeningPost, true);assert.equal(point.lpTier, 1);
        assert.equal(root.getObjectByName('crate_test').userData.listeningPostEntityId, pointId);
      }
      disposeMeshComponent(mesh);
      const replicaWorld = new World();sceneModule.setWorld(replicaWorld);
      const serverComponent = { type, team: 'blue', faction: 'ig', position: { $v: [0, 0, 0] }, hp: component.hp, maxHp: component.maxHp, constructing: true, constructProgress: 0, constructTime: component.constructTime, pendingWorker: true, deliveryProgress: .5, deliveryTime: 1, strategicPointId: type === 'listening_post' ? 99 : null };
      const snapshot = { schema: 2, tick: 1, players: [], entities: [{ id: 301, components: { [kind]: serverComponent, networkOwner: { id: 1 } }, transform: { p: [0, 0, 0], r: [0, 0, 0], s: [1, 1, 1], visible: true } }] };
      if (type === 'listening_post') snapshot.entities.push({ id: 99, components: { strategicPoint: { position: { $v: [0, 0, 0] }, kind: 'point', owner: 'blue', hasListeningPost: false, listeningPostEntityId: 301, lpTier: 0 } }, transform: { p: [0, 0, 0], r: [0, 0, 0], s: [1, 1, 1], visible: true } });
      applySkirmishSnapshot(replicaWorld, snapshot, 1);
      const replicaMesh = replicaWorld.get(301, 'mesh');
      assert.equal(replicaMesh._constructionAnimation.phase, 'delivery');
      serverComponent.deliveryProgress = 1;serverComponent.pendingWorker = false;serverComponent.constructProgress = component.constructTime * .5;snapshot.tick++;
      applySkirmishSnapshot(replicaWorld, snapshot, 1);
      assert.equal(replicaMesh.root.getObjectByName('bunker').position.y, -1.5);
      serverComponent.pendingWorker = true;snapshot.tick++;
      applySkirmishSnapshot(replicaWorld, snapshot, 1);
      assert.equal(replicaMesh.root.getObjectByName('bunker').position.y, -1.5, 'paused replicas retain their assembly pose');
      serverComponent.pendingWorker = false;
      serverComponent.constructing = false;serverComponent.constructProgress = component.constructTime;snapshot.tick++;
      applySkirmishSnapshot(replicaWorld, snapshot, 1);
      assert.equal(replicaMesh._realMeshBuilt, true);
      if (type === 'listening_post') {
        const point = replicaWorld.get(99, 'strategicPoint');
        assert.equal(point.hasListeningPost, true);assert.equal(point.lpMesh, null, 'network post uses its building mesh without a duplicate');
      }
      disposeMeshComponent(replicaMesh);
    } finally { factionContainers.ig.structures[modelType] = previous; }
  });
}

test('starting HQ is ready without delivery or construction', async () => {
  globalThis.window = { addEventListener() {} };
  globalThis.document = { getElementById: () => null, querySelector: () => null };
  const sceneModule = await import('../src/core/scene.js');
  const scene = new THREE.Scene();scene._registerShadows = () => {};
  sceneModule.__setSceneCameraForTests(scene, { target: new THREE.Vector3() });
  const { World } = await import('../src/core/ecs.js');
  const { createBuildingEntity } = await import('../src/entities/entities.js');
  const { disposeMeshComponent } = await import('../src/systems/combat.js');
  const world = new World();sceneModule.setWorld(world);
  const id = createBuildingEntity(world, 'hq', new THREE.Vector3(), 'blue', 'ig', { completed: true });
  const component = world.get(id, 'building'), mesh = world.get(id, 'mesh');
  assert.equal(component.constructing, false);assert.equal(component.constructTime, 0);
  assert.equal(component.deliveryTime, undefined);assert.equal(mesh._constructionAnimation, undefined);
  await new Promise(resolve => setTimeout(resolve, 150));
  assert.equal(mesh._realMeshBuilt, true);disposeMeshComponent(mesh);
});

for (const kind of ['structure', 'airfield']) {
  test(`${kind}: buildings without construction clips also pause without a worker`, async () => {
    const sceneModule = await import('../src/core/scene.js');
    const scene = new THREE.Scene();scene._registerShadows = () => {};
    sceneModule.__setSceneCameraForTests(scene, { target: new THREE.Vector3() });
    const { World } = await import('../src/core/ecs.js');
    const { createStructureEntity, createAirfieldEntity } = await import('../src/entities/entities.js');
    const { systemStructure } = await import('../src/systems/structures.js');
    const { systemAirfield } = await import('../src/systems/air.js');
    const { systemBuilder } = await import('../src/systems/builder.js');
    const { disposeMeshComponent } = await import('../src/systems/combat.js');
    const world = new World();sceneModule.setWorld(world);
    const id = kind === 'airfield' ? createAirfieldEntity(world, new THREE.Vector3(), 'ig', 'blue') : createStructureEntity(world, 'turret', new THREE.Vector3(), 'ig', 'blue');
    const site = world.get(id, kind);site.requiresWorker = true;site.pendingWorker = true;
    const tick = () => (kind === 'airfield' ? systemAirfield : systemStructure)(world, .5);
    tick();assert.equal(site.constructProgress, 0);
    const workerId = world.createEntity([]), root = new THREE.Group();standOutside(root, site);root._playAnim = () => {};
    const worker = { team: 'blue', hp: 100, buildTarget: { pendingEntityId: id, position: new THREE.Vector3() }, buildTargetSP: null, buildProgress: 0, isBuilding: false, moveTarget: new THREE.Vector3(), repairTarget: null };
    world.add(workerId, 'builder', worker);world.add(workerId, 'mesh', { root });
    systemBuilder(world, .5);tick();assert.equal(site.constructProgress, .5);
    worker.isBuilding = false;worker.buildTarget = null;tick();tick();
    assert.equal(site.constructProgress, .5);assert.equal(site.pendingWorker, true);
    disposeMeshComponent(world.get(id, 'mesh'));
  });
}
