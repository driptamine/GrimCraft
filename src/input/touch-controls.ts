// Touch controls for shooter modes (fps / third person): a left floating
// joystick driving the same WASD key state the keyboard writes, right-side
// drag for mouse-look without pointer lock, and a FIRE button.
// Desktop is untouched: the UI only builds on coarse-pointer devices and
// only shows while riding (isShooterMode).
import { keys } from './camera.js';
import { applyLookDelta, fpsAimPoint, isShooterMode } from '../render/camera-fps.js';
import { issueFpsShot } from './orders.js';
import { canvas } from '../core/scene.js';

export const TOUCH_STICK_RADIUS = 60;
export const TOUCH_LOOK_GAIN = 1.6;
const STICK_DEADZONE = 0.25;
const STICK_ENGAGE = 0.35;

// Pure mapping: normalized stick deflection (-1..1, y down) -> WASD state.
// Tested headless; the live stick writes the result into `keys`.
export function stickToKeys(nx: number, ny: number): { KeyW: boolean; KeyS: boolean; KeyA: boolean; KeyD: boolean } {
  const mag = Math.hypot(nx || 0, ny || 0);
  if (!(mag > STICK_DEADZONE)) {
    return { KeyW: false, KeyS: false, KeyA: false, KeyD: false };
  }
  return {
    KeyW: ny < -STICK_ENGAGE,
    KeyS: ny > STICK_ENGAGE,
    KeyA: nx < -STICK_ENGAGE,
    KeyD: nx > STICK_ENGAGE,
  };
}

export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  if (typeof window.matchMedia === 'function') {
    try {
      if (window.matchMedia('(pointer: coarse)').matches) {
        return true;
      }
    } catch (_) {}
  }
  return 'ontouchstart' in window || (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0);
}

let _root: HTMLElement | null = null;
let _base: HTMLElement | null = null;
let _knob: HTMLElement | null = null;
let _fireBtn: HTMLElement | null = null;
let _stickTouchId: number | null = null;
let _stickOrigin: { x: number; y: number } | null = null;
let _lookTouchId: number | null = null;
let _lookLast: { x: number; y: number } | null = null;
let _visibleShooter: boolean | null = null;

function _el(tag: string, id: string, css: string): HTMLElement {
  const el = document.createElement(tag);
  el.id = id;
  el.style.cssText = css;
  return el;
}

function _setStickKeys(nx: number, ny: number): void {
  const state = stickToKeys(nx, ny);
  keys.KeyW = state.KeyW;
  keys.KeyS = state.KeyS;
  keys.KeyA = state.KeyA;
  keys.KeyD = state.KeyD;
}

function _clearStickKeys(): void {
  keys.KeyW = false;
  keys.KeyS = false;
  keys.KeyA = false;
  keys.KeyD = false;
}

function _moveKnob(dx: number, dy: number): void {
  if (!_knob) {
    return;
  }
  _knob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
}

function _onTouchStart(event: TouchEvent): void {
  if (!isShooterMode()) {
    return;
  }
  for (const touch of event.changedTouches) {
    // Touches starting on the fire button are owned by the button.
    if (_fireBtn && _fireBtn.contains(touch.target as Node | null)) {
      continue;
    }
    if (touch.clientX < window.innerWidth * 0.45 && _stickTouchId === null) {
      _stickTouchId = touch.identifier;
      _stickOrigin = { x: touch.clientX, y: touch.clientY };
      _base!.style.left = `${touch.clientX}px`;
      _base!.style.top = `${touch.clientY}px`;
      _base!.style.display = 'block';
      _moveKnob(0, 0);
      _setStickKeys(0, 0);
    } else if (_lookTouchId === null) {
      _lookTouchId = touch.identifier;
      _lookLast = { x: touch.clientX, y: touch.clientY };
    }
  }
  if (event.cancelable) {
    event.preventDefault();
  }
}

function _onTouchMove(event: TouchEvent): void {
  if (!isShooterMode()) {
    return;
  }
  for (const touch of event.changedTouches) {
    if (touch.identifier === _stickTouchId && _stickOrigin) {
      let dx = touch.clientX - _stickOrigin.x;
      let dy = touch.clientY - _stickOrigin.y;
      const len = Math.hypot(dx, dy);
      if (len > TOUCH_STICK_RADIUS) {
        dx = (dx / len) * TOUCH_STICK_RADIUS;
        dy = (dy / len) * TOUCH_STICK_RADIUS;
      }
      _moveKnob(dx, dy);
      _setStickKeys(dx / TOUCH_STICK_RADIUS, dy / TOUCH_STICK_RADIUS);
    } else if (touch.identifier === _lookTouchId && _lookLast) {
      const dx = touch.clientX - _lookLast.x;
      const dy = touch.clientY - _lookLast.y;
      _lookLast = { x: touch.clientX, y: touch.clientY };
      applyLookDelta(dx * TOUCH_LOOK_GAIN, dy * TOUCH_LOOK_GAIN);
    }
  }
  if (event.cancelable) {
    event.preventDefault();
  }
}

function _onTouchEnd(event: TouchEvent): void {
  for (const touch of event.changedTouches) {
    if (touch.identifier === _stickTouchId) {
      _stickTouchId = null;
      _stickOrigin = null;
      _clearStickKeys();
      if (_base) {
        _base.style.display = 'none';
      }
      _moveKnob(0, 0);
    }
    if (touch.identifier === _lookTouchId) {
      _lookTouchId = null;
      _lookLast = null;
    }
  }
}

function _onFire(event: TouchEvent): void {
  if (event.cancelable) {
    event.preventDefault();
  }
  event.stopPropagation();
  if (!isShooterMode() || !canvas?.getBoundingClientRect) {
    return;
  }
  const aim = fpsAimPoint(0, 0, true, canvas.getBoundingClientRect());
  issueFpsShot(aim.x, aim.y);
}

// Builds the overlay once. Safe to call on desktop (no-op without touch).
export function initTouchControls(): HTMLElement | null {
  if (!isTouchDevice() || typeof document === 'undefined' || _root) {
    return _root;
  }
  const hostCanvas = canvas;
  if (!hostCanvas) {
    return null;
  }
  hostCanvas.style.touchAction = 'none';
  _root = _el(
    'div',
    'touch-controls',
    'display:none;position:fixed;inset:0;z-index:10002;pointer-events:none;font-family:Courier New,monospace;user-select:none;-webkit-user-select:none;touch-action:none;',
  );
  _base = _el(
    'div',
    'touch-stick-base',
    `display:none;position:fixed;width:${TOUCH_STICK_RADIUS * 2}px;height:${TOUCH_STICK_RADIUS * 2}px;transform:translate(-50%,-50%);border:2px solid rgba(80,200,255,0.5);border-radius:50%;background:rgba(5,8,18,0.35);pointer-events:none;`,
  );
  _knob = _el(
    'div',
    'touch-stick-knob',
    'position:absolute;left:50%;top:50%;width:56px;height:56px;transform:translate(-50%,-50%);border-radius:50%;background:rgba(80,200,255,0.45);pointer-events:none;',
  );
  _base.appendChild(_knob);
  _fireBtn = _el(
    'button',
    'touch-fire-btn',
    'position:fixed;right:26px;bottom:96px;width:84px;height:84px;border-radius:50%;border:2px solid rgba(255,120,60,0.65);background:rgba(60,12,4,0.55);color:#ffb08a;font-family:inherit;font-size:13px;letter-spacing:.1em;pointer-events:auto;touch-action:none;',
  );
  _fireBtn.textContent = 'FIRE';
  _fireBtn.addEventListener('touchstart', _onFire, { passive: false });
  _root.appendChild(_base);
  _root.appendChild(_fireBtn);
  document.body.appendChild(_root);
  hostCanvas.addEventListener('touchstart', _onTouchStart, { passive: false });
  hostCanvas.addEventListener('touchmove', _onTouchMove, { passive: false });
  hostCanvas.addEventListener('touchend', _onTouchEnd);
  hostCanvas.addEventListener('touchcancel', _onTouchEnd);
  window.addEventListener('blur', _clearStickKeys);
  return _root;
}

// Called every frame; only touches the DOM when visibility flips.
export function syncTouchControls(): void {
  if (!_root) {
    return;
  }
  const show = isShooterMode();
  if (show === _visibleShooter) {
    return;
  }
  _visibleShooter = show;
  _root.style.display = show ? 'block' : 'none';
  if (!show) {
    _stickTouchId = null;
    _stickOrigin = null;
    _lookTouchId = null;
    _lookLast = null;
    _clearStickKeys();
    if (_base) {
      _base.style.display = 'none';
    }
  }
}
