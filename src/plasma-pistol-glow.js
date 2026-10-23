import * as THREE from 'three';
import { mkGroup, findNodesByName } from './three-helpers.js';

// ══════════════════════════════════════════════════════════════════════════════
//  GUARDSMEN PLASMA PISTOL GLOW — Soulstorm-style internal plasma energy.
//
//  The pistol mesh shares the body material, which ships an emissive texture
//  that stays dark while emissive is black. This module assigns the pistol a
//  SHARED emissive clone (chamber lights up, body and asset untouched) and
//  parents a compact glow assembly (halos + micro-sparks + one short-range
//  PointLight) to the hand weapon BONE, not the pistol mesh: the pistol is a
//  skinned mesh whose node never moves, so mesh-parented sprites would freeze
//  at the bind pose while the gun animates away. Anchored to
//  marker_plasma_glow. Visibility follows the pistol via _toggleMeshNode.
//
//  Wiring: _makeFactionSoldierMesh() calls addPlasmaPistolGlow() for every
//  soldier; game.js calls updatePlasmaPistolGlow() once per frame.
//
//  Perf: one shared material clone + shared sprite materials + one shared
//  texture for all pistols; per pistol one capsule core mesh with a gaseous
//  shell, one halo sprite, one micro-spark sprite and one PointLight.
//  Steady install-time values — zero per-frame CPU per soldier.
//
//  Bloom: materials run HDR (>1 brightness) with additive halos, which reads
//  as localized bloom. No global EffectComposer is added: the game ships
//  dual WebGL/WebGPU backends with live switching, and three's composer
//  passes are WebGL-oriented.
// ══════════════════════════════════════════════════════════════════════════════

export const GUN_MESH = 'guardsmen_plasma_pistol';
export const WEAPON_BONE = 'bone_ig_hand_weapon_r';
const GLOW_MARKER = 'marker_plasma_glow';
const MUZZLE_MARKER = 'marker_plasma_muzzle';

let _plasmaMats = null;
const _spillLights = [];


function _pruneDeadLights() {
  for (let i = _spillLights.length - 1; i >= 0; i--) {
    let node = _spillLights[i];
    let alive = true;
    while (node) {
      if (node.userData && node.userData.disposed) {
        alive = false;
        break;
      }
      node = node.parent;
    }
    if (!alive) {
      _spillLights.splice(i, 1);
    }
  }
}
let _plasmaGeo = null;
let _haloMat = null;
let _sparkMat = null;
let _glowTexture = null;
let _coreGeo = null;
let _coreMat = null;
const _coreBase = new THREE.Color(0xf0e6ff);
// Capsule center rides ahead of the chamber marker, toward the muzzle.
const CORE_MUZZLE_SHIFT = 0.12;

let _gasGeo = null;
let _gasMat = null;

// Static gaseous envelope (same noise-shell pattern as the necron aura,
// minus the clock): thresholded sin-noise leaves transparent gaps, fresnel
// softens the silhouette. Deliberately no uTime — steady by design.
const GAS_VERTEX = /* glsl */`
varying vec3 vPos;
varying vec3 vNormal;
varying vec3 vViewPosition;
void main() {
  vPos = position;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vNormal = normalize(normalMatrix * normal);
  vViewPosition = -mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;
}
`;

const GAS_FRAGMENT = /* glsl */`
uniform vec3 uColorDeep;
uniform vec3 uColorHot;
uniform float uIntensity;
varying vec3 vPos;
varying vec3 vNormal;
varying vec3 vViewPosition;
float gas(vec3 p) {
  float n = sin(p.x * 11.0 + 1.7) * sin(p.y * 9.0 - 0.6) * sin(p.z * 10.0 + 2.9);
  n += 0.5 * sin(p.x * 23.0 - 2.2 + p.y * 17.0) * sin(p.z * 21.0 + 0.9);
  n += 0.25 * sin((p.x + p.y * 1.3 + p.z) * 37.0 + 4.1);
  return n / 1.75 * 0.5 + 0.5;
}
void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vViewPosition);
  float fresnel = pow(1.0 - abs(dot(N, V)), 1.6);
  float g = gas(vPos * 5.0);
  float wisp = smoothstep(0.35, 0.72, g);
  float fil = smoothstep(0.72, 0.95, g);
  vec3 col = mix(uColorDeep, uColorHot, clamp(fil * 1.2 + fresnel * 0.4, 0.0, 1.0)) * uIntensity;
  float alpha = clamp(wisp * 0.3 + fil * 0.3 + fresnel * 0.12, 0.0, 0.55);
  gl_FragColor = vec4(col, alpha);
}
`;

function gasMaterial() {
  if (!_gasMat) {
    _gasMat = new THREE.ShaderMaterial({
      uniforms: {
        uColorDeep: { value: new THREE.Color(0x2e2a99) },
        uColorHot: { value: new THREE.Color(0xbfb8ff) },
        uIntensity: { value: 1.4 },
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

function getGlowTexture() {
  if (_glowTexture) {
    return _glowTexture;
  }
  const size = 64;
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = (x / (size - 1)) * 2 - 1;
      const dy = (y / (size - 1)) * 2 - 1;
      const dist = Math.min(1, Math.hypot(dx, dy));
      const alpha = Math.pow(1 - dist, 2.6);
      const i = (y * size + x) * 4;
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
      data[i + 3] = Math.round(alpha * 255);
    }
  }
  _glowTexture = new THREE.DataTexture(data, size, size);
  _glowTexture.needsUpdate = true;
  return _glowTexture;
}

function getHaloMat() {
  if (!_haloMat) {
    _haloMat = new THREE.SpriteMaterial({
      map: getGlowTexture(),
      color: new THREE.Color(0x5569ff),
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }
  return _haloMat;
}

function getSparkMat() {
  if (!_sparkMat) {
    _sparkMat = new THREE.SpriteMaterial({
      map: getGlowTexture(),
      color: new THREE.Color(0x7d96ff),
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }
  return _sparkMat;
}

/**
 * Finds the plasma pistol in a soldier model and installs the full glow
 * effect: shared emissive material, halo layers, micro-sparks and one
 * short-range light, all parented to the hand weapon bone so the assembly
 * follows the skinned gun through every animation. Idempotent: returns
 * the existing assembly when already installed. Returns null when the
 * model has no pistol or plasma markers.
 */
export function addPlasmaPistolGlow(model) {
  if (!model) {
    return null;
  }
  const pistol = findNodesByName(model, [GUN_MESH]).find((n) => n.isMesh) || null;
  if (!pistol || !pistol.material) {
    return null;
  }
  const existing = typeof model.getObjectByName === 'function'
    ? model.getObjectByName('plasma_pistol_glow')
    : null;
  if (existing) {
    return existing;
  }
  const glows = findNodesByName(model, [GLOW_MARKER]);
  const muzzles = findNodesByName(model, [MUZZLE_MARKER]);
  if (!glows.length || !muzzles.length) {
    return null;
  }
  const anchor = findNodesByName(model, [WEAPON_BONE])[0] || pistol;

  // Shared emissive clone: chamber (emissiveMap) burns, body untouched.
  const srcMats = Array.isArray(pistol.material) ? pistol.material : [pistol.material];
  if (!srcMats.every((m) => m && m.emissive)) {
    return null;
  }
  // Anchors in assembly space (markers live under the weapon bone).
  model.updateMatrixWorld(true);
  const glowWorld = glows[0].getWorldPosition(new THREE.Vector3());
  const muzzleWorld = muzzles[0].getWorldPosition(new THREE.Vector3());
  const chamber = anchor.worldToLocal(glowWorld.clone());
  const muzzle = anchor.worldToLocal(muzzleWorld.clone());
  // The emissive mask lives on the pistol geometry: same point, pistol space.
  const chamberOnPistol = pistol.worldToLocal(glowWorld.clone());
  if (!_plasmaMats) {
    _plasmaMats = srcMats.map((m) => {
      const clone = m.clone();
      clone.emissive = new THREE.Color(0xe4daff);
      clone.emissiveIntensity = 4.2;
      clone.onBeforeCompile = (shader) => {
        shader.vertexShader = 'attribute float aEmissive;\nvarying float vEmissive;\n'
          + shader.vertexShader.replace(
            '#include <begin_vertex>',
            '#include <begin_vertex>\nvEmissive = aEmissive;',
          );
        shader.fragmentShader = 'varying float vEmissive;\n'
          + shader.fragmentShader.replace(
            '#include <emissivemap_fragment>',
            '#include <emissivemap_fragment>\ntotalEmissiveRadiance *= vEmissive;',
          );
      };
      clone.customProgramCacheKey = () => 'plasmaPistolChamberMask';
      return clone;
    });
  }
  pistol.material = Array.isArray(pistol.material) ? _plasmaMats : _plasmaMats[0];

  // Shared masked geometry: full emissive only around the chamber anchor,
  // cosine falloff to zero — the rest of the gun stays dark metal.
  if (!_plasmaGeo && pistol.geometry?.attributes?.position) {
    const geo = pistol.geometry.clone();
    geo.computeBoundingSphere();
    const radius = (geo.boundingSphere?.radius || 0.5) * 0.6;
    const posAttr = geo.attributes.position;
    const mask = new Float32Array(posAttr.count);
    const v = new THREE.Vector3();
    for (let i = 0; i < posAttr.count; i++) {
      v.fromBufferAttribute(posAttr, i);
      const d = v.distanceTo(chamberOnPistol);
      if (d <= radius * 0.4) {
        mask[i] = 1;
      } else if (d >= radius) {
        mask[i] = 0;
      } else {
        const t = (d - radius * 0.4) / (radius * 0.6);
        mask[i] = 0.5 + 0.5 * Math.cos(t * Math.PI);
      }
    }
    geo.setAttribute('aEmissive', new THREE.BufferAttribute(mask, 1));
    _plasmaGeo = geo;
  }
  if (_plasmaGeo) {
    pistol.geometry = _plasmaGeo;
  }

  const group = mkGroup('plasma_pistol_glow');
  group.userData.pickable = false;
  const haloMat = getHaloMat();
  const layers = [
    { at: chamber, scale: 0.55 },
  ];
  for (const { at, scale } of layers) {
    const sprite = new THREE.Sprite(haloMat);
    sprite.name = 'plasma_pistol_halo';
    sprite.position.copy(at);
    sprite.scale.set(scale, scale, 1);
    sprite.userData.pickable = false;
    group.add(sprite);
  }
  const sparkMat = getSparkMat();
  const sparkOffsets = [
    [0.08, 0.06, 0.03, 0.12],
  ];
  for (const [ox, oy, oz, scale] of sparkOffsets) {
    const spark = new THREE.Sprite(sparkMat);
    spark.name = 'plasma_pistol_spark';
    spark.position.set(chamber.x + ox, chamber.y + oy, chamber.z + oz);
    spark.scale.set(scale, scale, 1);
    spark.userData.pickable = false;
    group.add(spark);
  }
  const spill = new THREE.PointLight(0x738cff, 1.6, 3.2, 2);
  spill.name = 'plasma_pistol_spill';
  spill.position.copy(chamber);
  group.add(spill);
  _spillLights.push(spill);

  // Capsule core: the bright heart of the effect — a thin white-blue
  // capsule sunk into the chamber, long axis along the barrel.
  if (!_coreGeo) {
    _coreGeo = new THREE.CapsuleGeometry(0.04, 0.12, 6, 12);
    _coreGeo.userData.shared = true;
  }
  if (!_coreMat) {
    _coreMat = new THREE.MeshBasicMaterial({ color: _coreBase.clone() });
  }
  const core = new THREE.Mesh(_coreGeo, _coreMat);
  core.name = 'plasma_pistol_core';
  core.position.copy(chamber);
  const barrelDir = muzzle.clone().sub(chamber);
  if (barrelDir.lengthSq() > 1e-8) {
    barrelDir.normalize();
    core.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), barrelDir);
    core.position.addScaledVector(barrelDir, CORE_MUZZLE_SHIFT);
  }
  core.userData.pickable = false;
  group.add(core);

  // Gas envelope: a larger capsule shell with the static noise shader —
  // gaseous glow clinging to the core. Shared geo + material.
  if (!_gasGeo) {
    _gasGeo = new THREE.CapsuleGeometry(0.075, 0.16, 6, 12);
    _gasGeo.userData.shared = true;
  }
  const gas = new THREE.Mesh(_gasGeo, gasMaterial());
  gas.name = 'plasma_pistol_gas';
  gas.position.copy(core.position);
  gas.quaternion.copy(core.quaternion);
  gas.userData.pickable = false;
  group.add(gas);

  group.visible = pistol.visible;
  anchor.add(group);
  return group;
}

/**
 * Per-frame hook (kept for the game loop). The glow is steady by design:
 * install-time values are the final look, so there is nothing to animate.
 * Only prunes lights of removed soldiers. Safe to call headless.
 */
export function updatePlasmaPistolGlow() {
  _pruneDeadLights();
}
