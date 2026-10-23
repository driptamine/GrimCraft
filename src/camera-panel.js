// Interactive camera tuning panel (◉ CAMERA button, right column).
// Sliders write straight into the orbit rig (alpha/beta/radius/target);
// the frame loop's updateCamera() applies them, and the camera-change
// observer syncs the sliders back when the camera moves externally
// (wheel zoom, ALT+drag orbit, pan, map fit).
import { camera, addCameraChangeObserver, currentBounds } from './scene.js';
import { setCameraMode } from './camera-fps.js';
import {
  radToDeg,
  degToRad,
  normAlphaDeg,
  clampBetaRad,
  clampRadius,
  clampTargetXZ,
  clampTargetY,
  TARGET_Y_MIN,
  TARGET_Y_MAX,
} from './camera-params.js';

const SLIDERS = ['alpha', 'beta', 'radius', 'tx', 'ty', 'tz'];

let _inited = false;
let _dragId = null;
let _snapshot = null;

function el(id) {
  return document.getElementById(id);
}

function fmt(value, digits) {
  return Number(value).toFixed(digits);
}

export function toggleCameraPanel() {
  const panel = el('camera-panel');
  const btn = el('camera-panel-btn');
  if (!panel || !btn) {
    return;
  }
  const open = !panel.classList.contains('open');
  panel.classList.toggle('open', open);
  btn.classList.toggle('active', open);
  if (open) {
    initCameraPanel();
    syncCameraPanel();
  }
}

function initCameraPanel() {
  if (_inited) {
    return;
  }
  _inited = true;
  if (camera && camera.target) {
    _snapshot = {
      alpha: camera.alpha,
      beta: camera.beta,
      radius: camera.radius,
      tx: camera.target.x,
      ty: camera.target.y,
      tz: camera.target.z,
    };
  }
  for (const id of SLIDERS) {
    const slider = el(`camera-${id}`);
    if (!slider) {
      continue;
    }
    slider.addEventListener('pointerdown', () => { _dragId = id; });
    slider.addEventListener('pointerup', () => { _dragId = null; });
    slider.addEventListener('pointercancel', () => { _dragId = null; });
    slider.addEventListener('blur', () => { if (_dragId === id) _dragId = null; });
  }
  window.addEventListener('pointerup', () => { _dragId = null; });
  addCameraChangeObserver(() => syncCameraPanel());
}

export function updateCameraParam(which, value) {
  if (!camera || !camera.target) {
    return;
  }
  const v = Number(value);
  if (!Number.isFinite(v)) {
    return;
  }
  if (which === 'alpha') {
    camera.alpha = degToRad(((v % 360) + 360) % 360);
  } else if (which === 'beta') {
    camera.beta = clampBetaRad(degToRad(v), camera);
  } else if (which === 'radius') {
    camera.radius = clampRadius(v, camera);
  } else if (which === 'tx' || which === 'tz') {
    camera.target[which === 'tx' ? 'x' : 'z'] = clampTargetXZ(v, currentBounds() / 2);
  } else if (which === 'ty') {
    camera.target.y = clampTargetY(v);
  } else {
    return;
  }
  syncCameraPanel();
}

export function resetCameraPanel() {
  if (!camera || !camera.target || !_snapshot) {
    return;
  }
  setCameraMode('orbit');
  camera.alpha = _snapshot.alpha;
  camera.beta = _snapshot.beta;
  camera.radius = _snapshot.radius;
  camera.target.set(_snapshot.tx, _snapshot.ty, _snapshot.tz);
  syncCameraPanel();
}

function setSlider(id, value, min, max, label) {
  const slider = el(`camera-${id}`);
  const span = el(`camera-${id}-val`);
  if (slider && min !== undefined && max !== undefined) {
    slider.min = String(min);
    slider.max = String(max);
  }
  if (slider && _dragId !== id) {
    slider.value = String(value);
  }
  if (span) {
    span.textContent = label;
  }
}

export function syncCameraPanel() {
  const panel = el('camera-panel');
  if (!panel || !panel.classList.contains('open') || !camera || !camera.target) {
    return;
  }
  const betaMin = Math.floor(radToDeg(camera.lowerBetaLimit ?? 0.15));
  const betaMax = Math.ceil(radToDeg(camera.upperBetaLimit ?? 1.38));
  const panBound = Math.max(0, currentBounds() / 2);
  const alphaDeg = normAlphaDeg(camera.alpha);
  const betaDeg = radToDeg(clampBetaRad(camera.beta, camera));
  setSlider('alpha', fmt(alphaDeg, 0), 0, 360, `${fmt(alphaDeg, 0)}°`);
  setSlider('beta', fmt(betaDeg, 1), betaMin, betaMax, `${fmt(betaDeg, 1)}°`);
  setSlider('radius', fmt(camera.radius, 0),
    camera.lowerRadiusLimit ?? 6, camera.upperRadiusLimit ?? 800, fmt(camera.radius, 0));
  setSlider('tx', fmt(camera.target.x, 0), -panBound, panBound, fmt(camera.target.x, 0));
  setSlider('ty', fmt(camera.target.y, 1), TARGET_Y_MIN, TARGET_Y_MAX, fmt(camera.target.y, 1));
  setSlider('tz', fmt(camera.target.z, 0), -panBound, panBound, fmt(camera.target.z, 0));
  const readout = el('camera-readout');
  if (readout && camera.position) {
    const p = camera.position;
    const t = camera.target;
    readout.textContent = `POS ${fmt(p.x, 1)}, ${fmt(p.y, 1)}, ${fmt(p.z, 1)}\n`
      + `TGT ${fmt(t.x, 1)}, ${fmt(t.y, 1)}, ${fmt(t.z, 1)}`;
  }
}
