import * as THREE from 'three';
import { setGroundShadowsVisible } from './ground-shadows.js';

export type LightingMode = 'classic' | 'definitive';
export const LIGHTING_STORAGE_KEY = 'grimcraft-lighting';
export const SHADOWS_STORAGE_KEY = 'grimcraft-shadows';
export const LIGHTING_CHANGED = 'grimcraft-lighting-changed';
// A higher afternoon sun keeps the silhouette close to the model's proportions.
export const SUN_OFFSET = { x: 90, y: 80, z: 55 };
let selectedMode: LightingMode | null = null;
let shadowOverride: boolean | undefined;
let active: { scene: THREE.Scene; renderer: any; quality: string } | null = null;
let environment: THREE.CubeTexture | null = null;
const originalReceivers = new WeakMap<THREE.Object3D, boolean>();
const originalEnvironments = new WeakMap<THREE.Scene, { map: THREE.Texture | null; intensity: number }>();
const originalRenderers = new WeakMap<object, { toneMapping: THREE.ToneMapping; exposure: number }>();
const profiles = {
    classic: { amb: .35, sun: 1.8, fill: .25, rim: .20 },
    definitive: { amb: .20, sun: 2.4, fill: .14, rim: .28 },
};

function stored(key: string): string | null {
    try { return localStorage.getItem(key); } catch { return null; }
}
function persist(key: string, value: string): void {
    try { localStorage.setItem(key, value); } catch { /* Session settings still work. */ }
}
export function lightingMode(): LightingMode {
    return selectedMode ??= stored(LIGHTING_STORAGE_KEY) === 'definitive' ? 'definitive' : 'classic';
}
export function shadowsEnabled(_quality = active?.quality || 'high'): boolean {
    if (shadowOverride === undefined) {
        const value = stored(SHADOWS_STORAGE_KEY);
        if (value === 'on' || value === 'off') shadowOverride = value === 'on';
    }
    // Quality controls shadow resolution, not whether a model gets a silhouette.
    return shadowOverride ?? true;
}

export function updateSunShadowCamera(sun: THREE.DirectionalLight, target: THREE.Vector3, radius: number): void {
    sun.position.set(target.x + SUN_OFFSET.x, target.y + SUN_OFFSET.y, target.z + SUN_OFFSET.z);
    sun.target.position.copy(target);
    sun.target.updateMatrixWorld();
    const half = Math.max(24, Math.min(110, (radius || 100) * .85));
    const camera = sun.shadow.camera;
    if (camera.right !== half) {
        camera.left = camera.bottom = -half;
        camera.right = camera.top = half;
        camera.updateProjectionMatrix();
    }
}

// A small, neutral sky/ground reflection probe. Both render backends prefilter
// this cube for PBR roughness; there is no extra asset download or sky backdrop.
function reflectionEnvironment(): THREE.CubeTexture {
    if (environment) return environment;
    const size = 32, direction = new THREE.Vector3();
    const sun = new THREE.Vector3(SUN_OFFSET.x, SUN_OFFSET.y, SUN_OFFSET.z).normalize();
    const faces = Array.from({ length: 6 }, (_, face) => {
        const pixels = new Uint8Array(size * size * 4);
        for (let row = 0; row < size; row++) {
            for (let column = 0; column < size; column++) {
                const horizontal = (column + .5) / size * 2 - 1;
                const vertical = (row + .5) / size * 2 - 1;
                switch (face) {
                    case 0: direction.set(1, -vertical, -horizontal); break;
                    case 1: direction.set(-1, -vertical, horizontal); break;
                    case 2: direction.set(horizontal, 1, vertical); break;
                    case 3: direction.set(horizontal, -1, -vertical); break;
                    case 4: direction.set(horizontal, -vertical, 1); break;
                    default: direction.set(-horizontal, -vertical, -1);
                }
                direction.normalize();
                const sky = THREE.MathUtils.smoothstep(direction.y, -.3, .6);
                const highlight = Math.max(0, direction.dot(sun)) ** 32 * .45;
                const offset = (row * size + column) * 4;
                pixels[offset] = Math.min(255, Math.round((.22 + sky * .43 + highlight) * 255));
                pixels[offset + 1] = Math.min(255, Math.round((.20 + sky * .51 + highlight * .95) * 255));
                pixels[offset + 2] = Math.min(255, Math.round((.17 + sky * .65 + highlight * .85) * 255));
                pixels[offset + 3] = 255;
            }
        }
        return new THREE.DataTexture(pixels, size, size);
    });
    environment = new THREE.CubeTexture(faces);
    environment.name = 'definitive_reflection_environment';
    environment.colorSpace = THREE.SRGBColorSpace;
    environment.needsUpdate = true;
    return environment;
}

/** Also called for newly spawned models, so toggles apply to reinforcements. */
export function applyObjectLighting(root: THREE.Object3D): void {
    const enhanced = lightingMode() === 'definitive';
    root.traverse(node => {
        const mesh = node as THREE.Mesh;
        if (!mesh.isMesh) return;
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        if (mesh.name.startsWith('blobshadow')) {
            // Circular decals never reproduce the pose. Both lighting modes
            // use real shadows, while animation systems can still hide this node.
            for (const material of materials) material.opacity = 0;
        }
        if (!mesh.castShadow || !materials.some(material =>
            ((material as THREE.MeshStandardMaterial).isMeshStandardMaterial
                || (material as THREE.MeshPhongMaterial).isMeshPhongMaterial
                || (material as THREE.MeshLambertMaterial).isMeshLambertMaterial) && !material.transparent)) return;
        if (!originalReceivers.has(mesh)) originalReceivers.set(mesh, mesh.receiveShadow);
        mesh.receiveShadow = enhanced || originalReceivers.get(mesh)!;
    });
}

function apply(): void {
    if (!active) return;
    const { scene, renderer, quality } = active;
    const mode = lightingMode(), enhanced = mode === 'definitive', shadows = shadowsEnabled(quality);
    const brightness = scene.userData.lightingBrightness ?? 1;
    for (const [name, intensity] of Object.entries(profiles[mode])) {
        const light = scene.getObjectByName(name) as THREE.Light | undefined;
        if (light?.isLight) light.intensity = intensity * brightness;
        // The existing terrain brightness slider uses these base values.
        (scene as any)[`_${name}Base`] = intensity;
    }
    if (!originalEnvironments.has(scene))
        originalEnvironments.set(scene, { map: scene.environment, intensity: scene.environmentIntensity });
    const originalEnvironment = originalEnvironments.get(scene)!;
    scene.environment = enhanced ? reflectionEnvironment() : originalEnvironment.map;
    scene.environmentIntensity = enhanced ? .55 * brightness : originalEnvironment.intensity;
    if (!originalRenderers.has(renderer))
        originalRenderers.set(renderer, { toneMapping: renderer.toneMapping, exposure: renderer.toneMappingExposure });
    const originalRenderer = originalRenderers.get(renderer)!;
    renderer.toneMapping = enhanced ? THREE.ACESFilmicToneMapping : originalRenderer.toneMapping;
    renderer.toneMappingExposure = enhanced ? 1.05 : originalRenderer.exposure;
    if (renderer.shadowMap) {
        renderer.shadowMap.enabled = shadows;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.shadowMap.needsUpdate = true;
    }
    const sun = scene.getObjectByName('sun') as THREE.DirectionalLight | undefined;
    if (sun?.isDirectionalLight) {
        sun.castShadow = shadows;
        sun.position.copy(sun.target.position).add(new THREE.Vector3(SUN_OFFSET.x, SUN_OFFSET.y, SUN_OFFSET.z));
        sun.target.updateMatrixWorld();
        const size = quality === 'high' ? 2048 : 1024;
        if (sun.shadow.mapSize.x !== size) {
            sun.shadow.map?.dispose();
            sun.shadow.map = null;
            sun.shadow.mapSize.set(size, size);
        }
        sun.shadow.bias = enhanced ? -.00015 : -.0005;
        sun.shadow.normalBias = enhanced ? .025 : 0;
        sun.shadow.needsUpdate = true;
    }
    setGroundShadowsVisible(scene, shadows);
    applyObjectLighting(scene);
    // Shadow/IBL shader variants must refresh when switching live.
    scene.traverse(node => {
        const mesh = node as THREE.Mesh;
        if (!mesh.isMesh) return;
        for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material])
            material.needsUpdate = true;
    });
}

export function bindLighting(scene: THREE.Scene, renderer: any, quality: string): void {
    active = { scene, renderer, quality };
    apply();
}
function changed(): void {
    apply();
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function')
        window.dispatchEvent(new Event(LIGHTING_CHANGED));
}
export function setLightingMode(mode: LightingMode): void {
    selectedMode = mode;
    persist(LIGHTING_STORAGE_KEY, mode);
    changed();
}
export function setShadowsEnabled(enabled: boolean): void {
    shadowOverride = enabled;
    persist(SHADOWS_STORAGE_KEY, enabled ? 'on' : 'off');
    changed();
}
