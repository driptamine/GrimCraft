import * as THREE from 'three';
import { plasmaCloudTuning } from './plasma-cloud-puff.js';
import { CLOUD_BLASTER_STAGE_LENGTHS, plasmaCloudLayout } from './plasma-cloud-layout.js';
export { CLOUD_BLASTER_STAGE_LENGTHS } from './plasma-cloud-layout.js';

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
  const layout = plasmaCloudLayout(state.distance, travel, plasmaCloudTuning.blasterLength);
  const length = layout.length;
  const width = Math.max(0.05, plasmaCloudTuning.blasterWidth);
  const node = state.node;
  node.visible = layout.visible;
  if (!node.visible) return;
  // Travel with the clouds; stop the head at B without stretching the bolt.
  // A stationary preview carrier evaluates the same beam-and-cloud path.
  const start = layout.start;
  const offset = start - (state.movingCarrier ? travel : 0);
  node.position.set(0, 0, offset / carrier.scale.z);
  node.scale.set(
    width / carrier.scale.x, width / carrier.scale.y,
    length / GEOMETRY_LENGTH / carrier.scale.z,
  );
}
