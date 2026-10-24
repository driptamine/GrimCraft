// Soulstorm-style plasma pistol bolt: white-hot tablet/capsule core, turbulent
// electric-blue shell, transparent halo, crackling tendril filaments, arc-flash
// sprites and one halo sprite. Static layered geometry lives in
// models/ig/projectiles/plasma_bolt.glb (regenerate with
// scripts/generate-plasma-bolt.mjs); runtime swaps in shared animated materials
// so dozens of bolts cost ~1 uniform update per frame, plus cheap per-bolt
// crackle rewrites (in-place, no allocation) via updatePlasmaBoltCrackle.
import * as THREE from 'three';
import { loadTexture, mkGroup } from './three-helpers.js';
import { _instantiateFromContainer } from './model-upload.js';
import { modelUrl } from './assets.js';

export const PLASMA_BOLT_PATH = 'models/ig/projectiles/plasma_bolt.glb';
export const PLASMA_FX_DIR = 'models/ig/projectiles/plasma-fx';
export const BOLT_CORE_NAME = 'bolt_core';
export const BOLT_SHELL_NAME = 'bolt_shell';
export const BOLT_HALO_NAME = 'bolt_halo';
export const TENDRIL_PREFIX = 'tendril_';

let _boltContainer = null;
let _shared = null;

const SHELL_VERTEX = /* glsl */`
uniform float uTime;
varying vec3 vPos;
varying vec3 vNormal;
varying float vPhase;
void main() {
  vPos = position;
  vNormal = normalMatrix * normal;
  // Per-bolt phase from spawn position: bolts flicker out of sync for free.
  vec4 origin = modelMatrix * vec4(0.0, 0.0, 0.0, 1.0);
  vPhase = fract(sin(dot(origin.xz, vec2(12.9898, 78.233))) * 43758.5453) * 6.2831;
  vec3 p = position;
  float wobble = sin(position.y * 52.0 + uTime * 13.0 + vPhase)
    + 0.6 * sin(position.z * 40.0 - uTime * 17.0 + vPhase * 1.7);
  p += normal * wobble * 0.006;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

const SHELL_FRAGMENT = /* glsl */`
uniform float uTime;
uniform float uFlicker;
varying vec3 vPos;
varying vec3 vNormal;
varying float vPhase;
void main() {
  // Turbulent brightness bands crawling along the bolt body.
  float bands = sin(vPos.z * 68.0 - uTime * 26.0 + vPhase)
    + 0.5 * sin(vPos.z * 134.0 + uTime * 37.0 + vPhase * 2.3);
  float heat = clamp(0.55 + bands * 0.22, 0.0, 1.3);
  vec3 deep = vec3(0.06, 0.18, 0.85);
  vec3 hot = vec3(0.6, 0.85, 1.0);
  vec3 col = mix(deep, hot, heat * heat) * uFlicker;
  gl_FragColor = vec4(col * 0.9, 0.62);
}
`;

function _makeGlowTexture() {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.25, 'rgba(150,200,255,0.75)');
  gradient.addColorStop(0.55, 'rgba(50,120,255,0.28)');
  gradient.addColorStop(1, 'rgba(15,45,170,0)');
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

// Jagged electric-arc streak texture for the crackle flash sprites.
function _makeArcTexture(seed) {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  let state = seed >>> 0;
  const rand = () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const points = [];
  const segments = 9;
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    points.push([
      size * 0.08 + t * size * 0.84,
      size * 0.5 + (rand() - 0.5) * size * 0.55 * Math.sin(Math.PI * Math.min(1, t * 1.05)),
    ]);
  }
  const stroke = (width, style, blur) => {
    ctx.strokeStyle = style;
    ctx.lineWidth = width;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.shadowColor = 'rgba(80,140,255,0.9)';
    ctx.shadowBlur = blur;
    ctx.beginPath();
    points.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
    ctx.stroke();
  };
  stroke(10, 'rgba(30,90,255,0.35)', 14);
  stroke(4.5, 'rgba(90,170,255,0.8)', 8);
  stroke(1.8, 'rgba(255,255,255,0.95)', 4);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Rewrite a tendril's points in place: new random jagged discharge, zero alloc.
// Size-agnostic: follows the half-length / base radius measured at build time.
function _rewriteTendril(line) {
  const pos = line.geometry.attributes.position;
  const { halfLen, baseR } = line.userData.crackleBase;
  const phase = Math.random() * Math.PI * 2;
  const turns = 1.1 + Math.random() * 0.9;
  const count = pos.count;
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0 : i / (count - 1);
    const z = (t * 2 - 1) * halfLen;
    const envelope = baseR * (0.25 + 0.75 * Math.pow(Math.sin(Math.PI * t), 0.5));
    const angle = phase + t * turns * Math.PI * 2 + (Math.random() - 0.5) * 1.1;
    const r = envelope * (0.65 + Math.random() * 0.7);
    pos.setXYZ(i, Math.cos(angle) * r, Math.sin(angle) * r, z);
  }
  pos.needsUpdate = true;
}

function _measureTendrilBase(line) {
  line.geometry.computeBoundingBox();
  const box = line.geometry.boundingBox;
  const size = box.getSize(new THREE.Vector3());
  const pos = line.geometry.attributes.position;
  let baseR = 0;
  for (let i = 0; i < pos.count; i++) {
    baseR = Math.max(baseR, Math.hypot(pos.getX(i), pos.getY(i)));
  }
  line.userData.crackleBase = { halfLen: size.z / 2 || 0.26, baseR: baseR || 0.07 };
  line.frustumCulled = false; // bounds change on every crackle rewrite
}

function _sharedAssets() {
  if (_shared) {
    return _shared;
  }
  const coreGeo = _markShared(new THREE.CapsuleGeometry(0.04, 0.26, 4, 12));
  coreGeo.rotateX(Math.PI / 2); // capsule axis Y -> flight axis +Z
  const shellGeo = _markShared(new THREE.CapsuleGeometry(0.065, 0.32, 4, 14));
  shellGeo.rotateX(Math.PI / 2);
  const haloGeo = _markShared(new THREE.CapsuleGeometry(0.11, 0.36, 4, 12));
  haloGeo.rotateX(Math.PI / 2);
  _shared = {
    uniforms: { uTime: { value: 0 }, uFlicker: { value: 1 } },
    coreGeo,
    shellGeo,
    haloGeo,
    coreMat: new THREE.MeshBasicMaterial({ color: new THREE.Color(0xeaf6ff) }),
    shellMat: new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uFlicker: { value: 1 } },
      vertexShader: SHELL_VERTEX,
      fragmentShader: SHELL_FRAGMENT,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
    haloMat: new THREE.MeshBasicMaterial({
      color: new THREE.Color(0x1e56ff),
      transparent: true,
      opacity: 0.32,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
    tendrilMat: new THREE.LineBasicMaterial({
      color: new THREE.Color(0x4fb8ff),
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    }),
    glowTexture: null,
    arcTextures: null,
  };
  // Keep both uniform objects in sync without per-bolt updates.
  _shared.shellMat.uniforms.uTime = _shared.uniforms.uTime;
  _shared.shellMat.uniforms.uFlicker = _shared.uniforms.uFlicker;
  return _shared;
}

// Plasma Final dressing from the plasma-fx folder (DDS): beam streak along
// the bolt, head flash sprite, 3-frame muzzle blast. Textures load once via
// the shared DDS path (async-filled placeholder, same as everywhere else).
const _finalFx = { beam: null, flash: null, muzzle: [] };

export function plasmaFinalFxTextures() {
  const canDom =
    typeof document !== 'undefined' &&
    typeof document.createElement === 'function' &&
    typeof fetch !== 'undefined';
  if (!canDom) {
    return null;
  }
  if (!_finalFx.beam) {
    // Route through modelUrl: in production these live on R2, and the bar
    // tracks them like every other download.
    _finalFx.beam = loadTexture(modelUrl(`${PLASMA_FX_DIR}/plasma_beam_1.dds`));
    _finalFx.flash = loadTexture(modelUrl(`${PLASMA_FX_DIR}/plasma_flash_1.dds`));
    _finalFx.muzzle = [1, 2, 3].map((i) => loadTexture(modelUrl(`${PLASMA_FX_DIR}/plasma_muzzle_${i}.dds`)));
  }
  return _finalFx;
}

export async function preloadPlasmaFinalFx() {
  plasmaFinalFxTextures();
}

const FINAL_BEAM_TINT = 0xffe9c4;
const FINAL_FLASH_TINT = 0xffd9a0;
const FINAL_MUZZLE_LIFE = 0.12;

export function makePlasmaFinalBoltMesh() {
  // Full plasma contract (filaments/tendrils/arcs/crackle) so
  // systemPlasmaBullet drives it unchanged, plus the plasma-fx dressing.
  const root = makePlasmaBoltMesh();
  const fx = plasmaFinalFxTextures();
  if (!fx) {
    return root;
  }
  const beamMat = new THREE.MeshBasicMaterial({
    map: fx.beam,
    color: new THREE.Color(FINAL_BEAM_TINT),
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  // Crossed quads around the flight axis (+Z): length along Z.
  const beamA = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.34), beamMat);
  beamA.rotation.y = Math.PI / 2;
  beamA.position.z = 0.25;
  const beamB = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 1.5), beamMat);
  beamB.rotation.x = Math.PI / 2;
  beamB.position.z = 0.25;
  root.add(beamA, beamB);
  const flash = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: fx.flash,
      color: new THREE.Color(FINAL_FLASH_TINT),
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  flash.name = 'finalflash';
  flash.scale.set(0.9, 0.9, 1);
  flash.position.z = 0.55;
  root.add(flash);
  return root;
}

// Muzzle blast on the shooter: camera-facing sprite cycling the 3 muzzle
// frames over FINAL_MUZZLE_LIFE seconds. No ECS entity (visual only, runs
// identically on every client) — ticked from systemSoldier next to the
// existing flashTimer block.
export function attachPlasmaMuzzleFlash(meshRoot) {
  if (!meshRoot) {
    return;
  }
  const fx = plasmaFinalFxTextures();
  if (!fx) {
    return;
  }
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: fx.muzzle[0],
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  sprite.name = 'finalmuzzle';
  sprite.scale.set(1.4, 0.7, 1);
  sprite.position.set(0, 1.3, 0.3);
  meshRoot.add(sprite);
  meshRoot.userData.finalMuzzle = { sprite, t: 0 };
}

export function updatePlasmaMuzzleFlash(meshRoot, deltaTime) {
  const state = meshRoot?.userData?.finalMuzzle;
  if (!state) {
    return;
  }
  state.t += deltaTime;
  const fx = plasmaFinalFxTextures();
  if (state.t >= FINAL_MUZZLE_LIFE || !fx) {
    meshRoot.remove(state.sprite);
    state.sprite.material.dispose();
    delete meshRoot.userData.finalMuzzle;
    return;
  }
  const frame = Math.min(2, Math.floor((state.t / FINAL_MUZZLE_LIFE) * 3));
  state.sprite.material.map = fx.muzzle[frame];
  state.sprite.material.opacity = 1 - state.t / FINAL_MUZZLE_LIFE;
}

export async function preloadPlasmaBoltModel() {
  if (_boltContainer) {
    return _boltContainer;
  }
  try {
    const [{ loadGltf }, { modelUrl }] = await Promise.all([
      import('./gltf-models.js'),
      import('./assets.js'),
    ]);
    const container = await loadGltf(modelUrl(PLASMA_BOLT_PATH));
    if (container) {
      _boltContainer = container;
    }
  } catch (err) {
    console.warn('[plasma] bolt model failed to load, using procedural fallback', err);
  }
  return _boltContainer;
}

export function __setPlasmaBoltContainerForTests(container) {
  _boltContainer = container;
}

function _findBoltNodes(model) {
  const found = { core: null, shell: null, halo: null, tendrils: [] };
  model.traverse((child) => {
    const name = child.name || '';
    if (name === BOLT_CORE_NAME) found.core = child;
    else if (name === BOLT_SHELL_NAME) found.shell = child;
    else if (name === BOLT_HALO_NAME) found.halo = child;
    else if (name.startsWith(TENDRIL_PREFIX) && child.isLine) found.tendrils.push(child);
  });
  return found;
}

function _buildProceduralBolt(shared) {
  const model = mkGroup('boltmodel');
  const core = new THREE.Mesh(shared.coreGeo, shared.coreMat);
  core.name = BOLT_CORE_NAME;
  const shell = new THREE.Mesh(shared.shellGeo, shared.shellMat);
  shell.name = BOLT_SHELL_NAME;
  const halo = new THREE.Mesh(shared.haloGeo, shared.haloMat);
  halo.name = BOLT_HALO_NAME;
  const filaments = mkGroup('boltfilaments');
  for (let f = 0; f < 3; f++) {
    // Per-bolt geometry (never shared): the crackle tick rewrites it in place.
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(12 * 3), 3));
    const line = new THREE.Line(geo, shared.tendrilMat);
    line.name = `${TENDRIL_PREFIX}0${f + 1}`;
    line.userData.crackleBase = { halfLen: 0.26, baseR: 0.07 };
    line.frustumCulled = false;
    _rewriteTendril(line);
    filaments.add(line);
  }
  model.add(core, shell, halo, filaments);
  return { model, core, shell, halo, tendrils: [...filaments.children], filaments };
}

function _applySharedMaterials(shared, parts) {
  parts.core.material = shared.coreMat;
  parts.shell.material = shared.shellMat;
  parts.halo.material = shared.haloMat;
  parts.halo.visible = false;
  for (const line of parts.tendrils) {
    line.material = shared.tendrilMat;
    if (!line.userData.crackleBase) {
      // GLB path: clone so the crackle rewrite stays per-bolt.
      line.geometry = line.geometry.clone();
      line.geometry.userData.shared = false;
      _measureTendrilBase(line);
    }
  }
  for (const mesh of [parts.core, parts.shell, parts.halo]) {
    _markShared(mesh.geometry);
  }
}

export function makePlasmaBoltMesh() {
  const shared = _sharedAssets();
  let model = null;
  let parts = null;
  if (_boltContainer) {
    try {
      model = _instantiateFromContainer(_boltContainer, {});
      const found = _findBoltNodes(model);
      if (found.core && found.shell && found.halo) {
        parts = { model, ...found, filaments: null };
      } else {
        model = null;
      }
    } catch {
      model = null;
    }
  }
  if (!model) {
    parts = _buildProceduralBolt(shared);
    model = parts.model;
  }
  _applySharedMaterials(shared, parts);
  if (!shared.glowTexture && typeof document !== 'undefined' && typeof document.createElement === 'function') {
    shared.glowTexture = _makeGlowTexture();
  }
  const root = mkGroup('plasmabolt');
  root.add(model);
  let filaments = parts.filaments;
  if (!filaments) {
    // GLB path: regroup tendrils so the system can spin them cheaply.
    filaments = mkGroup('boltfilaments');
    for (const line of parts.tendrils) {
      filaments.add(line);
    }
    model.add(filaments);
  }
  if (shared.glowTexture) {
    const glow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: shared.glowTexture,
        color: new THREE.Color(0x3f8cff),
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    glow.name = 'boltglow';
    glow.scale.set(0.45, 0.45, 1);
    root.add(glow);
  }
  root.userData.filaments = filaments;
  root.userData.tendrils = parts.tendrils;
  root.userData.arcs = [];
  root.userData.crackle = { next: 0 };
  const canCanvas = typeof document !== 'undefined' && typeof document.createElement === 'function';
  if (canCanvas) {
    if (!shared.arcTextures) {
      shared.arcTextures = [_makeArcTexture(0xA1C), _makeArcTexture(0xE9A)];
    }
    for (let a = 0; a < 2; a++) {
      // Per-bolt material (own rotation/visibility), shared texture.
      const arc = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: shared.arcTextures[a % shared.arcTextures.length],
          color: new THREE.Color(0x9fd0ff),
          transparent: true,
          opacity: 0.85,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );
      arc.name = `boltarcs${a + 1}`;
      arc.scale.set(0.5, 0.5, 1);
      arc.visible = false;
      root.add(arc);
      root.userData.arcs.push(arc);
    }
  }
  return root;
}

// Electrification: every ~0.06-0.12s each bolt re-rolls its discharges —
// tendrils get new jagged paths (in-place rewrite, no allocation) and arc
// flashes blink with random orientation. Call per bolt from systemPlasmaBullet.
export function updatePlasmaBoltCrackle(root, age) {
  const crackle = root.userData.crackle;
  if (!crackle || age < crackle.next) {
    return;
  }
  crackle.next = age + 0.06 + Math.random() * 0.06;
  for (const line of root.userData.tendrils || []) {
    _rewriteTendril(line);
  }
  for (const arc of root.userData.arcs || []) {
    arc.visible = Math.random() < 0.4;
    if (arc.visible) {
      arc.material.rotation = Math.random() * Math.PI * 2;
      const s = 0.35 + Math.random() * 0.3;
      arc.scale.set(s, s, 1);
    }
  }
}

// Irregular slow pulse: layered sines, never a cheap blink.
export function updatePlasmaBoltFx(time) {
  const shared = _sharedAssets();
  shared.uniforms.uTime.value = time;
  const flicker =
    0.86 +
    0.1 * Math.sin(time * 11.3) +
    0.05 * Math.sin(time * 27.7 + 1.3) +
    0.03 * Math.sin(time * 47.1 + 4.1);
  shared.uniforms.uFlicker.value = flicker;
  shared.tendrilMat.opacity = Math.min(1, 0.45 + flicker * 0.45);
  shared.haloMat.opacity = 0.22 + flicker * 0.12;
}
