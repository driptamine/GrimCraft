import * as THREE from 'three';
import { mkGroup, findNodesByName } from './three-helpers.js';

// ══════════════════════════════════════════════════════════════════════════════
//  KASRKIN PLASMAGUN GLOW — Soulstorm-style internal plasma energy.
//
//  The kasrkin_plasmagun mesh shares the body material, which ships an
//  emissive texture that stays dark while emissive is black. This module
//  assigns the gun mesh a SHARED emissive clone (coils light up, body and
//  asset untouched) and adds a capsule core plus two small additive halo
//  sprites anchored to the plasma markers so the glow reads as coming
//  from inside the chamber.
//
//  Wiring: _makeFactionSoldierMesh() calls applyPlasmaGlow() for every
//  soldier; game.js calls updatePlasmaGlow() once per frame.
//
//  Perf: one shared material clone + one shared sprite material for all
//  plasma gunners; per soldier one capsule mesh and two Sprite nodes.
//  Animation is a single global pulse — zero per-frame CPU per soldier.
// ══════════════════════════════════════════════════════════════════════════════

const GUN_NODE = 'karskin_plasmagun';
const PWR_MARKER = 'marker_plasma_pwr';
const MUZZLE_MARKER = 'marker_plasma_muzzle';

let _plasmaMats = null;
let _haloMat = null;
let _glowTexture = null;
let _time = 0;
let _capsuleGeo = null;
let _capsuleMat = null;
const _capsuleBase = new THREE.Color(0xeaf4ff);
// Capsule center along the pwr -> muzzle axis (chamber/coils region).
const CAPSULE_T = 0.45;

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
      color: new THREE.Color(0x66ccff),
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }
  return _haloMat;
}

/**
 * Lights the plasmagun coils and attaches chamber halos under the weapon
 * bone of one soldier. Returns the halo group, or null when the model has
 * no (visible) plasmagun or plasma markers.
 */
export function applyPlasmaGlow(soldierRoot) {
  if (!soldierRoot) {
    return null;
  }
  const gun = findNodesByName(soldierRoot, [GUN_NODE]).find((n) => n.isMesh) || null;
  if (!gun || gun.visible === false || !gun.material) {
    return null;
  }
  const pwrs = findNodesByName(soldierRoot, [PWR_MARKER]);
  const muzzles = findNodesByName(soldierRoot, [MUZZLE_MARKER]);
  if (!pwrs.length || !muzzles.length) {
    return null;
  }
  const pwrNode = pwrs[0];
  const muzzleNode = muzzles[0];
  const parent = pwrNode.parent;
  if (!parent) {
    return null;
  }

  // Shared emissive clone: coils (emissiveMap) glow, body material untouched.
  const srcMats = Array.isArray(gun.material) ? gun.material : [gun.material];
  if (!srcMats.every((m) => m && m.emissive)) {
    return null;
  }
  if (!_plasmaMats) {
    _plasmaMats = srcMats.map((m) => {
      const clone = m.clone();
      clone.emissive = new THREE.Color(0x9fd4ff);
      clone.emissiveIntensity = 1.6;
      return clone;
    });
  }
  gun.material = Array.isArray(gun.material) ? _plasmaMats : _plasmaMats[0];

  // Halo anchors in the weapon-bone space, biased to chamber and coils.
  const pwrLocal = pwrNode.position.clone();
  let muzzleLocal;
  if (muzzleNode.parent === parent) {
    muzzleLocal = muzzleNode.position.clone();
  } else {
    parent.updateWorldMatrix(true, false);
    muzzleLocal = parent.worldToLocal(muzzleNode.getWorldPosition(new THREE.Vector3()));
  }
  const group = mkGroup('plasma_glow');
  group.userData.pickable = false;
  const haloMat = getHaloMat();
  const anchors = [
    { t: 0.38, scale: 0.42 },
    { t: 0.68, scale: 0.28 },
  ];
  for (const { t, scale } of anchors) {
    const sprite = new THREE.Sprite(haloMat);
    sprite.name = 'plasma_glow_halo';
    sprite.position.copy(pwrLocal).lerp(muzzleLocal, t);
    sprite.scale.set(scale, scale, 1);
    sprite.userData.pickable = false;
    group.add(sprite);
  }
  // Capsule core (same object as the pistol's, in kasrkin blue-white): a
  // thin bright capsule along the chamber axis. Shared geo + material.
  if (!_capsuleGeo) {
    _capsuleGeo = new THREE.CapsuleGeometry(0.05, 0.16, 6, 12);
    _capsuleGeo.userData.shared = true;
  }
  if (!_capsuleMat) {
    _capsuleMat = new THREE.MeshBasicMaterial({ color: _capsuleBase.clone() });
  }
  const capsule = new THREE.Mesh(_capsuleGeo, _capsuleMat);
  capsule.name = 'plasma_glow_capsule';
  const coilDir = muzzleLocal.clone().sub(pwrLocal);
  capsule.position.copy(pwrLocal).lerp(muzzleLocal, CAPSULE_T);
  if (coilDir.lengthSq() > 1e-8) {
    capsule.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), coilDir.normalize());
  }
  capsule.userData.pickable = false;
  group.add(capsule);
  parent.add(group);
  return group;
}

/**
 * Advances the shared plasma pulse. Called once per frame from the game
 * loop; safe to call headless (uniform/material update only).
 */
export function updatePlasmaGlow(deltaTime) {
  _time += deltaTime || 0;
  if (!_plasmaMats) {
    return;
  }
  const pulse = 1.5 + 0.25 * Math.sin(_time * 9.0) + 0.08 * Math.sin(_time * 31.0);
  for (const mat of _plasmaMats) {
    mat.emissiveIntensity = pulse;
  }
  if (_haloMat) {
    _haloMat.opacity = 0.36 + 0.08 * Math.sin(_time * 9.0 + 1.0);
  }
  if (_capsuleMat) {
    _capsuleMat.color.copy(_capsuleBase).multiplyScalar(pulse / 1.5);
  }
}
