import * as THREE from 'three';

const _matCache = new Map<string, THREE.MeshStandardMaterial>();

// Legacy tolerance: vehicles.js calls getMat('vboxmat', { diffuseColor, ... })
// with a string key and an options object. The options were never consumed —
// a non-number alpha fails the `< 1` check and the color string degrades to
// white — so the widened signature preserves that exact runtime behavior
// instead of "fixing" the call into a visual change.
export function getMat(hex: number | string, alpha: number | Record<string, unknown> = 1): THREE.MeshStandardMaterial {
  const key = hex + '_' + alpha;
  const hit = _matCache.get(key);
  if (hit) {
    return hit;
  }
  const material = new THREE.MeshStandardMaterial();
  const hexStr = typeof hex === 'number' ? hex.toString(16) : hex;
  const color = new THREE.Color('#' + hexStr.padStart(6, '0'));
  material.color = color;
  material.emissive = color.clone().multiplyScalar(0.2);
  material.roughness = 1;
  material.metalness = 0;
  if (typeof alpha === 'number' && alpha < 1) {
    material.opacity = alpha;
    material.transparent = true;
  }
  _matCache.set(key, material);
  return material;
}
