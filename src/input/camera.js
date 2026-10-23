import * as THREE from 'three';
import {
  JET_ATTACK_RANGE,
  camera,
  canCommand,
  currentBounds,
  selBuildings,
  selSquads,
  world,
} from '../scene.js';
import { disposeObj, mkTorus } from '../three-helpers.js';
import { getCameraMode } from '../camera-fps.js';


// Hover ring around strategic points + relics (world units). Tweak freely:
// 45% under the 'base' circle mesh inside strategic_point.glb (±3.49 XZ
// at the in-game scale 1.0), so the ring sits well inside the platform.
export const POINT_HOVER_RADIUS = 1.925;

export const POINT_HOVER_SEGMENTS = 48;


// ══════════════════════════════════════════════════════════════════════════════
//  RANGE CIRCLES (A key)
// ══════════════════════════════════════════════════════════════════════════════
export let _rangeCirclesVisible = false;

export const _rangeCircles = [];


export function _hideRangeCircles() {
  _rangeCircles.forEach((circle) => {
    if (circle.material) {
      circle.material.dispose();
    }
    disposeObj(circle);
  });
  _rangeCircles.length = 0;
}


export function _showRangeCircles() {
  _hideRangeCircles();
  const addCircle = (position, radius, r, g, b) => {
    const ring = mkTorus('rangecircle', radius * 2, 0.18, 64);
    ring.position.set(position.x, 0.12, position.z);
    ring.userData.pickable = false;
    const material = new THREE.MeshBasicMaterial();
    material.color = new THREE.Color(r, g, b);
    ring.material = material;
    _rangeCircles.push(ring);
  };

  selSquads.forEach((sid) => {
    const squad = world.get(sid, 'squad');
    if (squad) {
      addCircle(squad.position, squad.attackRange, 0.3, 0.8, 1);
    }
  });

  selBuildings.forEach((id) => {
    const structure = world.get(id, 'structure');
    if (structure && structure.attackRange > 0) {
      addCircle(structure.position, structure.attackRange, 1, 0.8, 0.2);
    }
  });

  world.query('apc').forEach((id) => {
    const apc = world.get(id, 'apc');
    if (apc && apc.selected) {
      addCircle(apc.position, apc.attackRange, 0.2, 1, 0.4);
    }
  });

  world.query('jet').forEach((id) => {
    const jet = world.get(id, 'jet');
    if (jet && canCommand(jet.team) && jet.selected) {
      addCircle(jet.position, JET_ATTACK_RANGE, 0.9, 0.5, 1.0);
    }
  });
}


// ══════════════════════════════════════════════════════════════════════════════
//  CAMERA CONTROL
// ══════════════════════════════════════════════════════════════════════════════
export const keys = {};

export let rightDown = false;

export let rightDragStartPos = { x: 0, y: 0 };

export let rightLastPos = { x: 0, y: 0 };

export let isOrbiting = false;

export let isSelecting = false;

export let selStart = { x: 0, y: 0 };

export let selEnd = { x: 0, y: 0 };

export let altDown = false;

export let altOrbitLast = { x: 0, y: 0 };

export let isAltOrbiting = false;


export let _mouseX = window.innerWidth / 2;

export let _mouseY = window.innerHeight / 2;

export let _mouseEntered = false;

export let _lastHoverPickT = 0;

// Latest ground point under the cursor, cached by _updateCursorCoords so the
// hover-cursor proximity scan reuses the same raycast (no second pick).
export const _lastGroundPt = { x: 0, z: 0, valid: false };


export const CAM_SPD = 64;

export const EDGE_ZONE = 40;


export function tickCamera(deltaTime) {
  // First-person mode rides the soldier: edge pan and arrow keys stay on
  // the orbit rig, look-around is ALT+drag (alpha/beta).
  if (getCameraMode() === 'fps') {
    return;
  }
  const theta = -camera.alpha - Math.PI / 2;
  // three.js renders the same camera numbers as a left-right mirror of the old
  // left-handed view (screen-right is -X here, +X there), so the horizontal
  // pan axis is negated; the toward/away axis is unaffected by mirroring.
  const rx = -Math.cos(theta);
  const rz = Math.sin(theta);
  const fx = Math.sin(theta);
  const fz = Math.cos(theta);
  const speed = CAM_SPD * deltaTime;
  let dx = 0;
  let dz = 0;

  if (_mouseEntered && !isSelecting && !isOrbiting && !isAltOrbiting && !rightDown && document.hasFocus()) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    if (_mouseX < EDGE_ZONE) {
      const factor = 1 - (_mouseX / EDGE_ZONE);
      dx -= rx * speed * factor;
      dz -= rz * speed * factor;
    } else if (_mouseX > width - EDGE_ZONE) {
      const factor = 1 - ((width - _mouseX) / EDGE_ZONE);
      dx += rx * speed * factor;
      dz += rz * speed * factor;
    }
    if (_mouseY < EDGE_ZONE) {
      const factor = 1 - (_mouseY / EDGE_ZONE);
      dx += fx * speed * factor;
      dz += fz * speed * factor;
    } else if (_mouseY > height - EDGE_ZONE) {
      const factor = 1 - ((height - _mouseY) / EDGE_ZONE);
      dx -= fx * speed * factor;
      dz -= fz * speed * factor;
    }
  }

  if (!isSelecting && !isOrbiting && !isAltOrbiting && !rightDown && document.hasFocus()) {
    if (keys['ArrowUp']) {
      dx += fx * speed;
      dz += fz * speed;
    }
    if (keys['ArrowDown']) {
      dx -= fx * speed;
      dz -= fz * speed;
    }
    if (keys['ArrowLeft']) {
      dx -= rx * speed;
      dz -= rz * speed;
    }
    if (keys['ArrowRight']) {
      dx += rx * speed;
      dz += rz * speed;
    }
  }

  if (dx || dz) {
    const panBound = currentBounds() / 2;
    camera.target.x = Math.max(-panBound, Math.min(panBound, camera.target.x + dx));
    camera.target.z = Math.max(-panBound, Math.min(panBound, camera.target.z + dz));
    camera.target.y = 0;
  }
}

// Mutators for the pointer/camera state above. Sibling input modules
// must go through these: ESM imports are read-only bindings, so a direct
// cross-module assignment is a build error (rollup rejects it).
export function setRangeCirclesVisible(value) { _rangeCirclesVisible = value; }
export function setRightDown(value) { rightDown = value; }
export function setRightDragStartPos(value) { rightDragStartPos = value; }
export function setRightLastPos(value) { rightLastPos = value; }
export function setIsOrbiting(value) { isOrbiting = value; }
export function setIsSelecting(value) { isSelecting = value; }
export function setSelStart(value) { selStart = value; }
export function setSelEnd(value) { selEnd = value; }
export function setAltDown(value) { altDown = value; }
export function setAltOrbitLast(value) { altOrbitLast = value; }
export function setIsAltOrbiting(value) { isAltOrbiting = value; }
export function setMouseX(value) { _mouseX = value; }
export function setMouseY(value) { _mouseY = value; }
export function setMouseEntered(value) { _mouseEntered = value; }
export function setLastHoverPickT(value) { _lastHoverPickT = value; }
