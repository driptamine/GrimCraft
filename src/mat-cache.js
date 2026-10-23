import * as THREE from 'three';

const _matCache = new Map();

export function getMat(hex, alpha = 1) {
  const key = hex + '_' + alpha;
  if (_matCache.has(key)) {
    return _matCache.get(key);
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
