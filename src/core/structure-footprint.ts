import imperialGuardFootprints from '../../stats/structure-footprints.json';

export interface GroundPoint { x: number; z: number }
export interface StructureFootprint { minX: number; maxX: number; minZ: number; maxZ: number }
export interface FootprintSite {
  type?: string;
  faction?: string;
  constructing?: boolean;
  pendingWorker?: boolean;
  position?: GroundPoint;
}

export const BUILDING_BOUNDS = { hq: 5, barracks: 3.5, infantry_command: 3.5, mechanized: 2.5 };
export const STRUCTURE_BOUNDS = {
  tower: 2.5, turret: 2.5, towerBase: 2.25, gunTurret: 2.5,
  thermo_generator: 3.5, thermoGen: 3.5, plasma_generator: 3.5,
  tactica_control: 3.5, mars_pattern: 3.5, mines: 2.5,
};
export const AIRFIELD_BOUNDS = 8;
export const WORKER_RADIUS = .5;
export const CONSTRUCTION_CLEARANCE = 1.35;
export const CONSTRUCTION_REACH = 2.2;
const profiles: Record<string, { construction: StructureFootprint; completed: StructureFootprint; selection?: { construction: StructureFootprint; completed: StructureFootprint } }> = imperialGuardFootprints;

function canonicalType(type = ''): string {
  return type === 'hq-anim' ? 'hq' : type === 'barracks' ? 'infantry_command' : type;
}

export function hasMeasuredFootprint(site: FootprintSite): boolean {
  return site.faction === 'ig' && !!profiles[canonicalType(site.type)];
}

/** Measured from landed crates and the finished building, without exhaust or flying turbines.
 * Coordinates include the HQ model's quarter-turn and off-centre origins.
 */
export function structureFootprint(site: FootprintSite, construction = !!(site.constructing || site.pendingWorker)): StructureFootprint {
  const profile = site.faction === 'ig' ? profiles[canonicalType(site.type)] : null;
  if (profile) return profile[construction ? 'construction' : 'completed'];
  const bounds: Record<string, number> = { ...BUILDING_BOUNDS, ...STRUCTURE_BOUNDS, airfield: AIRFIELD_BOUNDS };
  const halfSize = bounds[site.type || ''] ?? 3.5;
  return { minX: -halfSize, maxX: halfSize, minZ: -halfSize, maxZ: halfSize };
}

export function worldFootprint(site: FootprintSite, construction?: boolean): StructureFootprint {
  const local = structureFootprint(site, construction);
  const x = site.position?.x || 0, z = site.position?.z || 0;
  return { minX: x + local.minX, maxX: x + local.maxX, minZ: z + local.minZ, maxZ: z + local.maxZ };
}

/** The visible outline follows the drop hull, while the work boundary also clears its machinery. */
export function selectionFootprint(site: FootprintSite, construction = !!(site.constructing || site.pendingWorker)): StructureFootprint {
  const profile = site.faction === 'ig' ? profiles[canonicalType(site.type)] : null;
  return profile?.selection?.[construction ? 'construction' : 'completed'] || structureFootprint(site, construction);
}

export function insideFootprint(point: GroundPoint, bounds: StructureFootprint, padding = 0): boolean {
  return point.x > bounds.minX - padding && point.x < bounds.maxX + padding
    && point.z > bounds.minZ - padding && point.z < bounds.maxZ + padding;
}

export function canWorkAtStructure(point: GroundPoint, site: FootprintSite): boolean {
  const bounds = worldFootprint(site, true);
  if (insideFootprint(point, bounds, WORKER_RADIUS + .15)) return false;
  const dx = Math.max(bounds.minX - point.x, 0, point.x - bounds.maxX);
  const dz = Math.max(bounds.minZ - point.z, 0, point.z - bounds.maxZ);
  return Math.hypot(dx, dz) <= CONSTRUCTION_REACH;
}

/** Work from the front or right face: both remain visible in the default RTS view. */
export function constructionWorkPosition(site: FootprintSite, from: GroundPoint): GroundPoint {
  const bounds = worldFootprint(site, true);
  const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
  const front = { x: clamp(from.x, bounds.minX + .6, bounds.maxX - .6), z: bounds.minZ - CONSTRUCTION_CLEARANCE };
  const right = { x: bounds.maxX + CONSTRUCTION_CLEARANCE, z: clamp(from.z, bounds.minZ + .6, bounds.maxZ - .6) };
  return Math.hypot(from.x - front.x, from.z - front.z) <= Math.hypot(from.x - right.x, from.z - right.z) ? front : right;
}

export function outsideFootprint(point: GroundPoint, bounds: StructureFootprint, padding = WORKER_RADIUS + .2): GroundPoint {
  if (!insideFootprint(point, bounds, padding)) return point;
  const candidates = [
    { x: point.x, z: bounds.minZ - padding }, { x: bounds.maxX + padding, z: point.z },
    { x: bounds.minX - padding, z: point.z }, { x: point.x, z: bounds.maxZ + padding },
  ];
  return candidates.reduce((best, candidate) => Math.hypot(candidate.x - point.x, candidate.z - point.z)
    < Math.hypot(best.x - point.x, best.z - point.z) ? candidate : best);
}

export function segmentEntersFootprint(from: GroundPoint, to: GroundPoint, bounds: StructureFootprint): boolean {
  let entry = 0, exit = 1;
  for (const [start, end, min, max] of [[from.x, to.x, bounds.minX + 1e-5, bounds.maxX - 1e-5], [from.z, to.z, bounds.minZ + 1e-5, bounds.maxZ - 1e-5]]) {
    const delta = end - start;
    if (Math.abs(delta) < 1e-9) { if (start < min || start > max) return false; }
    else {
      const first = (min - start) / delta, second = (max - start) / delta;
      entry = Math.max(entry, Math.min(first, second));exit = Math.min(exit, Math.max(first, second));
      if (entry > exit) return false;
    }
  }
  return entry <= exit;
}

/** Small visibility graph routes around the drop instead of cutting across its centre.
 * The returned waypoint is still passed through the existing terrain pathfinder.
 */
export function constructionApproachWaypoint(from: GroundPoint, goal: GroundPoint, site: FootprintSite): GroundPoint {
  const footprint = worldFootprint(site, true), padding = WORKER_RADIUS + .35;
  const bounds = { minX: footprint.minX - padding, maxX: footprint.maxX + padding, minZ: footprint.minZ - padding, maxZ: footprint.maxZ + padding };
  if (insideFootprint(from, bounds)) return outsideFootprint(from, bounds, .01);
  if (!segmentEntersFootprint(from, goal, bounds)) return goal;
  const points = [from, goal, { x: bounds.minX, z: bounds.minZ }, { x: bounds.maxX, z: bounds.minZ }, { x: bounds.minX, z: bounds.maxZ }, { x: bounds.maxX, z: bounds.maxZ }];
  const distances = points.map(() => Infinity), previous = points.map(() => -1), visited = new Set<number>();distances[0] = 0;
  for (let step = 0; step < points.length; step++) {
    let current = -1;
    for (let index = 0; index < points.length; index++)
      if (!visited.has(index) && (current === -1 || distances[index] < distances[current])) current = index;
    if (current < 0 || !Number.isFinite(distances[current]) || current === 1) break;
    visited.add(current);
    for (let next = 0; next < points.length; next++) {
      if (next === current || visited.has(next) || segmentEntersFootprint(points[current], points[next], bounds)) continue;
      const distance = distances[current] + Math.hypot(points[current].x - points[next].x, points[current].z - points[next].z);
      if (distance < distances[next]) { distances[next] = distance;previous[next] = current; }
    }
  }
  let next = 1;
  if (previous[next] < 0) return goal;
  while (previous[next] > 0) next = previous[next];
  return points[next];
}
