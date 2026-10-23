import { enemyFaction, factionContainers, playerFaction, resolveFactionKey } from '../factions.js';
import { useProceduralModels } from '../model-source.js';
import { PLAYER } from '../scene.js';


// Empty bucket returned in procedural mode so every factory takes its
// built-in procedural branch (same path as a failed GLB load).
export const _EMPTY_FACTION_BUCKET = { hq: null, worker: null, soldier: null, units: {}, structures: {}, vehicles: {} };


export function _factionBucket(teamKey, metaPayload) {
  if (useProceduralModels()) {
    return _EMPTY_FACTION_BUCKET;
  }
  const fallback = teamKey === PLAYER ? playerFaction : enemyFaction;
  return factionContainers[resolveFactionKey(metaPayload?.faction, fallback)];
}
