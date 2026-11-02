import { enemyFaction, factionContainers, playerFaction, resolveFactionKey, type FactionBucket } from '../factions.js';
import { useProceduralModels } from '../render/model-source.js';
import { PLAYER } from '../core/scene.js';


// Empty bucket returned in procedural mode so every factory takes its
// built-in procedural branch (same path as a failed GLB load).
export const _EMPTY_FACTION_BUCKET: FactionBucket = { hq: null, worker: null, soldier: null, units: {}, structures: {}, vehicles: {}, teamcolor: null };


export function _factionBucket(teamKey: string, metaPayload?: { faction?: string } | null): FactionBucket {
  if (useProceduralModels()) {
    return _EMPTY_FACTION_BUCKET;
  }
  const fallback = teamKey === PLAYER ? playerFaction : enemyFaction;
  return factionContainers[resolveFactionKey(metaPayload?.faction, fallback)];
}
