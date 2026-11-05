import * as THREE from 'three';
import { mkSharedMesh } from '../render/three-helpers.js';

export const HELLGUN_LASER_NAME = 'hellgun_laser';

// Nested unlit tubes keep the nearly white center visible from every angle.
// Normal blending preserves the deep red edges on both render backends.
const LAYERS = [
  { radius: 1, color: 0x82000c },
  { radius: 0.86, color: 0xb90018 },
  { radius: 0.72, color: 0xf4384b },
  { radius: 0.56, color: 0xfff2f2 },
];
const beamGeometry = new THREE.CylinderGeometry(0.06, 0.06, 1, 12);
const boltGeometry = beamGeometry.clone();
boltGeometry.rotateX(Math.PI / 2);
boltGeometry.translate(0, 0, 0.5);
beamGeometry.userData.shared = true;
boltGeometry.userData.shared = true;

export function makeHellgunLaserMesh(length: number, axis: 'y' | 'z' = 'y'): THREE.Mesh {
  const geometry = axis === 'y' ? beamGeometry : boltGeometry;
  const root = mkSharedMesh(geometry, HELLGUN_LASER_NAME);
  root.scale[axis] = length;
  LAYERS.forEach((layer, index) => {
    const mesh = index === 0 ? root : new THREE.Mesh(geometry);
    if (index > 0) {
      mesh.name = index === LAYERS.length - 1 ? 'hellgun_laser_core' : `hellgun_laser_layer_${index}`;
      mesh.scale.set(layer.radius, axis === 'y' ? 1 : layer.radius, axis === 'z' ? 1 : layer.radius);
      root.add(mesh);
    }
    mesh.material = new THREE.MeshBasicMaterial({
      color: layer.color,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
      toneMapped: false,
    });
    // Draw the core last so the outer tube cannot darken its center.
    mesh.renderOrder = 10 + index;
    mesh.userData.pickable = false;
  });
  return root;
}

export function fadeHellgunLaser(root: THREE.Object3D, fade: number): void {
  root.traverse((child) => {
    if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial) {
      child.material.opacity = Math.max(0, Math.min(1, fade)) * 0.92;
    }
  });
}
