import { world, selBuilder, selSquads, selBuildings, selListeningPost, requisition, SQUAD_MAX, COSTS, PROD_TIME } from '../scene.js';
import { FACTIONS, playerFaction, getStructureConfig, ARENA_POSITION_FACTIONS } from '../factions.js';

function entityFocusPosition(worldLike, id) {
  if (id === null || id === undefined) {
    return null;
  }
  const root = worldLike.get(id, 'mesh')?.root;
  if (root?.position) {
    return { x: root.position.x, z: root.position.z };
  }
  const types = ['squad', 'builder', 'building', 'structure', 'airfield', 'apc', 'vehicle', 'jet', 'strategicPoint'];
  for (const type of types) {
    const comp = worldLike.get(id, type);
    if (comp?.position) {
      return { x: comp.position.x, z: comp.position.z };
    }
  }
  return null;
}

function firstFocusPosition(worldLike, ids) {
  for (const id of ids || []) {
    const pos = entityFocusPosition(worldLike, id);
    if (pos) {
      return pos;
    }
  }
  return null;
}

/**
 * World position a portrait click should move the camera to for the current
 * selection view. Returns { x, z } or null when there is nothing meaningful
 * to focus. Pure except for the injected world-like object.
 */
export function getPortraitFocusPosition(worldLike, view, selection) {
  if (!worldLike || !selection) {
    return null;
  }
  switch (view) {
    case 'builder':
      return entityFocusPosition(worldLike, selection.builderId);
    case 'airfield':
    case 'building':
      return entityFocusPosition(worldLike, (selection.buildingIds || [])[0]);
    case 'buildings':
      return firstFocusPosition(worldLike, selection.buildingIds);
    case 'jet':
      return firstFocusPosition(worldLike, selection.jets);
    case 'vehicle':
      return firstFocusPosition(worldLike, selection.vehicles);
    case 'apc':
      return firstFocusPosition(worldLike, selection.apcs);
    case 'squad':
    case 'squads':
      return firstFocusPosition(worldLike, selection.squads);
    case 'listening_post':
      return entityFocusPosition(worldLike, selection.listeningPostId);
    case 'default': {
      const hovered = selection.hoveredEnemySquad;
      if (hovered && worldLike.has(hovered, 'squad')) {
        return entityFocusPosition(worldLike, hovered);
      }
      return null;
    }
    default:
      return null;
  }
}

/**
 * Pure selectors shared by the React HUD panels. They read live ESM
 * bindings from scene.js, so they must only be called during render.
 */

export function entityFaction(entity, fallback = playerFaction) {
  const faction = entity?.faction;
  return faction && FACTIONS[faction] ? faction : fallback;
}

export function workerDisplayName(factionKey) {
  return FACTIONS[factionKey]?.infantry?.[0]?.name?.toUpperCase() || 'BUILDER';
}

export function getAliveGroups() {
  const squads = selSquads.filter((id) => world.has(id, 'squad'));
  const apcs = selSquads.filter((id) => world.has(id, 'apc'));
  const vehicles = selSquads.filter((id) => world.has(id, 'vehicle'));
  const jets = selSquads.filter((id) => world.has(id, 'jet'));
  return { squads, apcs, vehicles, jets };
}

export function getAnimList() {
  if (!world) {
    return null;
  }
  const squads = selSquads.filter((id) => world.has(id, 'squad'));
  if (squads.length === 0) {
    return null;
  }
  const squad = world.get(squads[0], 'squad');
  const soldierId = squad?.soldiers?.find((sid) => sid !== null && world.has(sid, 'soldier'));
  if (soldierId === undefined) {
    return null;
  }
  const root = world.get(soldierId, 'mesh')?.root;
  if (!root || !root._animGroups) {
    return null;
  }
  const slots = ['idle', 'run', 'shoot', 'shootMove']
    .filter((slot) => root._animGroups[slot]?.name)
    .map((slot) => ({ slot, name: root._animGroups[slot].name }));
  if (slots.length === 0) {
    return null;
  }
  return { isCustom: !!root._isCustomModel, slots };
}

export function getStructureProduction(type, factionKey = playerFaction) {
  if (!world) {
    return [];
  }
  const faction = FACTIONS[factionKey];
  const structure = faction?.structures?.find((s) => s.type === type);
  return structure?.production || [];
}

// Position of a faction's HQ building (null when none stands).
export function hqPositionForFaction(factionKey) {
  if (!world) {
    return null;
  }
  for (const id of world.query('building')) {
    const b = world.get(id, 'building');
    if (b?.type === 'hq' && b.faction === factionKey && b.position) {
      return b.position;
    }
  }
  return null;
}

// Factions with a standing HQ, in canonical cycle order.
export function factionsWithHQ() {
  if (!world) {
    return [];
  }
  const present = new Set();
  for (const id of world.query('building')) {
    const b = world.get(id, 'building');
    if (b?.type === 'hq' && b.faction) {
      present.add(b.faction);
    }
  }
  return ARENA_POSITION_FACTIONS.filter((f) => present.has(f));
}

// Team of a faction's HQ building (null when none stands).
export function hqTeamForFaction(factionKey) {
  if (!world) {
    return null;
  }
  for (const id of world.query('building')) {
    const b = world.get(id, 'building');
    if (b?.type === 'hq' && b.faction === factionKey) {
      return b.team || null;
    }
  }
  return null;
}

function displayName(name) {
  return String(name).replace(/_/g, ' ').toUpperCase();
}

export function unitTooltip(item, factionKey = playerFaction) {
  const faction = FACTIONS[factionKey];
  const unit = (faction?.units || []).find((u) => u.name === item.name);
  const cost = item.cost || unit?.cost || COSTS[item.name];
  const time = item.time || unit?.time || PROD_TIME[item.name];
  const lines = [displayName(item.name)];
  lines.push(`COST ${cost}R · TIME ${time}s`);
  if (unit) {
    const stats = [];
    if (unit.hp) stats.push(`HP ${unit.hp}`);
    if (unit.damage) stats.push(`DMG ${unit.damage}`);
    if (unit.attackRange) stats.push(`RNG ${unit.attackRange}u`);
    if (unit.size) stats.push(`SIZE ${unit.size}`);
    if (stats.length) lines.push(stats.join(' · '));
  }
  return lines.join('\n');
}

export function structureTooltip(type, factionKey = playerFaction) {
  const cfg = getStructureConfig(factionKey, type);
  const name = cfg?.name || type;
  const cost = cfg?.cost || COSTS[type];
  const time = cfg?.time;
  const lines = [displayName(name)];
  lines.push(`COST ${cost}R${time ? ` · TIME ${time}s` : ''}`);
  const prod = cfg?.production || [];
  if (prod.length) {
    lines.push(`PRODUCES: ${prod.map((p) => displayName(p.name)).join(', ')}`);
  }
  const addons = cfg?.addons || [];
  if (addons.length) {
    lines.push(`ADDONS: ${addons.map((a) => displayName(a.name)).join(', ')}`);
  }
  return lines.join('\n');
}

export function addonTooltip(addon) {
  const lines = [displayName(addon.name)];
  lines.push(`COST ${addon.cost}R${addon.power ? ` / ${addon.power}P` : ''}`);
  if (addon.time) lines.push(`TIME ${addon.time}s`);
  if (addon.tier) lines.push(`TIER ${addon.tier}`);
  if (addon.requiresTier) lines.push(`REQUIRES TIER ${addon.requiresTier}`);
  if (addon.unlocks) lines.push(`UNLOCKS ${displayName(addon.unlocks)}`);
  if (addon.scanner) lines.push('Reveals fog of war');
  return lines.join('\n');
}

export function getBarracksProduction(factionKey = playerFaction) {
  return getStructureProduction('infantry_command', factionKey) || getStructureProduction('barracks', factionKey);
}

export function getViewKind() {
  if (!world) {
    return 'none';
  }
  if (selBuilder !== null && world.has(selBuilder, 'builder')) {
    return 'builder';
  }
  if (selListeningPost !== null) {
    const sp = world.get(selListeningPost, 'strategicPoint');
    if (sp && sp.hasListeningPost) {
      return 'listening_post';
    }
  }
  if (selBuildings.length === 1) {
    if (world.has(selBuildings[0], 'airfield')) {
      return 'airfield';
    }
    return 'building';
  }
  if (selBuildings.length > 1) {
    return 'buildings';
  }
  const { squads, apcs, vehicles, jets } = getAliveGroups();
  if (jets.length > 0 && squads.length === 0 && apcs.length === 0 && vehicles.length === 0) {
    return 'jet';
  }
  if (vehicles.length > 0 && squads.length === 0 && apcs.length === 0) {
    return 'vehicle';
  }
  if (apcs.length > 0 && squads.length === 0) {
    return 'apc';
  }
  if (squads.length === 1) {
    return 'squad';
  }
  if (squads.length > 1) {
    return 'squads';
  }
  return 'default';
}

export function computeSquadData() {
  const alive = selSquads.filter((id) => world.has(id, 'squad'));

  const totalMen = alive.reduce((sum, sqId) => {
    const sq = world.get(sqId, 'squad');
    return sum + (sq ? sq.soldiers.filter((sid) => sid !== null && world.has(sid, 'soldier')).length : 0);
  }, 0);
  const totalMax = alive.length * SQUAD_MAX;

  let totalHp = 0;
  let totalMaxHp = 0;
  alive.forEach((sqId) => {
    const sq = world.get(sqId, 'squad');
    if (!sq) return;
    sq.soldiers.filter((sid) => sid !== null && world.has(sid, 'soldier')).forEach((sid) => {
      const sol = world.get(sid, 'soldier');
      if (!sol) return;
      totalHp += sol.hp;
      totalMaxHp += sol.maxHp;
    });
  });

  const avgHpPct = totalMaxHp > 0 ? totalHp / totalMaxHp : 0;
  const hpColor = avgHpPct > 0.6 ? '#44ff88' : avgHpPct > 0.3 ? '#ffcc00' : '#ff4422';

  const allReinforceQueued = alive.flatMap((sqId) => {
    const sq = world.get(sqId, 'squad');
    if (!sq) return [];
    return sq.reinforceQueue.map((q, i) => ({
      type: 'reinforce',
      sqId,
      formIdx: q.formIdx,
      isGrenadier: false,
      isActive: i === 0 && sq.grenadeQueue.length === 0,
      progress: (i === 0 && sq.grenadeQueue.length === 0) ? sq.reinforceProgress / 7.0 : 0,
      totalTime: 7.0,
    }));
  });
  const allGrenadeQueued = alive.flatMap((sqId) => {
    const sq = world.get(sqId, 'squad');
    if (!sq) return [];
    return sq.grenadeQueue.map((q, i) => ({
      type: 'grenade',
      sqId,
      solId: q.solId,
      isGrenadier: true,
      isActive: i === 0,
      progress: i === 0 ? sq.grenadeProgress / 2.0 : 0,
      totalTime: 2.0,
    }));
  });
  const allQueued = [...allGrenadeQueued, ...allReinforceQueued];
  const active = allQueued.find((q) => q.isActive) || allQueued[0];
  const rest = allQueued.filter((q) => q !== active).slice(0, 12);

  const reinCost = COSTS.reinforce;
  const autoOn = alive.some((sqId) => world.get(sqId, 'squad')?.autoReinforce);

  let sgtSoldier = null;
  let sgtQueued = false;
  for (let i = 0; i < alive.length; i += 1) {
    const sqId = alive[i];
    const sq = world.get(sqId, 'squad');
    if (!sq) continue;
    if (sq.reinforceQueue.some((q) => q.formIdx === 0)) {
      sgtQueued = true;
      break;
    }
    for (let k = 0; k < sq.soldiers.length; k += 1) {
      const sid = sq.soldiers[k];
      if (sid && world.has(sid, 'soldier')) {
        const sol = world.get(sid, 'soldier');
        if (sol.formIdx === 0) {
          sgtSoldier = sol;
          break;
        }
      }
    }
    if (sgtSoldier) break;
  }

  const glCost = COSTS.grenadeUpgrade;
  const canAddGL = requisition >= glCost && alive.some((sqId) => {
    const sq = world.get(sqId, 'squad');
    return sq && sq.soldiers.filter((sid) => sid && world.has(sid, 'soldier') && world.get(sid, 'soldier').isGrenadier).length + sq.grenadeQueue.length < 5;
  });

  const chaseOnCount = alive.filter((sqId) => world.get(sqId, 'squad')?.autoChase).length;
  const chaseActive = chaseOnCount > (alive.length / 2);

  const ptCounts = { bullet: 0, beam: 0, plasma: 0, 'plasma-final': 0 };
  alive.forEach((sqId) => {
    const sq = world.get(sqId, 'squad');
    if (sq) {
      const pt = sq.projectileType || 'bullet';
      if (ptCounts[pt] !== undefined) ptCounts[pt] += 1;
    }
  });
  let curPtSq = 'bullet';
  if (ptCounts['plasma-final'] > 0) curPtSq = 'plasma-final';
  else if (ptCounts.plasma > 0) curPtSq = 'plasma';
  else if (ptCounts.beam >= ptCounts.bullet) curPtSq = 'beam';

  return {
    alive,
    totalMen,
    totalMax,
    totalHp,
    totalMaxHp,
    avgHpPct,
    hpColor,
    allQueued,
    active,
    rest,
    reinCost,
    autoOn,
    sgtSoldier,
    sgtQueued,
    glCost,
    canAddGL,
    chaseActive,
    curPtSq,
  };
}
