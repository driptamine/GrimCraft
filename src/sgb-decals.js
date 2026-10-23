import * as THREE from 'three';

import { scene, canvas, pickAt } from './scene.js';
import { mkPlane, mkLines, mkGroup, disposeObj, loadTexture } from './three-helpers.js';
import { decalBaseSize, decalFlatRotation, drapeDecalLocalZ, decalStoreDirs, decalLayer } from './decal-size.js';

const DECAL_GLOB = import.meta.glob('/maps/**/decals/**/*.{png,jpg,jpeg,webp,tga,dds}', {
  as: 'url',
  eager: true,
});

let _decalRoot = null;
let _decalMeshes = [];
let _decalTextureCache = new Map();
let _decalScale = 6;
// Shown by default: the map's ground detail is part of the look.
let _decalVisible = true;
let _hiddenGroups = new Set();

const DECAL_MAX_HANG = 4;
// Drape tessellation for layout-driven sheets (17×17 verts each).
const DECAL_DRAPE_SEGMENTS = 16;

let _hoverDecal = null;
let _hoverOutline = null;
let _decalHoverEnabled = false;
let _selectedDecal = null;
let _selectedOutline = null;
let _decalPointerReady = false;

const OUTLINE_HOVER = new THREE.Color(1, 0.9, 0.2);
const OUTLINE_SELECT = new THREE.Color(1, 0.3, 0.3);

function _makeOutline(mesh, color) {
  // Hover mode OFF suppresses every decal outline (hover yellow + select
  // red). Callers store the null; _disposeOutline tolerates it.
  if (!_decalHoverEnabled) return null;
  const half = mesh.userData?.side / 2 || 8;
  const z = -0.15;
  const points = [
    new THREE.Vector3(-half, -half, z),
    new THREE.Vector3(half, -half, z),
    new THREE.Vector3(half, half, z),
    new THREE.Vector3(-half, half, z),
    new THREE.Vector3(-half, -half, z),
  ];
  const lines = mkLines('decal-outline-' + mesh.name, points, color, 1);
  mesh.add(lines);
  return lines;
}

function _disposeOutline(outline) {
  if (outline && !(outline.userData.disposed === true)) {
    disposeObj(outline);
  }
}

function _clearHover() {
  _disposeOutline(_hoverOutline);
  _hoverOutline = null;
  _hoverDecal = null;
}

function _clearSelected() {
  _disposeOutline(_selectedOutline);
  _selectedOutline = null;
  _selectedDecal = null;
}

function _selectedLabel() {
  if (!_selectedDecal) {
    return '';
  }
  const meta = _selectedDecal.userData || {};
  const size = Math.round((meta.baseSize || 10) * _decalScale);
  const name = String(meta.decalPath || '').replace(/^art\/decals\//, '') || 'decal';
  return 'SELECTED: ' + name + ' · ' + size + '×' + size;
}

function _notifySelection() {
  window.dispatchEvent(
    new CustomEvent('decal-selected', {
      detail: {
        path: _selectedDecal?.userData?.decalPath || '',
        index: _selectedDecal ? _decalMeshes.indexOf(_selectedDecal) : -1,
      },
    }),
  );
}

export function getSelectedDecalPath() {
  return _selectedDecal?.userData?.decalPath || '';
}

export function getSelectedDecalIndex() {
  if (!_selectedDecal) return -1;
  return _decalMeshes.indexOf(_selectedDecal);
}

export function getPlacedDecalList() {
  const byPath = new Map();
  _decalMeshes.forEach((mesh) => {
    const path = mesh.userData?.decalPath || '';
    if (!path) {
      return;
    }
    const entry = byPath.get(path) || {
      path,
      url: mesh.userData?.decalUrl || '',
      count: 0,
    };
    entry.count += 1;
    byPath.set(path, entry);
  });
  return Array.from(byPath.values()).sort((a, b) => a.path.localeCompare(b.path));
}

export function getDecalGroups() {
  const byPath = new Map();
  _decalMeshes.forEach((mesh, idx) => {
    const path = mesh.userData?.decalPath || '';
    if (!path) return;
    let g = byPath.get(path);
    if (!g) {
      g = { path, url: mesh.userData?.decalUrl || '', count: 0, instances: [] };
      byPath.set(path, g);
    }
    g.count += 1;
    g.instances.push({
      index: idx,
      mesh,
      x: mesh.userData?.x ?? mesh.position.x,
      z: mesh.userData?.z ?? mesh.position.z,
      sizeRaw: mesh.userData?.sizeRaw ?? 0,
      angle: mesh.userData?.angle ?? 0,
      baseSize: mesh.userData?.baseSize ?? 0,
    });
  });
  return Array.from(byPath.values()).sort((a, b) => a.path.localeCompare(b.path));
}

export function selectDecalByPath(path) {
  const decal = _decalMeshes.find((mesh) => mesh.userData?.decalPath === path) || null;
  if (!decal) {
    return;
  }
  _clearSelected();
  _selectedDecal = decal;
  _selectedOutline = _makeOutline(decal, OUTLINE_SELECT);
  _clearHover();
  setSgbDecalStatus(_selectedLabel(), 'ok');
  _notifySelection();
}

export function selectDecalAt(index) {
  const decal = _decalMeshes[index] || null;
  if (!decal) return;
  _clearSelected();
  _selectedDecal = decal;
  _selectedOutline = _makeOutline(decal, OUTLINE_SELECT);
  _clearHover();
  setSgbDecalStatus(_selectedLabel(), 'ok');
  _notifySelection();
}

export function selectDecal(mesh) {
  if (!mesh || !_decalMeshes.includes(mesh)) return;
  _clearSelected();
  _selectedDecal = mesh;
  _selectedOutline = _makeOutline(mesh, OUTLINE_SELECT);
  _clearHover();
  setSgbDecalStatus(_selectedLabel(), 'ok');
  _notifySelection();
}

export function getSelectedDecal() {
  return _selectedDecal;
}

export function getSelectedDecalPosition() {
  if (!_selectedDecal) return null;
  return { x: _selectedDecal.position.x, y: _selectedDecal.position.y, z: _selectedDecal.position.z };
}

export function setSelectedDecalPosition({ x, y, z }) {
  if (!_selectedDecal) return false;
  if (typeof x === 'number' && Number.isFinite(x)) {
    _selectedDecal.position.x = x;
    _selectedDecal.userData.x = x;
  }
  if (typeof y === 'number' && Number.isFinite(y)) {
    _selectedDecal.position.y = y;
    _selectedDecal.userData.y = y;
  }
  if (typeof z === 'number' && Number.isFinite(z)) {
    _selectedDecal.position.z = z;
    _selectedDecal.userData.z = z;
  }
  setSgbDecalStatus(_selectedLabel(), 'ok');
  window.dispatchEvent(
    new CustomEvent('decal-moved', {
      detail: {
        x: _selectedDecal.position.x,
        y: _selectedDecal.position.y,
        z: _selectedDecal.position.z,
        index: _decalMeshes.indexOf(_selectedDecal),
        path: _selectedDecal.userData?.decalPath || '',
      },
    }),
  );
  return true;
}

function _decalForPicked(picked) {
  if (!picked) {
    return null;
  }
  if (_decalMeshes.includes(picked)) {
    return picked;
  }
  const owner = String(picked.name || '').startsWith('decal-outline-')
    ? picked.parent
    : null;
  if (owner && _decalMeshes.includes(owner)) {
    return owner;
  }
  return null;
}

function setupDecalPointerActions() {
  if (_decalPointerReady) {
    return;
  }
  _decalPointerReady = true;
  const pickDecal = (event) => {
    const hit = pickAt(event.clientX, event.clientY, (mesh) => _decalMeshes.includes(mesh));
    return _decalForPicked(hit.pickedMesh || null);
  };
  canvas.addEventListener('pointermove', (event) => {
    if (!_decalHoverEnabled) {
      if (_hoverDecal) _clearHover();
      return;
    }
    const decal = pickDecal(event);
    if (decal && _hoverDecal !== decal) {
      _clearHover();
      if (decal !== _selectedDecal) {
        _hoverDecal = decal;
        _hoverOutline = _makeOutline(decal, OUTLINE_HOVER);
      }
    } else if (!decal) {
      _clearHover();
    }
  });
  canvas.addEventListener('click', (event) => {
    const decal = pickDecal(event);
    if (!decal) {
      _clearSelected();
      _notifySelection();
      return;
    }
    if (_selectedDecal === decal) {
      _clearSelected();
      _notifySelection();
      return;
    }
    _clearSelected();
    _selectedDecal = decal;
    _selectedOutline = _makeOutline(decal, OUTLINE_SELECT);
    _clearHover();
    setSgbDecalStatus(_selectedLabel(), 'ok');
    _notifySelection();
  });
}

// Re-attach canvas listeners after a render-backend swap replaces the canvas.
export function rebindDecalPointerActions() {
  _decalPointerReady = false;
  setupDecalPointerActions();
}

function setSgbDecalStatus(msg, className = '') {
  const element = document.getElementById('terrain-decal-status');
  if (!element) {
    return;
  }
  element.textContent = msg;
  element.className = 'terrain-status' + (className ? ' ' + className : '');
}

function fileUrlForDecalPath(path) {
  const rel = String(path || '')
    .replace(/^art\/decals\//, '')
    .replace(/\.(tga|dds|png|jpe?g|webp)$/i, '');
  if (!rel) return null;
  const mapKey = (typeof window !== 'undefined' && window._currentMapKey) || '';
  for (const dir of decalStoreDirs(mapKey)) {
    for (const ext of ['.png', '.tga', '.dds', '.jpg', '.webp']) {
      const key = dir + rel + ext;
      if (DECAL_GLOB[key]) return DECAL_GLOB[key];
    }
  }
  return null; // unresolved: caller skips (no black 404 planes)
}

function _createDecalMaterial(url, idx) {
  const mat = new THREE.MeshBasicMaterial();
  // Do not tint the texture — unlit white base; transparent alpha-blend just
  // like the old ALPHABLEND path so semi-transparent PNG pixels survive.
  mat.color = new THREE.Color(1, 1, 1);
  mat.side = THREE.DoubleSide;
  let texture = _decalTextureCache.get(url);
  if (!texture) {
    texture = loadTexture(url, {
      onError: (msg) => {
        console.warn('[decal] texture failed', url, msg);
      },
    });
    _decalTextureCache.set(url, texture);
  }
  // Layering like chaos_taint_02 — alpha-blend over the PNG alpha channel,
  // otherwise alpha-test eats 60% of semi-transparent pixels and the decals
  // look washed out / shifted.
  mat.map = texture;
  mat.transparent = true;
  // No depth writes: overlapping sheets blend in fixed renderOrder instead
  // of occluding each other (that swap is the edge-scroll flicker).
  // depthTest stays on so terrain/units still occlude decals correctly.
  mat.depthWrite = false;
  mat.polygonOffset = true;
  mat.polygonOffsetFactor = -2;
  return mat;
}

export function clearSgbDecals() {
  _clearHover();
  _clearSelected();
  (_decalMeshes || []).forEach((mesh) => {
    if (!(mesh.userData.disposed === true)) {
      disposeObj(mesh, true);
    }
  });
  _decalMeshes = [];
  _hiddenGroups.clear();
  _decalTextureCache.forEach((t) => disposeObj(t));
  _decalTextureCache = new Map();
  if (_decalRoot && !(_decalRoot.userData.disposed === true)) {
    disposeObj(_decalRoot);
  }
  _decalRoot = null;
}

export function isDecalGroupVisible(path) {
  return !_hiddenGroups.has(path);
}

export function setDecalGroupVisible(path, visible) {
  if (!path) return;
  if (visible) _hiddenGroups.delete(path);
  else _hiddenGroups.add(path);
  if (visible && !_decalVisible) {
    // Showing a group from the tab must appear on scene: if the user
    // turned the master switch off, lift it with full toggle semantics
    // (re-applies every per-group flag, syncs labels + status).
    toggleSgbDecals();
  }
  const effectiveVisible = visible && _decalVisible;
  _decalMeshes.forEach((m) => {
    if (m.userData?.decalPath === path) m.visible = effectiveVisible;
  });
  window.dispatchEvent(
    new CustomEvent('decal-group-visibility', { detail: { path, visible } }),
  );
}

export function toggleDecalGroup(path) {
  const next = !isDecalGroupVisible(path);
  setDecalGroupVisible(path, next);
  return next;
}

// Re-bake the terrain drape from the inputs stored in userData.drape.
// Called at build time and after every scale-slider resize (XZ stretch
// would otherwise detach the sheet from the relief). Recomputes the
// bounding sphere so frustum culling and picking stay correct.
function _drapeDecalPlane(plane) {
  const drape = plane.userData?.drape;
  const posAttr = plane.geometry?.attributes?.position;
  if (!drape || !posAttr) {
    return;
  }
  const { yaw, centerX, centerZ, centerH, sampleHeight } = drape;
  const scaleX = plane.scale.x;
  const scaleY = plane.scale.y;
  for (let i = 0; i < posAttr.count; i += 1) {
    // lift 0: the mesh origin already carries the +0.08 sheet offset.
    posAttr.setZ(i, drapeDecalLocalZ(posAttr.getX(i), posAttr.getY(i), {
      scaleX, scaleY, yaw, centerX, centerZ, centerH, sampleHeight, lift: 0,
    }));
  }
  posAttr.needsUpdate = true;
  plane.geometry.computeBoundingSphere();
}

export function updateSgbDecalScale(value) {
  _decalScale = parseFloat(value) || 300;
  const el = document.getElementById('terrain-decal-scale-val');
  if (el) {
    el.textContent = Math.round(_decalScale);
  }
  _decalMeshes.forEach((mesh) => {
    mesh.scale.setScalar(1);
    const base = mesh.userData?.baseSize || 10;
    const size = base * _decalScale;
    mesh.scale.x = size / mesh.userData.side;
    mesh.scale.y = size / mesh.userData.side;
    _drapeDecalPlane(mesh);
  });
  setSgbDecalStatus('DECAL SCALE ' + Math.round(_decalScale), '');
}

function setDecalButtonLabel() {
  // every master switch (terrain panel + decals tab) stays in sync
  document.querySelectorAll('[data-decal-toggle]').forEach((button) => {
    button.textContent = _decalVisible ? '👁 DECALS: HIDE' : '👁 DECALS: SHOW';
  });
}

export function areSgbDecalsVisible() {
  return _decalVisible;
}

export function isDecalHoverEnabled() {
  return _decalHoverEnabled;
}

function setDecalHoverLabel() {
  document.querySelectorAll('[data-decal-hover]').forEach((button) => {
    button.textContent = _decalHoverEnabled ? '◈ HOVER: ON' : '◈ HOVER: OFF';
  });
}

export function toggleDecalHover() {
  _decalHoverEnabled = !_decalHoverEnabled;
  if (!_decalHoverEnabled) {
    _clearHover();
    // drop the red select visual too, but keep _selectedDecal state so the
    // panel and position sliders keep working; hide the hover name pill.
    _disposeOutline(_selectedOutline);
    _selectedOutline = null;
    const tip = document.getElementById('decalHoverTip');
    if (tip) tip.style.display = 'none';
  } else if (_selectedDecal) {
    _selectedOutline = _makeOutline(_selectedDecal, OUTLINE_SELECT);
  }
  setDecalHoverLabel();
  return _decalHoverEnabled;
}

export function toggleSgbDecals() {
  _decalVisible = !_decalVisible;
  if (_decalRoot && !(_decalRoot.userData.disposed === true)) {
    _decalRoot.visible = _decalVisible;
  }
  _decalMeshes.forEach((m) => {
    const path = m.userData?.decalPath || '';
    const groupVisible = !_hiddenGroups.has(path);
    m.visible = _decalVisible && groupVisible;
  });
  if (!_decalVisible) {
    _clearHover();
    _clearSelected();
  } else if (_selectedDecal) {
    _selectedOutline = _makeOutline(_selectedDecal, OUTLINE_SELECT);
  }
  setSgbDecalStatus(
    _decalVisible ? 'DECALS ON' : 'DECALS OFF',
    _decalVisible ? '' : '',
  );
  setDecalButtonLabel();
}

export function buildSgbDecals(root, mapData, sampleHeight) {
  clearSgbDecals();
  const linkById = new Map(
    (mapData?.decalLinks || []).map((link) => [link.id, link.path]),
  );
  const records = mapData?.decals || [];
  // Build every record whose texture resolves; skip the rest (missing
  // biome assets would 404 into black planes).
  const decals = records.filter((decal) => {
    const path = linkById.get(decal.decalIdx) || '';
    return fileUrlForDecalPath(path) !== null;
  });
  if (!root || !decals.length) {
    setSgbDecalStatus(
      !root ? 'NO SCENE ROOT' : records.length ? 'NO DECAL TEXTURES' : 'NO DECALS IN THIS SGB',
      'err',
    );
    return;
  }
  _decalRoot = mkGroup('SGB_Decals');
  root.add(_decalRoot);
  _decalRoot.visible = _decalVisible;

  const materialByPath = new Map();

  decals.forEach((decal, i) => {
    const path = linkById.get(decal.decalIdx) || '';
    const url = fileUrlForDecalPath(path);
    let material = materialByPath.get(url);
    if (!material) {
      material = _createDecalMaterial(url, i);
      materialByPath.set(url, material);
    }
    // Per-decal SGB size respected; chaos keeps the legacy flat size.
    const baseSize = decalBaseSize(path, decal.size);
    const side = 16;
    const size = baseSize * _decalScale;
    const half = size / 2;
    if (sampleHeight) {
      const center = sampleHeight(decal.x, decal.z);
      const corners = [
        sampleHeight(decal.x - half, decal.z - half),
        sampleHeight(decal.x + half, decal.z - half),
        sampleHeight(decal.x - half, decal.z + half),
        sampleHeight(decal.x + half, decal.z + half),
      ];
      const hang = center - Math.min(...corners);
      if (hang > DECAL_MAX_HANG) {
        return;
      }
    }
    const plane = mkPlane('SGB_Decal_' + i, side, side, true);
    _decalRoot.add(plane);
    plane.material = material;
    // Fixed draw sequence (negative: before all other transparents): kills
    // the per-frame resort flicker between overlapping sheets.
    plane.renderOrder = -100000 + decalLayer(path) * 10000 + i;
    plane.userData = { baseSize, side, decalPath: path, decalUrl: url, x: decal.x, z: decal.z, sizeRaw: decal.size, angle: decal.angle };
    // nestle just above ground so decal looks layered onto surface like chaos_taint_02 ground sheet (zOffset handles z-fighting)
    plane.position.set(decal.x, sampleHeight(decal.x, decal.z) + 0.08, decal.z);
    const rot = decalFlatRotation(decal.angle);
    plane.rotation.set(rot.x, rot.y, rot.z);

    plane.scale.x = size / side;
    plane.scale.y = size / side;
    _decalMeshes.push(plane);
  });

  const byType = new Map();
  _decalMeshes.forEach((mesh) => {
    byType.set(mesh.material?.name, (byType.get(mesh.material?.name) || 0) + 1);
  });
  setSgbDecalStatus(
    '✓ ' + _decalMeshes.length + ' SGB DECALS PLACED · SCALE ' + Math.round(_decalScale),
    'ok',
  );
  setDecalButtonLabel();
  setupDecalPointerActions();
  window.dispatchEvent(new CustomEvent('decal-list-changed'));
}

/**
 * Layout-driven decals — placed from maps/*_layout_upd.json (world x/z,
 * size_raw, rotation_rad) so they share the same surface attachment as the
 * per-map ground sheet (terrain.ground_texture). Scale follows the same
 * _decalScale slider; at the default 6 a size_raw of 0.05 ≈ 25 world units.
 */
export function buildSgbDecalsFromLayout(root, layout, sampleHeight) {
  clearSgbDecals();
  const entries = layout?.decals || [];
  const decals = entries.map((d) => {
    const path = d.ref || '';
    return {
      path,
      url: fileUrlForDecalPath(path),
      x: d.x,
      z: d.z,
      sizeRaw: d.size_raw,
      angle: d.rotation_rad,
    };
  }).filter((d) => d.url !== null);
  if (!root || !decals.length) {
    setSgbDecalStatus(
      !root ? 'NO SCENE ROOT' : entries.length ? 'NO DECAL TEXTURES' : 'NO DECALS IN LAYOUT',
      'err',
    );
    return;
  }
  _decalRoot = mkGroup('SGB_Decals');
  root.add(_decalRoot);
  _decalRoot.visible = _decalVisible;

  const materialByUrl = new Map();

  decals.forEach((decal, i) => {
    let material = materialByUrl.get(decal.url);
    if (!material) {
      material = _createDecalMaterial(decal.url, i);
      materialByUrl.set(decal.url, material);
    }
    const side = 16;
    const baseSize = decal.sizeRaw * 1000 / 12;
    const size = baseSize * _decalScale;
    // позиции из maps/6p_alvarus/6p_alvarus_preview.png (x,z) — прямые мировые, без смещения; наслоение как у chaos_taint_02 — плоскость 0.08 над землёй
    const plane = mkPlane(`SGB_Decal_${i}`, side, side, true);
    // Subdivided sheet so it can drape onto the relief (a rigid flat quad
    // spanning 20-120 units over 38 units of relief floats or buries its
    // edges — chaos taint hung +7 above ground).
    plane.geometry.dispose();
    plane.geometry = new THREE.PlaneGeometry(side, side, DECAL_DRAPE_SEGMENTS, DECAL_DRAPE_SEGMENTS);
    _decalRoot.add(plane);
    plane.material = material;
    // Fixed draw sequence (negative: before all other transparents): kills
    // the per-frame resort flicker between overlapping sheets.
    plane.renderOrder = -100000 + decalLayer(decal.path) * 10000 + i;
    plane.userData = { baseSize, side, decalPath: decal.path, decalUrl: decal.url, x: decal.x, z: decal.z, sizeRaw: decal.sizeRaw, angle: decal.angle };
    const y = sampleHeight ? sampleHeight(decal.x, decal.z) + 0.08 : 0.08;
    plane.position.set(decal.x, y, decal.z);
    const rot = decalFlatRotation(decal.angle);
    plane.rotation.set(rot.x, rot.y, rot.z);

    plane.scale.x = size / side;
    plane.scale.y = size / side;
    plane.userData.drape = sampleHeight ? {
      yaw: rot.z, centerX: decal.x, centerZ: decal.z,
      centerH: y - 0.08, sampleHeight,
    } : null;
    _drapeDecalPlane(plane);
    _decalMeshes.push(plane);
  });

  const byType = new Map();
  _decalMeshes.forEach((mesh) => {
    byType.set(mesh.material?.name, (byType.get(mesh.material?.name) || 0) + 1);
  });
  setSgbDecalStatus(
    '✓ ' + _decalMeshes.length + ' LAYOUT DECALS PLACED · SCALE ' + Math.round(_decalScale),
    'ok',
  );
  setDecalButtonLabel();
  setupDecalPointerActions();
  window.dispatchEvent(new CustomEvent('decal-list-changed'));
}