import { insideFootprint, worldFootprint } from '../core/structure-footprint.js';
import type { GroundPoint } from '../core/structure-footprint.js';

/** Resolve the same construction site for hover and right-click orders.
 * A point's centerpost can obscure its unfinished listening post, and the
 * delivered scaffold has gaps, so also accept the site's ground footprint. */
export function findConstructionTarget(world: any, workerId: number | null, meta: any, ground: GroundPoint | null,
  canCommand: (team: string, id: number) => boolean): { id: number; component: any } | null {
  const worker = workerId != null ? world?.get(workerId, 'builder') : null;
  if (!worker || !(worker.hp > 0) || !canCommand(worker.team, workerId!)) return null;
  const candidate = (id: number | null | undefined) => {
    if (id == null) return null;
    const component = world.get(id, 'building') || world.get(id, 'structure') || world.get(id, 'airfield');
    return component && component.team === worker.team && component.hp > 0 && canCommand(component.team, id)
      && (component.constructing || component.pendingWorker) && component.constructTime > 0
      && component.constructProgress < component.constructTime ? { id, component } : null;
  };
  const directId = meta?.buildingEntityId ?? meta?.structureEntityId ?? meta?.airfieldEntityId;
  if (directId != null) return candidate(directId);
  const pointId = meta?.strategicPointEntityId ?? meta?.listeningPostEntityId;
  const linked = pointId != null ? candidate(world.get(pointId, 'strategicPoint')?.listeningPostEntityId) : null;
  if (linked) return linked;
  if (!ground) return null;
  let nearest: { id: number; component: any } | null = null;
  let distance = Infinity;
  for (const kind of ['building', 'structure', 'airfield']) {
    for (const id of world.query(kind)) {
      const target = candidate(id);
      if (!target || !insideFootprint(ground, worldFootprint(target.component, true), .25)) continue;
      const next = Math.hypot(ground.x - target.component.position.x, ground.z - target.component.position.z);
      if (next < distance) { nearest = target;distance = next; }
    }
  }
  return nearest;
}
