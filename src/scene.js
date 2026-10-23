import * as THREE from 'three';
import { bump } from './hud/store.js';
import {
  BACKEND_WEBGL, BACKEND_WEBGPU, isWebGPUSupported, readStoredBackend,
  writeStoredBackend, resolveBootBackend,
} from './render-backend.js';
import {
  setDefaultScene, mkBox, mkCylinder, mkSphere, mkGround, mkLineSystem, disposeObj,
  ghostHitboxMaterial, classifyGPU, pixelRatioForTier, isQualityLevel,
  resolveQualityTier, nextQualityTier, qualityShadowsEnabled,
  qualityAntialiasEnabled, QUALITY_STORAGE_KEY,
} from './three-helpers.js';
import { macroLinePositions, microLinePositions } from './grid-helper.js';
import { boundsFor } from './map-layout.js';
import { MIN_ZOOM_RADIUS, MAX_ZOOM_RADIUS, DEFAULT_CAMERA_RADIUS } from './camera-zoom.js';
import { updateFirstPersonCamera, updateThirdPersonCamera } from './camera-fps.js';

// ══════════════════════════════════════════════════════════════════════════════
//  RENDERER + SCENE BOOTSTRAP (three.js)
// ══════════════════════════════════════════════════════════════════════════════
export let canvas = document.getElementById('renderCanvas');
export let renderer;
export let scene;
export let camera;

export const ARENA = 256;

// Half-extent of the playable square for the current map (layout JSON).
export function currentBounds() {
  const key = (typeof window !== 'undefined' && window._currentMapKey) || 'arena';
  return boundsFor(key);
}
export let PLAYER = 'blue';
// HUD "switch faction" moves the commanded side to the switched faction's
// team. Only blue/red are valid; anything else is ignored.
export function setPlayerTeam(team) {
  if (team === 'blue' || team === 'red') {
    PLAYER = team;
  }
}
// Sandbox mode: command both teams at once (AI red spawns disabled).
export let controlBoth = false;
export function setControlBoth(value) {
  controlBoth = !!value;
}
// Units/owners of this team accept player orders. Strict team check so
// null/uncaptured owners never become commandable by accident.
export function canCommand(team) {
  if (team !== 'blue' && team !== 'red') {
    return false;
  }
  return team === PLAYER || controlBoth;
}
export const SQUAD_MAX = 13;
export const COSTS = {
  hq: 300,
  barracks: 150,
  infantry_command: 150,
  squad: 100,
  builder: 80,
  reinforce: 20,
  listeningPost: 60,
  tower: 120,
  thermoGen: 80,
  towerBase: 80,
  apc: 180,
  mechanized: 180,
  grenadeUpgrade: 30,
  airfield: 200,
  jet: 220,
  gunTurret: 100,
  listening_post: 60,
  plasma_generator: 80,
  tactica_control: 120,
  mars_pattern: 150,
  thermo_generator: 80,
  turret: 100,
  mines: 50,
  desecrated_stronghold: 300,
  chaos_temple: 150,
  armoury: 150,
  machine_pit: 180,
  sacrificial_circle: 120,
  greater_sacrificial_circle: 200,
  thermo_plasma_generator: 120,
  land_mine: 40,
  command_hq: 300,
  machine_cult: 180,
  progenitor_temple: 120,
  orbital_relay: 200,
  monolith: 300,
  obelisk: 100,
  thermoplasma_generator: 120,
  summoning_core: 150,
  forbidden_archive: 150,
  greater_summoning_core: 300,
  energy_core: 80,
  settlement: 300,
  da_boyz_hut: 150,
  generator: 80,
  waagh_banner: 100,
  pile_o_guns: 120,
  mek_shop: 180,
  bigger_generator: 120,
  webway_assembly: 300,
  aspect_portal: 150,
  warp_generator: 80,
  webway_gate: 200,
  soul_shrine: 120,
  support_portal: 180,
  advanced_warp_generator: 120,
  support_platform: 100,
  tau_hq: 300,
  tau_barracks: 150,
  tau_listening_post: 60,
  tau_plasma_generator: 80,
  tau_kroot_nest: 100,
  tau_research: 150,
  tau_vehicle_building: 180,
  tau_thermoplasma_generator: 120,
  tau_shrine_of_mont_ka: 120,
  tau_shrine_of_kauyon: 120,
  tau_shrine_of_purpose: 120,
};
export const PROD_TIME = { squad: 3, builder: 2, jet: 12 };
export let mapRevealed = false;
export function setMapRevealed(value) {
  mapRevealed = value;
}
export const TEAM_COLOR = {
  blue: {
    diffuse: new THREE.Color(0, 0.4, 1),
    emissive: new THREE.Color(0, 0.2, 0.8),
    projectile: new THREE.Color(0.3, 0.7, 1),
  },
  red: {
    diffuse: new THREE.Color(1, 0.1, 0),
    emissive: new THREE.Color(0.8, 0, 0),
    projectile: new THREE.Color(1, 0.3, 0.1),
  },
  builder: {
    diffuse: new THREE.Color(1, 0.8, 0),
    emissive: new THREE.Color(0.5, 0.3, 0),
    projectile: new THREE.Color(1, 0.8, 0),
  },
};

export const FORMATION = (() => {
  const spacing = 2.2;
  const grid = [
    [0, 0],
    [-spacing, -spacing],
    [0, -spacing],
    [spacing, -spacing],
    [-spacing, 0],
    [spacing, 0],
    [-spacing, spacing],
    [0, spacing],
    [spacing, spacing],
    [0, -spacing * 2],
    [-spacing, -spacing * 2],
    [spacing, -spacing * 2],
    [0, spacing * 2],
  ];
  return grid.map(([x, z]) => ({ x, y: 0, z }));
})();

export let SQUAD_SCATTER = 1.0;
export let HITBOX_SIZE = 2.8;
export let _hitboxDebug = false;
export const _allHitboxes = [];

export const JET_ALT = 14;
export const JET_SPEED = 10;
export const JET_ATTACK_RANGE = 38;
// Daemon flight (bloodthirster FLY order): cruise altitude, travel speed,
// climb/descend rates and the landing radius around the target point.
export const FLY_CRUISE_ALT = 10;
export const FLY_SPEED = 9;
export const FLY_CLIMB = 8;
export const FLY_DESCEND = 10;
export const FLY_LAND_RADIUS = 3;

export let world;
export function setWorld(entityWorld) { world = entityWorld; }

export const MAX_PLASMA = 6;
export const PLASMA_RATE_PER = 10;
export const LP_REQUISITION_RATES = [6, 12, 18, 24];

export const BUILDING_BOUNDS = {
  hq: 5,
  barracks: 3.5,
  infantry_command: 3.5,
  mechanized: 2.5,
};
export const STRUCTURE_BOUNDS = {
  tower: 2.5,
  turret: 2.5,
  towerBase: 2.25,
  gunTurret: 2.5,
  thermo_generator: 3.5,
  thermoGen: 3.5,
  plasma_generator: 3.5,
  tactica_control: 3.5,
  mars_pattern: 3.5,
  mines: 2.5,
};
export const AIRFIELD_BOUNDS = 8;
export function getPowerRate(worldRef = world) {
  if (!worldRef) return 0;
  const count = worldRef.query('structure').filter((id) => {
    const s = worldRef.get(id, 'structure');
    return s && !s.constructing && ['thermoGen', 'thermo_generator', 'plasma_generator'].includes(s.type);
  }).length;
  return Math.min(count, MAX_PLASMA) * PLASMA_RATE_PER;
}
export function getRequisitionRate(worldRef = world) {
  if (!worldRef) return 0;
  const hqCount = worldRef.query('building').filter((id) => {
    const b = worldRef.get(id, 'building');
    return b && b.team === PLAYER && b.type === 'hq' && !b.constructing;
  }).length;
  let pointRate = 0;
  worldRef.query('strategicPoint').forEach((id) => {
    const sp = worldRef.get(id, 'strategicPoint');
    if (sp && sp.owner === PLAYER) {
      pointRate += LP_REQUISITION_RATES[Math.min(sp.lpTier || 0, 3)];
    }
  });
  return hqCount * 20 + pointRate;
}

export let requisition = 1500;
export let energy = 0;
export let kills = 0;
export let startTime = Date.now();
export let gameOver = false;
export const counters = { baseReqT: 0, aiT: 0 };
export function setRequisition(value) { requisition = value; }
export function gainRequisition(world, amount) {
  setRequisition(Math.min(9999, requisition + amount));
}
export function setEnergy(value) { energy = value; }
export function setKills(value) { kills = value; }
export function setGameOver(value) { gameOver = value; }
export function setStartTime(value) { startTime = value; }

export const researchedTech = new Set();
export function setResearchedTech(key) { researchedTech.add(key); }
export function clearResearchedTech() { researchedTech.clear(); }

export let selSquads = [];
export function setSelSquads(value) { selSquads = value; }
export let selBuildings = [];
export function setSelBuildings(value) { selBuildings = value; }
export let selBuilder = null;
export function setSelBuilder(value) { selBuilder = value; }
export let selListeningPost = null;
export function setSelListeningPost(value) { selListeningPost = value; }
export let hoveredEnemySquad = null;
export function setHoveredEnemySquad(value) { hoveredEnemySquad = value; }
export let _hoverEnemySquad = null;
export function set_hoverEnemySquad(value) { _hoverEnemySquad = value; }

export let attackMode = 'ranged';

// ── Per-frame callbacks (replaces onBeforeRenderObservable) ─────────────────
const _beforeRenderCallbacks = [];
export function addBeforeRender(callback) {
  _beforeRenderCallbacks.push(callback);
  return callback;
}
export function removeBeforeRender(callback) {
  const index = _beforeRenderCallbacks.indexOf(callback);
  if (index >= 0) {
    _beforeRenderCallbacks.splice(index, 1);
  }
}
export function runBeforeRender() {
  _beforeRenderCallbacks.slice().forEach((callback) => {
    try {
      callback();
    } catch (error) {
      console.warn('[frame-callback]', error);
    }
  });
}

let _deltaTime = 0;
export function setDeltaTime(value) { _deltaTime = value; }
export function getDeltaTime() { return _deltaTime; }

let _targetPulseCallback = null;
export function _startTargetPulse(solId) {
  _stopTargetPulse();
  const squadComponent = world.get(solId, 'soldier');
  if (!squadComponent) {
    return;
  }
  const meshComponent = world.get(solId, 'mesh');
  if (!meshComponent?.root?._selMat) {
    return;
  }
  let elapsed = 0;
  _targetPulseCallback = addBeforeRender(() => {
    elapsed += getDeltaTime();
    const alpha = 0.5 + 0.5 * Math.sin(elapsed * 12);
    if (meshComponent.root?._selMat) {
      meshComponent.root._selMat.opacity = alpha;
    }
    if (!world.has(solId, 'soldier')) {
      _stopTargetPulse();
    }
  });
}
export function _stopTargetPulse() {
  if (_targetPulseCallback) {
    removeBeforeRender(_targetPulseCallback);
    _targetPulseCallback = null;
  }
}

export let buildMode = null;
export function setBuildMode(value) { buildMode = value; }

export let _gridVisible = true;
export let _gridVariant = 3;

function _applyGridVisibility() {
  if (scene._gridMicroMesh) {
    scene._gridMicroMesh.visible = _gridVisible && _gridVariant === 1;
  }
  if (scene._gridZoomMesh) {
    scene._gridZoomMesh.visible = _gridVisible && _gridVariant === 2;
  }
  if (scene._gridMacroMeshes) {
    scene._gridMacroMeshes.forEach((mesh) => { mesh.visible = _gridVisible && _gridVariant !== 3; });
  }
}

export function setGridVariant(variant) {
  _gridVariant = variant === 2 ? 2 : variant === 3 ? 3 : 1;
  _applyGridVisibility();
}

export function toggleGridVariant() {
  setGridVariant(_gridVariant === 1 ? 2 : _gridVariant === 2 ? 3 : 1);
}

export const TAG = {
  squad: 'squad',
  soldier: 'soldier',
  builder: 'builder',
  building: 'building',
  structure: 'structure',
  bullet: 'bullet',
  grenade: 'grenade',
  particle: 'particle',
  strategicPoint: 'strategicPoint',
};

export const particles = [];
export const grenadeCallbacks = [];

export const TERRAINS = {
  steppe: {
    groundColor: [0, 0, 0],
    fogColor: [0.129, 0.129, 0.129],
    clearColor: [0.129, 0.129, 0.129, 1],
    ambDiffuse: [0.88, 0.92, 1.00],
    ambGround: [0.08, 0.08, 0.10],
    sunColor: [1.00, 0.96, 0.88],
    microAlpha: 0.18,
    macroColor: [0.42, 0.42, 0.42],
  },
  jungle: {
    groundColor: [0.09, 0.17, 0.07],
    fogColor: [0.03, 0.08, 0.03],
    clearColor: [0.03, 0.07, 0.03, 1],
    ambDiffuse: [0.70, 1.00, 0.55],
    ambGround: [0.04, 0.12, 0.02],
    sunColor: [0.72, 1.00, 0.50],
    microAlpha: 0.07,
    macroColor: [0.18, 0.55, 0.12],
  },
  river: {
    groundColor: [0.30, 0.26, 0.18],
    fogColor: [0.04, 0.07, 0.12],
    clearColor: [0.04, 0.06, 0.10, 1],
    ambDiffuse: [0.88, 0.94, 1.00],
    ambGround: [0.08, 0.12, 0.18],
    sunColor: [0.85, 0.92, 1.00],
    microAlpha: 0.10,
    macroColor: [0.65, 0.72, 0.88],
  },
};

let _terrainDecoMeshes = [];
function _clearTerrainDeco() {
  _terrainDecoMeshes.forEach((mesh) => {
    try {
      disposeObj(mesh);
    } catch (e) {
      // empty
    }
  });
  _terrainDecoMeshes = [];
}

function _spawnJungleTrees() {
  const treeMat = new THREE.MeshStandardMaterial();
  treeMat.color.setRGB(0.07, 0.28, 0.05);
  treeMat.emissive.setRGB(0.02, 0.10, 0.01);
  treeMat.roughness = 1;
  treeMat.metalness = 0;
  const trunkMat = new THREE.MeshStandardMaterial();
  trunkMat.color.setRGB(0.22, 0.14, 0.06);
  trunkMat.emissive.setRGB(0.07, 0.04, 0.01);
  trunkMat.roughness = 1;
  trunkMat.metalness = 0;
  const rng = (a, b) => a + Math.random() * (b - a);
  let placed = 0;
  let att = 0;
  while (placed < 65 && att < 500) {
    att++;
    const x = rng(-57, 57);
    const z = rng(-57, 57);
    if (Math.abs(x) < 20 && Math.abs(z) < 20) {
      continue;
    }
    const size = rng(0.5, 1.5);
    const trunk = mkCylinder(`jt${placed}`, 0.06 * size, 0.32 * size, size * 1.7, 6);
    trunk.position.set(x, size * 0.85, z);
    trunk.material = trunkMat;
    trunk.userData.pickable = false;
    _terrainDecoMeshes.push(trunk);
    const canopy = mkSphere(`jc${placed}`, size * 2.4, 5);
    canopy.position.set(x, size * 2.0, z);
    canopy.scale.y = 1.25;
    canopy.material = treeMat;
    canopy.userData.pickable = false;
    _terrainDecoMeshes.push(canopy);
    placed++;
  }
}

function _spawnRiver() {
  const riverMat = new THREE.MeshBasicMaterial();
  riverMat.color.setRGB(0.02, 0.10, 0.32);
  riverMat.transparent = true;
  riverMat.opacity = 0.80;
  const river = mkGround('river_plane', 14, 140);
  river.rotation.y = Math.PI / 7;
  river.position.set(6, 0.03, 0);
  river.material = riverMat;
  river.userData.pickable = false;
  _terrainDecoMeshes.push(river);
  const bankMat = new THREE.MeshBasicMaterial();
  bankMat.color.setRGB(0.50, 0.44, 0.26);
  [-1, 1].forEach((side) => {
    const bank = mkGround(`bank${side}`, 4, 140);
    bank.rotation.y = Math.PI / 7;
    bank.position.set(6 + side * 9, 0.018, 0);
    bank.material = bankMat;
    bank.userData.pickable = false;
    _terrainDecoMeshes.push(bank);
  });
}

export function setTerrain(name) {
  if (!scene) {
    return;
  }
  const terrainConfig = TERRAINS[name];
  const groundMaterial = scene._ground?.material;
  if (groundMaterial) {
    groundMaterial.emissive.setRGB(...terrainConfig.groundColor);
  }
  scene.fog.color.setRGB(...terrainConfig.fogColor);
  scene.background.setRGB(terrainConfig.clearColor[0], terrainConfig.clearColor[1], terrainConfig.clearColor[2]);
  const ambientLight = scene.getObjectByName('amb');
  if (ambientLight) {
    ambientLight.color.setRGB(...terrainConfig.ambDiffuse);
    ambientLight.groundColor.setRGB(...terrainConfig.ambGround);
  }
  const sunLight = scene.getObjectByName('sun');
  if (sunLight) {
    sunLight.color.setRGB(...terrainConfig.sunColor);
  }
  if (scene._gridMacroMat) {
    scene._gridMacroMat.color.setRGB(...terrainConfig.macroColor);
  }
  scene._terrainMicroAlpha = terrainConfig.microAlpha;
  _clearTerrainDeco();
  if (name === 'jungle') {
    _spawnJungleTrees();
  }
  if (name === 'river') {
    _spawnRiver();
  }
}

// ── Orbit camera rig (same alpha/beta/radius/target semantics as before) ────

const _cameraChangeObservers = [];
let _cameraSignature = '';
export function addCameraChangeObserver(callback) {
  _cameraChangeObservers.push(callback);
}

export function updateCamera() {
  if (!camera) {
    return;
  }
  if (updateFirstPersonCamera()) {
    return;
  }
  if (updateThirdPersonCamera()) {
    return;
  }
  camera.radius = Math.max(camera.lowerRadiusLimit, Math.min(camera.upperRadiusLimit, camera.radius));
  camera.beta = Math.max(camera.lowerBetaLimit, Math.min(camera.upperBetaLimit, camera.beta));
  const sinBeta = Math.sin(camera.beta);
  camera.position.set(
    camera.target.x + camera.radius * Math.cos(camera.alpha) * sinBeta,
    camera.target.y + camera.radius * Math.cos(camera.beta),
    camera.target.z + camera.radius * Math.sin(camera.alpha) * sinBeta,
  );
  camera.lookAt(camera.target);
  const signature = `${camera.alpha.toFixed(4)},${camera.beta.toFixed(4)},${camera.radius.toFixed(2)},`
    + `${camera.target.x.toFixed(2)},${camera.target.y.toFixed(2)},${camera.target.z.toFixed(2)}`;
  if (signature !== _cameraSignature) {
    _cameraSignature = signature;
    _cameraChangeObservers.forEach((callback) => {
      try {
        callback();
      } catch (error) {
        // ignore observer errors
      }
    });
  }
}

// ── Picking + projection ────────────────────────────────────────────────────

const _raycaster = new THREE.Raycaster();
const _ndc = new THREE.Vector2();
const _projectVector = new THREE.Vector3();

function _chainVisible(object) {
  let current = object;
  while (current) {
    if (!current.visible) {
      return false;
    }
    current = current.parent;
  }
  return true;
}

export function pickAt(sx, sy, predicate, scope = null) {
  const scopeScene = scope?.scene ?? scene;
  const scopeCamera = scope?.camera ?? camera;
  const scopeCanvas = scope?.canvas ?? canvas;
  if (!scopeScene || !scopeCamera) {
    return { hit: false, pickedMesh: null, pickedPoint: null };
  }
  const rect = scopeCanvas?.getBoundingClientRect?.();
  if (!rect) {
    return { hit: false, pickedMesh: null, pickedPoint: null };
  }
  _ndc.set(
    ((sx - rect.left) / rect.width) * 2 - 1,
    -((sy - rect.top) / rect.height) * 2 + 1,
  );
  _raycaster.setFromCamera(_ndc, scopeCamera);
  const hits = _raycaster.intersectObjects(scopeScene.children, true);
  for (const hit of hits) {
    const object = hit.object;
    if (!object.isMesh) {
      continue;
    }
    if (!_chainVisible(object)) {
      continue;
    }
    if (object.userData.pickable === false) {
      continue;
    }
    if (predicate && !predicate(object)) {
      continue;
    }
    return { hit: true, pickedMesh: object, pickedPoint: hit.point };
  }
  return { hit: false, pickedMesh: null, pickedPoint: null };
}

export function projectToScreen(x, y, z) {
  _projectVector.set(x, y, z).project(camera);
  const rect = canvas.getBoundingClientRect();
  return {
    sx: (_projectVector.x * 0.5 + 0.5) * rect.width + rect.left,
    sy: (-_projectVector.y * 0.5 + 0.5) * rect.height + rect.top,
    z: _projectVector.z,
  };
}

export function handleResize() {
  if (!renderer || !camera) {
    return;
  }
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

// ══════════════════════════════════════════════════════════════════════════════
//  RENDER BACKEND (WebGL / WebGPU toggle)
// ══════════════════════════════════════════════════════════════════════════════
let _backend = BACKEND_WEBGL;
let _backendSwitching = false;
let _backendError = '';

export function getRenderBackend() {
  return _backend;
}

export function isBackendSwitching() {
  return _backendSwitching;
}

export function getBackendError() {
  return _backendError;
}

export function supportsWebGPU() {
  return isWebGPUSupported(typeof navigator !== 'undefined' ? navigator : undefined);
}

function _safeStorage() {
  try {
    return typeof localStorage !== 'undefined' ? localStorage : undefined;
  } catch (_) {
    return undefined;
  }
}

// ── GPU quality tier (auto) ─────────────────────────────────────────────
// Sniffed once from a throwaway context BEFORE the real renderer exists so
// antialias can be chosen at construction time. Override for testing via
// window.__GRIMCRAFT_QUALITY = 'low' | 'high' (read before first render).
let _qualityTier = null;

function _sniffGpuRendererName() {
  try {
    if (typeof document === 'undefined') return '';
    const probe = document.createElement('canvas');
    const gl = probe.getContext('webgl2') || probe.getContext('webgl');
    if (!gl) return '';
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const name = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || '') : '';
    const lose = gl.getExtension('WEBGL_lose_context');
    if (lose) lose.loseContext();
    return name;
  } catch (_) {
    return '';
  }
}

export function qualityTier() {
  if (_qualityTier) return _qualityTier;
  let forced = (typeof window !== 'undefined' && window.__GRIMCRAFT_QUALITY) || '';
  // URL override (?quality=low|medium|high): some browsers mask the GPU name
  // for privacy, which would silently defeat auto-detection.
  if (typeof window !== 'undefined' && window.location) {
    try {
      const q = new URLSearchParams(window.location.search).get('quality');
      if (q) forced = q;
    } catch (_) { /* ignore malformed URLs */ }
  }
  let stored = '';
  try {
    if (typeof localStorage !== 'undefined') {
      stored = localStorage.getItem(QUALITY_STORAGE_KEY) || '';
    }
  } catch (_) { /* storage unavailable */ }
  const query = isQualityLevel(forced) ? String(forced).toLowerCase() : '';
  const saved = isQualityLevel(stored) ? String(stored).toLowerCase() : '';
  _qualityTier = resolveQualityTier({
    query,
    stored: saved,
    gpu: (query || saved) ? '' : _sniffGpuRendererName(),
  });
  return _qualityTier;
}

export function setQualityTier(value) {
  if (!isQualityLevel(value)) return qualityTier();
  _qualityTier = String(value).toLowerCase();
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(QUALITY_STORAGE_KEY, _qualityTier);
    }
  } catch (_) { /* storage unavailable */ }
  return _qualityTier;
}

export function cycleQualityTier() {
  return setQualityTier(nextQualityTier(qualityTier()));
}

export function applyRendererSettings(r) {
  const tier = qualityTier();
  r.setPixelRatio(pixelRatioForTier(tier, window.devicePixelRatio));
  r.setSize(window.innerWidth, window.innerHeight);
  if (r.shadowMap) {
    // Low tier: no shadow maps at all (skips the shadow pass AND the
    // per-pixel PCF lookups — the biggest fill-rate cost after resolution).
    const shadows = qualityShadowsEnabled(tier);
    r.shadowMap.enabled = shadows;
    if (shadows && 'type' in r.shadowMap) {
      r.shadowMap.type = THREE.PCFSoftShadowMap;
    }
  }
}

export async function createBackendRenderer(backend, canvasEl) {
  if (backend === BACKEND_WEBGPU) {
    // Dynamic import: the WebGPU bundle only loads when actually used.
    const { WebGPURenderer } = await import('three/webgpu');
    const gpuRenderer = new WebGPURenderer({ canvas: canvasEl, antialias: qualityAntialiasEnabled(qualityTier()) });
    applyRendererSettings(gpuRenderer);
    await gpuRenderer.init();
    return gpuRenderer;
  }
  const glRenderer = new THREE.WebGLRenderer({ canvas: canvasEl, antialias: qualityAntialiasEnabled(qualityTier()) });
  applyRendererSettings(glRenderer);
  return glRenderer;
}

// A canvas is bound to a single context type, so a backend swap needs a
// fresh element; ids/classes are preserved for CSS and lookups.
export function createFreshCanvas() {
  const fresh = document.createElement('canvas');
  fresh.id = canvas.id;
  fresh.className = canvas.className;
  return fresh;
}

export function adoptCanvasElement(freshCanvas) {
  canvas.replaceWith(freshCanvas);
  canvas = freshCanvas;
}

export function setRendererInstance(nextRenderer) {
  renderer = nextRenderer;
}

export function setBackendState(backend, switching, error = '') {
  _backend = backend;
  _backendSwitching = switching;
  _backendError = error;
  writeStoredBackend(_safeStorage(), backend);
  bump('topbar');
}

export async function createScene() {
  _backend = resolveBootBackend({
    stored: readStoredBackend(_safeStorage()),
    supportsWebGPU: supportsWebGPU(),
  });
  if (_backend === BACKEND_WEBGPU) {
    try {
      renderer = await createBackendRenderer(_backend, canvas);
    } catch (error) {
      console.warn('[backend] WebGPU init failed, falling back to WebGL', error);
      _backend = BACKEND_WEBGL;
      _backendError = String(error?.message || error);
      adoptCanvasElement(createFreshCanvas());
      renderer = await createBackendRenderer(_backend, canvas);
    }
  } else {
    renderer = await createBackendRenderer(_backend, canvas);
  }

  scene = new THREE.Scene();
  window.__grimScene = scene;
  scene.background = new THREE.Color(0.129, 0.129, 0.129);
  scene.fog = new THREE.FogExp2(new THREE.Color(0.129, 0.129, 0.129), 0.0015);
  setDefaultScene(scene);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.5, 3000);
  camera.name = 'cam';
  // Debug/test handle (same pattern as window.__sgbTerrainRoot): lets
  // automation frame shots without touching the orbit rig.
  window.__grimCamera = camera;
  camera.alpha = -Math.PI / 2;
  camera.beta = 0.9;
  camera.radius = DEFAULT_CAMERA_RADIUS;
  camera.target = new THREE.Vector3(0, 0, 0);
  camera.lowerRadiusLimit = MIN_ZOOM_RADIUS;
  camera.upperRadiusLimit = MAX_ZOOM_RADIUS;
  camera.upperBetaLimit = 1.38;
  camera.lowerBetaLimit = 0.15;
  // First-person viewmodel (cloned lasgun) parents to the camera, so the
  // camera itself must live in the scene graph to render children.
  scene.add(camera);
  updateCamera();

  const ambientLight = new THREE.HemisphereLight(
    new THREE.Color(0.88, 0.92, 1.0),
    new THREE.Color(0.08, 0.08, 0.10),
    0.55,
  );
  ambientLight.name = 'amb';
  scene.add(ambientLight);
  scene._ambLight = ambientLight;
  scene._ambBase = 0.55;

  const sunLight = new THREE.DirectionalLight(new THREE.Color(1.0, 0.96, 0.88), 1.8);
  sunLight.name = 'sun';
  sunLight.position.set(60, 100, 40);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(1024, 1024);
  sunLight.shadow.camera.left = -150;
  sunLight.shadow.camera.right = 150;
  sunLight.shadow.camera.top = 150;
  sunLight.shadow.camera.bottom = -150;
  sunLight.shadow.camera.near = 10;
  sunLight.shadow.camera.far = 500;
  sunLight.shadow.bias = -0.0005;
  scene.add(sunLight);
  scene._sunLight = sunLight;
  scene._sunBase = 1.8;

  scene._registerShadows = function (root) {
    if (!root) {
      return;
    }
    if (root.isMesh) {
      root.castShadow = true;
      return;
    }
    if (root.traverse) {
      root.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
        }
      });
    }
  };

  const fill = new THREE.DirectionalLight(new THREE.Color(0.72, 0.82, 1.0), 0.45);
  fill.name = 'fill';
  fill.position.set(-80, 50, -60);
  scene.add(fill);
  scene._fillLight = fill;
  scene._fillBase = 0.45;

  const rim = new THREE.DirectionalLight(new THREE.Color(1.0, 0.85, 0.65), 0.28);
  rim.name = 'rim';
  rim.position.set(-40, 30, -100);
  scene.add(rim);
  scene._rimLight = rim;
  scene._rimBase = 0.28;

  const ground = mkGround('ground', 1080, 1080, 2);
  const groundMaterial = new THREE.MeshStandardMaterial();
  groundMaterial.color.setRGB(0.22, 0.22, 0.22);
  groundMaterial.emissive.setRGB(0, 0, 0);
  groundMaterial.roughness = 0.95;
  groundMaterial.metalness = 0;
  ground.material = groundMaterial;
  ground.receiveShadow = true;
  scene._ground = ground;

  // ── Two-tier grid: CELL_W x CELL_H macro cells, MICRO_DIV micro cells each ──
  (function buildGrid() {
    const HALF = 550;
    const CELL_W = 15;
    const CELL_H = 15;
    const MICRO_DIV = 5;
    const Y_MICRO = 0.012;
    const Y_MACRO = 0.018;

    // ── Micro lines — LineSegments, white low-alpha ──────────────────────────
    const microLines = [];
    const microCols = [];
    const microColor = new THREE.Color(0.55, 0.55, 0.55);
    const LEN = HALF * 2;

    for (const u of microLinePositions(HALF, CELL_W / MICRO_DIV, CELL_W)) {
      microLines.push([new THREE.Vector3(u, Y_MICRO, -HALF), new THREE.Vector3(u, Y_MICRO, HALF)]);
      microCols.push([microColor, microColor]);
    }
    for (const u of microLinePositions(HALF, CELL_H / MICRO_DIV, CELL_H)) {
      microLines.push([new THREE.Vector3(-HALF, Y_MICRO, u), new THREE.Vector3(HALF, Y_MICRO, u)]);
      microCols.push([microColor, microColor]);
    }

    const microMesh = mkLineSystem('grid_micro', microLines, microCols, 0.18);
    microMesh.userData.pickable = false;
    microMesh.frustumCulled = false;
    scene._gridMicroMesh = microMesh;

    // ── Variant 2: small cells that survive zoom-out ─────────────────────────
    // One shader plane instead of 1px lines: fwidth anti-aliasing keeps the
    // 3-unit cells crisp at any distance, with no distance fade (unlike the
    // micro LineSegments above, which game.js fades out past radius ~35).
    const zoomMat = new THREE.ShaderMaterial({
      uniforms: {
        uStep: { value: CELL_W / MICRO_DIV },
        uHalf: { value: HALF },
        uColor: { value: new THREE.Color(0.62, 0.62, 0.64) },
        uAlpha: { value: 0.65 },
      },
      vertexShader: /* glsl */`
        varying vec3 vWorldPos;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldPos = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: /* glsl */`
        uniform float uStep;
        uniform float uHalf;
        uniform vec3 uColor;
        uniform float uAlpha;
        varying vec3 vWorldPos;
        float gridLine(vec2 p) {
          vec2 q = p / uStep;
          vec2 w = fwidth(q) + 1e-6;
          vec2 a = abs(fract(q - 0.5) - 0.5) / w;
          return 1.0 - min(min(a.x, a.y), 1.0);
        }
        void main() {
          vec2 p = vWorldPos.xz;
          vec2 edge = smoothstep(uHalf, uHalf - 60.0, abs(p));
          float border = edge.x * edge.y;
          float alpha = gridLine(p) * uAlpha * border;
          if (alpha < 0.01) {
            discard;
          }
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
    });
    const zoomMesh = new THREE.Mesh(new THREE.PlaneGeometry(HALF * 2, HALF * 2), zoomMat);
    zoomMesh.name = 'grid_zoom_cells';
    zoomMesh.rotation.x = -Math.PI / 2;
    zoomMesh.position.y = 0.015;
    zoomMesh.userData.pickable = false;
    zoomMesh.frustumCulled = false;
    zoomMesh.visible = false;
    scene.add(zoomMesh);
    scene._gridZoomMesh = zoomMesh;

    // ── Macro lines — flat box ribbons ───────────────────────────────────────
    const macroMat = new THREE.MeshBasicMaterial();
    macroMat.color.setRGB(0.42, 0.42, 0.42);
    scene._gridMacroMat = macroMat;

    const THICK = 0.12;
    scene._gridMacroMeshes = [];

    for (const u of macroLinePositions(HALF, CELL_W)) {
      const vLine = mkBox('gm_v_' + u, THICK, 0.008, LEN);
      vLine.position.set(u, Y_MACRO, 0);
      vLine.material = macroMat;
      vLine.userData.pickable = false;
      vLine.frustumCulled = false;
      scene._gridMacroMeshes.push(vLine);
    }

    for (const u of macroLinePositions(HALF, CELL_H)) {
      const hLine = mkBox('gm_h_' + u, LEN, 0.008, THICK);
      hLine.position.set(0, Y_MACRO, u);
      hLine.material = macroMat;
      hLine.userData.pickable = false;
      hLine.frustumCulled = false;
      scene._gridMacroMeshes.push(hLine);
    }
  })();
  // Seat initial visibility from the default variant (no-grid hides all).
  _applyGridVisibility();

  setTerrain('steppe');

  return { engine: renderer, renderer, scene, camera };
}

export function setAttackMode(mode) {
  attackMode = mode;
  bump('hud');
}

export function toggleScatterPanel() {
  const panel = document.getElementById('scatter-panel');
  const btn = document.getElementById('scatter-btn');
  if (!panel || !btn) {
    return;
  }
  const open = panel.style.display === 'block';
  panel.style.display = open ? 'none' : 'block';
  btn.classList.toggle('active', !open);
}

export function onScatterInput(val) {
  SQUAD_SCATTER = parseFloat(val);
  const scatterValue = document.getElementById('scatter-val');
  if (scatterValue) {
    scatterValue.textContent = `${SQUAD_SCATTER.toFixed(1)}x`;
  }
  bump('hud');
}

export function onHitboxInput(val) {
  HITBOX_SIZE = parseFloat(val);
  const hitboxValue = document.getElementById('hitbox-val');
  if (hitboxValue) {
    hitboxValue.textContent = parseFloat(val).toFixed(1);
  }
  _allHitboxes.forEach((hitbox) => {
    if (hitbox.userData?.disposed) {
      return;
    }
    hitbox.scale.x = HITBOX_SIZE / 2.8;
    hitbox.scale.z = HITBOX_SIZE / 2.8;
  });
}

export function toggleHitboxDebug() {
  _hitboxDebug = !_hitboxDebug;
  const btn = document.getElementById('hitbox-debug-btn');
  if (btn) {
    btn.textContent = _hitboxDebug ? '◼ HIDE HITBOXES' : '◻ SHOW HITBOXES';
    btn.style.background = _hitboxDebug ? 'rgba(255,96,64,0.25)' : 'rgba(255,96,64,0.08)';
    btn.style.color = _hitboxDebug ? '#ff6040' : 'rgba(255,96,64,0.6)';
    btn.style.borderColor = _hitboxDebug ? '#ff6040' : 'rgba(255,96,64,0.3)';
  }
  _allHitboxes.forEach((hitbox) => {
    if (hitbox.userData?.disposed) {
      return;
    }
    // Hitboxes stay visible so the raycaster hits them; the ghost material
    // renders nothing until debug mode swaps in a wireframe.
    hitbox.visible = true;
    if (_hitboxDebug) {
      if (!hitbox.material || hitbox.material === ghostHitboxMaterial()) {
        const material = new THREE.MeshBasicMaterial();
        material.wireframe = true;
        material.color.setRGB(1, 0.2, 0.1);
        hitbox.material = material;
      }
    } else {
      hitbox.material = ghostHitboxMaterial();
    }
  });
}

export function toggleGrid() {
  _gridVisible = !_gridVisible;
  _applyGridVisibility();
}
