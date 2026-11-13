import type { WeaponProfile } from '../../../../src/combat/stats.js';

// Wiki: Grey Knights — Storm Bolter (Range 25, Refire 0.5 s, Accuracy 80%).
export const STORM_BOLTER: WeaponProfile = {
  name: 'Storm Bolter',
  range: 25,
  refire: 0.5,
  accuracy: 0.8,
  dps: {
    infantry_low: 13.4, infantry_med: 21.9, infantry_high: 18.7,
    infantry_hmed: 23.4, infantry_hhi: 17.5, infantry_cmdr: 7.4,
    vehicle_low: 4.1, vehicle_med: 4.0, vehicle_high: 4.0, vehicle_air: 4.1,
    building_low: 6.8, building_med: 4.0, building_high: 4.0,
    daemon_med: 22.4, daemon_high: 4.0,
  },
  moraleDps: 1.6,
  baseDamage: { dps: 2, min: 27.5, max: 29.0, minD: 2.5 },
};
