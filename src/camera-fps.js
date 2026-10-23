import * as THREE from 'three';
import { camera, canvas, selSquads, world } from './scene.js';

// First-person camera: rides the head of the first living soldier of the
// first selected squad, looking along the squad facing. ALT+drag keeps
// working as look-around (it just tweaks alpha/beta, which the FPS view
// reads as yaw/pitch). Losing the soldier (death, deselect) drops back to
// orbit automatically. Uses the orbit rig's own yaw convention so the drag
// feel matches: view dir = -(cos α, sin α) horizontally.

export const CAMERA_MODES = ['orbit', 'fps', 'third'];

// GTA-style ride modes: first person through the soldier's eyes, third
// person from behind his shoulder. Both steer by mouse-look, drive by
// WASD/IJKL and fire by LMB.
export function isShooterMode() {
  return _cameraMode === 'fps' || _cameraMode === 'third';
}

const FPS_EYE_HEIGHT = 1.6;
const FPS_FORWARD_OFFSET = 0.6;
const FPS_LOOK_DISTANCE = 10;
// Viewmodel mount, posed interactively in game (P key + sliders).
// Defaults below are the player's tuned pose.
const FPS_GUN_POS = [0.331, -0.108, -0.994];
const FPS_GUN_YAW = 0.068;
const FPS_GUN_PITCH = 0.259;
const FPS_GUN_ROLL = -0.552;
const FPS_GUN_SCALE = 1;
const _gunMountPos = new THREE.Vector3(...FPS_GUN_POS);
const _gunMountEuler = new THREE.Euler(FPS_GUN_PITCH, FPS_GUN_YAW, FPS_GUN_ROLL);
const _gunMountQuat = new THREE.Quaternion();
let _gunMountScale = FPS_GUN_SCALE;
function refreshGunMountQuat() {
  _gunMountQuat.setFromEuler(_gunMountEuler);
}
refreshGunMountQuat();

// In-game posing persists across reloads; C copies a snippet to hardcode.
export const GUN_POSE_STORAGE_KEY = 'grimcraftFpsGunPose';
try {
  if (typeof localStorage !== 'undefined') {
    const saved = JSON.parse(localStorage.getItem(GUN_POSE_STORAGE_KEY) || 'null');
    if (saved) {
      if (Array.isArray(saved.pos)) _gunMountPos.fromArray(saved.pos);
      if (Array.isArray(saved.rot)) _gunMountEuler.set(saved.rot[0], saved.rot[1], saved.rot[2]);
      if (Number.isFinite(saved.scale)) _gunMountScale = saved.scale;
      refreshGunMountQuat();
    }
  }
} catch (_) {}

// Test seam: reset the interactive pose.
export function _setGunPoseForTests(pos, rot, scale) {
  if (pos) _gunMountPos.set(pos[0], pos[1], pos[2]);
  if (rot) _gunMountEuler.set(rot[0], rot[1], rot[2]);
  if (scale !== undefined) _gunMountScale = scale;
  refreshGunMountQuat();
}
const FPS_NEAR = 0.05;
const ORBIT_NEAR = 0.5;

let _cameraMode = 'orbit';

export function getCameraMode() {
  return _cameraMode;
}

// First living soldier of the first selected squad, or null. Pure given
// fakes, so tests can drive it without a scene.
export function resolveFpsTarget(worldObj, selIds) {
  const ids = selIds || [];
  for (const squadId of ids) {
    const squad = worldObj && worldObj.get ? worldObj.get(squadId, 'squad') : null;
    if (!squad || !Array.isArray(squad.soldiers)) continue;
    for (const soldierId of squad.soldiers) {
      if (!soldierId || (worldObj.has && !worldObj.has(soldierId, 'soldier'))) continue;
      const mesh = worldObj.get(soldierId, 'mesh');
      const pos = mesh && mesh.root && mesh.root.position;
      if (!pos) continue;
      const facing = squad.facing || { x: 0, z: 1 };
      return { soldierId, squadId, squad, pos, facing };
    }
  }
  return null;
}

// Orbit yaw whose view direction matches a facing vector.
export function alphaForFacing(fx, fz) {
  const len = Math.hypot(fx, fz) || 1;
  return Math.atan2(-fz / len, -fx / len);
}

// Ride info for the squad system: while riding (fps/third), squadmates
// yield so nobody stands between the camera and the crosshair.
export function getRideInfo() {
  if (!isShooterMode() || !camera) return null;
  const target = resolveFpsTarget(world, selSquads);
  if (!target) return null;
  const sinBeta = Math.sin(camera.beta);
  let dx = -Math.cos(camera.alpha) * sinBeta;
  let dz = -Math.sin(camera.alpha) * sinBeta;
  const len = Math.hypot(dx, dz);
  if (len < 1e-6) {
    const fl = Math.hypot(target.facing.x, target.facing.z) || 1;
    dx = target.facing.x / fl;
    dz = target.facing.z / fl;
  } else {
    dx /= len;
    dz /= len;
  }
  return { squadId: target.squadId, soldierId: target.soldierId, dx, dz };
}

// Pushes a squadmate's formation slot behind the ridden soldier along the
// view axis (fanned sideways so they don't stack). Points already behind,
// far away, or wide of the view corridor pass through untouched (null).
export function yieldSlotBehind(tx, tz, rx, rz, dx, dz, slotIndex) {
  const ox = tx - rx;
  const oz = tz - rz;
  const along = ox * dx + oz * dz;
  const lat = Math.abs(ox * -dz + oz * dx);
  if (along <= -2 || along >= 30 || lat >= 2.2) return null;
  const back = along + 2.5;
  const side = (slotIndex % 2 === 0 ? 1 : -1) * Math.ceil(slotIndex / 2) * 1.6;
  return [tx - dx * back + -dz * side, tz - dz * back + dx * side];
}

// Screen point used by first-person fire. The centered crosshair is the
// aim: pointer lock freezes the cursor position, and without lock the free
// cursor is irrelevant to the crosshair. Falls back to the clicked point
// only when no canvas rect is available. Pure given fakes, so tests can
// drive it headless.
export function fpsAimPoint(clientX, clientY, pointerLocked, canvasRect) {
  if (pointerLocked && canvasRect && Number.isFinite(canvasRect.width) && Number.isFinite(canvasRect.height)) {
    return {
      x: (canvasRect.left || 0) + canvasRect.width / 2,
      y: (canvasRect.top || 0) + canvasRect.height / 2,
    };
  }
  return { x: clientX, y: clientY };
}

// Maps a canvas pick to an attack order for the ridden squad: enemy squad
// id + soldier id, or null (ground, friends, self). Pure given fakes.
export function fpsShotTarget(worldObj, meta, mySquadId, myTeam) {
  if (!meta) return null;
  const sid = meta.squadEntityId !== undefined
    ? meta.squadEntityId
    : (meta.soldierEntityId !== undefined ? worldObj.get(meta.soldierEntityId, 'soldier')?.squadId : undefined);
  if (sid === undefined || sid === mySquadId) return null;
  const enemy = worldObj.get ? worldObj.get(sid, 'squad') : null;
  if (!enemy || enemy.team === myTeam) return null;
  const targetSoldierId = meta.soldierEntityId !== undefined && worldObj.has && worldObj.has(meta.soldierEntityId, 'soldier')
    ? meta.soldierEntityId
    : null;
  return { sid, targetSoldierId };
}

let _gunEdit = false;

// Interactive gun posing, done live in first person: P toggles edit mode,
// then IJKL/UO nudge the gun (Shift+… rotates instead), C copies the pose
// JSON, P exits. The squad stands still while editing.
export const GUN_EDIT_MOVE = 0.6;
export const GUN_EDIT_TURN = 1.4;

export function isGunEditMode() {
  return _gunEdit;
}

export function toggleGunEditMode() {
  if (getCameraMode() !== 'fps') return false;
  _gunEdit = !_gunEdit;
  initGunPosePanel();
  syncGunPoseTip();
  syncGunPosePanel();
  return _gunEdit;
}

export function gunPoseSnapshot() {
  return {
    pos: _gunMountPos.toArray().map((v) => +v.toFixed(3)),
    rot: [_gunMountEuler.x, _gunMountEuler.y, _gunMountEuler.z].map((v) => +v.toFixed(3)),
    scale: +_gunMountScale.toFixed(3),
  };
}

function persistGunPose() {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(GUN_POSE_STORAGE_KEY, JSON.stringify(gunPoseSnapshot()));
    }
  } catch (_) {}
}

export function copyGunPose() {
  const snapshot = JSON.stringify(gunPoseSnapshot());
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(snapshot).catch(() => {});
    }
  } catch (_) {}
  console.log(`[gun-pose] ${snapshot} — saved to localStorage; hardcode as FPS_GUN_POS / euler defaults`);
  persistGunPose();
  return snapshot;
}

export function syncGunPoseTip() {
  if (typeof document === 'undefined' || !document.getElementById) return;
  const el = document.getElementById('gunPoseTip');
  if (!el) return;
  if (!_gunEdit) {
    el.style.display = 'none';
    return;
  }
  const p = _gunMountPos;
  const e = _gunMountEuler;
  el.style.display = 'block';
  el.textContent = `GUN pos ${p.x.toFixed(2)} ${p.y.toFixed(2)} ${p.z.toFixed(2)} | rot ${e.x.toFixed(2)} ${e.y.toFixed(2)} ${e.z.toFixed(2)} — I/K/J/L + U/O move, Shift+… rotate, C copy, P exit`;
}

// Slider panel (gunPosePanel): the same mount state, draggable with a mouse.
// Degrees on screen, radians in state.
const GUN_POSE_SLIDERS = [
  ['gunPosX', 'gunPosXv', () => _gunMountPos.x, (v) => { _gunMountPos.x = v; }, (v) => v.toFixed(2)],
  ['gunPosY', 'gunPosYv', () => _gunMountPos.y, (v) => { _gunMountPos.y = v; }, (v) => v.toFixed(2)],
  ['gunPosZ', 'gunPosZv', () => _gunMountPos.z, (v) => { _gunMountPos.z = v; }, (v) => v.toFixed(2)],
  ['gunRotX', 'gunRotXv', () => THREE.MathUtils.radToDeg(_gunMountEuler.x), (v) => { _gunMountEuler.x = THREE.MathUtils.degToRad(v); }, (v) => `${v.toFixed(0)}°`],
  ['gunRotY', 'gunRotYv', () => THREE.MathUtils.radToDeg(_gunMountEuler.y), (v) => { _gunMountEuler.y = THREE.MathUtils.degToRad(v); }, (v) => `${v.toFixed(0)}°`],
  ['gunRotZ', 'gunRotZv', () => THREE.MathUtils.radToDeg(_gunMountEuler.z), (v) => { _gunMountEuler.z = THREE.MathUtils.degToRad(v); }, (v) => `${v.toFixed(0)}°`],
  ['gunScale', 'gunScalev', () => _gunMountScale, (v) => { _gunMountScale = v; }, (v) => `${Math.round(v * 100)}%`],
];

function gunPoseElements() {
  if (typeof document === 'undefined' || !document.getElementById) return null;
  return document;
}

function applyGunPoseToViewmodel() {
  refreshGunMountQuat();
  if (_viewmodel) {
    _viewmodel.position.copy(_gunMountPos);
    _viewmodel.quaternion.copy(_gunMountQuat);
    _viewmodel.scale.setScalar(_gunMountScale);
  }
}

// Pushes mount state into the sliders (called on toggle and keyboard edits).
export function syncGunPosePanel() {
  const doc = gunPoseElements();
  if (!doc) return;
  const panel = doc.getElementById('gunPosePanel');
  if (!panel) return;
  panel.style.display = _gunEdit ? 'block' : 'none';
  if (!_gunEdit) return;
  for (const [inputId, labelId, get, , format] of GUN_POSE_SLIDERS) {
    const input = doc.getElementById(inputId);
    const label = doc.getElementById(labelId);
    if (!input || !label) continue;
    if (doc.activeElement !== input) input.value = get();
    label.textContent = format(get());
  }
}

// Reads the sliders into mount state (slider `input` events call this).
export function readGunPosePanel() {
  const doc = gunPoseElements();
  if (!doc) return false;
  let changed = false;
  for (const [inputId, , , set] of GUN_POSE_SLIDERS) {
    const input = doc.getElementById(inputId);
    if (!input || input.value === '' || input.value === undefined) continue;
    const v = Number(input.value);
    if (!Number.isFinite(v)) continue;
    set(v);
    changed = true;
  }
  if (!changed) return false;
  applyGunPoseToViewmodel();
  persistGunPose();
  syncGunPoseTip();
  syncGunPosePanel();
  return true;
}

let _gunPosePanelWired = false;

// Idempotent: call whenever the game boots with a real DOM (and from tests
// with fakes). Slider drags pose the gun live.
export function initGunPosePanel() {
  const doc = gunPoseElements();
  if (!doc || _gunPosePanelWired) return false;
  const panel = doc.getElementById('gunPosePanel');
  if (!panel) return false;
  let wired = false;
  for (const [inputId] of GUN_POSE_SLIDERS) {
    const input = doc.getElementById(inputId);
    if (!input || typeof input.addEventListener !== 'function') continue;
    input.addEventListener('input', readGunPosePanel);
    wired = true;
  }
  if (!wired) return false;
  _gunPosePanelWired = true;
  return true;
}

export function tickGunEdit(deltaTime, keysObj) {
  if (!_gunEdit || _cameraMode !== 'fps' || !camera) return false;
  const pressed = (code) => keysObj && keysObj[code];
  const shift = pressed('ShiftLeft') || pressed('ShiftRight');
  const mv = GUN_EDIT_MOVE * (deltaTime || 0);
  const tr = GUN_EDIT_TURN * (deltaTime || 0);
  let changed = false;
  const bump = (fn) => { fn(); changed = true; };
  if (shift) {
    if (pressed('KeyI')) bump(() => { _gunMountEuler.x -= tr; });
    if (pressed('KeyK')) bump(() => { _gunMountEuler.x += tr; });
    if (pressed('KeyJ')) bump(() => { _gunMountEuler.y += tr; });
    if (pressed('KeyL')) bump(() => { _gunMountEuler.y -= tr; });
    if (pressed('KeyU')) bump(() => { _gunMountEuler.z += tr; });
    if (pressed('KeyO')) bump(() => { _gunMountEuler.z -= tr; });
  } else {
    if (pressed('KeyI')) bump(() => { _gunMountPos.y += mv; });
    if (pressed('KeyK')) bump(() => { _gunMountPos.y -= mv; });
    if (pressed('KeyJ')) bump(() => { _gunMountPos.x -= mv; });
    if (pressed('KeyL')) bump(() => { _gunMountPos.x += mv; });
    if (pressed('KeyU')) bump(() => { _gunMountPos.z -= mv; });
    if (pressed('KeyO')) bump(() => { _gunMountPos.z += mv; });
  }
  if (changed) {
    refreshGunMountQuat();
    if (_viewmodel) {
      _viewmodel.position.copy(_gunMountPos);
      _viewmodel.quaternion.copy(_gunMountQuat);
      _viewmodel.scale.setScalar(_gunMountScale);
    }
    persistGunPose();
    syncGunPoseTip();
    syncGunPosePanel();
  }
  return true;
}

export function setCameraMode(mode) {
  if (mode === 'fps' || mode === 'third') {
    const target = resolveFpsTarget(world, selSquads);
    if (!target) return _cameraMode;
    // Start fetching the dedicated lasgun file (no-op once cached).
    preloadLasgunViewmodel();
    if (camera) camera.alpha = alphaForFacing(target.facing.x, target.facing.z);
    _cameraMode = mode;
    // Third person shows the real soldier, so no viewmodel is needed.
    if (mode === 'third') detachViewmodel();
    if (mode !== 'fps' && _gunEdit) {
      _gunEdit = false;
      syncGunPoseTip();
      syncGunPosePanel();
    }
    syncCameraFpsButton();
    return _cameraMode;
  }
  _cameraMode = 'orbit';
  _gunEdit = false;
  syncGunPoseTip();
  syncGunPosePanel();
  detachViewmodel();
  if (camera && camera.near !== ORBIT_NEAR) {
    camera.near = ORBIT_NEAR;
    camera.updateProjectionMatrix();
  }
  syncCameraFpsButton();
  return _cameraMode;
}

// Single camera toggle shared by the HUD button and the TAB hotkey.
// Pointer lock must stay in the user gesture: callers must invoke this
// synchronously from the click/key event, otherwise the browser rejects it.
export function toggleCameraFps() {
  // The HUD button and TAB walk the same ring: orbit -> fps -> third.
  const ring = ['orbit', 'fps', 'third'];
  const next = ring[(ring.indexOf(getCameraMode()) + 1) % ring.length];
  const active = setCameraMode(next);
  if (typeof document === 'undefined') return active;
  if (isShooterMode()) {
    try {
      const locked = canvas && canvas.requestPointerLock && canvas.requestPointerLock();
      if (locked && locked.catch) locked.catch(() => {});
    } catch (_) {}
  } else {
    try {
      if (document.pointerLockElement) document.exitPointerLock();
    } catch (_) {}
  }
  return active;
}

// Viewmodel: clone the soldier's own lasgun onto the camera so first person
// always shows the gun it belongs to. Orientation is copied from the gun's
// world aim at attach time, so model-space conventions don't matter.
let _viewmodel = null;
let _viewmodelSoldierId = null;

// Dedicated FPS lasgun file: a standalone weapon that never depends on the
// soldier's nodes, so it can't vanish when those rebuild or hide. Loaded
// lazily and cached; the soldier-node clone covers the ride until it arrives.
export const LASGUN_MODEL_PATH = 'models/ig/infantry/guardsmen_lasgun_mesh.glb';
let _lasgunTemplate = null;
let _lasgunLoading = null;
let _viewmodelFromTemplate = false;

export function preloadLasgunViewmodel() {
  if (_lasgunTemplate) return Promise.resolve(_lasgunTemplate);
  if (!_lasgunLoading) {
    _lasgunLoading = (async () => {
      try {
        const [{ loadGltf }, { modelUrl }] = await Promise.all([
          import('./gltf-models.js'),
          import('./assets.js'),
        ]);
        const container = await loadGltf(modelUrl(LASGUN_MODEL_PATH));
        _lasgunTemplate = staticizeViewmodelTemplate(container?.scene) || null;
      } catch (_) {
        _lasgunTemplate = null;
      }
      return _lasgunTemplate;
    })();
  }
  return _lasgunLoading;
}

// A plain Object3D.clone() of a SkinnedMesh orphans the skeleton, so the
// viewmodel would render warped or misplaced. The lasgun never animates in
// first person — bake the bind pose into static meshes once, at load.
export function staticizeViewmodelTemplate(root) {
  if (!root) return root;
  const skinned = [];
  root.traverse((child) => {
    if (child.isSkinnedMesh) skinned.push(child);
  });
  for (const sm of skinned) {
    const mesh = new THREE.Mesh(sm.geometry, sm.material);
    mesh.name = sm.name;
    mesh.position.copy(sm.position);
    mesh.quaternion.copy(sm.quaternion);
    mesh.scale.copy(sm.scale);
    if (sm.parent) {
      sm.parent.add(mesh);
      sm.parent.remove(sm);
    }
  }
  return root;
}

// Test seam: inject a template group headless (the file itself is covered by
// tests/lasgun-model.test.js through the real GLTFLoader).
export function _setLasgunTemplateForTests(template) {
  _lasgunTemplate = template || null;
  return _lasgunTemplate;
}

// Gun nodes by preference: the lasgun first, then alternate guardsman
// weapons, then procedural gun parts. Grenadiers/plasma troops hide the
// lasgun node and procedural meshes have no lasgun at all, so exact-name
// matches alone leave the player gunless.
const FPS_GUN_NAMES = [
  'guardsmen_lasgun',
  'guardsmen_grenade_launcher',
  'guardsmen_plasma_pistol',
  'gun_root',
  'gb',
  'gr',
];
const FPS_GUN_PATTERN = /gun|lasgun|grenade|plasma|pistol|blaster|flayer|shoota|choppa/i;

function _chainShown(object) {
  let current = object;
  while (current) {
    if (!current.visible) return false;
    current = current.parent;
  }
  return true;
}

function findGun(root) {
  const exact = [];
  const fuzzy = [];
  root.traverse((child) => {
    if (!child || (!child.isMesh && !child.isGroup)) return;
    if (FPS_GUN_NAMES.includes(child.name)) exact.push(child);
    else if (child.isMesh && FPS_GUN_PATTERN.test(child.name)) fuzzy.push(child);
  });
  // Prefer a currently visible gun (grenadiers hide the lasgun but show the
  // launcher); fall back to any gun node and force it visible on the clone.
  return exact.find(_chainShown) || exact[0] || fuzzy.find(_chainShown) || fuzzy[0] || null;
}

const _gunWorldQuat = new THREE.Quaternion();
const _camInverse = new THREE.Quaternion();

export function attachViewmodel(cameraObj, soldierRoot) {
  detachViewmodel();
  if (!cameraObj) return false;
  // The dedicated lasgun file wins: it is modeled in viewmodel space
  // (barrel along -Z), so it mounts with identity rotation. Otherwise fall
  // back to cloning the soldier's own gun with its world aim preserved.
  _viewmodelFromTemplate = !!_lasgunTemplate;
  if (_lasgunTemplate) {
    _viewmodel = _lasgunTemplate.clone(true);
    _viewmodel.quaternion.copy(_gunMountQuat);
  } else {
    if (!soldierRoot) return false;
    const gun = findGun(soldierRoot);
    if (!gun) return false;
    gun.getWorldQuaternion(_gunWorldQuat);
    _camInverse.copy(cameraObj.quaternion).invert();
    _viewmodel = gun.clone(true);
    _viewmodel.quaternion.copy(_camInverse.multiply(_gunWorldQuat).multiply(_gunMountQuat));
  }
  _viewmodel.position.copy(_gunMountPos);
  _viewmodel.scale.setScalar(_gunMountScale);
  // The source node can be hidden (grenadier lasgun) — the viewmodel itself
  // is always shown, CS-style, even at idle.
  _viewmodel.visible = true;
  _viewmodel.traverse((child) => {
    child.visible = true;
    child.userData.pickable = false;
  });
  cameraObj.add(_viewmodel);
  return true;
}

// True while the camera carries a live viewmodel.
export function hasViewmodel(cameraObj) {
  return !!_viewmodel && !!cameraObj && _viewmodel.parent === cameraObj;
}

const _muzzleBox = new THREE.Box3();

// World position of the viewmodel's muzzle tip: center of the gun's bounds
// pushed to its most forward face. The FPS beam starts here, so the line
// visibly leaves the barrel instead of the soldier's chest.
export function getViewmodelMuzzleWorldPos(out) {
  const v = out || new THREE.Vector3();
  if (!_viewmodel || !camera) return null;
  _muzzleBox.setFromObject(_viewmodel);
  if (_muzzleBox.isEmpty()) return null;
  _muzzleBox.getCenter(v);
  v.z = _muzzleBox.min.z;
  return v;
}

export function detachViewmodel() {
  if (_viewmodel && _viewmodel.parent) {
    _viewmodel.parent.remove(_viewmodel);
  }
  _viewmodel = null;
  _viewmodelSoldierId = null;
  _viewmodelFromTemplate = false;
}

// Keeps the panel toggle label truthful (also after an automatic drop back
// to orbit). No-ops headless or when the button is absent.
export function syncCameraFpsButton() {
  if (typeof document === 'undefined') return;
  if (!document.getElementById) return;
  const riding = isShooterMode();
  const btn = document.getElementById('camera-fps-btn');
  if (btn) {
    btn.textContent = _cameraMode === 'third'
      ? '◉ THIRD-PERSON: ON'
      : (riding ? '◉ FIRST-PERSON: ON' : '◉ FIRST-PERSON: OFF');
    btn.classList.toggle('active', riding);
  }
  const cross = document.getElementById('fps-crosshair');
  if (cross) cross.style.display = riding ? 'block' : 'none';
}

// Shooter mouse-look: raw cursor deltas steer the orbit yaw/pitch the FPS
// view reads (same signs as ALT+drag). Only under pointer lock — otherwise
// the cursor is needed for UI. Returns true when applied.
export const FPS_LOOK_SENS = 0.0028;
export const FPS_PITCH_SENS = 0.0022;
export const FPS_BETA_MIN = 0.05;
export const FPS_BETA_MAX = 2.6;

export function fpsLook(movementX, movementY) {
  if (!isShooterMode() || !camera) return false;
  if (typeof document !== 'undefined' && !document.pointerLockElement) return false;
  // Shooter directions: mouse right turns the view right, mouse up looks
  // up. (Deliberately opposite to ALT+drag signs: dragging moves the
  // camera, while mouse-look moves the view itself.)
  camera.alpha += (movementX || 0) * FPS_LOOK_SENS;
  camera.beta = Math.max(FPS_BETA_MIN, Math.min(FPS_BETA_MAX, camera.beta - (movementY || 0) * FPS_PITCH_SENS));
  return true;
}

// WASD/arrows (plus IJKL as a mirror) drive the ridden squad through short
// move orders (refreshed near arrival or on sharp turns, so there is no
// per-frame route churn).
// Orders flow through the normal pipeline: walk anims, wall routing via
// paint, capture logic all behave like player-issued moves. The squad moves
// only while a drive key is held: releasing the keys cancels the drive
// order immediately instead of walking it out. Returns true while riding
// (even without drive input).
export const FPS_DRIVE_STEP = 7;
const FPS_REISSUE_DIST = 2.5;
const FPS_REISSUE_TURN = 0.6;

export function tickFirstPerson(deltaTime, keysObj) {
  if (!isShooterMode() || !camera) return false;
  const target = resolveFpsTarget(world, selSquads);
  if (!target) return false;
  // Gun-pose editing preempts driving: the squad stands still.
  if (_gunEdit) return tickGunEdit(deltaTime, keysObj);
  const pressed = (code) => keysObj && keysObj[code];
  const theta = -camera.alpha - Math.PI / 2;
  const fx = Math.sin(theta);
  const fz = Math.cos(theta);
  const rx = -Math.cos(theta);
  const rz = Math.sin(theta);
  let wx = 0;
  let wz = 0;
  // WASD stays; IJKL mirrors it (I forward, K back, J left, L right).
  if (pressed('KeyW') || pressed('ArrowUp') || pressed('KeyI')) { wx += fx; wz += fz; }
  if (pressed('KeyS') || pressed('ArrowDown') || pressed('KeyK')) { wx -= fx; wz -= fz; }
  if (pressed('KeyD') || pressed('ArrowRight') || pressed('KeyL')) { wx += rx; wz += rz; }
  if (pressed('KeyA') || pressed('ArrowLeft') || pressed('KeyJ')) { wx -= rx; wz -= rz; }
  const squad = target.squad;
  const len = Math.hypot(wx, wz);
  if (!len) {
    // No drive input: stop only our own drive order. Orders issued by other
    // means (RMB ground orders, attacks) are left untouched.
    if (squad.moveOrder && squad.moveOrder._fpsDrive) {
      squad.moveOrder = null;
      squad._fpsDriveAngle = undefined;
      squad.stopped = true;
    }
    return true;
  }
  wx /= len;
  wz /= len;
  const sp = squad.position;
  const order = squad.moveOrder;
  const orderDist = order ? Math.hypot(order.x - sp.x, order.z - sp.z) : Infinity;
  const prevAngle = squad._fpsDriveAngle;
  const wishAngle = Math.atan2(wz, wx);
  const turned = prevAngle === undefined
    || Math.abs(Math.atan2(Math.sin(wishAngle - prevAngle), Math.cos(wishAngle - prevAngle))) > FPS_REISSUE_TURN;
  if (!order || orderDist < FPS_REISSUE_DIST || turned) {
    const drive = new THREE.Vector3(sp.x + wx * FPS_DRIVE_STEP, 0, sp.z + wz * FPS_DRIVE_STEP);
    drive._fpsDrive = true;
    squad.moveOrder = drive;
    squad._fpsDriveAngle = wishAngle;
  }
  squad.stopped = false;
  squad.flyOrder = null;
  squad.forcedTarget = null;
  squad.forcedSoldierId = null;
  return true;
}

// Positions the scene camera at the soldier's eyes. Returns true when
// applied; false (no soldier) means the caller renders orbit instead.
export function updateFirstPersonCamera() {
  if (_cameraMode !== 'fps' || !camera) return false;
  const target = resolveFpsTarget(world, selSquads);
  if (!target) {
    _cameraMode = 'orbit';
    detachViewmodel();
    syncCameraFpsButton();
    return false;
  }
  if (camera.near !== FPS_NEAR) {
    camera.near = FPS_NEAR;
    camera.updateProjectionMatrix();
  }
  // Re-attach when riding a new soldier, when the camera lost its gun, or
  // when the dedicated lasgun file arrived mid-ride: the weapon stays put,
  // CS-style, for the whole ride, even at idle.
  if (target.soldierId !== _viewmodelSoldierId || !hasViewmodel(camera) || (_lasgunTemplate && !_viewmodelFromTemplate)) {
    const mesh = world.get(target.soldierId, 'mesh');
    if (mesh && mesh.root) attachViewmodel(camera, mesh.root);
    _viewmodelSoldierId = target.soldierId;
  }
  const flen = Math.hypot(target.facing.x, target.facing.z) || 1;
  const fx = target.facing.x / flen;
  const fz = target.facing.z / flen;
  const eye = new THREE.Vector3(
    target.pos.x + fx * FPS_FORWARD_OFFSET,
    target.pos.y + FPS_EYE_HEIGHT,
    target.pos.z + fz * FPS_FORWARD_OFFSET,
  );
  const sinBeta = Math.sin(camera.beta);
  const cosBeta = Math.cos(camera.beta);
  const look = new THREE.Vector3(
    eye.x - Math.cos(camera.alpha) * sinBeta * FPS_LOOK_DISTANCE,
    eye.y - cosBeta * FPS_LOOK_DISTANCE,
    eye.z - Math.sin(camera.alpha) * sinBeta * FPS_LOOK_DISTANCE,
  );
  camera.position.copy(eye);
  camera.lookAt(look);
  return true;
}

// GTA-style third person: the camera rides behind and above the soldier's
// head, looking along the mouse-look direction. Returns true when applied;
// false (no soldier) means the caller renders orbit instead.
export const THIRD_DIST = 6.5;
export const THIRD_HEIGHT = 1.5;
export const THIRD_LOOK_AHEAD = 8;

const _thirdHead = new THREE.Vector3();
const _thirdLook = new THREE.Vector3();

export function updateThirdPersonCamera() {
  if (_cameraMode !== 'third' || !camera) return false;
  const target = resolveFpsTarget(world, selSquads);
  if (!target) {
    _cameraMode = 'orbit';
    detachViewmodel();
    syncCameraFpsButton();
    return false;
  }
  if (camera.near !== ORBIT_NEAR) {
    camera.near = ORBIT_NEAR;
    camera.updateProjectionMatrix();
  }
  const sinBeta = Math.sin(camera.beta);
  const vx = -Math.cos(camera.alpha) * sinBeta;
  const vy = -Math.cos(camera.beta);
  const vz = -Math.sin(camera.alpha) * sinBeta;
  _thirdHead.set(target.pos.x, target.pos.y + THIRD_HEIGHT, target.pos.z);
  camera.position.set(
    _thirdHead.x - vx * THIRD_DIST,
    _thirdHead.y - vy * THIRD_DIST,
    _thirdHead.z - vz * THIRD_DIST,
  );
  _thirdLook.set(
    _thirdHead.x + vx * THIRD_LOOK_AHEAD,
    _thirdHead.y + vy * THIRD_LOOK_AHEAD,
    _thirdHead.z + vz * THIRD_LOOK_AHEAD,
  );
  camera.lookAt(_thirdLook);
  return true;
}
