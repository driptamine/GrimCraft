import * as THREE from 'three';
import { PLASMA_CLOUD_PUFF_COUNT, makePlasmaCloudPuffMesh, plasmaCloudPuffOffset, plasmaCloudPuffSize, plasmaCloudPuffCenter, updatePlasmaCloudPuff } from '../fx/plasma-cloud-puff.js';
import { attachPlasmaCloudBlaster, updatePlasmaCloudBlaster } from '../fx/plasma-cloud-blaster.js';

const SAMPLE_SPACING = 0.55;

/** Full travel path of the preview bolt; the seven clouds ride its short core. */
export function pathPreviewLength(): number {
  return (PLASMA_CLOUD_PUFF_COUNT - 1) * SAMPLE_SPACING;
}

/** Find open ground beside the first selected guardsmen squad, clear of building footprints. */
export function findPlasmaPuffPreviewCenter(
  world: any, squadIds: readonly number[], right: THREE.Vector3,
  groundAt: (x: number, z: number) => number,
  footprintRadius: (kind: string, type: string) => number = () => 3.5,
): THREE.Vector3 | null {
  if (!world) return null;
  const soldiers: THREE.Vector3[] = [];
  let facing: any = null;
  for (const id of squadIds) {
    const squad = world.get(id, 'squad');
    if (!squad || (squad.faction || 'ig') !== 'ig' || (squad.unitType && squad.unitType !== 'guardsmen')) continue;
    for (const soldierId of squad.soldiers || []) {
      const soldier = world.get(soldierId, 'soldier');
      const root = world.get(soldierId, 'mesh')?.root;
      if (soldier?.hp > 0 && root?.visible && !root.userData.disposed) soldiers.push(root.getWorldPosition(new THREE.Vector3()));
    }
    if (soldiers.length) { facing = squad.facing; break; }
  }
  if (!soldiers.length) return null;
  const anchor = soldiers.reduce((sum, position) => sum.add(position), new THREE.Vector3()).multiplyScalar(1 / soldiers.length);
  const row = right.clone().setY(0);
  if (row.lengthSq() < 1e-8) row.set(1, 0, 0);
  row.normalize();
  const blockers: THREE.Box3[] = [];
  for (const kind of ['building', 'structure', 'airfield']) {
    for (const id of world.query(kind)) {
      const component = world.get(id, kind);
      if (component.hp != null && component.hp <= 0) continue;
      const mesh = world.get(id, 'mesh')?.root;
      const box = mesh ? new THREE.Box3().setFromObject(mesh) : new THREE.Box3();
      const position = component.position;
      if (position) {
        const radius = footprintRadius(kind, component.type);
        box.expandByPoint(new THREE.Vector3(position.x - radius, 0, position.z - radius));
        box.expandByPoint(new THREE.Vector3(position.x + radius, 0, position.z + radius));
      }
      if (!box.isEmpty()) blockers.push(box.expandByScalar(0.4));
    }
  }
  const initialAngle = facing && Math.hypot(facing.x, facing.z) > 0.001
    ? Math.atan2(facing.z, facing.x) : Math.atan2(row.x, -row.z);
  const sample = new THREE.Vector3();
  for (const distance of [2.5, 4, 6, 8, 10, 14, 20]) {
    for (const turn of [0, 1, -1, 2, -2, 3, -3, 4]) {
      const angle = initialAngle + turn * Math.PI / 4;
      const center = anchor.clone().add(new THREE.Vector3(Math.cos(angle) * distance, 0, Math.sin(angle) * distance));
      let clear = true;
      for (let index = 0; index < PLASMA_CLOUD_PUFF_COUNT && clear; index++) {
        sample.copy(center).addScaledVector(row, plasmaCloudPuffOffset(index, pathPreviewLength()) - pathPreviewLength() / 2);
        clear = !blockers.some((box) => sample.x >= box.min.x && sample.x <= box.max.x && sample.z >= box.min.z && sample.z <= box.max.z)
          && !soldiers.some((position) => Math.hypot(sample.x - position.x, sample.z - position.z) < 0.8);
      }
      if (clear) {
        center.y = groundAt(center.x, center.z) + 1.2;
        return center;
      }
    }
  }
  return null;
}

/** Visual samples have no ECS bullet components, velocity, damage, or expiry. */
export function createPlasmaPuffPreview(scene: THREE.Object3D, center: THREE.Vector3, right: THREE.Vector3) {
  const root = new THREE.Group();
  root.name = 'plasma_cloud_puff_preview';
  root.userData.pickable = false;
  const direction = right.clone().setY(0);
  if (direction.lengthSq() < 1e-8) direction.set(1, 0, 0);
  direction.normalize();
  const pathLength = pathPreviewLength();
  const start = center.clone().addScaledVector(direction, -pathLength / 2);
  const place = (puff: THREE.Group): void => {
    puff.position.copy(start);
    puff.userData.plasmaPathDistance = pathLength;
    puff.userData.plasmaStationaryCarrier = true;
    puff.lookAt(start.clone().add(direction));
  };
  const puffs: THREE.Group[] = [];
  for (let index = 0; index < PLASMA_CLOUD_PUFF_COUNT; index++) {
    const puff = makePlasmaCloudPuffMesh(index);
    place(puff);
    root.add(puff);
    puffs.push(puff);
  }
  scene.add(root);
  puffs[0].lookAt(puffs[0].position.clone().add(direction));
  attachPlasmaCloudBlaster(puffs[0], pathLength, false);
  const guide = new THREE.ArrowHelper(direction, start.clone().add(new THREE.Vector3(0, -.3, 0)), pathLength, 0x6ca9cf, .12, .07);
  guide.name = 'plasma_puff_direction';
  guide.line.userData.pickable = guide.cone.userData.pickable = false;
  scene.add(guide);
  const selection = new THREE.Mesh(new THREE.SphereGeometry(.65, 16, 8), new THREE.MeshBasicMaterial({
    color: 0x9be6ff, wireframe: true, transparent: true, opacity: .5, depthTest: false, depthWrite: false,
  }));
  selection.name = 'plasma_puff_selection';selection.userData.pickable = false;selection.renderOrder = 20;
  let selected: number | null = null;
  let age = 0;
  const sample = (time: number): void => {
    age = Math.max(0, Number.isFinite(time) ? time : 0);
    for (const [index, puff] of puffs.entries()) {
      place(puff);
      puff.userData.plasmaPathTravelled = (age % 4) / 4 * pathLength;
      updatePlasmaCloudPuff(puff, age);
    }
    if (selected != null) {
      selection.scale.setScalar(plasmaCloudPuffSize(selected));
      selection.position.z = plasmaCloudPuffCenter(puffs[selected]);
    }
    // The beam and clouds share one layout throughout all three stages.
    updatePlasmaCloudBlaster(puffs[0], (age % 4) / 4 * pathLength);
  };
  return {
    root,
    get time(): number { return age; },
    duration: 4,
    setTime: sample,
    select(index: number): void {
      selected = THREE.MathUtils.clamp(Math.trunc(index), 0, puffs.length - 1);
      puffs[selected].add(selection);
      selection.scale.setScalar(plasmaCloudPuffSize(selected));
      selection.position.z = plasmaCloudPuffCenter(puffs[selected]);
    },
    update(deltaTime: number): void {
      sample(age + Math.max(0, deltaTime));
    },
    dispose(): void {
      // Sprite geometry, textures and materials belong to the shared FX cache.
      root.removeFromParent();
      root.clear();
      guide.removeFromParent();
      (guide.line.material as THREE.Material).dispose();
      (guide.cone.material as THREE.Material).dispose();
      selection.removeFromParent();selection.geometry.dispose();selection.material.dispose();
    },
  };
}
