import * as THREE from 'three';
import { canWorkAtStructure, constructionWorkPosition } from '../core/structure-footprint.js';

export function assignConstructionWork(world: any, workerId: number, siteId: number, site: any): void {
  const worker = world.get(workerId, 'builder'), root = world.get(workerId, 'mesh')?.root;
  if (!worker || !root) return;
  const point = constructionWorkPosition(site, root.position);
  const workPosition = new THREE.Vector3(point.x, site.position.y || 0, point.z);
  worker.buildTarget = { type: site.type, position: site.position.clone(), pendingEntityId: siteId, workPosition };
  worker.buildTargetSP = null;worker.buildProgress = 0;worker.isBuilding = false;
  worker.repairTarget = null;worker.attackMove = false;worker.meleeOrder = false;
  worker.moveTarget = workPosition.clone();site.requiresWorker = true;
}

/** A build order contributes work only while its living worker stays at the site. */
export function hasActiveConstructionWorker(world: any, entityId: number, site: any): boolean {
  if (site.deliveryTime > 0 && site.deliveryProgress < site.deliveryTime) return false;
  for (const workerId of world.query('builder', 'mesh')) {
    const worker = world.get(workerId, 'builder');
    const root = world.get(workerId, 'mesh')?.root;
    if (!root || !worker?.isBuilding || worker.hp <= 0 || worker.team !== site.team
      || worker.buildTarget?.pendingEntityId !== entityId || worker.buildTargetSP != null
      || worker.moveTarget != null || worker.repairTarget != null) continue;
    if (canWorkAtStructure(root.position, site)) return true;
  }
  return false;
}
