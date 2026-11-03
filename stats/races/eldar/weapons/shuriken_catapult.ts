import type { WeaponProfile } from '../../../../../src/combat/stats.js';

// Wiki: Guardian Squad — Shuriken Catapult (Range 25, Refire 0.5 s,
// Accuracy 70%).
export const SHURIKEN_CATAPULT: WeaponProfile = {
  name: 'Shuriken Catapult',
  range: 25,
  refire: 0.5,
  accuracy: 0.7,
  dps: {
    infantry_low: 5.3, infantry_med: 8.4, infantry_high: 6.3,
    infantry_hmed: 6.0, infantry_hhi: 1.4, infantry_cmdr: 2.9,
    vehicle_low: 1.4, vehicle_med: 1.4, vehicle_high: 1.4, vehicle_air: 1.4,
    building_low: 2.5, building_med: 1.4, building_high: 1.4,
    daemon_med: 2.9, daemon_high: 1.4,
  },
  moraleDps: 0.7,
  baseDamage: { dps: 1, min: 8, max: 10, minD: 1 },
};
