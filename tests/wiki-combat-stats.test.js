import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  ARMOR_LABELS,
  damagePerShot,
  dpsAgainst,
  getWeapon,
} from '../src/combat/stats.js';
import { FACTIONS } from '../src/factions.js';

// Guard against accidentally clipping a wiki DPS column: every armour class
// the wiki lists must be present on the profiles used by the two starter units.
const INFANTRY_ARMOR = ['infantry_low', 'infantry_med', 'infantry_high', 'infantry_hmed', 'infantry_hhi', 'infantry_cmdr'];

describe('Wiki weapon profiles', () => {
  it('carries every wiki armour column for the Guardsmen Lasgun', () => {
    const lasgun = getWeapon('lasgun');
    assert.ok(lasgun);
    for (const armor of INFANTRY_ARMOR) {
      assert.equal(typeof lasgun.dps[armor], 'number', `lasgun missing ${armor}`);
    }
    assert.equal(lasgun.range, 27);
    assert.equal(lasgun.refire, 0.5);
    assert.equal(lasgun.accuracy, 0.5);
  });

  it('carries every wiki armour column for the Chaos Bolter', () => {
    const bolter = getWeapon('bolter');
    assert.ok(bolter);
    for (const armor of INFANTRY_ARMOR) {
      assert.equal(typeof bolter.dps[armor], 'number', `bolter missing ${armor}`);
    }
    assert.equal(bolter.range, 25);
    assert.equal(bolter.refire, 0.5);
    assert.equal(bolter.accuracy, 0.6);
  });

  it('reconstructs the wiki DPS from per-shot damage and refire', () => {
    const cases = [
      ['lasgun', 'infantry_med', 5.5],
      ['lasgun', 'infantry_hmed', 5.5],
      ['bolter', 'infantry_med', 11.5],
      ['bolter', 'infantry_hmed', 9.9],
      ['heavy_bolter', 'infantry_med', 28.0],
    ];
    for (const [key, armor, expected] of cases) {
      const weapon = getWeapon(key);
      assert.equal(dpsAgainst(weapon, armor), expected, `${key} vs ${armor}`);
      assert.ok(
        Math.abs(damagePerShot(weapon, armor, 1) / weapon.refire - expected) < 1e-9,
        `${key} per-shot damage disagrees with ${armor} DPS`,
      );
    }
  });

  it('scales per-shot damage for slowed beam cadence without changing DPS', () => {
    const lasgun = getWeapon('lasgun');
    const cadence = 2.5;
    const perShot = damagePerShot(lasgun, 'infantry_med', cadence);
    const effectiveDps = perShot / (lasgun.refire * cadence);
    assert.ok(Math.abs(effectiveDps - 5.5) < 1e-9);
  });

  it('labels every armour class', () => {
    assert.equal(ARMOR_LABELS.infantry_med, 'Infantry Medium');
    assert.equal(ARMOR_LABELS.infantry_hmed, 'Infantry Heavy Medium');
  });
});

describe('Wiki unit configs', () => {
  it('applies the Guardsmen squad line', () => {
    const squad = FACTIONS.ig.infantry[1];
    assert.equal(squad.name, 'Guardsmen');
    assert.equal(squad.model, 'models/ig/infantry/guardsmen.glb');
    assert.equal(squad.hp, 160);
    assert.equal(squad.armor, 'infantry_med');
    assert.equal(squad.weapon, 'lasgun');
    assert.equal(squad.size, 5);
    assert.equal(squad.squadSize, 9);
    assert.equal(squad.cost, 160);
    assert.equal(squad.time, 20);
    assert.equal(squad.reinforceCost, 20);
    assert.equal(squad.reinforceTime, 7);
  });

  it('applies the Chaos Space Marine squad line', () => {
    const squad = FACTIONS.chaos.infantry[1];
    assert.equal(squad.name, 'Chaos Space Marine');
    assert.equal(squad.model, 'models/chaos/infantry/chaos_space_marine.glb');
    assert.equal(squad.hp, 375);
    assert.equal(squad.armor, 'infantry_hmed');
    assert.equal(squad.weapon, 'bolter');
    assert.equal(squad.size, 4);
    assert.equal(squad.squadSize, 10);
    assert.equal(squad.cost, 190);
    assert.equal(squad.time, 26.4);
    assert.equal(squad.reinforceCost, 50);
    assert.equal(squad.reinforceTime, 9);
  });

  it('applies the Guardsmen Sergeant line', () => {
    const sergeant = FACTIONS.ig.units.find((u) => u.name === 'sergeant');
    assert.ok(sergeant);
    assert.equal(sergeant.hp, 200);
    assert.equal(sergeant.armor, 'infantry_hmed');
    assert.equal(sergeant.weapon, 'laspistol');
    assert.equal(sergeant.cost, 55);
    assert.equal(sergeant.time, 15);
    assert.equal(sergeant.reinforceCost, 55);
    assert.equal(sergeant.reinforceTime, 15);
  });

  it('uses wiki weapons for the basic squads', () => {
    assert.equal(FACTIONS.ig.infantry[1].weapon, 'lasgun');
    assert.equal(FACTIONS.chaos.infantry[1].weapon, 'bolter');
    assert.ok(getWeapon(FACTIONS.ig.infantry[1].weapon));
    assert.ok(getWeapon(FACTIONS.chaos.infantry[1].weapon));
  });
});
