import * as THREE from 'three';

const OVERLAY_NAME = 'ground_shadow_silhouette';
const material = new THREE.ShadowMaterial({
    color: 0x000000, opacity: .82, depthWrite: false,
    side: THREE.DoubleSide, toneMapped: false,
    polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4,
});
material.userData.shared = true;
let enabled = true;

/** Catch the animated model silhouette above terrain paint and unlit decals. */
export function attachGroundShadowOverlay(ground: THREE.Mesh): void {
    if (ground.userData.groundShadowOverlay || ground.children.some(child => child.name === OVERLAY_NAME)) return;
    // The ground owns this geometry. The receiver shares it so hills, mirror
    // transforms and imported terrain keep exactly the same surface.
    const overlay = new THREE.Mesh(ground.geometry, material);
    overlay.name = OVERLAY_NAME;
    overlay.receiveShadow = true;
    overlay.castShadow = false;
    overlay.visible = enabled;
    overlay.renderOrder = -1; // after terrain decals, before combat FX
    overlay.userData.groundShadowOverlay = true;
    overlay.userData.pickable = false;
    overlay.raycast = () => {};
    ground.add(overlay);
}

export function setGroundShadowsVisible(scene: THREE.Object3D, visible: boolean): void {
    enabled = visible;
    scene.traverse(node => {
        if (node.userData.groundShadowOverlay) node.visible = visible;
    });
}
