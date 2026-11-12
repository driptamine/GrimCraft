import * as THREE from 'three';
import { clampGhostPos, intersectGroundPlane, screenToNDC } from '../ui/ghost-place.js';
import { makeGhostMesh, canPlaceListeningPost } from '../meshes.js';
import { _groundAt } from '../systems/terrain.js';
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
} from '../core/scene.js';
import {
  childMeshes,
  disposeObj,
  mkBox,
} from '../render/three-helpers.js';
import { pickMesh } from './selection.js';
import { _mouseX, _mouseY } from './camera.js';


export let _buildGhost: THREE.Group | null | undefined = null;

export let _buildGhostObserver: unknown = null;

export let _buildGhostT = 0;

export let _buildFootprint: THREE.Mesh | null = null;

export let _buildGhostMeshes: THREE.Mesh[] = [];
export let _listeningPostGhostTarget: number | null = null;
const _previewBoxOffset = new THREE.Vector3();
interface ListeningPostPointPreview {
  ghost: THREE.Group;
  footprint: THREE.Mesh;
  meshes: THREE.Mesh[];
}
export const _listeningPostPointPreviews = new Map<number, ListeningPostPointPreview>();
const _previewBoxSize = new THREE.Vector3();

// Deferred ghost placement: mousemove only stores coords, the per-frame
// observer applies them, so high-frequency mice can't fire several
// full-scene raycasts between renders.
export let _ghostPendingX = 0;

export let _ghostPendingY = 0;

export let _ghostPending = false;

export const _ghostNdc = new THREE.Vector2();

export const _ghostHit = new THREE.Vector3();

export function _disposeGhostMeshTree(node: THREE.Object3D | null | undefined): void {
  if (!node) return;
  childMeshes(node).forEach((mesh) => {
    for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) material?.dispose();
    disposeObj(mesh);
  });
  (node as any)._instanceData?.dispose();
  disposeObj(node);
}

/** Finished visible geometry, without selection bars, shadows or hidden construction props. */
export function visibleGhostBounds(root: THREE.Object3D): THREE.Box3 {
  const original = root.position.clone();root.position.set(0, 0, 0);root.updateWorldMatrix(true, true);root.updateMatrixWorld(true);
  const bounds = new THREE.Box3();
  root.traverse((node: any) => {
    if (!node.isMesh || node._isSelRingBar || /shadow/i.test(node.name)) return;
    for (let parent = node; parent; parent = parent.parent) {
      if (!parent.visible) return;
      if (parent === root) break;
    }
    if (node.isSkinnedMesh) {
      node.skeleton.update();node.computeBoundingBox();
      bounds.union(node.boundingBox.clone().applyMatrix4(node.matrixWorld));
    } else {
      node.geometry.computeBoundingBox();bounds.union(node.geometry.boundingBox.clone().applyMatrix4(node.matrixWorld));
    }
  });
  root.position.copy(original);root.updateWorldMatrix(true, true);root.updateMatrixWorld(true);
  if (!bounds.isEmpty()) bounds.min.y = Math.max(0, Math.min(bounds.min.y, bounds.max.y - .1));
  return bounds;
}

function syncPreviewBox(): void {
  if (_buildGhost && _buildFootprint) {
    _buildFootprint.position.copy(_buildGhost.position).add(_previewBoxOffset);
    _buildFootprint.visible = _buildGhost.visible;
  }
}

export function nearestListeningPostPreviewTarget(origin: { x: number; z: number }, range = Infinity): number | null {
  const builder = selBuilder != null ? world?.get(selBuilder, 'builder') : null;
  if (!builder) return null;
  let closest: number | null = null, distance = range;
  for (const id of world.query('strategicPoint')) {
    const point = world.get(id, 'strategicPoint');
    if (!canPlaceListeningPost(point, builder.team)) continue;
    const next = Math.hypot(point.position.x - origin.x, point.position.z - origin.z);
    if (next <= distance) { distance = next;closest = id; }
  }
  return closest;
}

function disposeListeningPostPointPreview(preview: ListeningPostPointPreview): void {
  const meshes = new Set(preview.meshes);
  _buildGhostMeshes = _buildGhostMeshes.filter(mesh => !meshes.has(mesh));
  _disposeGhostMeshTree(preview.ghost);
  disposePreviewBox(preview.footprint);
}

function updateListeningPostPointPreviews(): void {
  const builder = selBuilder != null ? world?.get(selBuilder, 'builder') : null;
  const eligible = new Set<number>();
  if (builder && builder.hp > 0) {
    for (const pointId of world.query('strategicPoint')) {
      const point = world.get(pointId, 'strategicPoint');
      if (!canPlaceListeningPost(point, builder.team)) continue;
      eligible.add(pointId);
      let preview = _listeningPostPointPreviews.get(pointId);
      if (!preview) {
        const ghost = makeGhostMesh('listening_post', new THREE.Vector3(0, -999, 0), { faction: builder.faction }, builder.team, { completedPose: true });
        if (!ghost) continue;
        const meshes = childMeshes(ghost);
        meshes.forEach(mesh => configureGhostMesh(mesh, 'listening_post'));
        preview = { ghost, footprint: createPreviewBox(_previewBoxSize, 'listening_post'), meshes };
        _listeningPostPointPreviews.set(pointId, preview);
      }
      const height = world.get(pointId, 'mesh')?.root?.position.y ?? _groundAt(point.position.x, point.position.z);
      preview.ghost.position.set(point.position.x, height, point.position.z);
      preview.footprint.position.copy(preview.ghost.position).add(_previewBoxOffset);
      preview.ghost.visible = preview.footprint.visible = true;
    }
  }
  for (const [pointId, preview] of _listeningPostPointPreviews) {
    if (eligible.has(pointId)) continue;
    disposeListeningPostPointPreview(preview);
    _listeningPostPointPreviews.delete(pointId);
  }
}

function snapCursorPreviewToPoint(): boolean {
  const builder = selBuilder != null ? world?.get(selBuilder, 'builder') : null;
  const point = _listeningPostGhostTarget != null ? world?.get(_listeningPostGhostTarget, 'strategicPoint') : null;
  if (!_buildGhost || !canPlaceListeningPost(point, builder?.team)) return false;
  const height = world.get(_listeningPostGhostTarget, 'mesh')?.root?.position.y ?? _groundAt(point.position.x, point.position.z);
  _buildGhost.position.set(point.position.x, height, point.position.z);
  _buildGhost.visible = true;syncPreviewBox();
  return true;
}

function configureGhostMesh(mesh: THREE.Mesh, type: string): void {
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  mesh.frustumCulled = false;
  if (/shadow/i.test(mesh.name)) { mesh.visible = false;return; }
  if (!mesh.material) return;
  // makeGhostMesh clones materials; both previews keep the source model intact.
  const previewGreen = new THREE.Color(0.15, 1.0, 0.3);
  const material = mesh.material as THREE.MeshStandardMaterial;
  if (material.isMeshStandardMaterial) material.emissive.copy(previewGreen);
  else if (material.color) material.color.copy(previewGreen);
  if (type === 'listening_post') {
    material.depthTest = false;material.depthWrite = false;mesh.renderOrder = 10;
    material.map = null;material.alphaMap = null;material.alphaTest = 0;material.side = THREE.DoubleSide;
    if (material.isMeshStandardMaterial) {
      material.emissiveMap = null;material.color.copy(previewGreen);material.emissive.copy(previewGreen).multiplyScalar(.35);
    }
    material.needsUpdate = true;
  }
  _buildGhostMeshes.push(mesh);
}

function createPreviewBox(size: THREE.Vector3, type: string): THREE.Mesh {
  const box = mkBox('bfp_fill', size.x, size.y, size.z);
  const fillMaterial = new THREE.MeshBasicMaterial({ color: 0x0d59cc, opacity: .3, transparent: true, depthWrite: false });
  fillMaterial.color.setRGB(.05, .35, .8);
  box.material = fillMaterial;
  if (type === 'listening_post') box.renderOrder = 8;
  box.userData.pickable = false;
  const wire = new THREE.LineSegments(new THREE.EdgesGeometry(box.geometry), new THREE.LineBasicMaterial({ color: 0x26bfff, transparent: true, opacity: .65 }));
  wire.name = 'bfp_wire';wire.userData.pickable = false;wire.renderOrder = 11;box.add(wire);
  box.visible = false;
  return box;
}

function disposePreviewBox(box: THREE.Mesh | null): void {
  if (!box) return;
  box.traverse((node: any) => {
    for (const material of Array.isArray(node.material) ? node.material : [node.material]) material?.dispose();
  });
  disposeObj(box);
}


export function _getFootprintDiameter(type: string): number {
  return (type === 'thermoGen' || type === 'thermo_generator' || type === 'plasma_generator') ? 7
    : (type === 'barracks' || type === 'infantry_command' || type === 'mechanized' || type === 'mars_pattern' || type === 'tactica_control') ? 7
    : (type === 'towerBase') ? 6
    : (type === 'gunTurret') ? 5.5
    : (type === 'mines') ? 4
    : 5.5;
}


export function _stopBuildGhost(): void {
  if (_buildGhostObserver) {
    removeBeforeRender(_buildGhostObserver);
    _buildGhostObserver = null;
  }
  if (_buildGhost) {
    _disposeGhostMeshTree(_buildGhost);
    _buildGhost = null;
  }
  disposePreviewBox(_buildFootprint);
  _buildFootprint = null;
  for (const preview of _listeningPostPointPreviews.values()) disposeListeningPostPointPreview(preview);
  _listeningPostPointPreviews.clear();
  _buildGhostMeshes = [];
  _listeningPostGhostTarget = null;
  _ghostPending = false;
}


export function _startBuildGhost(type: string): void {
  _stopBuildGhost();
  const dummy = new THREE.Vector3(0, -999, 0);
  const builder = selBuilder !== null && world ? world.get(selBuilder, 'builder') : null;
  _buildGhost = makeGhostMesh(type, dummy, builder?.faction ? { faction: builder.faction } : {}, builder?.team, { completedPose: true });
  if (!_buildGhost) return;
  _buildGhostT = 0;
  // Ghosts never touch the shadow map, and the pulse loop reuses one cached
  // mesh list instead of traversing the subtree every frame.
  _buildGhostMeshes = [];
  childMeshes(_buildGhost).forEach(mesh => configureGhostMesh(mesh, type));
  _ghostPending = false;
  const bounds = visibleGhostBounds(_buildGhost), fallback = _getFootprintDiameter(type) * 1.15;
  if (bounds.isEmpty()) bounds.set(new THREE.Vector3(-fallback / 2, 0, -fallback / 2), new THREE.Vector3(fallback / 2, 5.5, fallback / 2));
  const size = bounds.getSize(_previewBoxSize);bounds.getCenter(_previewBoxOffset);
  _buildFootprint = createPreviewBox(size, type);
  _buildGhost.visible = false;
  if (type === 'listening_post') {
    const rect = canvas!.getBoundingClientRect();
    _moveBuildGhost(Number.isFinite(_mouseX) ? _mouseX : rect.left + rect.width / 2,
      Number.isFinite(_mouseY) ? _mouseY : rect.top + rect.height / 2);
    updateListeningPostPointPreviews();
  }
  _buildGhostObserver = addBeforeRender(() => {
    if (!_buildGhost) return;
    if (_ghostPending) {
      _ghostPending = false;
      _moveBuildGhost(_ghostPendingX, _ghostPendingY);
    }
    _buildGhostT += getDeltaTime();
    const alpha = (type === 'listening_post' ? .3 : .18) + .06 * Math.sin(_buildGhostT * 3.5);
    // Materials are already transparent (see makeGhostMesh); only opacity pulses.
    for (let i = 0; i < _buildGhostMeshes.length; i++) {
      // @ts-expect-error ghost materials are single (see makeGhostMesh); the union type can't see that
      _buildGhostMeshes[i].material.opacity = alpha;
    }
    if (type === 'listening_post') {
      updateListeningPostPointPreviews();
      if (_listeningPostGhostTarget != null && !snapCursorPreviewToPoint()) _moveBuildGhost(_ghostPendingX, _ghostPendingY);
    }
    syncPreviewBox();
  });
}


export function _moveBuildGhost(sx: number, sy: number): void {
  if (!_buildGhost) return;
  _ghostPendingX = sx;_ghostPendingY = sy;
  // O(1) math-plane hit instead of a full-scene raycast: the ghost sits at
  // y=0, so the plane gives the same placement with no triangle tests.
  if (!scene || !camera || !canvas) return;
  screenToNDC(sx, sy, canvas.getBoundingClientRect(), _ghostNdc);
  const point = intersectGroundPlane(_ghostNdc, camera, _ghostHit);
  if (!point) return;
  if (buildMode === 'listening_post') {
    const hit = pickMesh(sx, sy);
    const hitId = hit?.meta?.strategicPointEntityId;
    const builder = selBuilder != null ? world?.get(selBuilder, 'builder') : null;
    const hoveredPoint = hitId != null ? world?.get(hitId, 'strategicPoint') : null;
    _listeningPostGhostTarget = canPlaceListeningPost(hoveredPoint, builder?.team) ? hitId
      : nearestListeningPostPreviewTarget(point, 4.5);
    updateListeningPostPointPreviews();
    if (snapCursorPreviewToPoint()) return;
  }
  clampGhostPos(point.x, point.z, currentBounds(), point);
  _buildGhost.position.set(point.x, buildMode === 'listening_post' ? _groundAt(point.x, point.z) : 0, point.z);
  _buildGhost.visible = true;syncPreviewBox();
}


export function startBuild(type: string): void {
  if (requisition < COSTS[type as keyof typeof COSTS]) return;
  setBuildMode(type);
  canvas!.style.cursor = 'crosshair';
  _startBuildGhost(type);
}


export function cancelBuild(): void {
  setBuildMode(null);
  canvas!.style.cursor = '';
  _stopBuildGhost();
}

// Deferred ghost placement: the pointer handler stores coords through
// this instead of assigning the module lets directly (read-only imports).
export function setGhostPending(x: number, y: number): void {
  _ghostPendingX = x;
  _ghostPendingY = y;
  _ghostPending = true;
}
