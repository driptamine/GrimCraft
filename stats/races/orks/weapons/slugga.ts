import type { WeaponProfile } from '../../../../src/combat/stats.js';

// Wiki: Slugga Boy Squad — Slugga (Range 25, Refire 0.5 s, Accuracy 60%,
// Default Weapon).
export const SLUGGA: WeaponProfile = {
  name: 'Slugga',
  range: 25,
  refire: 0.5,
  accuracy: 0.6,
  dps: {
    infantry_low: 3.0, infantry_med: 3.7, infantry_high: 3.0,
    infantry_hmed: 3.0, infantry_hhi: 3.0, infantry_cmdr: 3.0,
    vehicle_low: 3.0, vehicle_med: 3.0, vehicle_high: 3.0, vehicle_air: 3.0,
    building_low: 3.0, building_med: 3.0, building_high: 3.0,
    daemon_med: 3.0, daemon_high: 3.0,
  },
  moraleDps: 1.2,
  baseDamage: { dps: 2, min: 6, max: 8, minD: 2.5 },
};
