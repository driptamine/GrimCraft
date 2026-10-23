import * as THREE from 'three';
import { addBeforeRender, getDeltaTime, removeBeforeRender, world } from '../scene.js';
import { childMeshes, disposeObj, mkCylinder, mkTorus, spPingFrame } from '../three-helpers.js';
import { _groundAt } from '../systems/terrain.js';
import { raycastGround } from './selection.js';


export function spawnMoveMarker(sx, sy) {
  const point = raycastGround(sx, sy);
  if (!point) return;
  spawnMoveMarkerAt(point);
}

export function spawnMoveMarkerAt(point) {
  if (!point) return;
  const ping = mkTorus('moveping', 1.4, 0.12, 32);
  ping.position.set(point.x, _groundAt(point.x, point.z) + 0.08, point.z);
  const material = new THREE.MeshBasicMaterial();
  material.color = new THREE.Color(0, 1, 0.53);
  ping.material = material;
  ping.userData.pickable = false;
  let time = 0;
  const observer = addBeforeRender(() => {
    time += getDeltaTime();
    const scale = 0.3 + time * 4.5;
    ping.scale.setScalar(scale);
    material.opacity = Math.max(0, 1 - time * 2);
    material.transparent = true;
    if (time >= 0.5) {
      disposeObj(ping);
      material.dispose();
      removeBeforeRender(observer);
    }
  });
}


export function spawnAttackMarker(sx, sy) {
  const point = raycastGround(sx, sy);
  if (!point) return;
  const ping = mkTorus('attackping', 1.8, 0.15, 32);
  ping.position.set(point.x, point.y + 0.09, point.z);
  const material = new THREE.MeshBasicMaterial();
  material.color = new THREE.Color(1, 0.2, 0.1);
  ping.material = material;
  ping.userData.pickable = false;
  let time = 0;
  const observer = addBeforeRender(() => {
    time += getDeltaTime();
    const scale = 0.3 + time * 4.5;
    ping.scale.setScalar(scale);
    material.opacity = Math.max(0, 1 - time * 2);
    material.transparent = true;
    if (time >= 0.5) {
      disposeObj(ping);
      material.dispose();
      removeBeforeRender(observer);
    }
  });
}


// Free-fire tracer for first-person shooting: a short-lived beam from the
// muzzle to any world point (ground, sky, scenery). Visual only — damage is
// handled by createBeamEntity for enemy hits. Auto-attached to the scene by
// the mk helper, faded out on the render loop like the other pings.
export function spawnBeamTracer(fromPos, toPos) {
  if (!fromPos || !toPos) return;
  const dir = toPos.clone().sub(fromPos);
  const length = dir.length() || 1;
  const beam = mkCylinder('fpstracer', 0.035, 0.035, length, 8);
  beam.position.copy(fromPos).addScaledVector(dir, 0.5);
  beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  const material = new THREE.MeshBasicMaterial();
  material.color = new THREE.Color(1, 0.36, 0.36);
  material.opacity = 0.9;
  material.transparent = true;
  beam.material = material;
  beam.userData.pickable = false;
  let time = 0;
  const observer = addBeforeRender(() => {
    time += getDeltaTime();
    material.opacity = Math.max(0, 0.9 * (1 - time / 0.15));
    if (time >= 0.15) {
      disposeObj(beam);
      material.dispose();
      removeBeforeRender(observer);
    }
  });
}

// Hitmarker X flashed over the crosshair on every enemy hit, CoD-style.
// Hidden again after a beat so spam-clicking strobes it instead of sticking.
export function flashHitmarker(durationMs = 140) {
  if (typeof document === 'undefined' || !document.getElementById) return false;
  const el = document.getElementById('fps-hitmarker');
  if (!el || !el.style) return false;
  el.style.display = 'block';
  if (flashHitmarker._timer) clearTimeout(flashHitmarker._timer);
  flashHitmarker._timer = setTimeout(() => {
    el.style.display = 'none';
    flashHitmarker._timer = 0;
  }, Math.max(0, durationMs));
  return true;
}

export const SP_PING_DURATION = 0.9;

export const SP_PING_MAX_SCALE = 8;

export const SP_PING_PEAK_GLOW = 1.6;

export let _spPingToken = 0;


// Right-click ping on a strategic point / relic: a red torus expands from
// the center and fades as it reaches full radius, while the point model
// glows red and fades back with the same easing.
export function spawnSpPing(spId) {
  const strategicPoint = world.get(spId, 'strategicPoint');
  const meshComponent = world.get(spId, 'mesh');
  if (!strategicPoint || !meshComponent?.root) {
    return;
  }
  const token = ++_spPingToken;
  const ping = mkTorus('spping', 1.2, 0.12, 40);
  ping.position.set(strategicPoint.position.x, 0.08, strategicPoint.position.z);
  const material = new THREE.MeshBasicMaterial();
  material.color = new THREE.Color(1, 0.12, 0.08);
  material.transparent = true;
  ping.material = material;
  ping.userData.pickable = false;
  // Instances share materials, so tint clones and restore the originals at
  // the end; the token keeps overlapping pings from restoring early.
  const tinted = [];
  childMeshes(meshComponent.root).forEach((mesh) => {
    if (!mesh.visible || !mesh.material || Array.isArray(mesh.material) || !mesh.material.emissive) {
      return;
    }
    if (!mesh.userData._pingOrig) {
      mesh.userData._pingOrig = mesh.material;
      mesh.material = mesh.material.clone();
    }
    mesh.userData._pingToken = token;
    mesh.material.emissive.setRGB(1, 0.06, 0.04);
    mesh.material.emissiveIntensity = SP_PING_PEAK_GLOW;
    tinted.push(mesh);
  });
  let time = 0;
  const observer = addBeforeRender(() => {
    time += getDeltaTime();
    const frame = spPingFrame(time, SP_PING_DURATION, SP_PING_MAX_SCALE);
    ping.scale.setScalar(frame.scale);
    material.opacity = frame.opacity;
    for (const mesh of tinted) {
      if (mesh.userData._pingToken === token) {
        mesh.material.emissiveIntensity = SP_PING_PEAK_GLOW * frame.opacity;
      }
    }
    if (time >= SP_PING_DURATION) {
      disposeObj(ping);
      material.dispose();
      for (const mesh of tinted) {
        if (mesh.userData._pingToken === token) {
          mesh.material.dispose();
          mesh.material = mesh.userData._pingOrig;
          mesh.userData._pingOrig = null;
          mesh.userData._pingToken = 0;
        }
      }
      removeBeforeRender(observer);
    }
  });
}


// Strategic point whose capture radius contains (x, z), or null. Click-time
// only — point counts are tiny, no caching needed.
export function _spIdAt(x, z) {
  for (const spId of world.query('strategicPoint')) {
    const sp = world.get(spId, 'strategicPoint');
    if (sp && Math.hypot(x - sp.position.x, z - sp.position.z) < sp.captureRadius) {
      return spId;
    }
  }
  return null;
}
