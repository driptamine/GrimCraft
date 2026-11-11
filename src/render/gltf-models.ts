import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import { reportR2Progress } from '../net/r2-progress.js';
import type { AnyGroup } from '../meshes/types.js';

// ══════════════════════════════════════════════════════════════════════════════
//  GLTF MODELS — animated glTF/FBX loading + per-instance playback for three.js.
//
//  Replaces the old AssetContainer/AnimationGroup flow with the native three.js
//  equivalents: GLTFLoader/FBXLoader for loading, SkeletonUtils.clone for
//  instancing, and one AnimationMixer per instance. Each clip is wrapped in an
//  AnimGroup so the game's animation-state logic (idle/run/shoot/die slots
//  with loop + on-ended callbacks) keeps working unchanged.
// ══════════════════════════════════════════════════════════════════════════════

// Loaded model container: scene root, clips, flat mesh list, optional
// hidden-node names applied at instantiate, explicit GPU dispose.
export interface GltfContainer {
  scene: THREE.Object3D;
  animations: THREE.AnimationClip[];
  meshes: THREE.Object3D[];
  _hiddenNodes: string[] | null;
  // model-upload containers expose a duck-typed instantiate(metaPayload);
  // strategic-point meshes probe for it instead of branching per source.
  instantiate?(meta?: Record<string, unknown>): AnyGroup;
  dispose(): void;
}

// Per-instance playback state returned by instantiateGltf.
export interface GltfInstance {
  rootNodes: THREE.Object3D[];
  animationGroups: AnimGroup[];
  mixer: THREE.AnimationMixer;
  dispose(): void;
}

// Mixer bookkeeping: how many live AnimGroups share the mixer (the last
// one out unregisters it).
export interface MixerRecord {
  mixer: THREE.AnimationMixer;
  alive: number;
}

const _gltfLoader = new GLTFLoader();
const _fbxLoader = new FBXLoader();
const _mixers = new Set<THREE.AnimationMixer>();

// Mixer distance throttle: mixers whose root sits outside the camera
// frustum update every MIXER_THROTTLE_EVERY-th frame with a scaled delta,
// so one-shots still finish (coarse time steps) instead of stalling.
// Onscreen mixers — and everything when no camera is passed — run full
// rate, exactly as before.
export const MIXER_THROTTLE_EVERY = 4;
export const MIXER_SPHERE_RADIUS = 10;

const _mixerPhase = new Map<THREE.AnimationMixer, number>();
let _mixerPhaseNext = 0;
let _mixerTick = 0;
const _throttleFrustum = new THREE.Frustum();
const _throttleMatrix = new THREE.Matrix4();
const _throttleCenter = new THREE.Vector3();
const _throttleSphere = new THREE.Sphere();

export function mixerThrottleStep(visible: boolean, tick: number, phase: number, every = MIXER_THROTTLE_EVERY): number {
  if (visible) {
    return 1;
  }
  return (tick + phase) % every === 0 ? every : 0;
}

export function updateMixers(deltaTime: number, camera: THREE.Camera | null = null): void {
  _mixerTick += 1;
  let frustum: THREE.Frustum | null = null;
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
        const anyMixer = mixer as unknown as { getRoot?: () => unknown };
        const maybeRoot = typeof anyMixer.getRoot === 'function' ? anyMixer.getRoot() : null;
        const root = maybeRoot as { getWorldPosition?: (target: THREE.Vector3) => void } | null;
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
        scale = mixerThrottleStep(visible, _mixerTick, _mixerPhase.get(mixer) as number);
      }
      if (scale !== 0) {
        mixer.update(deltaTime * scale);
      }
    } catch (error) {
      // ignore per-mixer failures so one bad clip can't stall the frame
    }
  });
}

function _registerMixer(mixer: THREE.AnimationMixer): void {
  _mixers.add(mixer);
}

function _unregisterMixer(mixer: THREE.AnimationMixer): void {
  _mixers.delete(mixer);
  _mixerPhase.delete(mixer);
}

export async function loadGltf(url: string, extension = ''): Promise<GltfContainer> {
  const ext = String(extension || url || '').split('?')[0].split('#')[0].toLowerCase();
  // Byte-level R2 progress for the START BATTLE bar (R2 sends
  // Content-Length, so lengthComputable is true and totals are real).
  const onByteProgress = (event: ProgressEvent): void => {
    if (!event) {
      return;
    }
    reportR2Progress(url, {
      loaded: event.loaded || 0,
      total: event.lengthComputable && event.total > 0 ? event.total : null,
    });
  };
  let root: THREE.Object3D;
  let animations: THREE.AnimationClip[];
  try {
    if (ext.endsWith('.fbx')) {
      root = await _fbxLoader.loadAsync(url, onByteProgress);
      animations = root.animations || [];
    } else {
      const gltf = await _gltfLoader.loadAsync(url, onByteProgress);
      root = gltf.scene;
      animations = gltf.animations || [];
      // The new guardsman was exported with animation timelines twice as
      // long as the classic model. The repaired asset carries a marker;
      // normalize older cached/R2 exports without speeding up fixed files.
      if (/(^|\/)models\/guardsmen\.glb$/i.test(url.split(/[?#]/)[0])
        && gltf.asset.extras?.grimcraftAnimationTiming !== 'original-speed') {
        animations = animations.map(source => {
          const clip = source.clone();
          for (const track of clip.tracks) track.scale(.5);
          clip.duration *= .5;
          return clip;
        });
      }
    }
  } catch (error) {
    // Mark finished-with-error so the progress bar never sticks on a
    // failed download (callers fall back to procedural models).
    reportR2Progress(url, { done: true, failed: true });
    throw error;
  }
  reportR2Progress(url, { done: true });
  // The newer guardsman/marine exports incorrectly mark the body as BLEND.
  // Its nearly opaque atlas needs no blending; BLEND disables depth writes
  // and draws body parts in the wrong order. Repair older cached/R2 copies
  // as well as local exports, leaving the genuinely transparent banner alone.
  const opaqueBodyMaterial = /(^|\/)models\/guardsmen\.glb$/i.test(url.split(/[?#]/)[0]) ? 'ig_guardsmen'
    : /(^|\/)models\/space-marine\.glb$/i.test(url.split(/[?#]/)[0]) ? 'space_marine_unit' : null;
  if (opaqueBodyMaterial) {
    root.traverse(node => {
      const mesh = node as THREE.Mesh;
      if (!mesh.isMesh) return;
      for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
        if (material.name !== opaqueBodyMaterial || (!material.transparent && material.opacity === 1 && material.depthWrite)) continue;
        material.transparent = false;
        material.opacity = 1;
        material.depthWrite = true;
        material.needsUpdate = true;
      }
    });
  }
  const meshes: THREE.Object3D[] = [];
  root.traverse((child: THREE.Object3D & { isMesh?: unknown; userData?: { hidden?: unknown } }) => {
    if (child.isMesh) {
      meshes.push(child);
    }
    // Variant meshes baked hidden in the file (node extras.hidden) stay
    // hidden: nothing is deleted, and no clip carries visibility tracks
    // that would switch them back on. Explicit _toggleMeshNode calls still
    // override this initial state.
    if ((child.userData as { hidden?: unknown } | undefined)?.hidden === true) {
      child.visible = false;
    }
  });
  const container: GltfContainer = {
    scene: root,
    animations,
    meshes,
    _hiddenNodes: null,
    dispose() {
      root.traverse((child: THREE.Object3D & { geometry?: THREE.BufferGeometry; material?: THREE.Material | THREE.Material[] }) => {
        if (child.geometry) {
          child.geometry.dispose();
        }
        const materials = Array.isArray(child.material)
          ? child.material
          : (child.material ? [child.material] : []);
        materials.forEach((material) => {
          Object.values(material).forEach((value) => {
            if (value && (value as { isTexture?: unknown }).isTexture) {
              (value as THREE.Texture).dispose();
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
  name: string;
  onAnimationGroupEndObservable: {
    addOnce: (callback: () => void) => void;
    clear: () => void;
  };
  private _clip: THREE.AnimationClip;
  private _mixer: THREE.AnimationMixer;
  private _record: MixerRecord;
  private _action: THREE.AnimationAction | null = null;
  private _loop = true;
  private _endCallbacks: Array<() => void> = [];
  private _disposed = false;
  private _finishedListener: (event: { action: unknown }) => void;

  constructor(clip: THREE.AnimationClip, mixer: THREE.AnimationMixer, record: MixerRecord) {
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

  _ensureAction(): THREE.AnimationAction {
    if (!this._action) {
      this._action = this._mixer.clipAction(this._clip);
    }
    return this._action;
  }

  set loopAnimation(value: boolean) {
    this._loop = !!value;
    if (this._action) {
      this._action.setLoop(this._loop ? THREE.LoopRepeat : THREE.LoopOnce, Infinity);
      this._action.clampWhenFinished = !this._loop;
    }
  }

  get loopAnimation(): boolean {
    return this._loop;
  }

  start(loop = true, speed = 1.0): void {
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

  stop(): void {
    if (this._action) {
      this._mixer.removeEventListener('finished', this._finishedListener);
      this._action.stop();
    }
  }

  reset(): void {
    if (this._action) {
      this._action.reset();
    }
  }

  // Freeze the clip at a progress point (0..1): the paused action keeps
  // contributing its pose on mixer.update, so each frame can re-scrub it.
  // start()/stop() take over cleanly afterwards (reset() unpauses).
  scrub(progress01: number): void {
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

  getDuration(): number {
    return this._clip.duration || 0;
  }

  dispose(): void {
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

export function instantiateGltf(container: GltfContainer): GltfInstance {
  const clone = SkeletonUtils.clone(container.scene);
  // SkeletonUtils clones rigs, but shares geometry/materials with the source
  // and every other soldier. Removing one instance must not free that geometry.
  const skeletons = new Set<THREE.Skeleton>();
  clone.traverse((node) => {
    const mesh = node as THREE.SkinnedMesh;
    if (mesh.geometry) mesh.geometry.userData.shared = true;
    if (mesh.isSkinnedMesh && mesh.skeleton) skeletons.add(mesh.skeleton);
  });
  const mixer = new THREE.AnimationMixer(clone);
  _registerMixer(mixer);
  const record: MixerRecord = { mixer, alive: (container.animations || []).length };
  const animationGroups = (container.animations || []).map((clip) => new AnimGroup(clip, mixer, record));
  if (record.alive <= 0) {
    // Static model with no clips: nothing will ever unregister the mixer, so
    // drop it immediately instead of updating a dead mixer every frame.
    _unregisterMixer(mixer);
  }
  let disposed = false;
  return {
    rootNodes: [clone],
    animationGroups,
    mixer,
    dispose() {
      if (disposed) return;
      disposed = true;
      animationGroups.forEach((group) => group.dispose());
      mixer.uncacheRoot(clone);
      skeletons.forEach((skeleton) => skeleton.dispose());
      if (clone.parent) {
        clone.parent.remove(clone);
      }
    },
  };
}
