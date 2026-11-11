import * as THREE from 'three';

export const PLASMA_CLOUD_PUFF = 'plasma-cloud-puff';
// Biggest toward the enemy: size grows along the flight direction.
export const PLASMA_CLOUD_PUFF_SIZES = [0.15, 0.19, 0.2, 0.21, 0.25, 0.26, 0.3] as const;
// Fraction of the A→B path from the muzzle end; the volley clusters on the front 55%.
export const PLASMA_CLOUD_PUFF_SPREAD = [0, 0.09, 0.18, 0.28, 0.37, 0.46, 0.55] as const;
export const PLASMA_CLOUD_PUFF_COUNT = PLASMA_CLOUD_PUFF_SIZES.length;

/** Live tuning shared by the preview sliders and the real volley. */
export const plasmaCloudTuning = {
  sizes: [...PLASMA_CLOUD_PUFF_SIZES],
  spread: [...PLASMA_CLOUD_PUFF_SPREAD],
  blasterLength: 1,
  blasterWidth: 1,
};

export function resetPlasmaCloudTuning(): void {
  plasmaCloudTuning.sizes = [...PLASMA_CLOUD_PUFF_SIZES];
  plasmaCloudTuning.spread = [...PLASMA_CLOUD_PUFF_SPREAD];
  plasmaCloudTuning.blasterLength = 1;
  plasmaCloudTuning.blasterWidth = 1;
}

export function plasmaCloudPuffSize(index: number): number {
  const size = plasmaCloudTuning.sizes[((Math.trunc(index) % PLASMA_CLOUD_PUFF_COUNT) + PLASMA_CLOUD_PUFF_COUNT) % PLASMA_CLOUD_PUFF_COUNT];
  return Number.isFinite(size) ? Math.max(0.01, size) : PLASMA_CLOUD_PUFF_SIZES[0];
}

/** Path offset of a puff measured from A for a path of the given length. */
export function plasmaCloudPuffOffset(index: number, pathLength: number): number {
  const wrapped = ((Math.trunc(index) % PLASMA_CLOUD_PUFF_COUNT) + PLASMA_CLOUD_PUFF_COUNT) % PLASMA_CLOUD_PUFF_COUNT;
  const fraction = plasmaCloudTuning.spread[wrapped];
  return (Number.isFinite(fraction) ? fraction : PLASMA_CLOUD_PUFF_SPREAD[wrapped]) * pathLength;
}

let texture: THREE.DataTexture | null = null;
const materials: THREE.SpriteMaterial[] = [];
const layerScales = [1, 0.86, 0.72] as const;

function smoothstep(low: number, high: number, value: number): number {
  const t = THREE.MathUtils.clamp((value - low) / (high - low), 0, 1);
  return t * t * (3 - 2 * t);
}

function cloudTexture(): THREE.DataTexture {
  if (texture) return texture;
  const size = 64;
  const pixels = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const px = x / (size - 1) * 2 - 1;
      const py = y / (size - 1) * 2 - 1;
      // Warped overlapping wisps leave translucent gaps instead of a solid hot core.
      const wx = px + 0.14 * Math.sin(py * 6 + 0.8) + 0.06 * Math.sin(py * 13 + px * 5);
      const wy = py + 0.13 * Math.sin(px * 7 - 0.6) + 0.05 * Math.cos(px * 15 - py * 4);
      const haze = Math.exp(-4.8 * ((wx + 0.22) ** 2 + (wy - 0.1) ** 2))
        + 0.7 * Math.exp(-7 * ((wx - 0.26) ** 2 + (wy + 0.2) ** 2))
        + 0.45 * Math.exp(-9 * ((wx - 0.1) ** 2 + (wy - 0.33) ** 2));
      const turbulence = 0.5 + 0.26 * Math.sin(wx * 13 + wy * 8) * Math.cos(wy * 15 - wx * 5)
        + 0.16 * Math.sin(wx * 27 - wy * 19 + 1.7);
      const wisps = smoothstep(0.16, 0.8, turbulence);
      const edge = 1 - smoothstep(0.55, 0.98, Math.hypot(px, py));
      const density = THREE.MathUtils.clamp(haze * (0.22 + wisps * 0.78) * edge, 0, 1);
      const index = (y * size + x) * 4;
      pixels[index] = Math.round(100 + wisps * 80);
      pixels[index + 1] = Math.round(155 + wisps * 65);
      pixels[index + 2] = 255;
      pixels[index + 3] = Math.round(density * 150);
    }
  }
  texture = new THREE.DataTexture(pixels, size, size);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

/** Three translucent wisps form each small cloud; resources are shared across volleys. */
export function makePlasmaCloudPuffMesh(variant: number): THREE.Group {
  const index = ((Math.trunc(variant) % PLASMA_CLOUD_PUFF_COUNT) + PLASMA_CLOUD_PUFF_COUNT) % PLASMA_CLOUD_PUFF_COUNT;
  const root = new THREE.Group();
  root.name = 'plasma_cloud_puff';
  root.userData.pickable = false;
  root.userData.puffVariant = index;
  const size = plasmaCloudPuffSize(index);
  for (let layer = 0; layer < layerScales.length; layer++) {
    const materialIndex = index * layerScales.length + layer;
    if (!materials[materialIndex]) {
      materials[materialIndex] = new THREE.SpriteMaterial({
        map: cloudTexture(), color: new THREE.Color(0.7, 0.9, 1.3),
        transparent: true, opacity: layer === 0 ? 0.52 : 0.3, blending: THREE.AdditiveBlending,
        depthWrite: false, toneMapped: false, rotation: index * 0.87 + layer * 2.1,
      });
    }
    const sprite = new THREE.Sprite(materials[materialIndex]);
    sprite.name = layer === 0 ? `plasma_cloud_puff_${index + 1}` : `plasma_cloud_wisp_${layer}`;
    sprite.scale.set(size * layerScales[layer], size * layerScales[layer] * (0.88 + index * 0.025), 1);
    sprite.userData.pickable = false;
    sprite.geometry.userData.shared = true;
    root.add(sprite);
  }
  return root;
}

export function updatePlasmaCloudPuff(root: THREE.Object3D, age: number): void {
  const variant = root.userData.puffVariant || 0;
  const time = Math.max(0, age);
  const size = plasmaCloudPuffSize(variant);
  root.scale.setScalar(1 + Math.min(time, 1.5) * 0.18);
  for (let layer = 0; layer < layerScales.length; layer++) {
    const sprite = root.children[layer];
    if (!sprite) continue;
    const phase = variant * 0.87 + layer * 2.1;
    const swirl = time * (1.4 + layer * 0.35) + phase;
    const drift = size * (0.08 + layer * 0.035);
    sprite.position.set(Math.cos(swirl) * drift, Math.sin(swirl * 0.83) * drift, Math.sin(swirl * 0.6) * drift * 0.4);
    const width = size * layerScales[layer];
    sprite.scale.set(width * (1 + Math.sin(swirl) * 0.08), width * (0.88 + variant * 0.025 + Math.cos(swirl * 1.1) * 0.09), 1);
  }
}
