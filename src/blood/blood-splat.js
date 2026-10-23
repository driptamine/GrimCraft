import * as THREE from 'three';
import { particles } from '../scene.js';
import { mkSharedMesh } from '../three-helpers.js';

// Blood spurts for guardsmen.glb hits. Particles ride the shared combat
// particle pool (scene.js `particles`, ticked by systemParticle), so there
// is no new update loop — this module only spawns. One shared box keeps
// per-hit geometry churn at zero, same as combat spawnParticles.

const _bloodGeo = new THREE.BoxGeometry(0.09, 0.09, 0.09);
_bloodGeo.userData.shared = true;

const BLOOD_DARK = new THREE.Color(0.42, 0.02, 0.02);
const BLOOD_BRIGHT = new THREE.Color(0.78, 0.07, 0.05);

export const GUARDSMAN_HEAD_NODES = [
  'guardsmen_head01',
  'guardsmen_head02',
  'guardsmen_head03',
  'guardsmen_head04',
];

// True for meshes instantiated from guardsmen.glb (any head variant), false
// for everything else (sergeants, other factions, procedural fallback).
export function isGuardsmanMesh(root) {
  if (!root || typeof root.traverse !== 'function') return false;
  let found = false;
  root.traverse((child) => {
    if (GUARDSMAN_HEAD_NODES.includes(child.name)) found = true;
  });
  return found;
}

// Radial blood burst at a wound point (caller passes chest height).
// scale 1 = survivable hit, ~1.6 = kill burst. Gravity applies via the
// shared particle tick; life keeps the spray under a second.
export function spawnBloodSplat(position, scale = 1) {
  if (!position) return 0;
  const count = Math.max(1, Math.round(10 * scale));
  for (let i = 0; i < count; i++) {
    const drop = mkSharedMesh(_bloodGeo, 'blood');
    drop.position.set(
      position.x + (Math.random() - 0.5) * 0.3,
      position.y + (Math.random() - 0.5) * 0.3,
      position.z + (Math.random() - 0.5) * 0.3,
    );
    const material = new THREE.MeshBasicMaterial();
    material.color.copy(BLOOD_DARK).lerp(BLOOD_BRIGHT, Math.random());
    drop.material = material;
    const angle = Math.random() * Math.PI * 2;
    const speed = (1 + Math.random() * 3) * scale;
    particles.push({
      mesh: drop,
      material,
      vx: Math.cos(angle) * speed,
      vy: (2 + Math.random() * 4) * scale,
      vz: Math.sin(angle) * speed,
      life: 0.35 + Math.random() * 0.35,
      age: 0,
    });
  }
  return count;
}
