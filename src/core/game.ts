import * as THREE from 'three';
import { updateSunShadowCamera } from '../render/lighting.js';
import { spawnMatchSeat } from './match-spawn.js';
import { localMatchFor, localMatchPositions } from './local-match.js';

import { World } from './ecs.js';
import {
  scene, renderer, camera, canvas, world, setWorld, PLAYER, ARENA, COSTS, TAG,
  JET_ALT, JET_SPEED, JET_ATTACK_RANGE, selSquads, setSelSquads, selBuildings,
  setSelBuildings, selBuilder, setSelBuilder, requisition, setRequisition, energy, setEnergy,
  kills, setKills, startTime, setStartTime, gameOver, setGameOver, paused, counters,
  particles, grenadeCallbacks, SQUAD_MAX, _gridVisible, createScene,
  clearResearchedTech, updateCamera, runBeforeRender, setDeltaTime, handleResize,
  getRenderBackend, isBackendSwitching, supportsWebGPU, createBackendRenderer,
  createFreshCanvas, adoptCanvasElement, setRendererInstance, setBackendState,
  qualityTier,
} from './scene.js';
import { updateMixers } from '../render/gltf-models.js';
import { updateNecronConduits } from '../fx/necron-conduit.js';
import { updatePlasmaGlow } from '../fx/plasma-glow.js';
import { updatePlasmaPistolGlow } from '../fx/plasma-pistol-glow.js';
import { preloadPlasmaBoltModel, preloadPlasmaFinalFx, updatePlasmaBoltFx } from '../fx/plasma-bolt.js';
import { updateBlasterBoltFx } from '../fx/blaster-bolt.js';
import { updateReaperBoltFx } from '../fx/reaper-bolt.js';
import { updateNecronAurora } from '../fx/necron-aurora.js';
import { updateNecronAura } from '../fx/necron-aura.js';
import { NecronFootDust } from '../fx/necron-foot-dust.js';
import { _groundAt } from '../systems/terrain.js';
import { loadFactionModels, factionContainers, ARENA_POSITION_FACTIONS } from '../factions.js';
import { useProceduralModels } from '../render/model-source.js';
import { preloadStrategicPointModel, preloadRelicModel, preloadObjectiveModel } from '../meshes.js';
import { startPositionsFor, strategicPointsFor, factionsFor, startingGuardsmenSpawns, startingNecronSpawns, startingTauSpawns, startingOrkSpawns, startingEldarSpawns, startingMarineSpawns, startingDarkEldarSpawns, factionBasePosition } from '../maps/map-layout.js';
import {
  updateHUD, updateTopBar, updateMinimap, updateCaptureProgressBars,
} from './hud.js';
import { tickFps, getFps, hudDue } from '../hud/store.js';
import { createDynamicResolution, pixelRatioForTier } from '../render/three-helpers.js';
import { toggleNodesPanel, initNodesPanelAutoRefresh } from '../ui/nodes-panel.js';
import { preloadLasgunViewmodel, tickFirstPerson, toggleCameraFps } from '../render/camera-fps.js';
import {
  toggleEntitiesPanel, entitiesFilter, entitiesRefresh, initEntitiesPanelAutoRefresh,
} from '../ui/entities-panel.js';
import {
  initInput, setupPointerEvents, tickCamera, cancelBuild, _rangeCirclesVisible, _showRangeCircles,
  clearAirfieldRallyMarker, clearRallyMarker, keys,
} from './input.js';
import { syncTouchControls } from '../input/touch-controls.js';
import { rebindDecalPointerActions } from '../maps/sgb-decals.js';
import { nextBackend } from '../render/render-backend.js';
import {
  createSoldierEntity, createSquadEntity, createBuilderEntity,
  createBuildingEntity, createStructureEntity, createStrategicPointEntity,
} from '../entities/entities.js';
import {
  _initSystems, systemAI, systemWinCheck, disposeMeshComponent,
} from './systems.js';
import { disposeObj, childMeshes } from '../render/three-helpers.js';

declare global {
  interface Window {
    resetGame: typeof resetGame;
    bootGame: typeof bootGame;
    switchRenderBackend: typeof switchRenderBackend;
    toggleGrid: () => Promise<void>;
    toggleGridVariant: () => Promise<void>;
    toggleNodesPanel: () => void;
    toggleScatterPanel: () => Promise<void>;
    onScatterInput: (value: any) => Promise<void>;
    onHitboxInput: (value: any) => Promise<void>;
    toggleHitboxDebug: () => Promise<void>;
    setTerrain: (value: any) => Promise<void>;
    setAttackMode: (value: any) => Promise<void>;
    toggleControlBoth: () => Promise<void>;
    startBuild: (value: any) => Promise<void>;
    filterNodes: (value: any) => Promise<void>;
    nodesShowAll: () => Promise<void>;
    nodesHideAll: () => Promise<void>;
    nodesRefresh: () => Promise<void>;
    toggleEntitiesPanel: () => void;
    entitiesFilter: (value: any) => void;
    entitiesRefresh: () => void;
    toggleFactionTeamcolour: (faction: any) => Promise<string | void>;
    toggleInfantryModel: (unit: any) => Promise<{ variant: string; swapped: number } | void>;
    toggleDecalsPanel: () => Promise<void>;
    togglePathfindingPanel: () => Promise<void>;
    toggleCameraPanel: () => Promise<void>;
    toggleCombatPanel: () => Promise<void>;
    updateKasrkinFireRate: (value: unknown) => Promise<void>;
    resetKasrkinFireRate: () => Promise<void>;
    updateCameraParam: (which: any, value: any) => Promise<void>;
    resetCameraPanel: () => Promise<void>;
    switchFaction: () => Promise<void>;
    toggleTerrainPanel: () => Promise<void>;
    handleTerrainMeshDrop: (e: any) => Promise<void>;
    handleTerrainMeshFiles: (files: any) => Promise<void>;
    updateTerrainMeshScale: (value: any) => Promise<void>;
    updateTerrainMeshY: (value: any) => Promise<void>;
    updateTerrainMapRotate: (value: any) => Promise<void>;
    updateSgbDecalScale: (value: any) => Promise<void>;
    toggleSgbDecals: () => Promise<void>;
    toggleDecalHover: () => Promise<boolean | void>;
    toggleCameraFps: () => void;
    setCameraMode: (mode: any) => Promise<string>;
    getCameraMode: () => Promise<string>;
    clearTerrainMesh: () => Promise<void>;
    handleTerrainTexDrop: (e: any) => Promise<void>;
    loadTerrainTexture: (files: any) => Promise<void>;
    updateTexTiling: () => Promise<void>;
    rotateTerrainLayers: () => Promise<void>;
    handleTerrainPropDrop: (e: any) => Promise<void>;
    handleTerrainPropFiles: (files: any) => Promise<void>;
    updatePropScale: (value: any) => Promise<void>;
    rescatterProps: () => Promise<void>;
    clearAllTerrain: () => Promise<void>;
    setBrightness: (value: any) => Promise<void>;
    filterDecals: (value: any) => Promise<void>;
    toggleModelPanel: () => Promise<void>;
    handleModelDrop: (e: any) => Promise<void>;
    handleModelFiles: (files: any) => Promise<void>;
    updateModelScaleFromNum: (value: any) => Promise<void>;
    updateModelScaleFromSlider: (value: any) => Promise<void>;
    updateModelOffset: (axis: any, value: any) => Promise<void>;
    updateModelRotation: (axis: any, value: any) => Promise<void>;
    clearCustomModel: () => Promise<void>;
    toggleInspector: () => void;
    toggleSliderSection: (name: any) => Promise<void>;
    assignAnimFromList: (idx: any, slot: any) => Promise<void>;
  }
}

// ══════════════════════════════════════════════════════════════════════════════
const necronFootDust = new NecronFootDust(_groundAt);

export function resetGame(mapKey: string = window._currentMapKey || 'arena'): void {
  necronFootDust.clear();
  if (world) {
    const tags = ['squad', 'builder', 'building', 'structure', 'bullet', 'grenade', 'strategicPoint', 'apc', 'vehicle', 'laserBullet', 'plasmaBullet', 'airfield', 'jet', 'missile', 'soldier', 'replicaShot'];
    for (const tag of tags) {
      for (const id of world.query(tag)) {
        const meshComponent = world.get(id, 'mesh');
        if (meshComponent) {
          disposeMeshComponent(meshComponent);
        }
        const strategicPoint = world.get(id, 'strategicPoint');
        if (strategicPoint?.lpMesh) {
          childMeshes(strategicPoint.lpMesh).forEach((child: any) => disposeObj(child));
          disposeObj(strategicPoint.lpMesh);
        }
      }
    }
  }
  particles.forEach((particle: any) => disposeObj(particle.mesh, true));
  particles.length = 0;
  grenadeCallbacks.length = 0;

  setRequisition(1500);
  setEnergy(100);
  setKills(0);
  setStartTime(Date.now());
  setGameOver(false);
  setSelBuildings([]);
  setSelBuilder(null);
  setSelSquads([]);
  clearResearchedTech();

  // Capture bars are React-managed now — let the component re-render on reset
  updateCaptureProgressBars();

  cancelBuild();
  const winEl = document.getElementById('win');
  if (winEl) {
    winEl.style.display = 'none';
  }

  const entityWorld = new World();
  setWorld(entityWorld);
  _initSystems(entityWorld);
  entityWorld.addSystem(systemAI);

  // Per-map layout: start positions + strategic points (arena adds a
  // 4-point ring plus one relic around every HQ, no center cluster).
  const startPositions = startPositionsFor(mapKey);
  const factions = factionsFor(mapKey);
  for (const { x, z, kind } of strategicPointsFor(mapKey)) {
    createStrategicPointEntity(entityWorld, x, z, kind);
  }

  const localMatch = localMatchFor(mapKey);
  if (localMatch) {
    const matchPositions = localMatchPositions(localMatch, startPositions);
    for (const seat of localMatch.seats) {
      const position=matchPositions.get(seat.slot);
      if(position)spawnMatchSeat(entityWorld,seat,position);
    }
    entityWorld.defaultOwner = null;
    const human = localMatch.seats.find(seat => !seat.computer) || localMatch.seats[0];
    const position = matchPositions.get(human.slot);
    if (position) camera.target.set(position.x, 0, position.z);
    updateHUD();
    return;
  }

  for (const [index, { x, z, team }] of startPositions.entries()) {
    // Positions carry fixed factions (factions list order).
    const faction = factions[index];
    createBuildingEntity(entityWorld, 'hq', new THREE.Vector3(x, 0, z), team, faction);
    const builderX = team === PLAYER ? x + 10 : x - 10;
    createBuilderEntity(entityWorld, builderX, z, team, faction);
  }
  // One four-man Chaos squad; systemAI replaces it only after all four die.
  createSquadEntity(entityWorld, 'red', 30, 10, 4, 'chaos_space_marine', 'chaos');
  // Faction starter squads for both sides: blue hosts IG/Necrons/Tau/Orks
  // bases, red hosts Eldar/Space Marine/Dark Eldar bases on the shipped maps.
  const starterSpawns = [
    startingGuardsmenSpawns, startingNecronSpawns, startingTauSpawns,
    startingOrkSpawns, startingEldarSpawns, startingMarineSpawns,
    startingDarkEldarSpawns,
  ];
  for (const team of [PLAYER, 'red']) {
    for (const getSpawns of starterSpawns) {
      for (const spawn of getSpawns(mapKey, team)) {
        createSquadEntity(entityWorld, spawn.team, spawn.x, spawn.z, spawn.size, spawn.unitType, spawn.faction);
      }
    }
  }
  const igBase = factionBasePosition(mapKey, PLAYER, 'ig');
  if (igBase) {
    camera.target.set(igBase.x, 0, igBase.z);
  }

  updateHUD();
}

let lastTime = performance.now();
let _gameBooted = false;
let _frameNo = 0;
let _frameTick = () => {};

// Live WebGL <-> WebGPU switch: the replacement renderer is built and
// initialized off-DOM first, so a failure keeps the old backend running.
export async function switchRenderBackend() {
  const from = getRenderBackend();
  if (!renderer || isBackendSwitching()) {
    return from;
  }
  const target = nextBackend(from, supportsWebGPU());
  if (target === from) {
    return from;
  }
  setBackendState(from, true);
  try {
    const freshCanvas = createFreshCanvas();
    const next = await createBackendRenderer(target, freshCanvas);
    const prev = renderer;
    if (prev && prev.setAnimationLoop) {
      prev.setAnimationLoop(null);
    }
    try {
      prev.dispose();
    } catch (_) {}
    adoptCanvasElement(freshCanvas);
    setRendererInstance(next);
    setupPointerEvents();
    rebindDecalPointerActions();
    next.setAnimationLoop(_frameTick);
    setBackendState(target, false);
    return target;
  } catch (error) {
    console.warn(`[backend] switch to ${target} failed, staying on ${from}`, error);
    setBackendState(from, false, String((error as any)?.message || error));
    return from;
  }
}

// Follow the viewed battlefield with a low sun and a tight shadow frustum.
function updateShadowFollow() {
  const sun = scene._sunLight;
  if (!sun || !sun.castShadow || !camera || !camera.target) {
    return;
  }
  updateSunShadowCamera(sun, camera.target, camera.radius);
}

export async function bootGame(loadHooks: any = {}): Promise<void> {
  if (_gameBooted) {
    return;
  }
  _gameBooted = true;

  await createScene();
  initInput();
  // Fetch the dedicated FPS lasgun in the background so first person owns
  // its weapon file from the first ride (never blocks boot on failure).
  preloadLasgunViewmodel();

  if (useProceduralModels()) {
    console.log('[FACTION] Procedural models enabled — skipping models/ GLB loads.');
  } else {
    await loadFactionModels(scene, ARENA_POSITION_FACTIONS, loadHooks);
    await preloadStrategicPointModel();
    await preloadRelicModel();
    await preloadObjectiveModel();
  }
  await preloadPlasmaBoltModel();
  await preloadPlasmaFinalFx();

  if (!window._multiplayerMode) {
    resetGame();
  }

  // Dynamic resolution: drop DPR a step while slow, restore with headroom.
  const dynRes = createDynamicResolution(
    pixelRatioForTier(qualityTier(), window.devicePixelRatio),
  );

  _frameTick = () => {
    const now = performance.now();
    const deltaTime = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    setDeltaTime(deltaTime);
    tickFps(now);
    const dynRatio = dynRes.tick(getFps());
    if (dynRatio !== null && renderer) {
      renderer.setPixelRatio(dynRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    updateShadowFollow();

    if (!gameOver && !paused && world) {
      world.tick(deltaTime);
      for (let i = grenadeCallbacks.length - 1; i >= 0; i--) {
        if (grenadeCallbacks[i](deltaTime)) {
          grenadeCallbacks.splice(i, 1);
        }
      }

      // Auto-reinforce
      {
        let changed = false;
        for (const sid of world.query('squad')) {
          const squadComponent = world.get(sid, 'squad');
          const cost = squadComponent?.reinforceCost ?? COSTS.reinforce;
          const maxSquadSize = squadComponent?.maxSquadSize ?? SQUAD_MAX;
          if (!squadComponent || !squadComponent.autoReinforce || squadComponent.team !== PLAYER || squadComponent.reinforceQueue.length > 0 || requisition < cost) {
            continue;
          }
          const alive = squadComponent.soldiers.filter((soldierId: any) => soldierId !== null && world.has(soldierId, 'soldier'));
          const occupied = new Set(alive.map((soldierId: any) => world.get(soldierId, 'soldier')?.formIdx));
          for (let i = 1; i < maxSquadSize; i++) {
            if (!occupied.has(i)) {
              setRequisition(requisition - cost);
              squadComponent.reinforceQueue.push({ formIdx: i, cost, time: squadComponent.reinforceTime ?? 7 });
              changed = true;
              break;
            }
          }
        }
        if (changed) {
          updateHUD();
        }
      }

      // Queue bars animate at the shared 20 Hz HUD cadence, not 60 Hz:
      // a full HUDApp re-render (plus its ECS queries) every frame costs
      // more than the bars gain. Completions still bump instantly from
      // the production systems themselves.
      if (hudDue(_frameNo)) {
        const hasQueue = world.query('building').some((id: any) => (world.get(id, 'building')?.queue.length || 0) > 0);
        const hasReinforce = selSquads.some((id) => {
          const squadComponent = world.get(id, 'squad');
          return squadComponent && (squadComponent.reinforceQueue.length > 0 || squadComponent.grenadeQueue.length > 0 || (squadComponent.plasmaQueue || []).length > 0);
        });
        if (hasQueue || hasReinforce) {
          updateHUD();
        }
      }

      if (!window._multiplayerMode) systemWinCheck(world);
    }

    tickCamera(deltaTime);
    tickFirstPerson(deltaTime, keys);
    syncTouchControls();

    if (scene._gridMicroMesh && _gridVisible) {
      const radius = camera.radius;
      const factor = Math.max(0, Math.min(1, (45 - radius) / 10));
      const terrainAlpha = scene._terrainMicroAlpha ?? 0.1;
      scene._gridMicroMesh.material.opacity = Math.min(1, factor * (terrainAlpha / 0.1));
    }
    _frameNo += 1;
    if (hudDue(_frameNo)) {
      updateTopBar();
      updateCaptureProgressBars();
    }
    if (world && _rangeCirclesVisible) {
      _showRangeCircles();
    }
    updateCamera();
    updateMixers(deltaTime, camera);
    updateNecronConduits(deltaTime);
    updatePlasmaGlow(deltaTime);
    updatePlasmaPistolGlow();
    updatePlasmaBoltFx(performance.now() / 1000);
    updateBlasterBoltFx(performance.now() / 1000);
    updateReaperBoltFx(performance.now() / 1000);
    updateNecronAura(performance.now() / 1000);
    updateNecronAurora(performance.now() / 1000);
    const necronWalkers: THREE.Object3D[] = [];
    for (const soldierId of world?.query('soldier', 'mesh') || []) {
      const soldier: any = world.get(soldierId, 'soldier');
      const squad: any = world.get(soldier.squadId, 'squad');
      const mesh: any = world.get(soldierId, 'mesh');
      if (squad?.faction === 'necrons' && soldier.hp > 0 && !soldier.scatter && !soldier.flyAlt && mesh.root)
        necronWalkers.push(mesh.root);
    }
    necronFootDust.update(deltaTime, necronWalkers, scene);
    runBeforeRender();
    renderer.render(scene, camera);
  };
  renderer.setAnimationLoop(_frameTick);

  window.addEventListener('resize', () => handleResize());
}

// Start the game when loaded
window.addEventListener('DOMContentLoaded', () => {
  // Bind UI functions to window for HTML onclick handlers
  window.resetGame = resetGame;
  window.bootGame = bootGame;
  window.switchRenderBackend = switchRenderBackend;
  window.toggleGrid = () => import('./scene.js').then((module) => module.toggleGrid());
  window.toggleGridVariant = () => import('./scene.js').then((module) => module.toggleGridVariant());
  window.toggleNodesPanel = toggleNodesPanel;
  window.toggleCombatPanel = () => import('../ui/combat-panel.js').then((module) => module.toggleCombatPanel());
  window.updateKasrkinFireRate = (value) => import('../ui/combat-panel.js').then((module) => module.updateKasrkinFireRate(value));
  window.resetKasrkinFireRate = () => import('../ui/combat-panel.js').then((module) => module.resetKasrkinFireRate());
  window.toggleScatterPanel = () => import('./scene.js').then((module) => module.toggleScatterPanel());
  window.resetGame = resetGame;
  window.onScatterInput = (value: any) => import('./scene.js').then((module) => module.onScatterInput(value));
  window.onHitboxInput = (value: any) => import('./scene.js').then((module) => module.onHitboxInput(value));
  window.toggleHitboxDebug = () => import('./scene.js').then((module) => module.toggleHitboxDebug());
  window.setTerrain = (value) => import('./scene.js').then((module) => module.setTerrain(value));
  window.setAttackMode = (value: any) => import('./scene.js').then((module) => module.setAttackMode(value));
  window.toggleControlBoth = () => import('./scene.js').then((scene) => {
    scene.setControlBoth(!scene.controlBoth);
    return import('./input.js').then((input) => input.clearSelection());
  });
  window.startBuild = (value: any) => import('./input.js').then((module) => module.startBuild(value));

  window.filterNodes = (value: any) => import('../ui/nodes-panel.js').then((module) => module.filterNodes(value));
  window.nodesShowAll = () => import('../ui/nodes-panel.js').then((module) => module.nodesShowAll());
  window.nodesHideAll = () => import('../ui/nodes-panel.js').then((module) => module.nodesHideAll());
  window.nodesRefresh = () => import('../ui/nodes-panel.js').then((module) => module.nodesRefresh());

  window.toggleEntitiesPanel = toggleEntitiesPanel;
  window.entitiesFilter = entitiesFilter;
  window.entitiesRefresh = entitiesRefresh;
  initEntitiesPanelAutoRefresh();
  initNodesPanelAutoRefresh();

  window.toggleFactionTeamcolour = (faction: any) => import('../factions.js').then((module) => module.toggleFactionTeamcolourScheme(faction));
  window.toggleInfantryModel = (unit: any) => import('../entities/entities.js').then((module) => module.toggleInfantryModel(world, unit));
  // Lazy chunks 404 when the page predates the last `npm run build` (vite
  // wipes dist). A failed open must say so instead of silently doing nothing.
  window.toggleDecalsPanel = () => import('../ui/decals-panel.js').then(
    (module) => module.toggleDecalsPanel(),
    (err) => console.error('[decals] panel chunk failed to load — hard-refresh the page:', err),
  );
  window.togglePathfindingPanel = () => import('../ui/pathfinding-panel.js').then(
    (module) => module.togglePathfindingPanel(),
    (err) => console.error('[pathfinding] panel chunk failed to load — hard-refresh the page:', err),
  );
  window.toggleCameraPanel = () => import('../ui/camera-panel.js').then((module) => module.toggleCameraPanel());
  window.updateCameraParam = (which, value) => import('../ui/camera-panel.js').then((module) => module.updateCameraParam(which, value));
  window.resetCameraPanel = () => import('../ui/camera-panel.js').then((module) => module.resetCameraPanel());
  window.switchFaction = () => import('../ui/switch-faction.js').then((module) => module.switchFaction());

  window.toggleTerrainPanel = () => import('../maps/terrain-upload.js').then((module) => module.toggleTerrainPanel());
  window.handleTerrainMeshDrop = (e) => import('../maps/terrain-upload.js').then((module) => module.handleTerrainMeshDrop(e));
  window.handleTerrainMeshFiles = (files) => import('../maps/terrain-upload.js').then((module) => module.handleTerrainMeshFiles(files));
  window.updateTerrainMeshScale = (value) => import('../maps/terrain-upload.js').then((module) => module.updateTerrainMeshScale(value));
  window.updateTerrainMeshY = (value) => import('../maps/terrain-upload.js').then((module) => module.updateTerrainMeshY(value));
  window.updateTerrainMapRotate = (value) => import('../maps/sgb-upload.js').then((module) => module.updateTerrainMapRotate(value));
  window.updateSgbDecalScale = (value) => import('../maps/sgb-decals.js').then((module) => module.updateSgbDecalScale(value));
  window.toggleSgbDecals = () => import('../maps/sgb-decals.js').then((module) => module.toggleSgbDecals());
  window.toggleDecalHover = () => import('../maps/sgb-decals.js').then((module) => module.toggleDecalHover());
  // Shared toggle (also used by the TAB hotkey): the static import above
  // keeps this synchronous in the click gesture, otherwise the browser
  // rejects the pointer-lock request.
  window.toggleCameraFps = () => toggleCameraFps();
  window.setCameraMode = (mode) => import('../render/camera-fps.js').then((module) => module.setCameraMode(mode));
  window.getCameraMode = () => import('../render/camera-fps.js').then((module) => module.getCameraMode());
  window.clearTerrainMesh = () => import('../maps/terrain-upload.js').then((module) => module.clearTerrainMesh());
  window.handleTerrainTexDrop = (e) => import('../maps/terrain-upload.js').then((module) => module.handleTerrainTexDrop(e));
  window.loadTerrainTexture = (files) => import('../maps/terrain-upload.js').then((module) => module.loadTerrainTexture(files));
  window.updateTexTiling = () => import('../maps/terrain-upload.js').then((module) => module.updateTexTiling());
  window.rotateTerrainLayers = () => import('../maps/terrain-upload.js').then((module) => module.rotateTerrainLayers());
  window.handleTerrainPropDrop = (e) => import('../maps/terrain-upload.js').then((module) => module.handleTerrainPropDrop(e));
  window.handleTerrainPropFiles = (files) => import('../maps/terrain-upload.js').then((module) => module.handleTerrainPropFiles(files));
  window.updatePropScale = (value) => import('../maps/terrain-upload.js').then((module) => module.updatePropScale(value));
  window.rescatterProps = () => import('../maps/terrain-upload.js').then((module) => module.rescatterProps());
  window.clearAllTerrain = () => import('../maps/terrain-upload.js').then((module) => module.clearAllTerrain());
  window.setBrightness = (value) => import('../maps/terrain-upload.js').then((module) => module.setBrightness(value));

  import('../ui/maps-menu.js').then((module) => module.buildMapsMenu());
  import('../ui/decals-menu.js').then(
    (module) => module.buildDecalsMenu(),
    (err) => {
      console.error('[decals] menu chunk failed to load — hard-refresh the page:', err);
      const list = document.getElementById('decals-list');
      if (list) {
        list.innerHTML = '<div class="maps-empty">DECALS CHUNK FAILED TO LOAD — HARD-REFRESH THE PAGE</div>';
      }
    },
  );
  window.filterDecals = (value) => import('../ui/decals-menu.js').then((module) => module.filterDecals(value));

  window.toggleModelPanel = () => import('../render/model-upload.js').then((module) => module.toggleModelPanel());
  window.handleModelDrop = (e) => import('../render/model-upload.js').then((module) => module.handleModelDrop(e));
  window.handleModelFiles = (files) => import('../render/model-upload.js').then((module) => module.handleModelFiles(files));
  window.updateModelScaleFromNum = (value) => import('../render/model-upload.js').then((module) => module.updateModelScaleFromNum(value));
  window.updateModelScaleFromSlider = (value) => import('../render/model-upload.js').then((module) => module.updateModelScaleFromSlider(value));
  window.updateModelOffset = (axis, value) => import('../render/model-upload.js').then((module) => module.updateModelOffset(axis, value));
  window.updateModelRotation = (axis, value) => import('../render/model-upload.js').then((module) => module.updateModelRotation(axis, value));
  window.clearCustomModel = () => import('../render/model-upload.js').then((module) => module.clearCustomModel());
  window.toggleInspector = () => {
    console.warn('[grimcraft] scene inspector was removed with the three.js migration; use the Nodes panel instead.');
  };
  window.toggleSliderSection = (name) => import('../render/model-upload.js').then((module) => module.toggleSliderSection(name));
  window.assignAnimFromList = (idx, slot) => import('../render/model-upload.js').then((module) => module.assignAnimFromList(idx, slot));
  // Add other UI bindings as needed...

  import('../ui/main-menu.js').then((module) => module.injectMainMenu());
});
