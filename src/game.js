import * as THREE from 'three';

import { World } from './ecs.js';
import {
  scene, renderer, camera, canvas, world, setWorld, PLAYER, ARENA, COSTS, TAG,
  JET_ALT, JET_SPEED, JET_ATTACK_RANGE, selSquads, setSelSquads, selBuildings,
  setSelBuildings, selBuilder, setSelBuilder, requisition, setRequisition, energy, setEnergy,
  kills, setKills, startTime, setStartTime, gameOver, setGameOver, counters,
  particles, grenadeCallbacks, SQUAD_MAX, _gridVisible, createScene,
  clearResearchedTech, updateCamera, runBeforeRender, setDeltaTime, handleResize,
  getRenderBackend, isBackendSwitching, supportsWebGPU, createBackendRenderer,
  createFreshCanvas, adoptCanvasElement, setRendererInstance, setBackendState,
  qualityTier,
} from './scene.js';
import { updateMixers } from './gltf-models.js';
import { updateNecronConduits } from './necron-conduit.js';
import { updatePlasmaGlow } from './plasma-glow.js';
import { updatePlasmaPistolGlow } from './plasma-pistol-glow.js';
import { preloadPlasmaBoltModel, preloadPlasmaFinalFx, updatePlasmaBoltFx } from './plasma-bolt.js';
import { updateBlasterBoltFx } from './blaster-bolt.js';
import { updateReaperBoltFx } from './reaper-bolt.js';
import { updateNecronAura } from './necron-aura.js';
import { loadFactionModels, factionContainers, ARENA_POSITION_FACTIONS } from './factions.js';
import { useProceduralModels } from './model-source.js';
import { preloadStrategicPointModel, preloadRelicModel, preloadObjectiveModel } from './meshes.js';
import { startPositionsFor, strategicPointsFor, factionsFor, startingGuardsmenSpawns, startingNecronSpawns, startingTauSpawns, startingOrkSpawns, startingEldarSpawns, startingMarineSpawns, startingDarkEldarSpawns, factionBasePosition } from './map-layout.js';
import {
  updateHUD, updateTopBar, updateMinimap, updateCaptureProgressBars,
} from './hud.js';
import { tickFps, getFps, hudDue } from './hud/store.js';
import { createDynamicResolution, pixelRatioForTier } from './three-helpers.js';
import { toggleNodesPanel } from './nodes-panel.js';
import { preloadLasgunViewmodel, tickFirstPerson, toggleCameraFps } from './camera-fps.js';
import {
  toggleEntitiesPanel, entitiesFilter, entitiesRefresh, initEntitiesPanelAutoRefresh,
} from './entities-panel.js';
import {
  initInput, setupPointerEvents, tickCamera, cancelBuild, _rangeCirclesVisible, _showRangeCircles,
  clearAirfieldRallyMarker, clearRallyMarker, keys,
} from './input.js';
import { rebindDecalPointerActions } from './sgb-decals.js';
import { nextBackend } from './render-backend.js';
import {
  createSoldierEntity, createSquadEntity, createBuilderEntity,
  createBuildingEntity, createStructureEntity, createStrategicPointEntity,
} from './entities.js';
import {
  _initSystems, systemAI, systemWinCheck, disposeMeshComponent,
} from './systems.js';
import { disposeObj, childMeshes } from './three-helpers.js';

// ══════════════════════════════════════════════════════════════════════════════
export function resetGame(mapKey = window._currentMapKey || 'arena') {
  if (world) {
    const tags = ['squad', 'builder', 'building', 'structure', 'bullet', 'grenade', 'strategicPoint', 'apc', 'vehicle', 'laserBullet', 'plasmaBullet', 'airfield', 'jet', 'missile', 'soldier'];
    for (const tag of tags) {
      for (const id of world.query(tag)) {
        const meshComponent = world.get(id, 'mesh');
        if (meshComponent) {
          disposeMeshComponent(meshComponent);
        }
        const strategicPoint = world.get(id, 'strategicPoint');
        if (strategicPoint?.lpMesh) {
          childMeshes(strategicPoint.lpMesh).forEach((child) => disposeObj(child));
          disposeObj(strategicPoint.lpMesh);
        }
      }
    }
  }
  particles.forEach((particle) => disposeObj(particle.mesh));
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

  for (const [index, { x, z, team }] of startPositions.entries()) {
    // Positions carry fixed factions (factions list order).
    const faction = factions[index];
    createBuildingEntity(entityWorld, 'hq', new THREE.Vector3(x, 0, z), team, faction);
    const builderX = team === PLAYER ? x + 10 : x - 10;
    createBuilderEntity(entityWorld, builderX, z, team, faction);
  }
  createSquadEntity(entityWorld, 'red', 30, 10, 5);
  createSquadEntity(entityWorld, 'red', 30, -10, 5);
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
    setBackendState(from, false, String(error?.message || error));
    return from;
  }
}

// Shadow frustum follows the camera target, sized to the zoom radius:
// tight (±90) up close for crisp texels, today's ±150 at far zoom.
const SHADOW_DIR = { x: 60, y: 100, z: 40 };

function updateShadowFollow() {
  const sun = scene._sunLight;
  if (!sun || !sun.castShadow || !camera || !camera.target) {
    return;
  }
  const t = camera.target;
  sun.position.set(t.x + SHADOW_DIR.x, SHADOW_DIR.y, t.z + SHADOW_DIR.z);
  sun.target.position.set(t.x, 0, t.z);
  sun.target.updateMatrixWorld();
  const half = Math.max(90, Math.min(150, camera.radius || 150));
  const sc = sun.shadow.camera;
  if (sc.right !== half) {
    sc.left = -half;
    sc.right = half;
    sc.top = half;
    sc.bottom = -half;
    sc.updateProjectionMatrix();
  }
}

export async function bootGame(loadHooks = {}) {
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

    if (!gameOver && world) {
      world.tick(deltaTime);
      for (let i = grenadeCallbacks.length - 1; i >= 0; i--) {
        if (grenadeCallbacks[i](deltaTime)) {
          grenadeCallbacks.splice(i, 1);
        }
      }

      // Auto-reinforce
      {
        const cost = COSTS.reinforce;
        let changed = false;
        for (const sid of world.query('squad')) {
          const squadComponent = world.get(sid, 'squad');
          if (!squadComponent || !squadComponent.autoReinforce || squadComponent.team !== PLAYER || squadComponent.reinforceQueue.length > 0 || requisition < cost) {
            continue;
          }
          const alive = squadComponent.soldiers.filter((soldierId) => soldierId !== null && world.has(soldierId, 'soldier'));
          const occupied = new Set(alive.map((soldierId) => world.get(soldierId, 'soldier')?.formIdx));
          for (let i = 1; i < SQUAD_MAX; i++) {
            if (!occupied.has(i)) {
              setRequisition(requisition - cost);
              squadComponent.reinforceQueue.push({ formIdx: i });
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
        const hasQueue = world.query('building').some((id) => (world.get(id, 'building')?.queue.length || 0) > 0);
        const hasReinforce = selSquads.some((id) => {
          const squadComponent = world.get(id, 'squad');
          return squadComponent && (squadComponent.reinforceQueue.length > 0 || squadComponent.grenadeQueue.length > 0);
        });
        if (hasQueue || hasReinforce) {
          updateHUD();
        }
      }

      systemWinCheck(world);
    }

    tickCamera(deltaTime);
    tickFirstPerson(deltaTime, keys);

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
    updatePlasmaPistolGlow(performance.now() / 1000);
    updatePlasmaBoltFx(performance.now() / 1000);
    updateBlasterBoltFx(performance.now() / 1000);
    updateReaperBoltFx(performance.now() / 1000);
    updateNecronAura(performance.now() / 1000);
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
  window.toggleScatterPanel = () => import('./scene.js').then((module) => module.toggleScatterPanel());
  window.resetGame = resetGame;
  window.onScatterInput = (value) => import('./scene.js').then((module) => module.onScatterInput(value));
  window.onHitboxInput = (value) => import('./scene.js').then((module) => module.onHitboxInput(value));
  window.toggleHitboxDebug = () => import('./scene.js').then((module) => module.toggleHitboxDebug());
  window.setTerrain = (value) => import('./scene.js').then((module) => module.setTerrain(value));
  window.setAttackMode = (value) => import('./scene.js').then((module) => module.setAttackMode(value));
  window.toggleControlBoth = () => import('./scene.js').then((scene) => {
    scene.setControlBoth(!scene.controlBoth);
    return import('./input.js').then((input) => input.clearSelection());
  });
  window.startBuild = (value) => import('./input.js').then((module) => module.startBuild(value));

  window.filterNodes = (value) => import('./nodes-panel.js').then((module) => module.filterNodes(value));
  window.nodesShowAll = () => import('./nodes-panel.js').then((module) => module.nodesShowAll());
  window.nodesHideAll = () => import('./nodes-panel.js').then((module) => module.nodesHideAll());
  window.nodesRefresh = () => import('./nodes-panel.js').then((module) => module.nodesRefresh());

  window.toggleEntitiesPanel = toggleEntitiesPanel;
  window.entitiesFilter = entitiesFilter;
  window.entitiesRefresh = entitiesRefresh;
  initEntitiesPanelAutoRefresh();

  window.toggleFactionTeamcolour = (faction) => import('./factions.js').then((module) => module.toggleFactionTeamcolourScheme(faction));
  // Lazy chunks 404 when the page predates the last `npm run build` (vite
  // wipes dist). A failed open must say so instead of silently doing nothing.
  window.toggleDecalsPanel = () => import('./decals-panel.js').then(
    (module) => module.toggleDecalsPanel(),
    (err) => console.error('[decals] panel chunk failed to load — hard-refresh the page:', err),
  );
  window.togglePathfindingPanel = () => import('./pathfinding-panel.js').then(
    (module) => module.togglePathfindingPanel(),
    (err) => console.error('[pathfinding] panel chunk failed to load — hard-refresh the page:', err),
  );
  window.toggleCameraPanel = () => import('./camera-panel.js').then((module) => module.toggleCameraPanel());
  window.updateCameraParam = (which, value) => import('./camera-panel.js').then((module) => module.updateCameraParam(which, value));
  window.resetCameraPanel = () => import('./camera-panel.js').then((module) => module.resetCameraPanel());
  window.switchFaction = () => import('./switch-faction.js').then((module) => module.switchFaction());

  window.toggleTerrainPanel = () => import('./terrain-upload.js').then((module) => module.toggleTerrainPanel());
  window.handleTerrainMeshDrop = (e) => import('./terrain-upload.js').then((module) => module.handleTerrainMeshDrop(e));
  window.handleTerrainMeshFiles = (files) => import('./terrain-upload.js').then((module) => module.handleTerrainMeshFiles(files));
  window.updateTerrainMeshScale = (value) => import('./terrain-upload.js').then((module) => module.updateTerrainMeshScale(value));
  window.updateTerrainMeshY = (value) => import('./terrain-upload.js').then((module) => module.updateTerrainMeshY(value));
  window.updateTerrainMapRotate = (value) => import('./sgb-upload.js').then((module) => module.updateTerrainMapRotate(value));
  window.updateSgbDecalScale = (value) => import('./sgb-decals.js').then((module) => module.updateSgbDecalScale(value));
  window.toggleSgbDecals = () => import('./sgb-decals.js').then((module) => module.toggleSgbDecals());
  window.toggleDecalHover = () => import('./sgb-decals.js').then((module) => module.toggleDecalHover());
  // Shared toggle (also used by the TAB hotkey): the static import above
  // keeps this synchronous in the click gesture, otherwise the browser
  // rejects the pointer-lock request.
  window.toggleCameraFps = () => toggleCameraFps();
  window.setCameraMode = (mode) => import('./camera-fps.js').then((module) => module.setCameraMode(mode));
  window.getCameraMode = () => import('./camera-fps.js').then((module) => module.getCameraMode());
  window.clearTerrainMesh = () => import('./terrain-upload.js').then((module) => module.clearTerrainMesh());
  window.handleTerrainTexDrop = (e) => import('./terrain-upload.js').then((module) => module.handleTerrainTexDrop(e));
  window.loadTerrainTexture = (files) => import('./terrain-upload.js').then((module) => module.loadTerrainTexture(files));
  window.updateTexTiling = () => import('./terrain-upload.js').then((module) => module.updateTexTiling());
  window.rotateTerrainLayers = () => import('./terrain-upload.js').then((module) => module.rotateTerrainLayers());
  window.handleTerrainPropDrop = (e) => import('./terrain-upload.js').then((module) => module.handleTerrainPropDrop(e));
  window.handleTerrainPropFiles = (files) => import('./terrain-upload.js').then((module) => module.handleTerrainPropFiles(files));
  window.updatePropScale = (value) => import('./terrain-upload.js').then((module) => module.updatePropScale(value));
  window.rescatterProps = () => import('./terrain-upload.js').then((module) => module.rescatterProps());
  window.clearAllTerrain = () => import('./terrain-upload.js').then((module) => module.clearAllTerrain());
  window.setBrightness = (value) => import('./terrain-upload.js').then((module) => module.setBrightness(value));

  import('./maps-menu.js').then((module) => module.buildMapsMenu());
  import('./decals-menu.js').then(
    (module) => module.buildDecalsMenu(),
    (err) => {
      console.error('[decals] menu chunk failed to load — hard-refresh the page:', err);
      const list = document.getElementById('decals-list');
      if (list) {
        list.innerHTML = '<div class="maps-empty">DECALS CHUNK FAILED TO LOAD — HARD-REFRESH THE PAGE</div>';
      }
    },
  );
  window.filterDecals = (value) => import('./decals-menu.js').then((module) => module.filterDecals(value));

  window.toggleModelPanel = () => import('./model-upload.js').then((module) => module.toggleModelPanel());
  window.handleModelDrop = (e) => import('./model-upload.js').then((module) => module.handleModelDrop(e));
  window.handleModelFiles = (files) => import('./model-upload.js').then((module) => module.handleModelFiles(files));
  window.updateModelScaleFromNum = (value) => import('./model-upload.js').then((module) => module.updateModelScaleFromNum(value));
  window.updateModelScaleFromSlider = (value) => import('./model-upload.js').then((module) => module.updateModelScaleFromSlider(value));
  window.updateModelOffset = (axis, value) => import('./model-upload.js').then((module) => module.updateModelOffset(axis, value));
  window.updateModelRotation = (axis, value) => import('./model-upload.js').then((module) => module.updateModelRotation(axis, value));
  window.clearCustomModel = () => import('./model-upload.js').then((module) => module.clearCustomModel());
  window.toggleInspector = () => {
    console.warn('[grimcraft] scene inspector was removed with the three.js migration; use the Nodes panel instead.');
  };
  window.toggleSliderSection = (name) => import('./model-upload.js').then((module) => module.toggleSliderSection(name));
  window.assignAnimFromList = (idx, slot) => import('./model-upload.js').then((module) => module.assignAnimFromList(idx, slot));
  // Add other UI bindings as needed...

  import('./main-menu.js').then((module) => module.injectMainMenu());
});
