import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

register('./node-esm-hooks.mjs', import.meta.url);
globalThis.document = { getElementById: () => null };
const layout = await import('../src/map-layout.js');
const { FACTIONS } = await import('../src/factions.js');

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

// Mirrors makeSoldierMesh: a named unitType uses the units entry when one
// exists, otherwise falls back to the default soldier slot (e.g. IG
// 'guardsmen' has no units entry and resolves to guardsmen.glb).
function resolveStarterModel(factionKey, unitType) {
  if (unitType) {
    const unit = FACTIONS[factionKey]?.units?.find((u) => u.name === unitType);
    if (unit) {
      return unit.model;
    }
  }
  return FACTIONS[factionKey]?.infantry?.[1]?.model || null;
}

describe('starter squads resolve to real models', () => {
  const spawnFns = [
    'startingGuardsmenSpawns', 'startingNecronSpawns', 'startingTauSpawns',
    'startingOrkSpawns', 'startingEldarSpawns', 'startingMarineSpawns',
    'startingDarkEldarSpawns',
  ];
  const mapKeys = [
    'arena',
    '/maps/6p_alvarus/6p_alvarus.sgb',
    '/maps/6p_mortalis/6p_mortalis.sgb',
    '/maps/4p_doom_spiral/4p_doom_spiral.sgb',
    '/maps/4p_into_the_breach/4p_into_the_breach.sgb',
    '/maps/6p_parmenie/6p_parmenie.sgb',
    '/maps/6p_vandea_coast/6p_vandea_coast.sgb',
    '/maps/8p_burial_grounds/8p_burial_grounds.sgb',
    '/maps/8p_oasis_of_sharr/8p_oasis_of_sharr.sgb',
  ];

  it('every starter spawn maps to a GLB file on disk', () => {
    let checked = 0;
    for (const fn of spawnFns) {
      for (const mapKey of mapKeys) {
        for (const team of ['blue', 'red']) {
          for (const spawn of layout[fn](mapKey, team)) {
            const model = resolveStarterModel(spawn.faction, spawn.unitType);
            assert.ok(model, `${fn} ${spawn.faction}/${spawn.unitType} resolves to a model`);
            assert.ok(
              existsSync(path.join(ROOT, model)),
              `${fn} ${spawn.faction}/${spawn.unitType} -> ${model} exists on disk`,
            );
            checked += 1;
          }
        }
      }
    }
    assert.ok(checked > 0, 'at least one starter spawn checked');
  });

  it('new specialist starters use the requested models', () => {
    assert.equal(
      FACTIONS.orks.units?.find((u) => u.name === 'boyz_shoota')?.model,
      'models/orks/infantry/boyz_shoota.glb',
    );
    assert.equal(
      FACTIONS.eldar.units?.find((u) => u.name === 'dark_reaper')?.model,
      'models/eldar/infantry/dark_reaper.glb',
    );
    assert.equal(
      FACTIONS['space marines'].infantry[1].model,
      'models/space marines/troops/space_marine.glb',
    );
    assert.equal(
      FACTIONS['space marines'].units?.find((u) => u.name === 'grey_knight')?.model,
      'models/space marines/troops/grey_knight.glb',
    );
  });
});
