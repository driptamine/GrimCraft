import { clampStepToRoute } from '../../pathfinding/astar-integrated.js';
import { getRideInfo } from '../render/camera-fps.js';
import { _groundAt } from './terrain.js';

// Soft body collision for soldiers locked in melee.
//
// Normal movement uses formation slots and terrain avoidance only, so several
// fighters converging on the same opponent can end up inside one another.
// This pass runs once per tick after the squad system has moved everyone and
// pushes overlapping fighters apart, which also spreads multiple attackers
// around a shared victim instead of stacking them on one spot.
//
// The radius is tuned against MELEE_STANDOFF: two opponents stop 1.9 apart,
// while collision keeps bodies at 1.8, so a duel does not fight the
// separation pass every frame but crowded fighters still cannot overlap.
// Models in this project are not normalized (a chaos marine torso is ~1.7
// wide, a guardsman ~1.35), so the old 1.2 standoff put their meshes inside
// each other even though the root positions never overlapped.

export const MELEE_BODY_RADIUS = 0.9;
export const MELEE_BODY_DIAMETER = MELEE_BODY_RADIUS * 2;

interface MeleeBody {
  id: number;
  root: any;
  x: number;
  z: number;
  flyAlt: number;
}

function _canCollide(soldier: any): boolean {
  if (!soldier || soldier.hp <= 0) {
    return false;
  }
  if ((soldier._flyStage || 0) > 0 || (soldier.flyAlt || 0) > 0.1) {
    return false;
  }
  // Knocked-back soldiers are airborne/externally driven; leave them alone.
  if (soldier.scatter) {
    return false;
  }
  return true;
}

function _isFighting(soldier: any): boolean {
  return _canCollide(soldier)
    && (!!soldier.meleeEngaged || soldier.meleeTargetId != null);
}

/** Push overlapping melee fighters apart. Returns how many bodies moved. */
export function resolveMeleeBodyCollision(world: any): number {
  const riddenId = getRideInfo()?.soldierId ?? null;
  const roots = new Map<number, any>();
  const participantIds = new Set<number>();

  for (const id of world.query('soldier', 'mesh')) {
    const soldier = world.get(id, 'soldier');
    if (!_isFighting(soldier)) {
      continue;
    }
    const root = world.get(id, 'mesh')?.root;
    if (!root) {
      continue;
    }
    roots.set(id, root);
    participantIds.add(id);
    // The opponent is part of the same clash even when he is not issuing a
    // melee order himself (for example a squad that just got charged, or a
    // ranged unit backing away while it is being chased).
    const targetId = soldier.meleeTargetId;
    if (targetId != null && !roots.has(targetId)) {
      const target = world.get(targetId, 'soldier');
      const targetRoot = world.get(targetId, 'mesh')?.root;
      if (targetRoot && _canCollide(target)) {
        roots.set(targetId, targetRoot);
        participantIds.add(targetId);
      }
    }
  }

  const bodies: MeleeBody[] = [];
  for (const id of participantIds) {
    if (id === riddenId) {
      continue;
    }
    const root = roots.get(id);
    if (!root) {
      continue;
    }
    const soldier = world.get(id, 'soldier');
    bodies.push({
      id,
      root,
      x: root.position.x,
      z: root.position.z,
      flyAlt: soldier?.flyAlt || 0,
    });
  }
  if (bodies.length < 2) {
    return 0;
  }

  const minDistance = MELEE_BODY_DIAMETER;
  const minDistanceSq = minDistance * minDistance;
  let moved = 0;

  // A few relaxed iterations: one pass can push A out of B and B into C in
  // a crowded pile, so the last pair would still overlap slightly.
  for (let pass = 0; pass < 3; pass += 1) {
    for (let i = 0; i < bodies.length; i += 1) {
      const a = bodies[i];
      for (let j = i + 1; j < bodies.length; j += 1) {
        const b = bodies[j];
        let dx = b.x - a.x;
        let dz = b.z - a.z;
        const distanceSq = dx * dx + dz * dz;
        if (distanceSq >= minDistanceSq) {
          continue;
        }
        let distance = Math.sqrt(distanceSq);
        if (distance < 1e-4) {
          // Exactly stacked: pick a stable direction from the two ids so the
          // split is deterministic instead of flickering between frames.
          const angle = ((a.id * 0.6180339887 + b.id * 0.3819660113) % 1) * Math.PI * 2;
          dx = Math.cos(angle);
          dz = Math.sin(angle);
          distance = 0;
        } else {
          dx /= distance;
          dz /= distance;
        }
        const push = (minDistance - distance) * 0.5;
        a.x -= dx * push;
        a.z -= dz * push;
        b.x += dx * push;
        b.z += dz * push;
      }
    }
  }

  for (const body of bodies) {
    const position = body.root.position;
    if (position.x === body.x && position.z === body.z) {
      continue;
    }
    const step = clampStepToRoute({}, position.x, position.z, body.x - position.x, body.z - position.z);
    position.x += step[0];
    position.z += step[1];
    // Keep pushed fighters on the ground on sloped maps; systemSquad already
    // ran this frame's terrain snapshot.
    position.y = _groundAt(position.x, position.z) + body.flyAlt;
    moved += 1;
  }
  return moved;
}

export function systemMeleeCollision(world: any): void {
  resolveMeleeBodyCollision(world);
}
