import * as THREE from 'three';
import { mkSharedMesh } from '../render/three-helpers.js';

export const LASGUN_LASER_NAME = 'lasgun_laser';
const OPACITY = 0.92;
const LAYERS = [
  { radius: 1, color: 0xd52a08 },
  { radius: 0.75, color: 0xff651a },
  { radius: 0.45, color: 0xfff8f0 },
];
const geometry = new THREE.CylinderGeometry(0.01, 0.025, 1, 10);
geometry.userData.shared = true;

// Guardsmen lasgun visuals: geometry, color, and fading live here so the
// rifle's laser can be tuned independently of the Kasrkin hellgun.
export function makeLasgunLaserMesh(length: number): THREE.Mesh {
  const root = mkSharedMesh(geometry, LASGUN_LASER_NAME);
  root.scale.y = length;
  LAYERS.forEach((layer, index) => {
    const mesh = index === 0 ? root : new THREE.Mesh(geometry);
    if (index > 0) {
      mesh.name = index === LAYERS.length - 1 ? 'lasgun_laser_core' : 'lasgun_laser_orange';
      mesh.scale.set(layer.radius, 1, layer.radius);
      root.add(mesh);
    }
    mesh.material = new THREE.MeshBasicMaterial({
      color: layer.color,
      opacity: OPACITY,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
    });
    mesh.renderOrder = 10 + index;
    mesh.userData.pickable = false;
  });
  return root;
}

export function fadeLasgunLaser(mesh: THREE.Mesh, fade: number): void {
  const opacity = Math.max(0, Math.min(1, fade)) * OPACITY;
  mesh.traverse((child) => {
    if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial) {
      child.material.opacity = opacity;
    }
  });
}
