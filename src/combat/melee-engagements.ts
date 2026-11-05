import { MELEE_RANGE } from '../entities/soldier-aim.js';

interface Fighter {
  id: number;
  squadId: number;
  soldier: any;
  squad: any;
  position: { distanceToSquared(other: any): number };
  initiates: boolean;
  responds: boolean;
  preferredSquad: number | null;
  previousTarget: number | null;
  wasEngaged: boolean;
}

/** Assign stable opponents once per tick, before either team's combat runs. */
export function updateMeleeEngagements(world: any, squadIds: number[], defaultMode = 'ranged'): void {
  const fighters: Fighter[] = [];
  const byId = new Map<number, Fighter>();
  for (const squadId of squadIds) {
    const squad = world.get(squadId, 'squad');
    if (!squad) continue;
    const retreating = !!squad.moveOrder && !squad.attackMove;
    const preferredSquad = world.get(squad.forcedSoldierId, 'soldier')?.squadId ?? squad.forcedTarget ?? null;
    for (const id of squad.soldiers || []) {
      if (id == null) continue;
      const soldier = world.get(id, 'soldier');
      const root = world.get(id, 'mesh')?.root;
      if (!soldier) continue;
      const previousTarget = soldier.meleeTargetId ?? null;
      const wasEngaged = !!soldier.meleeEngaged;
      soldier.meleeTargetId = null;
      soldier.meleeEngaged = false;
      if (!root || soldier.hp <= 0 || squad.flyOrder || (soldier._flyStage || 0) > 0 || (soldier.flyAlt || 0) > 0.1) continue;
      const responds = !retreating && !soldier.scatter && !(soldier.stagger > 0);
      const fighter: Fighter = {
        id, squadId, soldier, squad, position: root.position,
        initiates: responds && !squad.stopped && (squad.attackMode || defaultMode) === 'melee',
        responds, preferredSquad, previousTarget, wasEngaged,
      };
      fighters.push(fighter);
      byId.set(id, fighter);
    }
  }
  const targets = new Map<number, number>();
  const incoming = new Map<number, number>();
  const canTarget = (attacker: Fighter, target: Fighter): boolean => {
    if (attacker.squad.team === target.squad.team) return false;
    if (target.soldier.cloaked && !(target.soldier.revealTimer > 0)) return false;
    if (attacker.preferredSquad != null) return target.squadId === attacker.preferredSquad;
    const radius = attacker.squad.detectionRange ?? 40;
    return attacker.position.distanceToSquared(target.position) <= radius * radius;
  };
  const assign = (attacker: Fighter, target: Fighter): void => {
    targets.set(attacker.id, target.id);
    incoming.set(target.id, (incoming.get(target.id) || 0) + 1);
    if (!targets.has(target.id) && target.responds) {
      targets.set(target.id, attacker.id);
      incoming.set(attacker.id, (incoming.get(attacker.id) || 0) + 1);
    }
  };
  const initiators = fighters.filter((fighter) => fighter.initiates);
  // Retain reciprocal duels so a small movement does not shuffle opponents.
  for (const attacker of initiators) {
    const target = byId.get(attacker.previousTarget as number);
    if (target && target.previousTarget === attacker.id && canTarget(attacker, target)
      && !targets.has(attacker.id) && !targets.has(target.id)) assign(attacker, target);
  }
  // Give every unpaired attacker an unused opponent before allowing doubles.
  for (const attacker of initiators) {
    if (targets.has(attacker.id)) continue;
    let best: Fighter | undefined;
    let distance = Infinity;
    for (const target of fighters) {
      if ((incoming.get(target.id) || 0) > 0 || targets.has(target.id) || !canTarget(attacker, target)) continue;
      const next = attacker.position.distanceToSquared(target.position);
      if (next < distance) { best = target; distance = next; }
    }
    if (best) assign(attacker, best);
  }
  // Unequal numbers: spread spare attackers across the least-loaded enemies.
  for (const attacker of initiators) {
    if (targets.has(attacker.id)) continue;
    let best: Fighter | undefined;
    let load = Infinity;
    let distance = Infinity;
    for (const target of fighters) {
      if (!canTarget(attacker, target)) continue;
      const nextLoad = incoming.get(target.id) || 0;
      const nextDistance = attacker.position.distanceToSquared(target.position);
      if (nextLoad < load || (nextLoad === load && nextDistance < distance)) {
        best = target; load = nextLoad; distance = nextDistance;
      }
    }
    if (best) assign(attacker, best);
  }
  for (const [id, targetId] of targets) {
    const fighter = byId.get(id)!;
    const target = byId.get(targetId)!;
    fighter.soldier.meleeTargetId = targetId;
    const releaseRange = fighter.wasEngaged || target.wasEngaged ? MELEE_RANGE + 1.6 : MELEE_RANGE;
    if (fighter.position.distanceToSquared(target.position) <= releaseRange * releaseRange) {
      if (fighter.responds) fighter.soldier.meleeEngaged = true;
      if (target.responds) target.soldier.meleeEngaged = true;
    }
  }
  for (const fighter of fighters) {
    if (fighter.soldier.meleeEngaged && !fighter.wasEngaged) {
      fighter.soldier.shootTimer = 0;
      fighter.soldier.attackCooldown = Math.min(fighter.soldier.attackCooldown || 0, 0.65);
    }
  }
}
