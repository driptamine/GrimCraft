import * as THREE from 'three';

import { scene, camera, addCameraChangeObserver, PLAYER } from './scene.js';
import { disposeObj, childMeshes } from './three-helpers.js';
import { applySgbRootTransform } from './sgb-mirror.js';
import { factionBasePosition } from './map-layout.js';

export let _sgbRoot = null;
export let _sgbMapData = null;
export let _sgbNumTilesX = 0;
export let _sgbNumTilesZ = 0;
export let _sgbCellSize = 0;
export let _sgbTileSize = 0;
export let _sgbRotate = 90;
// Mirror the map left<->right on screen (rows stay, each row reverses).
export let _sgbFlipH = true;
let _sgbTexture = null;
let _sgbYBase = 0;
let _sgbYDelta = 0;
let _passGridToken = 0;

// Passability paint (<map>_path.json, same folder/naming as the .sgb) for
// ground movement: window.__sgbPassGrid or null when the map has none (slope
// avoidance only). The token drops stale resolves on quick map switches.
async function loadPassGridForMap(mapPath) {
  const token = ++_passGridToken;
  window.__sgbPassGrid = null;
  const url = String(mapPath || '').replace(/\.sgb$/i, '') + '_path.json';
  try {
    const res = await fetch(url);
    if (!res.ok) {
      return;
    }
    const doc = await res.json();
    if (token !== _passGridToken) {
      return;
    }
    if (!doc || !Array.isArray(doc.rows) || !doc.grid) {
      return;
    }
    // Hand paint lives in the sidecar edits file so path.json keeps
    // matching the SGB bytes exactly; missing file means no overrides.
    try {
      const eres = await fetch(String(mapPath || '').replace(/\.sgb$/i, '') + '_path_edits.json');
      if (eres.ok) {
        const edoc = await eres.json();
        const { applyPathEdits } = await import('../pathfinding/astar-integrated.js');
        applyPathEdits(doc, edoc && edoc.edits);
      }
    } catch (_) {
      // No overrides: SGB-derived paint stands as is.
    }
    window.__sgbPassGrid = doc;
  } catch (_) {
    // Maps without path data behave as before.
  }
}

export function updateTerrainMapY(sliderVal) {
  _sgbYDelta = parseFloat(sliderVal) || 0;
  const root = _activeRoot();
  if (root) {
    root.position.y = _sgbYBase + _sgbYDelta;
  }
}

function updateOrientStatus() {
  const el = document.getElementById('terrain-map-orient');
  if (!el) {
    return;
  }
  const camDeg = Math.round(((camera?.alpha || 0) * 180) / Math.PI) % 360;
  el.textContent = 'CAMERA ' + camDeg + '° · MAP ' + (Math.round(_sgbRotate) % 360) + '°';
}

function _activeRoot() {
  return _sgbRoot || (scene && scene.getObjectByName('SGB_Map')) || null;
}

export function updateTerrainMapRotate(degVal) {
  const degrees = parseFloat(degVal) || 0;
  _sgbRotate = degrees;
  const el = document.getElementById('terrain-map-rotate-val');
  if (el) {
    el.textContent = Math.round(degrees) + '°';
  }
  const root = _activeRoot();
  if (root) {
    applySgbRootTransform(root, degrees, _sgbFlipH);
  }
  updateOrientStatus();
}

function setSgbStatus(msg, className = '') {
  const element = document.getElementById('terrain-mesh-status');
  if (!element) {
    return;
  }
  element.textContent = msg;
  element.className = 'terrain-status' + (className ? ' ' + className : '');
}

export async function loadSgbFile(file) {
  if (!file) {
    return;
  }
  if (!/\.sgb$/i.test(file.name)) {
    setSgbStatus('DROP AN .SGB FILE', 'err');
    return;
  }
  const buffer = await file.arrayBuffer();
  await loadSgbBuffer(buffer, file.name, file.name);
}

export async function loadSgbUrl(url, label, mapPath = '') {
  setSgbStatus('LOADING ' + (label || url).slice(0, 24) + '…', 'loading');
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error('HTTP ' + res.status);
    }
    const buffer = await res.arrayBuffer();
    await loadSgbBuffer(buffer, label || url, mapPath || url);
  } catch (err) {
    console.error(err);
    setSgbStatus('SGB ERROR: ' + (err.message || err).slice(0, 30), 'err');
  }
}

async function loadSgbBuffer(buffer, label = 'map', mapPath = '') {
  setSgbStatus('LOADING ' + (label || 'map').slice(0, 24) + '…', 'loading');
  try {
    clearSgbMap(true);
    const terrainModule = await import('./terrain-upload.js');
    if (terrainModule._terrainMeshRoot) {
      terrainModule.clearTerrainMesh(true);
    }
    if (!scene) {
      setSgbStatus('START A GAME FIRST (PLAY OFFLINE)', 'err');
      return;
    }
    const { createSgbParser } = await import('./sgb-parser.js');
    const parser = createSgbParser(null);
    const mapData = parser.parse(buffer);
    const root = parser.createThreeMap();
    childMeshes(root).forEach((mesh) => {
      mesh.receiveShadow = true;
      if (scene._registerShadows) {
        scene._registerShadows(mesh);
      }
    });
    _sgbRoot = root;
    _sgbMapData = mapData;
    window.__sgbSampleHeight = (x, z) => parser.sampleHeight(x, z);
    window.__sgbTerrainRoot = root;
    loadPassGridForMap(mapPath || label);
    import('./terrain-upload.js').then((module) => module.linkSgbRoot(root, parser.numTilesX, parser.numTilesZ));
    import('./sgb-decals.js').then((module) =>
      module.buildSgbDecals(root, mapData, (x, z) => parser.sampleHeight(x, z)),
    );
    _sgbNumTilesX = parser.numTilesX;
    _sgbNumTilesZ = parser.numTilesZ;
    _sgbCellSize = parser.cellSize;
    _sgbTileSize = parser.tileSize;
    let minY = Infinity;
    childMeshes(root).forEach((mesh) => {
      const tileBox = new THREE.Box3().setFromObject(mesh);
      minY = Math.min(minY, tileBox.min.y);
    });
    if (isFinite(minY)) {
      _sgbYBase = -minY - 6;
      root.position.y = _sgbYBase + _sgbYDelta;
    }
    if (scene._ground) {
      scene._ground.visible = false;
    }
    fitCameraToMap(root, mapPath || label);
    applySgbRootTransform(root, _sgbRotate, _sgbFlipH);
    window.__sgbTexData = {
      mapName: mapData.mapName,
      scenarioName: mapData.scenarioName,
      detailTextures: mapData.detailTextures || [],
      decalLinks: mapData.decalLinks || [],
      decals: mapData.decals || [],
    };
    import('./sgb-textures.js').then((module) => module.renderTextureList());
    setSgbStatus(
      '✓ ' + (label || mapData.mapName).slice(0, 24) + '\n' +
      mapData.mapName + ' · ' + mapData.scenarioName + '\n' +
      parser.numTilesX + '×' + parser.numTilesZ + ' tiles · cell ' + parser.cellSize + 'u',
      'ok',
    );
  } catch (err) {
    console.error(err);
    setSgbStatus('SGB ERROR: ' + (err.message || err).slice(0, 30), 'err');
  }
}

// Camera yaw per map: alvarus sits at 315° (tuned view), every other map
// keeps the π yaw.
const CAMERA_ALPHA_ALVARUS = (7 * Math.PI) / 4;
const CAMERA_ALPHA_NEW_MAPS = Math.PI;

// Camera distance per map: alvarus uses the tuned fixed radius, every other
// map keeps the bounding-box fit passed in.
const CAMERA_RADIUS_ALVARUS = 55;

export function cameraAlphaForMap(mapPath) {
  return /alvarus/i.test(String(mapPath || '')) ? CAMERA_ALPHA_ALVARUS : CAMERA_ALPHA_NEW_MAPS;
}

export function cameraRadiusForMap(mapPath, fitRadius) {
  return /alvarus/i.test(String(mapPath || '')) ? CAMERA_RADIUS_ALVARUS : fitRadius;
}

// Far plane per map size: big maps sit the camera past the default far plane,
// which would clip the whole map. Never shrinks an already-large far.
export function cameraFarForRadius(currentFar, radius) {
  return Math.max(currentFar || 0, radius * 1.2);
}

// Default camera target: the player's IG base when the layout has one,
// else the terrain bbox center. Pure (testable) — fitCameraToMap applies it.
export function cameraTargetForMap(mapId, center) {
  const igBase = factionBasePosition(mapId, PLAYER, 'ig');
  if (igBase) {
    return { x: igBase.x, y: 0, z: igBase.z };
  }
  return { x: center.x, y: center.y, z: center.z };
}

function fitCameraToMap(root, mapId = '') {
  if (!camera) {
    return;
  }
  const meshes = childMeshes(root);
  if (!meshes.length) {
    return;
  }
  const worldMin = new THREE.Vector3(Infinity, Infinity, Infinity);
  const worldMax = new THREE.Vector3(-Infinity, -Infinity, -Infinity);
  for (const mesh of meshes) {
    const meshBox = new THREE.Box3().setFromObject(mesh);
    worldMin.min(meshBox.min);
    worldMax.max(meshBox.max);
  }
  const center = worldMin.add(worldMax).multiplyScalar(0.5);
  const size = worldMax.sub(worldMin);
  const radius = cameraRadiusForMap(mapId, Math.max(size.x, size.z) * 5 + 40);
  if (camera.upperRadiusLimit < radius) {
    camera.upperRadiusLimit = radius;
  }
  const target = cameraTargetForMap(mapId, center);
  camera.target.set(target.x, target.y, target.z);
  camera.alpha = cameraAlphaForMap(mapId);
  camera.radius = radius;
  camera.far = cameraFarForRadius(camera.far, radius);
  camera.updateProjectionMatrix();
  updateOrientStatus();
  if (!camera._orientObs) {
    camera._orientObs = true;
    addCameraChangeObserver(() => updateOrientStatus());
  }
}

export function clearSgbMap(silent) {
  const root = _activeRoot();
  if (root) {
    childMeshes(root).forEach((mesh) => disposeObj(mesh));
    disposeObj(root);
  }
  _sgbRoot = null;
  _sgbMapData = null;
  _passGridToken += 1;
  window.__sgbTexData = null;
  window.__sgbSampleHeight = null;
  window.__sgbTerrainRoot = null;
  window.__sgbPassGrid = null;
  import('./terrain-upload.js').then((module) => module.linkSgbRoot(null, 0, 0));
  import('./sgb-textures.js').then((module) => module.clearTextureList());
  import('./sgb-decals.js').then((module) => module.clearSgbDecals());
  if (scene && scene._ground) {
    scene._ground.visible = true;
  }
  if (!silent) {
    setSgbStatus('NO TERRAIN MESH LOADED');
  }
}