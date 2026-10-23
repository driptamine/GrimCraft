import * as THREE from 'three';
import { mkGroup, mkTube, mkLines, findNodesByName } from './three-helpers.js';

// ══════════════════════════════════════════════════════════════════════════════
//  GAUSS FLAYER ENERGY CONDUIT — transparent tube + contained green energy
//  stream along the Necron Warrior barrel, anchored to the gun markers
//  (marker_gun_tube_ctr_base → marker_gun_tube_ctr_end, under bone_hand_r).
//
//  Wiring: _makeFactionSoldierMesh() calls attachGaussConduit() for necron
//  soldiers; game.js calls updateNecronConduits() once per frame.
//
//  Perf: geometries/materials are built ONCE (all warriors share one model)
//  and reused by every instance; per soldier only a few Object3D nodes are
//  added. Animation is a single shared shader time uniform — zero per-frame
//  CPU per soldier.
// ══════════════════════════════════════════════════════════════════════════════

const BASE_MARKER = 'marker_gun_tube_ctr_base';
const END_MARKER = 'marker_gun_tube_ctr_end';

const CASING_RADIUS = 0.035;
const STREAM_RADIUS = 0.012;
const RING_RADIUS = 0.045;
const RING_TUBE = 0.012;

let _template = null;
let _time = 0;

let _glowTexture = null;

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

const STREAM_VERTEX = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const STREAM_FRAGMENT = /* glsl */`
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  float pulse(float x, float t, float freq, float speed) {
    return pow(0.5 + 0.5 * sin((x * freq - t * speed) * 6.28318), 6.0);
  }
  void main() {
    // Two traveling energy pulses plus a fine electrical shimmer.
    float p1 = pulse(vUv.x, uTime, 3.0, 0.9);
    float p2 = pulse(vUv.x, uTime * 1.7 + 0.35, 7.0, 1.6);
    float flick = 0.85 + 0.15 * sin(uTime * 23.0 + vUv.x * 40.0);
    vec3 col = mix(uColorA, uColorB, clamp(p1 * 0.8 + p2 * 0.5, 0.0, 1.0)) * flick;
    float alpha = 0.75 + 0.25 * p1;
    gl_FragColor = vec4(col * 1.6, alpha);
  }
`;

function buildTemplate(baseLocal, endLocal) {
  const dir = endLocal.clone().sub(baseLocal);
  const length = dir.length() || 1;
  dir.normalize();
  const mid = baseLocal.clone().add(endLocal).multiplyScalar(0.5);
  const path = [baseLocal.clone(), mid.clone(), endLocal.clone()];

  const ref = Math.abs(dir.y) > 0.9 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
  const side = new THREE.Vector3().crossVectors(dir, ref).normalize();
  const upv = new THREE.Vector3().crossVectors(side, dir).normalize();
  const ringQuat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);

  // Transparent casing (built directly, not via mk*: shared, never attached).
  const casingGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(path), 24, CASING_RADIUS, 8, false);
  const casingMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x1a2a22),
    transparent: true,
    opacity: 0.3,
    roughness: 0.15,
    metalness: 0.6,
    depthWrite: false,
  });

  const streamGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(path), 48, STREAM_RADIUS, 6, false);
  const streamMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color(0x00a82b) },
      uColorB: { value: new THREE.Color(0xd8ffe0) },
    },
    vertexShader: STREAM_VERTEX,
    fragmentShader: STREAM_FRAGMENT,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  // Branching filaments contained inside the casing.
  const filamentGeos = [];
  for (let f = 0; f < 2; f++) {
    const pts = [];
    const count = 9;
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      const p = baseLocal.clone().addScaledVector(dir, t * length);
      if (i > 0 && i < count - 1) {
        p.addScaledVector(side, (Math.random() - 0.5) * 0.04);
        p.addScaledVector(upv, (Math.random() - 0.5) * 0.04);
      }
      pts.push(p);
    }
    filamentGeos.push(new THREE.BufferGeometry().setFromPoints(pts));
  }
  const filamentMat = new THREE.LineBasicMaterial({
    color: new THREE.Color(0x39ff6a),
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
  });

  const ringGeo = new THREE.TorusGeometry(RING_RADIUS, RING_TUBE, 6, 14);
  const ringMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x1a1a1c),
    roughness: 0.4,
    metalness: 0.9,
  });

  const glowMat = new THREE.SpriteMaterial({
    map: getGlowTexture(),
    color: new THREE.Color(0x00ff41),
    transparent: true,
    opacity: 0.32,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  return {
    dir, length, mid,
    ringQuat,
    ringOffsets: [0.25, 0.75],
    baseLocal: baseLocal.clone(),
    casingGeo, casingMat,
    streamGeo, streamMat,
    filamentGeos, filamentMat,
    ringGeo, ringMat,
    glowMat,
  };
}

/**
 * Attaches the shared conduit assembly under the gun bone of one soldier.
 * Returns the attached group, or null when the model has no gun markers.
 */
export function attachGaussConduit(soldierRoot) {
  if (!soldierRoot) {
    return null;
  }
  const baseMarkers = findNodesByName(soldierRoot, [BASE_MARKER]);
  const endMarkers = findNodesByName(soldierRoot, [END_MARKER]);
  if (!baseMarkers.length || !endMarkers.length) {
    return null;
  }
  const baseNode = baseMarkers[0];
  const endNode = endMarkers[0];
  const parent = baseNode.parent;
  if (!parent) {
    return null;
  }
  // Marker locals are in parent space when both share one bone; otherwise
  // resolve the end point into the base parent's space.
  const baseLocal = baseNode.position.clone();
  let endLocal;
  if (endNode.parent === parent) {
    endLocal = endNode.position.clone();
  } else {
    parent.updateWorldMatrix(true, false);
    endLocal = parent.worldToLocal(endNode.getWorldPosition(new THREE.Vector3()));
  }
  if (!_template) {
    _template = buildTemplate(baseLocal, endLocal);
  }
  const t = _template;
  const group = mkGroup('gauss_conduit');
  group.userData.pickable = false;

  const casing = new THREE.Mesh(t.casingGeo, t.casingMat);
  casing.name = 'gauss_conduit_casing';
  casing.renderOrder = 2;
  casing.userData.pickable = false;
  group.add(casing);

  const stream = new THREE.Mesh(t.streamGeo, t.streamMat);
  stream.name = 'gauss_conduit_stream';
  stream.renderOrder = 1;
  stream.userData.pickable = false;
  group.add(stream);

  for (const geo of t.filamentGeos) {
    const line = new THREE.Line(geo, t.filamentMat);
    line.name = 'gauss_conduit_filament';
    line.renderOrder = 1;
    line.frustumCulled = false;
    line.userData.pickable = false;
    group.add(line);
  }

  for (const offset of t.ringOffsets) {
    const ring = new THREE.Mesh(t.ringGeo, t.ringMat);
    ring.name = 'gauss_conduit_ring';
    ring.position.copy(t.baseLocal).addScaledVector(t.dir, t.length * offset);
    ring.quaternion.copy(t.ringQuat);
    ring.userData.pickable = false;
    group.add(ring);
  }

  const glow = new THREE.Sprite(t.glowMat);
  glow.name = 'gauss_conduit_glow';
  glow.position.copy(t.mid);
  glow.scale.set(0.55, 0.55, 1);
  glow.userData.pickable = false;
  group.add(glow);

  parent.add(group);
  return group;
}

/**
 * Advances the shared energy-stream clock. Called once per frame from the
 * game loop; safe to call headless (uniform update only).
 */
export function updateNecronConduits(deltaTime) {
  _time += deltaTime || 0;
  if (!_template) {
    return;
  }
  _template.streamMat.uniforms.uTime.value = _time;
  _template.filamentMat.opacity = 0.55 + 0.2 * Math.sin(_time * 17.0);
}
