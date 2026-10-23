import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import { reportR2Progress } from './r2-progress.js';

// ══════════════════════════════════════════════════════════════════════════════
//  GLTF MODELS — animated glTF/FBX loading + per-instance playback for three.js.
//
//  Replaces the old AssetContainer/AnimationGroup flow with the native three.js
//  equivalents: GLTFLoader/FBXLoader for loading, SkeletonUtils.clone for
//  instancing, and one AnimationMixer per instance. Each clip is wrapped in an
//  AnimGroup so the game's animation-state logic (idle/run/shoot/die slots
//  with loop + on-ended callbacks) keeps working unchanged.
// ══════════════════════════════════════════════════════════════════════════════

const _gltfLoader = new GLTFLoader();
const _fbxLoader = new FBXLoader();
const _mixers = new Set();

// Mixer distance throttle: mixers whose root sits outside the camera
// frustum update every MIXER_THROTTLE_EVERY-th frame with a scaled delta,
// so one-shots still finish (coarse time steps) instead of stalling.
// Onscreen mixers — and everything when no camera is passed — run full
// rate, exactly as before.
export const MIXER_THROTTLE_EVERY = 4;
export const MIXER_SPHERE_RADIUS = 10;

const _mixerPhase = new Map();
let _mixerPhaseNext = 0;
let _mixerTick = 0;
const _throttleFrustum = new THREE.Frustum();
const _throttleMatrix = new THREE.Matrix4();
const _throttleCenter = new THREE.Vector3();
const _throttleSphere = new THREE.Sphere();

export function mixerThrottleStep(visible, tick, phase, every = MIXER_THROTTLE_EVERY) {
  if (visible) {
    return 1;
  }
  return (tick + phase) % every === 0 ? every : 0;
}

export function updateMixers(deltaTime, camera = null) {
  _mixerTick += 1;
  let frustum = null;
  if (camera && camera.projectionMatrix) {
    camera.updateMatrixWorld();
    _throttleMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    _throttleFrustum.setFromProjectionMatrix(_throttleMatrix);
    frustum = _throttleFrustum;
  }
  _mixers.forEach((mixer) => {
    try {
      let scale = 1;
      if (frustum) {
        const root = typeof mixer.getRoot === 'function' ? mixer.getRoot() : null;
        let visible = true;
        if (root && typeof root.getWorldPosition === 'function') {
          root.getWorldPosition(_throttleCenter);
          _throttleSphere.center.copy(_throttleCenter);
          _throttleSphere.radius = MIXER_SPHERE_RADIUS;
          visible = frustum.intersectsSphere(_throttleSphere);
        }
        if (!_mixerPhase.has(mixer)) {
          _mixerPhase.set(mixer, _mixerPhaseNext);
          _mixerPhaseNext = (_mixerPhaseNext + 1) % MIXER_THROTTLE_EVERY;
        }
        scale = mixerThrottleStep(visible, _mixerTick, _mixerPhase.get(mixer));
      }
      if (scale !== 0) {
        mixer.update(deltaTime * scale);
      }
    } catch (error) {
      // ignore per-mixer failures so one bad clip can't stall the frame
    }
  });
}

function _registerMixer(mixer) {
  _mixers.add(mixer);
}

function _unregisterMixer(mixer) {
  _mixers.delete(mixer);
  _mixerPhase.delete(mixer);
}

export async function loadGltf(url, extension = '') {
  const ext = String(extension || url || '').split('?')[0].split('#')[0].toLowerCase();
  // Byte-level R2 progress for the START BATTLE bar (R2 sends
  // Content-Length, so lengthComputable is true and totals are real).
  const onByteProgress = (event) => {
    if (!event) {
      return;
    }
    reportR2Progress(url, {
      loaded: event.loaded || 0,
      total: event.lengthComputable && event.total > 0 ? event.total : null,
    });
  };
  let root;
  let animations;
  try {
    if (ext.endsWith('.fbx')) {
      root = await _fbxLoader.loadAsync(url, onByteProgress);
      animations = root.animations || [];
    } else {
      const gltf = await _gltfLoader.loadAsync(url, onByteProgress);
      root = gltf.scene;
      animations = gltf.animations || [];
    }
  } catch (error) {
    // Mark finished-with-error so the progress bar never sticks on a
    // failed download (callers fall back to procedural models).
    reportR2Progress(url, { done: true, failed: true });
    throw error;
  }
  reportR2Progress(url, { done: true });
  const meshes = [];
  root.traverse((child) => {
    if (child.isMesh) {
      meshes.push(child);
    }
  });
  const container = {
    scene: root,
    animations,
    meshes,
    _hiddenNodes: null,
    dispose() {
      root.traverse((child) => {
        if (child.geometry) {
          child.geometry.dispose();
        }
        const materials = Array.isArray(child.material)
          ? child.material
          : (child.material ? [child.material] : []);
        materials.forEach((material) => {
          Object.values(material).forEach((value) => {
            if (value && value.isTexture) {
              value.dispose();
            }
          });
          material.dispose();
        });
      });
      if (root.parent) {
        root.parent.remove(root);
      }
    },
  };
  return container;
}

// ── Per-clip playback wrapper ───────────────────────────────────────────────

export class AnimGroup {
  constructor(clip, mixer, record) {
    this.name = clip.name || '';
    this._clip = clip;
    this._mixer = mixer;
    this._record = record;
    this._action = null;
    this._loop = true;
    this._endCallbacks = [];
    this._disposed = false;
    this._finishedListener = (event) => {
      if (event.action === this._action) {
        const callbacks = this._endCallbacks.slice();
        this._endCallbacks.length = 0;
        callbacks.forEach((callback) => {
          try {
            callback();
          } catch (error) {
            // ignore listener errors
          }
        });
      }
    };
    this.onAnimationGroupEndObservable = {
      addOnce: (callback) => {
        this._endCallbacks.push(callback);
      },
      clear: () => {
        this._endCallbacks.length = 0;
      },
    };
  }

  _ensureAction() {
    if (!this._action) {
      this._action = this._mixer.clipAction(this._clip);
    }
    return this._action;
  }

  set loopAnimation(value) {
    this._loop = !!value;
    if (this._action) {
      this._action.setLoop(this._loop ? THREE.LoopRepeat : THREE.LoopOnce, Infinity);
      this._action.clampWhenFinished = !this._loop;
    }
  }

  get loopAnimation() {
    return this._loop;
  }

  start(loop = true, speed = 1.0) {
    if (this._disposed) {
      return;
    }
    this._loop = !!loop;
    const action = this._ensureAction();
    action.setLoop(this._loop ? THREE.LoopRepeat : THREE.LoopOnce, Infinity);
    action.clampWhenFinished = !this._loop;
    action.setEffectiveTimeScale(speed);
    action.reset();
    this._mixer.removeEventListener('finished', this._finishedListener);
    if (!this._loop) {
      this._mixer.addEventListener('finished', this._finishedListener);
    }
    action.play();
  }

  stop() {
    if (this._action) {
      this._mixer.removeEventListener('finished', this._finishedListener);
      this._action.stop();
    }
  }

  reset() {
    if (this._action) {
      this._action.reset();
    }
  }

  // Freeze the clip at a progress point (0..1): the paused action keeps
  // contributing its pose on mixer.update, so each frame can re-scrub it.
  // start()/stop() take over cleanly afterwards (reset() unpauses).
  scrub(progress01) {
    if (this._disposed) {
      return;
    }
    const action = this._ensureAction();
    const p = Math.min(1, Math.max(0, progress01 || 0));
    action.setLoop(THREE.LoopOnce, 1);
    action.clampWhenFinished = true;
    action.enabled = true;
    action.setEffectiveWeight(1);
    if (!action.isRunning()) {
      this._mixer.removeEventListener('finished', this._finishedListener);
      action.reset();
      action.play();
    }
    action.paused = true;
    action.time = p * this.getDuration();
  }

  getDuration() {
    return this._clip.duration || 0;
  }

  dispose() {
    if (this._disposed) {
      return;
    }
    this._disposed = true;
    this.stop();
    this._endCallbacks.length = 0;
    if (this._action) {
      try {
        this._mixer.uncacheAction(this._clip);
      } catch (error) {
        // ignore
      }
      this._action = null;
    }
    if (this._record) {
      this._record.alive -= 1;
      if (this._record.alive <= 0) {
        _unregisterMixer(this._record.mixer);
        this._record.mixer.stopAllAction();
      }
    }
  }
}

// ── Instancing ──────────────────────────────────────────────────────────────

export function instantiateGltf(container) {
  const clone = SkeletonUtils.clone(container.scene);
  const mixer = new THREE.AnimationMixer(clone);
  _registerMixer(mixer);
  const record = { mixer, alive: (container.animations || []).length };
  const animationGroups = (container.animations || []).map((clip) => new AnimGroup(clip, mixer, record));
  if (record.alive <= 0) {
    // Static model with no clips: nothing will ever unregister the mixer, so
    // drop it immediately instead of updating a dead mixer every frame.
    _unregisterMixer(mixer);
  }
  return {
    rootNodes: [clone],
    animationGroups,
    mixer,
    dispose() {
      animationGroups.forEach((group) => group.dispose());
      if (clone.parent) {
        clone.parent.remove(clone);
      }
    },
  };
}
