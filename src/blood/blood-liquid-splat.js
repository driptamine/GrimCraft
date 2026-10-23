import * as THREE from 'three';
import { particles } from '../scene.js';
import { mkSharedMesh } from '../three-helpers.js';

// Liquid-look blood spray for guardsmen.glb hits: stretched flying droplets
// only, no puddles. Everything rides the shared combat particle pool
// (scene.js `particles`, ticked by systemParticle), so there is no new
// update loop. The droplet geometry is module-shared: zero per-hit churn.

const _dropGeo = new THREE.SphereGeometry(0.075, 6, 5);
_dropGeo.userData.shared = true;

const _up = new THREE.Vector3(0, 1, 0);
const _dir = new THREE.Vector3();

const DROP_RED = new THREE.Color(0.75, 0.06, 0.05);
const DROP_DARK = new THREE.Color(0.5, 0.02, 0.02);

function pushDrop(x, y, z, vx, vy, vz, size, stretch, life) {
  const drop = mkSharedMesh(_dropGeo, 'bloodrop');
  drop.position.set(x, y, z);
  // Stretch along the flight direction: reads as a liquid streak.
  _dir.set(vx, vy, vz).normalize();
  drop.quaternion.setFromUnitVectors(_up, _dir);
  drop.scale.set(0.6 * size, stretch * size, 0.6 * size);
  const material = new THREE.MeshBasicMaterial();
  material.color.copy(DROP_DARK).lerp(DROP_RED, Math.random());
  drop.material = material;
  particles.push({
    mesh: drop,
    material,
    vx,
    vy,
    vz,
    life,
    age: 0,
  });
}

// Fine hanging mist: many tiny slow drops, brief life.
function sprayMist(x, y, z, scale, count) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = (0.5 + Math.random()) * scale;
    pushDrop(
      x + (Math.random() - 0.5) * 0.25,
      y + (Math.random() - 0.5) * 0.25,
      z + (Math.random() - 0.5) * 0.25,
      Math.cos(angle) * speed,
      (1 + Math.random() * 1.5) * scale,
      Math.sin(angle) * speed,
      0.45 * scale,
      1.2,
      0.25 + Math.random() * 0.15,
    );
  }
}

// Heavy gore: few large fast drops arcing far, living longer.
function sprayGore(x, y, z, scale, count) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = (2 + Math.random() * 3) * scale;
    const size = (0.9 + Math.random() * 0.5) * scale;
    pushDrop(
      x + (Math.random() - 0.5) * 0.3,
      y + (Math.random() - 0.5) * 0.3,
      z + (Math.random() - 0.5) * 0.3,
      Math.cos(angle) * speed,
      (3 + Math.random() * 4) * scale,
      Math.sin(angle) * speed,
      size,
      1.9,
      0.5 + Math.random() * 0.3,
    );
  }
}

// Liquid burst at a wound point (caller passes chest height): fine mist
// hanging in the air plus heavy drops arcing out.
// scale 1 = survivable hit, ~1.6 = kill burst. Returns particle count.
export function spawnBloodLiquid(position, scale = 1) {
  if (!position) return 0;
  const mist = Math.max(1, Math.round(14 * scale));
  const gore = Math.max(1, Math.round(7 * scale));
  sprayMist(position.x, position.y, position.z, scale, mist);
  sprayGore(position.x, position.y, position.z, scale, gore);
  return mist + gore;
}
