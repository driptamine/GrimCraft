// Expected R2 downloads for one battle boot, in loadFactionModels order
// (hq, worker, soldier, units, structures, vehicles per faction), then the
// caller-supplied extras (points, bolts, viewmodel). Used for the START
// BATTLE cache preflight: urls already in Cache Storage need no download.
import { FACTIONS, ARENA_POSITION_FACTIONS } from './factions.js';
import { modelUrl } from './assets.js';

function _collectVehicleModels(config) {
  const models = [];
  const seen = new Set();
  for (const structure of config?.structures || []) {
    for (const item of structure.production || []) {
      if (item.model && !seen.has(item.model)) {
        seen.add(item.model);
        models.push(item.model);
      }
    }
  }
  return models;
}

export function collectFactionR2Urls(factionKeys = ARENA_POSITION_FACTIONS) {
  const urls = [];
  const seen = new Set();
  const push = (path) => {
    if (!path) {
      return;
    }
    const url = modelUrl(path);
    if (url && !seen.has(url)) {
      seen.add(url);
      urls.push(url);
    }
  };
  for (const key of factionKeys || []) {
    const config = FACTIONS[key];
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

export function collectBootR2Urls(factionKeys = ARENA_POSITION_FACTIONS, extraPaths = []) {
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
