import type { WeaponProfile } from '../../../../src/combat/stats.js';

// Wiki: Space Marine Squad — Bolter (Range 25, Refire 0.5 s, Accuracy 60%,
// Default Weapon). Loyalist variant: slightly different line from the
// Chaos Bolter, so it registers under its own key.
export const SPACE_MARINE_BOLTER: WeaponProfile = {
  name: 'Space Marine Bolter',
  range: 25,
  refire: 0.5,
  accuracy: 0.6,
  dps: {
    infantry_low: 8.7, infantry_med: 10.6, infantry_high: 9.7,
    infantry_hmed: 11.3, infantry_hhi: 9.8, infantry_cmdr: 4.8,
    vehicle_low: 3.0, vehicle_med: 4.6, vehicle_high: 3.0, vehicle_air: 3.0,
    building_low: 7.5, building_med: 3.0, building_high: 3.0,
    daemon_med: 9.7, daemon_high: 3.0,
  },
  moraleDps: 2.4,
  baseDamage: { dps: 4, min: 14.1, max: 17.2, minD: 2.5 },
};
