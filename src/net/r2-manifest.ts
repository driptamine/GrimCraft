// Expected R2 downloads for one battle boot, in loadFactionModels order
// (hq, worker, soldier, units, structures, vehicles per faction), then the
// caller-supplied extras (points, bolts, viewmodel). Used for the START
// BATTLE cache preflight: urls already in Cache Storage need no download.
import { FACTIONS, ARENA_POSITION_FACTIONS } from '../factions.js';
import { modelUrl } from '../render/assets.js';
import type { FactionStructureEntry } from '../factions/types.js';

interface StructureLike {
  model?: unknown;
  production?: FactionStructureEntry['production'];
}

// Minimal contract this module reads from a faction config. factions.js is
// still untyped and per-faction shapes differ (some lack units/structures),
// so the access goes through this interface instead of the inferred union.
interface FactionModels {
  hq?: unknown;
  infantry?: Array<{ model?: unknown }>;
  units?: Array<{ model?: unknown }>;
  structures?: StructureLike[] | null;
}

function _collectVehicleModels(config: { structures?: StructureLike[] | null } | null | undefined): string[] {
  const models: string[] = [];
  const seen = new Set<string>();
  for (const structure of config?.structures || []) {
    for (const item of structure.production || []) {
      if (typeof item !== 'string' && item.model && !seen.has(item.model)) {
        seen.add(item.model);
        models.push(item.model);
      }
    }
  }
  return models;
}

export function collectFactionR2Urls(factionKeys: string[] = ARENA_POSITION_FACTIONS): string[] {
  const urls: string[] = [];
  const seen = new Set<string>();
  const push = (path: unknown): void => {
    if (!path) {
      return;
    }
    const url = modelUrl(String(path));
    if (url && !seen.has(url)) {
      seen.add(url);
      urls.push(url);
    }
  };
  for (const key of factionKeys || []) {
    const config = FACTIONS[key as keyof typeof FACTIONS] as unknown as FactionModels | undefined;
    if (!config) {
      continue;
    }
    push(config.hq);
    push(config.infantry?.[0]?.model);
    push(config.infantry?.[1]?.model);
    for (const unit of config.units || []) {
      push(unit.model);
    }
    for (const structure of config.structures || []) {
      push(structure.model);
    }
    for (const model of _collectVehicleModels(config)) {
      push(model);
    }
  }
  return urls;
}

export function collectBootR2Urls(factionKeys: string[] = ARENA_POSITION_FACTIONS, extraPaths: string[] = []): string[] {
  const urls = collectFactionR2Urls(factionKeys);
  const seen = new Set(urls);
  for (const path of extraPaths || []) {
    if (!path) {
      continue;
    }
    const url = modelUrl(path);
    if (url && !seen.has(url)) {
      seen.add(url);
      urls.push(url);
    }
  }
  return urls;
}
