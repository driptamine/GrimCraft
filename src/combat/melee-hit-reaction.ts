import { MELEE_HIT_REACTION_SEC } from '../entities/soldier-aim.js';

// Melee flinch reaction.
//
// A soldier who takes a melee blow plays the authored melee_damage_l/_r clip
// once. The reaction is set from the melee damage call site (systemSquad)
// rather than _soldierTakeDamage, because that helper is shared with ranged
// projectiles, which must not stagger units with a melee clip.
//
// Cycle available damage reactions and the authored block when present.
export function triggerMeleeHitReaction(world: any, soldierId: any, allowBlock = true): boolean {
  const soldier = world.get(soldierId, 'soldier');
  const root = world.get(soldierId, 'mesh')?.root;
  if (!soldier || !root || soldier.hp <= 0) {
    return false;
  }
  const groups = root._animGroups;
  if (!groups) {
    return false;
  }
  const reactions = ['hitL', 'hitR', 'hitBlock'].filter((name) => groups[name] && (name !== 'hitBlock' || allowBlock));
  if (!reactions.length) return false;
  const index = soldier._meleeReactionIndex || 0;
  soldier.hitReactionAnim = reactions[index % reactions.length];
  soldier._meleeReactionIndex = index + 1;
  soldier.hitReactionTimer = MELEE_HIT_REACTION_SEC;
  return true;
}
