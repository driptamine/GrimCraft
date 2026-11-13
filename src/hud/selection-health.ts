import { bump } from './store.js';

interface HealthSelection {
  unitIds?: number[];
  buildingIds?: number[];
  builderId?: number | null;
  enemySquadId?: number | null;
}

/** Read only the inspected entities; combat elsewhere must not redraw the HUD. */
export function createSelectionHealthTracker() {
  let previousWorld: any = null;
  let previousSignature = '';
  return (world: any, selection: HealthSelection): boolean => {
    const ids = new Set([...selection.unitIds || [], ...selection.buildingIds || []]);
    if (selection.builderId != null) ids.add(selection.builderId);
    if (selection.enemySquadId != null) ids.add(selection.enemySquadId);
    const values: unknown[] = [];
    for (const id of ids) {
      values.push(id);
      const squad = world?.get(id, 'squad');
      if (squad) {
        values.push('squad', squad.maxSquadSize);
        for (const soldierId of squad.soldiers || []) {
          const soldier = soldierId != null ? world.get(soldierId, 'soldier') : null;
          values.push(soldierId, soldier?.hp, soldier?.maxHp);
        }
      } else {
        const entity = ['builder', 'building', 'structure', 'airfield', 'vehicle', 'apc', 'jet']
          .map(kind => world?.get(id, kind)).find(Boolean);
        values.push(entity?.hp, entity?.maxHp);
      }
    }
    const signature = JSON.stringify(values);
    if (world === previousWorld && signature === previousSignature) return false;
    previousWorld = world;previousSignature = signature;
    return true;
  };
}

const changed = createSelectionHealthTracker();
/** Called at the existing HUD cadence after damage, healing and removals. */
export function refreshSelectionHealth(world: any, selection: HealthSelection): void {
  if (changed(world, selection)) bump('health');
}
