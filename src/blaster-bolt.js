// Tau pulse blaster bolt: thin, long, bright-blue tracer for Fire Warriors.
// Two shared capsules (white-blue core + additive blue shell) and one shared-
// texture halo sprite per bolt. Orientation runs in systemBlasterBullet via
// lookAt; brightness breathes through one shared pulse in updateBlasterBoltFx.
import * as THREE from 'three';
import { mkGroup } from './three-helpers.js';

export const BLASTER_CORE_NAME = 'blaster_core';
export const BLASTER_SHELL_NAME = 'blaster_shell';

let _shared = null;

function _makeGlowTexture() {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.3, 'rgba(170,215,255,0.7)');
  gradient.addColorStop(0.6, 'rgba(60,150,255,0.25)');
  gradient.addColorStop(1, 'rgba(20,70,200,0)');
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
  const coreGeo = _markShared(new THREE.CapsuleGeometry(0.011, 0.7, 4, 10));
  coreGeo.rotateX(Math.PI / 2); // capsule axis Y -> flight axis +Z
  const shellGeo = _markShared(new THREE.CapsuleGeometry(0.02, 0.78, 4, 12));
  shellGeo.rotateX(Math.PI / 2);
  _shared = {
    coreGeo,
    shellGeo,
    coreMat: new THREE.MeshBasicMaterial({ color: new THREE.Color(0x8ecfff) }),
    shellMat: new THREE.MeshBasicMaterial({
      color: new THREE.Color(0x2b9bff),
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
    glowTexture: null,
  };
  return _shared;
}

export function makeBlasterBoltMesh() {
  const shared = _sharedAssets();
  const root = mkGroup('blasterbolt');
  const core = new THREE.Mesh(shared.coreGeo, shared.coreMat);
  core.name = BLASTER_CORE_NAME;
  const shell = new THREE.Mesh(shared.shellGeo, shared.shellMat);
  shell.name = BLASTER_SHELL_NAME;
  root.add(core, shell);
  if (!shared.glowTexture && typeof document !== 'undefined' && typeof document.createElement === 'function') {
    shared.glowTexture = _makeGlowTexture();
  }
  if (shared.glowTexture) {
    const glow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: shared.glowTexture,
        color: new THREE.Color(0x55b6ff),
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    glow.name = 'blasterglow';
    glow.scale.set(0.2, 1.1, 1);
    root.add(glow);
  }
  return root;
}

// Gentle irregular shimmer on the shared shell — one update per frame.
export function updateBlasterBoltFx(time) {
  const shared = _sharedAssets();
  shared.shellMat.opacity = 0.5 + 0.1 * Math.sin(time * 17.3) + 0.05 * Math.sin(time * 29.7 + 1.1);
}
