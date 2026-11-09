// Shared squad reinforcement used by both the HUD REINFORCE button and the
// R hotkey, so their rules (cost, formation slots, queue) can never drift.
import { COSTS, SQUAD_MAX, requisition, selSquads, setRequisition, world } from './scene.js';

/**
 * Queue one replacement soldier for the first selected squad that has an
 * open formation slot and can afford it. Returns true when a soldier was
 * queued.
 */
export function reinforceSelectedSquads(): boolean {
  if (requisition < COSTS.reinforce) return false;
  for (const sqId of selSquads) {
    const sq = world.get(sqId, 'squad');
    if (!sq) continue;
    const cost = sq.reinforceCost ?? COSTS.reinforce;
    const maxSquadSize = sq.maxSquadSize ?? SQUAD_MAX;
    if (requisition < cost) continue;
    const aliveSols = sq.soldiers.filter((sid: any) => sid !== null && world.has(sid, 'soldier'));
    const occupied = new Set([
      ...aliveSols.map((sid: any) => {
        const sol = world.get(sid, 'soldier');
        return sol ? sol.formIdx : -1;
      }),
      ...sq.reinforceQueue.map((q: any) => q.formIdx),
    ]);
    for (let i = 1; i < maxSquadSize; i += 1) {
      if (!occupied.has(i)) {
        setRequisition(requisition - cost);
        sq.reinforceQueue.push({ formIdx: i, cost, time: sq.reinforceTime ?? 7 });
        return true;
      }
    }
  }
  return false;
}
