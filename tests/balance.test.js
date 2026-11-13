import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ARMOR_TYPES, newMod, clone, parseMod, validateMod, expectedHit, weaponDps, approximatePiercing } from '../src/balance/model.js';
import { BASE_WEAPONS } from '../src/balance/catalog.js';
import { setNetworkBalanceMod } from '../src/balance/runtime.js';
import { getWeapon } from '../src/combat/stats.js';

const weapon = () => ({ ...clone(BASE_WEAPONS.lasgun), mode: 'ap', minDamage: 20, maxDamage: 24, minimumDamage: 1, accuracy: .5, movingAccuracy: .15, refire: .5, armorPiercing: Object.fromEntries(ARMOR_TYPES.map(armor => [armor, 25])) });
test('AP damage, floor, moving accuracy and refire are calculated independently', () => {
  const profile = weapon();
  assert.equal(expectedHit(profile, 'infantry_med'), 5.5);
  assert.equal(weaponDps(profile, 'infantry_med'), 5.5);
  assert.equal(weaponDps(profile, 'infantry_med', true), 1.65);
  profile.refire = 1;
  assert.equal(expectedHit(profile, 'infantry_med'), 5.5, 'slower fire must not increase hit damage');
  assert.equal(weaponDps(profile, 'infantry_med'), 2.75);
  profile.armorPiercing.vehicle_high = 0;
  assert.equal(expectedHit(profile, 'vehicle_high'), 1);
});
test('legacy DPS and unknown AP survive export/import without changing the original catalogue', () => {
  const mod = newMod();mod.weapons.lasgun = clone(BASE_WEAPONS.lasgun);
  assert.deepEqual(parseMod(JSON.stringify(mod)), mod);
  assert.equal(weaponDps(mod.weapons.lasgun, 'infantry_med'), 5.5);
  assert.equal(mod.weapons.lasgun.armorPiercing.vehicle_high, null);
  const derived = approximatePiercing(mod.weapons.lasgun);
  assert.equal(derived.armorPiercing.infantry_med, 50);
  assert.equal(derived.armorPiercing.vehicle_high, null, 'minimum-damage floor does not reveal AP');
  assert.equal(BASE_WEAPONS.lasgun.armorPiercing.infantry_med, null);
});
test('invalid and incomplete mods cannot be imported or applied', () => {
  const mod = newMod();mod.weapons.lasgun = weapon();
  assert.deepEqual(validateMod(mod), []);
  for (const patch of [{ refire: 0 }, { accuracy: 1.01 }, { minDamage: 100, maxDamage: 1 }, { range: Infinity }]) {
    assert.ok(validateMod({ ...mod, weapons: { lasgun: { ...mod.weapons.lasgun, ...patch } } }).length);
  }
  mod.weapons.lasgun.armorPiercing.vehicle_high = null;
  assert.throws(() => parseMod(JSON.stringify(mod)), /AP/);
  assert.throws(() => parseMod('{"schemaVersion":2}'));
  assert.throws(() => parseMod(' '.repeat(512001)), /512/);
});
test('game weapon lookup uses the selected room mod and restores defaults when leaving it', () => {
  globalThis.window = { _multiplayerMode: true };
  const mod = newMod();mod.weapons.lasgun = weapon();mod.weapons.lasgun.refire = 1;
  setNetworkBalanceMod(mod);
  assert.equal(getWeapon('lasgun').refire, 1);
  assert.equal(getWeapon('lasgun').dps.infantry_med, 2.75);
  assert.equal(getWeapon('lasgun').baseDamage.min, 20);
  setNetworkBalanceMod(null);
  assert.equal(getWeapon('lasgun').refire, .5);
  assert.equal(getWeapon('lasgun').baseDamage.min, 10);
  window._multiplayerMode = false;
});
