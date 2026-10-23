// Per-map layout driven by JSON files in maps/<map>/:
//   'arena'                 -> maps/default_arena/default_arena.json
//   '/maps/<map>/<b>.sgb'   -> maps/<map>/<b>.json (6p_alvarus, 6p_mortalis, ...)
// Unknown maps fall back to the default arena layout so the game always boots.
// game.js resetGame consumes the three functions below.
import arenaLayout from '../maps/default_arena/default_arena.json';
import alvarusLayout from '../maps/6p_alvarus/6p_alvarus.json';
import mortalisLayout from '../maps/6p_mortalis/mortalis.json';
import doomSpiralLayout from '../maps/4p_doom_spiral/4p_doom_spiral.json';
import intoTheBreachLayout from '../maps/4p_into_the_breach/4p_into_the_breach.json';
import parmenieLayout from '../maps/6p_parmenie/6p_parmenie.json';
import vandeaCoastLayout from '../maps/6p_vandea_coast/6p_vandea_coast.json';
import burialGroundsLayout from '../maps/8p_burial_grounds/8p_burial_grounds.json';
import oasisOfSharrLayout from '../maps/8p_oasis_of_sharr/8p_oasis_of_sharr.json';

const LAYOUTS = {
  arena: arenaLayout,
  '6p_alvarus': alvarusLayout,
  mortalis: mortalisLayout,
  '6p_mortalis': mortalisLayout,
  '4p_doom_spiral': doomSpiralLayout,
  '4p_into_the_breach': intoTheBreachLayout,
  '6p_parmenie': parmenieLayout,
  '6p_vandea_coast': vandeaCoastLayout,
  '8p_burial_grounds': burialGroundsLayout,
  '8p_oasis_of_sharr': oasisOfSharrLayout,
};

export function layoutFor(mapKey) {
  if (mapKey === 'arena') {
    return LAYOUTS.arena;
  }
  const base = String(mapKey || '').split('/').pop().replace(/\.sgb$/i, '');
  return LAYOUTS[base] || LAYOUTS.arena;
}

export function startPositionsFor(mapKey) {
  return layoutFor(mapKey).positions.map((pos) => ({ x: pos.x, z: pos.z, team: pos.team }));
}

export function factionsFor(mapKey) {
  return layoutFor(mapKey).positions.map((pos) => pos.faction);
}

export function boundsFor(mapKey) {
  return layoutFor(mapKey).bounds || 256;
}

export function strategicPointsFor(mapKey) {
  const layout = layoutFor(mapKey);
  if (Array.isArray(layout.strategicPoints) && layout.strategicPoints.length) {
    return layout.strategicPoints.map((p) => ({
      x: p.x,
      z: p.z,
      kind: p.kind === 'relic' ? 'relic' : (p.kind === 'objective' ? 'objective' : 'point'),
    }));
  }
  const points = (layout.centerPoints || []).map(([x, z]) => ({ x, z, kind: 'point' }));
  if (layout.ringPerPosition) {
    for (const pos of layout.positions) {
      for (const [dx, dz] of layout.ringOffsets || []) {
        points.push({ x: pos.x + dx, z: pos.z + dz, kind: 'point' });
      }
      if (layout.relicDistance) {
        const inward = pos.z >= 0 ? -1 : 1;
        points.push({ x: pos.x, z: pos.z + inward * layout.relicDistance, kind: 'relic' });
      }
    }
  }
  return points;
}

// Starting camera target: the given side's base of a faction (if any).
export function factionBasePosition(mapKey, team, faction) {
  const pos = layoutFor(mapKey).positions.find((p) => p.team === team && p.faction === faction);
  return pos ? { x: pos.x, z: pos.z } : null;
}

// Starting troops: the given side's IG base fields two guardsmen squads
// flanking its HQ (unitType 'guardsmen' -> guardsmen.glb + sergeant lead).
export function startingGuardsmenSpawns(mapKey, team) {
  const spawns = [];
  for (const pos of layoutFor(mapKey).positions) {
    if (pos.team === team && pos.faction === 'ig') {
      spawns.push(
        { team: pos.team, x: pos.x + 16, z: pos.z + 10, size: 5, unitType: 'guardsmen', faction: pos.faction },
        { team: pos.team, x: pos.x + 16, z: pos.z - 10, size: 5, unitType: 'guardsmen', faction: pos.faction },
      );
    }
  }
  return spawns;
}

// Starting troops: the given side's Necron base fields two warrior squads
// flanking its HQ (unitType null -> default soldier necron_basic_warrior.glb).
export function startingNecronSpawns(mapKey, team) {
  const spawns = [];
  for (const pos of layoutFor(mapKey).positions) {
    if (pos.team === team && pos.faction === 'necrons') {
      spawns.push(
        { team: pos.team, x: pos.x + 16, z: pos.z + 10, size: 5, unitType: null, faction: pos.faction },
        { team: pos.team, x: pos.x + 16, z: pos.z - 10, size: 5, unitType: null, faction: pos.faction },
      );
    }
  }
  return spawns;
}

// Starting troops: the given side's Tau base fields two fire warrior squads
// flanking its HQ (unitType null -> default soldier fire_warrior.glb).
// Only the arena fields Tau (7th position); SGB maps have no Tau base.
export function startingTauSpawns(mapKey, team) {
  const spawns = [];
  for (const pos of layoutFor(mapKey).positions) {
    if (pos.team === team && pos.faction === 'tau') {
      spawns.push(
        { team: pos.team, x: pos.x + 16, z: pos.z + 10, size: 5, unitType: null, faction: pos.faction },
        { team: pos.team, x: pos.x + 16, z: pos.z - 10, size: 5, unitType: null, faction: pos.faction },
      );
    }
  }
  return spawns;
}

// Starting troops: the given side's Dark Eldar base fields two Kabalite
// Warrior squads flanking its HQ.
export function startingDarkEldarSpawns(mapKey, team) {
  const spawns = [];
  for (const pos of layoutFor(mapKey).positions) {
    if (pos.team === team && pos.faction === 'dark eldar') {
      spawns.push(
        { team: pos.team, x: pos.x + 16, z: pos.z + 10, size: 5, unitType: null, faction: pos.faction },
        { team: pos.team, x: pos.x + 16, z: pos.z - 10, size: 5, unitType: null, faction: pos.faction },
      );
    }
  }
  return spawns;
}

// Starting troops: the given side's Ork base fields a Boyz squad and a
// Shoota Boyz squad flanking its HQ.
export function startingOrkSpawns(mapKey, team) {
  const spawns = [];
  for (const pos of layoutFor(mapKey).positions) {
    if (pos.team === team && pos.faction === 'orks') {
      spawns.push(
        { team: pos.team, x: pos.x + 16, z: pos.z + 10, size: 5, unitType: null, faction: pos.faction },
        { team: pos.team, x: pos.x + 16, z: pos.z - 10, size: 5, unitType: 'boyz_shoota', faction: pos.faction },
      );
    }
  }
  return spawns;
}

// Starting troops: the given side's Eldar base fields a Guardian squad and
// a Dark Reaper squad flanking its HQ.
export function startingEldarSpawns(mapKey, team) {
  const spawns = [];
  for (const pos of layoutFor(mapKey).positions) {
    if (pos.team === team && pos.faction === 'eldar') {
      spawns.push(
        { team: pos.team, x: pos.x + 16, z: pos.z + 10, size: 5, unitType: null, faction: pos.faction },
        { team: pos.team, x: pos.x + 16, z: pos.z - 10, size: 5, unitType: 'dark_reaper', faction: pos.faction },
      );
    }
  }
  return spawns;
}

// Starting troops: the given side's Space Marine base fields two tactical
// squads flanking its HQ (unitType null -> space_marine.glb) plus a Grey
// Knight squad between them.
export function startingMarineSpawns(mapKey, team) {
  const spawns = [];
  for (const pos of layoutFor(mapKey).positions) {
    if (pos.team === team && pos.faction === 'space marines') {
      spawns.push(
        { team: pos.team, x: pos.x + 16, z: pos.z + 10, size: 5, unitType: null, faction: pos.faction },
        { team: pos.team, x: pos.x + 16, z: pos.z - 10, size: 5, unitType: null, faction: pos.faction },
        { team: pos.team, x: pos.x + 16, z: pos.z, size: 5, unitType: 'grey_knight', faction: pos.faction },
      );
    }
  }
  return spawns;
}
