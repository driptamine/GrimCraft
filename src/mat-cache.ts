import * as THREE from 'three';

const _matCache = new Map<string, THREE.MeshStandardMaterial>();

export function getMat(hex: number, alpha = 1): THREE.MeshStandardMaterial {
  const key = hex + '_' + alpha;
  const hit = _matCache.get(key);
  if (hit) {
    return hit;
  }
  const material = new THREE.MeshStandardMaterial();
  const color = new THREE.Color('#' + hex.toString(16).padStart(6, '0'));
  material.color = color;
  material.emissive = color.clone().multiplyScalar(0.2);
  material.roughness = 1;
  material.metalness = 0;
  if (alpha < 1) {
    material.opacity = alpha;
    material.transparent = true;
  }
  _matCache.set(key, material);
  return material;
}
