import * as THREE from 'three';
import { modelUrl } from './assets.js';
import { loadGltf } from './gltf-models.js';
import { loadTeamcolour, teamcolorHex } from './teamcolour.js';
import { mergeStaticContainer } from './merge-static.js';
import { mergeSkinnedContainer } from './merge-skinned.js';
import { bump } from './hud/store.js';

import chaos from './factions/chaos.js';
import darkEldar from './factions/dark-eldar.js';
import eldar from './factions/eldar.js';
import ig from './factions/ig.js';
import necrons from './factions/necrons.js';
import orks from './factions/orks.js';
import sob from './factions/sob.js';
import spaceMarines from './factions/space-marines.js';
import tau from './factions/tau.js';

export const FACTIONS = {
  chaos,
  'dark eldar': darkEldar,
  eldar,
  ig,
  necrons,
  orks,
  sob,
  'space marines': spaceMarines,
  tau,
};

export let playerFaction = 'ig';
export let enemyFaction = 'chaos';

// HUD "switch faction": point the player side at another faction.
// Unknown keys are ignored so a bad cycle step can't corrupt lookups.
export function setPlayerFaction(key) {
  if (FACTIONS[key]) {
    playerFaction = key;
  }
}

// Start positions 1-6 in game.js resetGame, in order.
export const POSITION_FACTIONS = ['orks', 'ig', 'necrons', 'chaos', 'space marines', 'eldar'];

// Default Arena adds a 7th start position (Tau, blue side) and an 8th
// (Dark Eldar, red side). SGB maps keep the base 6 positions. Model
// loading always covers the union.
export const ARENA_POSITION_FACTIONS = [...POSITION_FACTIONS, 'tau', 'dark eldar'];

function _emptyBucket() {
  return { hq: null, worker: null, soldier: null, units: {}, structures: {}, vehicles: {}, teamcolor: null };
}

export const factionContainers = {};
for (const key of ARENA_POSITION_FACTIONS) {
  factionContainers[key] = _emptyBucket();
}

// Static-merge results per HQ/structure container, filled during
// loadFactionModels ({label, before, after, ...}). Powers benchmark.md
// verification and console inspection.
export const mergeStats = [];

export function resolveFactionKey(faction, fallback = playerFaction) {
  if (faction && factionContainers[faction]) {
    return faction;
  }
  if (fallback && factionContainers[fallback]) {
    return fallback;
  }
  return POSITION_FACTIONS[0];
}

export function getFactionAnimations(factionKey, role = 'soldier') {
  const key = FACTIONS[factionKey] ? factionKey : (factionKey === 'player' ? playerFaction : enemyFaction);
  const idx = role === 'worker' ? 0 : 1;
  return FACTIONS[key]?.infantry?.[idx]?.animations || null;
}

export function getStructureConfig(factionKey, type) {
  return FACTIONS[factionKey]?.structures?.find((s) => s.type === type) || null;
}

// Parsed .teamcolour palette for a faction (null until loaded, or when the
// faction declares no scheme file). Surfaces (HUD/banner) read from here.
export function getFactionTeamcolor(factionKey) {
  return factionContainers[factionKey]?.teamcolor ?? null;
}

// Teamcolour schemes per faction: 'default' = pre-scheme behavior
// (teamcolor null); named schemes map to files in the faction config's
// `teamcolours` map (scheme -> .teamcolour path). The colorize slot picks
// which palette entry drives the body look: IG reads white-grey Trim,
// Space Marines read chapter Primary.
export const TEAMCOLOUR_SLOT = { ig: 'trim', 'space marines': 'primary' };

export function getFactionTeamcolourSchemes(factionKey) {
  return ['default', ...Object.keys(FACTIONS[factionKey]?.teamcolours || {})];
}

const _teamcolourScheme = {};
const _teamcolourCache = {};

// Scheme look: colorize the body toward the scheme slot color.
//
// The converted .glb files have no team-color mask channel, and a plain
// color multiply can only darken the painted texture — it can never reach
// IG's white-grey Trim (212,212,212) or re-hue the pre-painted Blood
// Ravens red into other chapters. So the shared body material gets a
// permanent onBeforeCompile patch (one program; the mix amount is a
// uniform): diffuse colorizes toward the slot color while shading
// variation is preserved, and skin-toned texels are mostly kept so faces
// don't go flat. 'default' = mix 0, i.e. the authored look exactly.
// Instances share materials by reference (SkeletonUtils.clone), so one
// patch + uniform update recolors every soldier with zero per-instance
// and zero per-frame cost. Painted banners keep their authored art.
const TEAMCOLOUR_BODY_MATERIALS = ['ig_guardsmen', 'space_marine_unit'];
const TEAMCOLOUR_MIX = 0.85;

const _TEAMCOLOUR_CHUNK = `
  {
    float teamLum = dot(diffuseColor.rgb, vec3(0.299, 0.587, 0.114));
    float teamShade = smoothstep(0.0, 0.22, teamLum);
    vec3 teamTarget = uTeamColor * mix(0.45, 1.0, teamShade);
    float teamSkin = smoothstep(0.02, 0.08, diffuseColor.r - diffuseColor.g)
      * smoothstep(0.0, 0.05, diffuseColor.g - diffuseColor.b);
    diffuseColor.rgb = mix(diffuseColor.rgb, teamTarget, uTeamMix * (1.0 - teamSkin * 0.85));
  }
`;

function _patchTeamcolourMaterial(mat) {
  if (mat.userData._teamPatched) {
    return;
  }
  mat.userData._teamPatched = true;
  mat.userData._uTeamColor = { value: new THREE.Color(0xffffff) };
  mat.userData._uTeamMix = { value: 0 };
  const prev = mat.onBeforeCompile;
  mat.onBeforeCompile = (shader) => {
    if (typeof prev === 'function') {
      prev(shader);
    }
    shader.uniforms.uTeamColor = mat.userData._uTeamColor;
    shader.uniforms.uTeamMix = mat.userData._uTeamMix;
    // Uniform declarations are mandatory: without them the program fails
    // to compile and the mesh renders nothing (invisible in every mode).
    shader.fragmentShader = (
      `uniform vec3 uTeamColor;\nuniform float uTeamMix;\n${shader.fragmentShader}`
    ).replace(
      '#include <map_fragment>',
      `#include <map_fragment>${_TEAMCOLOUR_CHUNK}`,
    );
  };
  mat.customProgramCacheKey = () => 'teamcolour1';
  mat.needsUpdate = true;
}

function _applyTeamcolorToContainer(factionKey, target) {
  const scene = target?.soldier?.scene;
  if (!scene || typeof scene.traverse !== 'function') {
    return;
  }
  const slot = TEAMCOLOUR_SLOT[factionKey] || 'trim';
  const slotHex = teamcolorHex(target.teamcolor?.[slot])
    ?? teamcolorHex(target.teamcolor?.primary);
  scene.traverse((node) => {
    const mats = Array.isArray(node.material) ? node.material : (node.material ? [node.material] : []);
    for (const mat of mats) {
      if (!TEAMCOLOUR_BODY_MATERIALS.includes(mat.name) || !mat.color) {
        continue;
      }
      _patchTeamcolourMaterial(mat);
      if (slotHex == null) {
        mat.userData._uTeamMix.value = 0;
      } else {
        mat.userData._uTeamColor.value.setHex(slotHex);
        mat.userData._uTeamMix.value = TEAMCOLOUR_MIX;
      }
    }
  });
}

export function getFactionTeamcolourScheme(factionKey) {
  return _teamcolourScheme[factionKey] || 'default';
}

export async function setFactionTeamcolourScheme(factionKey, scheme) {
  const schemes = getFactionTeamcolourSchemes(factionKey);
  const next = schemes.includes(scheme) ? scheme : 'default';
  _teamcolourScheme[factionKey] = next;
  const target = factionContainers[factionKey];
  if (target) {
    if (next === 'default') {
      target.teamcolor = null;
    } else {
      const url = modelUrl(FACTIONS[factionKey]?.teamcolours?.[next]);
      if (!url) {
        target.teamcolor = null;
      } else if (_teamcolourCache[url]) {
        target.teamcolor = _teamcolourCache[url];
      } else {
        try {
          const parsed = await loadTeamcolour(url);
          if (parsed) _teamcolourCache[url] = parsed;
          target.teamcolor = parsed;
        } catch (_) {
          target.teamcolor = null;
        }
      }
    }
    _applyTeamcolorToContainer(factionKey, target);
  }
  bump('topbar');
  return next;
}

export function toggleFactionTeamcolourScheme(factionKey) {
  const schemes = getFactionTeamcolourSchemes(factionKey);
  const cur = schemes.indexOf(getFactionTeamcolourScheme(factionKey));
  return setFactionTeamcolourScheme(factionKey, schemes[(cur + 1) % schemes.length]);
}



function _collectUnitModels(config) {
  const models = new Set();
  for (const unit of config?.units || []) {
    if (unit.model) {
      models.add(unit.model);
    }
  }
  return models;
}

function _collectVehicleModels(config) {
  const models = new Set();
  for (const structure of config?.structures || []) {
    for (const item of structure.production || []) {
      if (item.model) {
        models.add(item.model);
      }
    }
  }
  return models;
}

export function countFactionModels(config) {
  if (!config) {
    return 0;
  }
  let total = 0;
  if (config.hq) {
    total += 1;
  }
  if (config.infantry?.[0]?.model) {
    total += 1;
  }
  if (config.infantry?.[1]?.model) {
    total += 1;
  }
  total += (config.units || []).filter((u) => u.model).length;
  total += (config.structures || []).filter((s) => s.model).length;
  total += _collectVehicleModels(config).size;
  return total;
}

export async function loadFactionModels(scene, factionKeys = POSITION_FACTIONS, hooks = {}) {
  console.log('[FACTION] START LOADING MODELS...');
  const { loadModel = loadGltf, onProgress = null } = hooks;
  let total = 0;
  for (const key of factionKeys) {
    total += countFactionModels(FACTIONS[key]);
  }
  let loaded = 0;

  function reportProgress(label) {
    loaded += 1;
    if (onProgress) {
      try {
        onProgress({ loaded, total, label });
      } catch (_) {}
    }
  }

  async function safeLoad(path, label, hiddenNodes) {
    if (!path) return null;
    try {
      const url = modelUrl(path);
      console.log(`[FACTION] Loading ${label}: ${url}`);
      const container = await loadModel(url);
      if (container && hiddenNodes) container._hiddenNodes = hiddenNodes;
      return container;
    } catch (error) {
      console.warn(`[FACTION] Failed to load model (${label}): ${path}`, error);
      return null;
    } finally {
      reportProgress(label);
    }
  }

  async function loadUnitContainers(config, target, label) {
    for (const unit of config?.units || []) {
      target[unit.name] = maybeMergeSkinned(
        await safeLoad(unit.model, `${label} Unit ${unit.name}`, unit.hiddenNodes),
        unit.hiddenNodes,
        `${label} Unit ${unit.name}`,
      );
    }
  }

  // Worker/soldier/units: merge skinned parts per material at load.
  // Runtime-switched meshes (weapons, planter banner, glow anchors),
  // hidden and animated subtrees always stay separate.
  function maybeMergeSkinned(container, hiddenNodes, label) {
    if (!container) {
      return container;
    }
    const stats = mergeSkinnedContainer(container, hiddenNodes || []);
    if (stats.merged > 0) {
      mergeStats.push({ label, ...stats });
      console.log(`[FACTION] Merged ${label}: ${stats.before} -> ${stats.after} calls`);
    }
    return container;
  }

  // HQ/structures only: merge static geometry per material at load.
  // Hidden subtrees stay separate so hiddenNodes keeps working;
  // animated subtrees, skins and morphs are never merged.
  function maybeMergeStatic(container, hiddenNodes, label) {
    if (!container) {
      return container;
    }
    const stats = mergeStaticContainer(container, hiddenNodes || []);
    if (stats.merged > 0) {
      mergeStats.push({ label, ...stats });
      console.log(`[FACTION] Merged ${label}: ${stats.before} -> ${stats.after} meshes`);
    }
    return container;
  }

  for (const key of factionKeys) {
    const config = FACTIONS[key];
    if (!config) {
      continue;
    }
    if (!factionContainers[key]) {
      factionContainers[key] = _emptyBucket();
    }
    const target = factionContainers[key];
    const hqHidden = getStructureConfig(key, 'hq')?.hiddenNodes;
    target.hq = maybeMergeStatic(await safeLoad(config.hq, `${config.name} HQ`, hqHidden), hqHidden, `${config.name} HQ`);
    target.worker = maybeMergeSkinned(await safeLoad(config.infantry?.[0]?.model, `${config.name} Worker`, config.infantry?.[0]?.hiddenNodes), config.infantry?.[0]?.hiddenNodes, `${config.name} Worker`);
    target.soldier = maybeMergeSkinned(await safeLoad(config.infantry?.[1]?.model, `${config.name} Soldier`, config.infantry?.[1]?.hiddenNodes), config.infantry?.[1]?.hiddenNodes, `${config.name} Soldier`);
    await loadUnitContainers(config, target.units, config.name);
    for (const s of config.structures || []) {
      target.structures[s.type] = maybeMergeStatic(
        await safeLoad(s.model, `${config.name} Structure ${s.type}`, s.hiddenNodes),
        s.hiddenNodes,
        `${config.name} Structure ${s.type}`,
      );
    }
    for (const model of _collectVehicleModels(config)) {
      target.vehicles[model] = await safeLoad(model, `${config.name} Vehicle`);
    }
    // Teamcolour starts on 'default' (no scheme, pre-feature behavior).
    // Named schemes activate on demand via the TopBar toggle (cached,
    // never fatal), so model loading never fetches scheme files.
    target.teamcolor = null;
    _teamcolourScheme[key] = 'default';
    _applyTeamcolorToContainer(key, target);
  }

  console.log('[FACTION] ALL MODELS LOADED.');
}
