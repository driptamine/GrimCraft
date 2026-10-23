// Necron warrior aura: wispy gaseous glow in the warrior's shape. Each body
// mesh gets a sibling shell sharing its geometry and skeleton, rendered with
// one shared gas shader — thresholded noise leaves large transparent gaps,
// so it reads as drifting wisps clinging to the body, not paint. Three soft
// fog billboards pool around the feet. The model's own materials are never
// touched; shells deform with every animation for free on the same bones.
import * as THREE from 'three';
import { mkGroup } from './three-helpers.js';

export const AURA_GROUP = 'necron_aura';
export const SHELL_SUFFIX = '_gas';

// Helper assemblies live under the soldier root too — never wrap them.
const EXCLUDED = new Set(['necron_aura', 'gauss_conduit', 'plasma_pistol_glow']);

const FOG = [
  { pos: [0.41, 0.12, 0.18], scale: 1.3, mat: 'A' },
  { pos: [-0.36, 0.1, 0.27], scale: 1.1, mat: 'B' },
  { pos: [-0.05, 0.14, -0.45], scale: 1.2, mat: 'A' },
];

let _gasMat = null;
let _fogMatA = null;
let _fogMatB = null;
let _fogTexture = null;
let _fogTextureTried = false;
const _uniforms = { uTime: { value: 0 }, uIntensity: { value: 1.2 } };

const GAS_VERTEX = /* glsl */`
#include <common>
#include <skinning_pars_vertex>
uniform float uTime;
uniform float uInflate;
varying vec3 vPos;
varying vec3 vNormal;
varying vec3 vViewPosition;
void main() {
  vPos = position;
  #include <beginnormal_vertex>
  #include <skinnormal_vertex>
  #include <begin_vertex>
  #include <skinning_vertex>
  transformed += normalize(objectNormal) * uInflate;
  #include <project_vertex>
  vNormal = normalize(normalMatrix * objectNormal);
  vViewPosition = -mvPosition.xyz;
}
`;

const GAS_FRAGMENT = /* glsl */`
uniform float uTime;
uniform vec3 uColorDeep;
uniform vec3 uColorHot;
uniform float uIntensity;
varying vec3 vPos;
varying vec3 vNormal;
varying vec3 vViewPosition;
float gas(vec3 p, float t) {
  float n = sin(p.x * 11.0 + t * 1.9) * sin(p.y * 9.0 - t * 1.4) * sin(p.z * 10.0 + t * 2.2);
  n += 0.5 * sin(p.x * 23.0 - t * 2.9 + p.y * 17.0) * sin(p.z * 21.0 + t * 2.4);
  n += 0.25 * sin((p.x + p.y * 1.3 + p.z) * 37.0 + t * 4.4);
  return n / 1.75 * 0.5 + 0.5;
}
void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vViewPosition);
  float fresnel = pow(1.0 - abs(dot(N, V)), 1.6);
  float g = gas(vPos * 2.0, uTime);
  // Wisps with transparent gaps: most of the shell stays invisible.
  float wisp = smoothstep(0.42, 0.78, g);
  float fil = smoothstep(0.78, 0.96, g);
  vec3 col = mix(uColorDeep, uColorHot, clamp(fil * 1.2 + fresnel * 0.4, 0.0, 1.0)) * uIntensity;
  float alpha = clamp(wisp * 0.32 + fil * 0.28 + fresnel * 0.1, 0.0, 0.55);
  gl_FragColor = vec4(col, alpha);
}
`;

function gasMaterial() {
  if (!_gasMat) {
    _gasMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: _uniforms.uTime,
        uIntensity: _uniforms.uIntensity,
        uInflate: { value: 0.02 },
        uColorDeep: { value: new THREE.Color(0x0a5c22) },
        uColorHot: { value: new THREE.Color(0x5cff8a) },
      },
      vertexShader: GAS_VERTEX,
      fragmentShader: GAS_FRAGMENT,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }
  return _gasMat;
}

function getFogTexture() {
  if (_fogTexture || _fogTextureTried) {
    return _fogTexture;
  }
  _fogTextureTried = true;
  if (typeof document === 'undefined' || typeof document.createElement !== 'function') {
    return null;
  }
  let state = 0xF09;
  const rand = () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 9; i++) {
    const cx = size * (0.3 + rand() * 0.4);
    const cy = size * (0.3 + rand() * 0.4);
    const r = size * (0.12 + rand() * 0.16);
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    const a = 0.1 + rand() * 0.1;
    g.addColorStop(0, `rgba(120,255,160,${a.toFixed(3)})`);
    g.addColorStop(1, 'rgba(40,180,90,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  _fogTexture = new THREE.CanvasTexture(canvas);
  _fogTexture.colorSpace = THREE.SRGBColorSpace;
  return _fogTexture;
}

function ensureFogMats() {
  if (_fogMatA) {
    return;
  }
  const map = getFogTexture();
  const make = (color, opacity) => new THREE.SpriteMaterial({
    map,
    color: new THREE.Color(color),
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  _fogMatA = make(0x2bd65a, 0.22);
  _fogMatB = make(0x1fae4c, 0.2);
}

function isExcluded(obj) {
  let node = obj;
  while (node) {
    if (EXCLUDED.has(node.name)) {
      return true;
    }
    node = node.parent;
  }
  return false;
}

/**
 * Wraps every body mesh in a gaseous shell and pools fog at the feet.
 * Idempotent; never touches the model's own materials or geometry.
 * Returns the marker group, or null without a model.
 */
export function addNecronAura(model) {
  if (!model) {
    return null;
  }
  const existing = typeof model.getObjectByName === 'function'
    ? model.getObjectByName(AURA_GROUP)
    : null;
  if (existing) {
    return existing;
  }
  const mat = gasMaterial();
  const bodies = [];
  model.traverse((child) => {
    if (!child.isMesh || child.isSprite) {
      return;
    }
    if (child.material === mat || isExcluded(child)) {
      return;
    }
    bodies.push(child);
  });
  for (const body of bodies) {
    const shell = body.isSkinnedMesh
      ? new THREE.SkinnedMesh(body.geometry, mat)
      : new THREE.Mesh(body.geometry, mat);
    shell.name = `${body.name}${SHELL_SUFFIX}`;
    shell.position.copy(body.position);
    shell.quaternion.copy(body.quaternion);
    shell.scale.copy(body.scale);
    shell.frustumCulled = body.frustumCulled;
    shell.castShadow = false;
    shell.receiveShadow = false;
    shell.userData.pickable = false;
    shell.renderOrder = 5;
    body.parent.add(shell);
    if (shell.isSkinnedMesh) {
      shell.bind(body.skeleton, body.bindMatrix);
    }
  }
  ensureFogMats();
  const group = mkGroup(AURA_GROUP);
  group.userData.pickable = false;
  for (const fog of FOG) {
    const sprite = new THREE.Sprite(fog.mat === 'A' ? _fogMatA : _fogMatB);
    sprite.name = 'necron_aura_fog';
    sprite.position.set(fog.pos[0], fog.pos[1], fog.pos[2]);
    sprite.scale.set(fog.scale, fog.scale, 1);
    sprite.userData.pickable = false;
    group.add(sprite);
  }
  model.add(group);
  return group;
}

/**
 * Advances the shared gas animation. Absolute time in seconds; safe to call
 * headless (updates uniforms even before any install).
 */
export function updateNecronAura(time) {
  const t = time || 0;
  _uniforms.uTime.value = t;
  _uniforms.uIntensity.value = 1.2 + 0.2 * Math.sin(t * 2.1) + 0.08 * Math.sin(t * 5.3 + 1.0);
  if (_fogMatA) {
    _fogMatA.opacity = 0.21 + Math.sin(t * 1.7) * 0.05;
    _fogMatA.rotation = t * 0.1;
  }
  if (_fogMatB) {
    _fogMatB.opacity = 0.19 + Math.sin(t * 2.1 + 2.4) * 0.045;
    _fogMatB.rotation = -t * 0.08;
  }
}
