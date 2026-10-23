// Eldar Dark Reaper bolt: plump symmetric egg/capsule with a black core and
// white glow around it. Two shared capsules (unlit near-black core + additive
// white shell) and one shared-texture white halo sprite per bolt. Orientation
// runs in systemReaperBullet via lookAt; the shell breathes through one shared
// pulse in updateReaperBoltFx.
import * as THREE from 'three';
import { mkGroup } from './three-helpers.js';

export const REAPER_CORE_NAME = 'reaper_core';
export const REAPER_SHELL_NAME = 'reaper_shell';

let _shared = null;

function _makeGlowTexture() {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.35, 'rgba(240,244,255,0.65)');
  gradient.addColorStop(0.7, 'rgba(200,210,235,0.2)');
  gradient.addColorStop(1, 'rgba(160,170,200,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function _markShared(geo) {
  if (geo) {
    geo.userData.shared = true; // disposeObj skips shared geometry.
  }
  return geo;
}

function _sharedAssets() {
  if (_shared) {
    return _shared;
  }
  const coreGeo = _markShared(new THREE.CapsuleGeometry(0.09, 0.18, 4, 12));
  coreGeo.rotateX(Math.PI / 2); // capsule axis Y -> flight axis +Z
  const shellGeo = _markShared(new THREE.CapsuleGeometry(0.14, 0.24, 4, 14));
  shellGeo.rotateX(Math.PI / 2);
  _shared = {
    coreGeo,
    shellGeo,
    coreMat: new THREE.MeshBasicMaterial({ color: new THREE.Color(0x060608) }),
    shellMat: new THREE.MeshBasicMaterial({
      color: new THREE.Color(0xffffff),
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
    glowTexture: null,
  };
  return _shared;
}

export function makeReaperBoltMesh() {
  const shared = _sharedAssets();
  const root = mkGroup('reaperbolt');
  const core = new THREE.Mesh(shared.coreGeo, shared.coreMat);
  core.name = REAPER_CORE_NAME;
  const shell = new THREE.Mesh(shared.shellGeo, shared.shellMat);
  shell.name = REAPER_SHELL_NAME;
  root.add(core, shell);
  if (!shared.glowTexture && typeof document !== 'undefined' && typeof document.createElement === 'function') {
    shared.glowTexture = _makeGlowTexture();
  }
  if (shared.glowTexture) {
    const glow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: shared.glowTexture,
        color: new THREE.Color(0xffffff),
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    glow.name = 'reaperglow';
    glow.scale.set(0.7, 0.7, 1);
    root.add(glow);
  }
  return root;
}

// Gentle irregular shimmer on the shared shell — one update per frame.
export function updateReaperBoltFx(time) {
  const shared = _sharedAssets();
  shared.shellMat.opacity = 0.42 + 0.08 * Math.sin(time * 13.1) + 0.04 * Math.sin(time * 23.7 + 0.9);
}
