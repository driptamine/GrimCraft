import * as THREE from 'three';

// Same nominal guardsman height used by the custom soldier model importer.
const SOLDIER_HEIGHT = 1.85;
export const CLOUD_BLASTER_STAGE_LENGTHS = [0.2, 0.4, 0.6].map(fraction => SOLDIER_HEIGHT * fraction);
export const CLOUD_BLASTER_INITIAL_LENGTH = CLOUD_BLASTER_STAGE_LENGTHS[0];
const GEOMETRY_LENGTH = 0.65;

let shared: { core: THREE.BufferGeometry; shell: THREE.BufferGeometry; coreMaterial: THREE.MeshBasicMaterial; shellMaterial: THREE.MeshBasicMaterial } | null = null;

function sharedAssets() {
  if (!shared) {
    const cylinder = (radius: number, length: number) => {
      const geometry = new THREE.CylinderGeometry(radius, radius, length, 10);
      geometry.rotateX(Math.PI / 2);
      geometry.translate(0, 0, GEOMETRY_LENGTH / 2);
      geometry.userData.shared = true;
      return geometry;
    };
    shared = {
      core: cylinder(0.009, GEOMETRY_LENGTH), shell: cylinder(0.022, GEOMETRY_LENGTH),
      coreMaterial: new THREE.MeshBasicMaterial({ color: 0x9feaff, transparent: true, opacity: 0.72, depthWrite: false, toneMapped: false, blending: THREE.AdditiveBlending }),
      shellMaterial: new THREE.MeshBasicMaterial({ color: 0x239fff, transparent: true, opacity: 0.32, depthWrite: false, toneMapped: false, blending: THREE.AdditiveBlending }),
    };
  }
  return shared;
}

interface CloudBlaster {
  node: THREE.Group;
  distance: number;
  movingCarrier: boolean;
}

/** A short blue bolt travels A→B, stepping through three lengths along the path. */
export function attachPlasmaCloudBlaster(carrier: THREE.Object3D, distance: number, movingCarrier = true): THREE.Group | null {
  if (!Number.isFinite(distance) || distance <= 0) return null;
  const existing = carrier.userData.cloudBlaster as CloudBlaster | undefined;
  if (existing) return existing.node;
  const assets = sharedAssets();
  const node = new THREE.Group();
  node.name = 'plasma_cloud_blaster';
  node.userData.pickable = false;
  const shell = new THREE.Mesh(assets.shell, assets.shellMaterial);
  shell.name = 'plasma_cloud_blaster_shell';
  const core = new THREE.Mesh(assets.core, assets.coreMaterial);
  core.name = 'plasma_cloud_blaster_core';
  shell.userData.pickable = core.userData.pickable = false;
  node.add(shell, core);
  carrier.add(node);
  carrier.userData.cloudBlaster = { node, distance, movingCarrier } satisfies CloudBlaster;
  updatePlasmaCloudBlaster(carrier, 0);
  return node;
}

export function updatePlasmaCloudBlaster(carrier: THREE.Object3D, travelled: number): void {
  const state = carrier.userData.cloudBlaster as CloudBlaster | undefined;
  if (!state) return;
  const travel = Math.max(0, travelled);
  const stage = Math.min(2, Math.floor(travel / state.distance * 3));
  const length = Math.min(state.distance, CLOUD_BLASTER_STAGE_LENGTHS[stage]);
  const node = state.node;
  node.visible = travel < state.distance;
  if (!node.visible) return;
  // Travel with the clouds; stop the head at B without stretching the bolt.
  // A stationary preview carrier uses the same path without moving its clouds.
  const start = Math.min(travel, state.distance - length);
  const offset = start - (state.movingCarrier ? travel : 0);
  node.position.set(0, 0, offset / carrier.scale.z);
  node.scale.set(
    1 / carrier.scale.x, 1 / carrier.scale.y,
    length / GEOMETRY_LENGTH / carrier.scale.z,
  );
}
