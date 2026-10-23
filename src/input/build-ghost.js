import * as THREE from 'three';
import { clampGhostPos, intersectGroundPlane, screenToNDC } from '../ghost-place.js';
import { makeGhostMesh } from '../meshes.js';
import {
  COSTS,
  addBeforeRender,
  buildMode,
  camera,
  canvas,
  currentBounds,
  getDeltaTime,
  removeBeforeRender,
  requisition,
  scene,
  selBuilder,
  setBuildMode,
  world,
} from '../scene.js';
import {
  childMeshes,
  disposeObj,
  mkBox,
  mkGroup,
  mkLines,
} from '../three-helpers.js';
import { pickMesh } from './selection.js';


export let _buildGhost = null;

export let _buildGhostObserver = null;

export let _buildGhostT = 0;

export let _buildFootprint = null;

export let _buildGhostMeshes = null;

// Deferred ghost placement: mousemove only stores coords, the per-frame
// observer applies them, so high-frequency mice can't fire several
// full-scene raycasts between renders.
export let _ghostPendingX = 0;

export let _ghostPendingY = 0;

export let _ghostPending = false;

export const _ghostNdc = new THREE.Vector2();

export const _ghostHit = new THREE.Vector3();

export function _disposeGhostMeshTree(node) {
  if (!node) return;
  childMeshes(node).forEach((mesh) => {
    if (mesh.material) mesh.material.dispose();
    disposeObj(mesh);
  });
  disposeObj(node);
}


export function _getFootprintDiameter(type) {
  return (type === 'thermoGen' || type === 'thermo_generator' || type === 'plasma_generator') ? 7
    : (type === 'barracks' || type === 'infantry_command' || type === 'mechanized' || type === 'mars_pattern' || type === 'tactica_control') ? 7
    : (type === 'towerBase') ? 6
    : (type === 'gunTurret') ? 5.5
    : (type === 'mines') ? 4
    : 5.5;
}


export function _stopBuildGhost() {
  if (_buildGhostObserver) {
    removeBeforeRender(_buildGhostObserver);
    _buildGhostObserver = null;
  }
  if (_buildGhost) {
    _disposeGhostMeshTree(_buildGhost);
    _buildGhost = null;
  }
  if (_buildFootprint) {
    childMeshes(_buildFootprint).forEach((mesh) => {
      if (mesh.material) mesh.material.dispose();
    });
    disposeObj(_buildFootprint.material);
    disposeObj(_buildFootprint);
    _buildFootprint = null;
  }
  _buildGhostMeshes = null;
  _ghostPending = false;
}


export function _startBuildGhost(type) {
  _stopBuildGhost();
  const dummy = new THREE.Vector3(0, -999, 0);
  const builder = selBuilder !== null && world ? world.get(selBuilder, 'builder') : null;
  _buildGhost = makeGhostMesh(type, dummy, builder?.faction ? { faction: builder.faction } : {});
  _buildGhostT = 0;
  // Ghosts never touch the shadow map, and the pulse loop reuses one cached
  // mesh list instead of traversing the subtree every frame.
  _buildGhostMeshes = [];
  childMeshes(_buildGhost).forEach((mesh) => {
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    if (mesh.material) _buildGhostMeshes.push(mesh);
  });
  _ghostPending = false;
  const footprintDiameter = _getFootprintDiameter(type);
  _buildFootprint = mkBox('bfp_fill', footprintDiameter * 1.15, 5.5, footprintDiameter * 1.15);
  _buildFootprint.position.set(0, 2.75, 0);
  const fillMaterial = new THREE.MeshBasicMaterial();
  fillMaterial.color = new THREE.Color(0.05, 0.35, 0.8);
  fillMaterial.opacity = 0.3;
  fillMaterial.transparent = true;
  fillMaterial.depthWrite = false;
  _buildFootprint.material = fillMaterial;
  _buildFootprint.userData.pickable = false;
  const wireGroup = mkGroup('bfp_wire');
  const half = (footprintDiameter * 1.15) / 2;
  const yBot = -2.75;
  const yTop = 2.75;
  const seg = (ax, ay, az, bx, by, bz) => {
    const line = mkLines('bfp_wire_seg', [new THREE.Vector3(ax, ay, az), new THREE.Vector3(bx, by, bz)], new THREE.Color(0.15, 0.75, 1), 0.2);
    line.userData.pickable = false;
    wireGroup.add(line);
  };
  seg(-half, yBot, -half, half, yBot, -half);
  seg(half, yBot, -half, half, yBot, half);
  seg(half, yBot, half, -half, yBot, half);
  seg(-half, yBot, half, -half, yBot, -half);
  seg(-half, yTop, -half, half, yTop, -half);
  seg(half, yTop, -half, half, yTop, half);
  seg(half, yTop, half, -half, yTop, half);
  seg(-half, yTop, half, -half, yTop, -half);
  seg(-half, yBot, -half, -half, yTop, -half);
  seg(half, yBot, -half, half, yTop, -half);
  seg(half, yBot, half, half, yTop, half);
  seg(-half, yBot, half, -half, yTop, half);
  _buildFootprint.add(wireGroup);
  _buildGhostObserver = addBeforeRender(() => {
    if (!_buildGhost) return;
    if (_ghostPending) {
      _ghostPending = false;
      _moveBuildGhost(_ghostPendingX, _ghostPendingY);
    }
    _buildGhostT += getDeltaTime();
    const alpha = 0.18 + 0.06 * Math.sin(_buildGhostT * 3.5);
    // Materials are already transparent (see makeGhostMesh); only opacity pulses.
    for (let i = 0; i < _buildGhostMeshes.length; i++) {
      _buildGhostMeshes[i].material.opacity = alpha;
    }
    if (_buildFootprint) {
      _buildFootprint.position.x = _buildGhost.position.x;
      _buildFootprint.position.z = _buildGhost.position.z;
    }
  });
}


export function _moveBuildGhost(sx, sy) {
  if (!_buildGhost) return;
  if (buildMode === 'listening_post') {
    const hit = pickMesh(sx, sy);
    const spId = hit?.meta?.strategicPointEntityId;
    const sp = spId !== undefined ? world.get(spId, 'strategicPoint') : null;
    if (sp) {
      _buildGhost.position.set(sp.position.x, 0, sp.position.z);
      return;
    }
  }
  // O(1) math-plane hit instead of a full-scene raycast: the ghost sits at
  // y=0, so the plane gives the same placement with no triangle tests.
  if (!scene || !camera || !canvas) return;
  screenToNDC(sx, sy, canvas.getBoundingClientRect(), _ghostNdc);
  const point = intersectGroundPlane(_ghostNdc, camera, _ghostHit);
  if (!point) return;
  clampGhostPos(point.x, point.z, currentBounds(), point);
  _buildGhost.position.set(point.x, 0, point.z);
}


export function startBuild(type) {
  if (requisition < COSTS[type]) return;
  setBuildMode(type);
  canvas.style.cursor = 'crosshair';
  _startBuildGhost(type);
}


export function cancelBuild() {
  setBuildMode(null);
  canvas.style.cursor = '';
  _stopBuildGhost();
}

// Deferred ghost placement: the pointer handler stores coords through
// this instead of assigning the module lets directly (read-only imports).
export function setGhostPending(x, y) {
  _ghostPendingX = x;
  _ghostPendingY = y;
  _ghostPending = true;
}
