import type { WeaponProfile } from '../../../../src/combat/stats.js';

// Space Marine Squad — Heavy Bolter, initial values without Target Finders.
// Source: https://warhammer-guide.ru/wiki/Space_Marine_Squad.html#Heavy_Bolter
// Range 35, accuracy 75%, refire 0.4 s; setup time in the source is 2 s.
export const SPACE_MARINE_HEAVY_BOLTER: WeaponProfile = {
  name: 'Space Marine Heavy Bolter',
  range: 35,
  refire: 0.4,
  accuracy: 0.75,
  dps: {
    infantry_low: 40.0, infantry_med: 40.5, infantry_high: 39.8,
    infantry_hmed: 36.1, infantry_hhi: 32.0, infantry_cmdr: 14.7,
    vehicle_low: 8.7, vehicle_med: 4.5, vehicle_high: 3.7, vehicle_air: 8.7,
    building_low: 15.9, building_med: 5.1, building_high: 3.7,
    daemon_med: 29.7, daemon_high: 3.7,
  },
  moraleDps: 8.4,
  baseDamage: { dps: 9, min: 40, max: 45, minD: 2 },
};
