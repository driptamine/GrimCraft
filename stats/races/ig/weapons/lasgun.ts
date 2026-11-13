import type { WeaponProfile } from '../../../../src/combat/stats.js';

// Wiki: Guardsmen Squad — Lasgun (Range 27, Refire 0.5 s, Accuracy 50%).
export const LASGUN: WeaponProfile = {
  name: 'Lasgun',
  range: 27,
  refire: 0.5,
  accuracy: 0.5,
  dps: {
    infantry_low: 5.5, infantry_med: 5.5, infantry_high: 5.5,
    infantry_hmed: 5.5, infantry_hhi: 3.9, infantry_cmdr: 3.3,
    vehicle_low: 1.7, vehicle_med: 1.0, vehicle_high: 1.0, vehicle_air: 1.7,
    building_low: 2.2, building_med: 1.7, building_high: 1.0,
    daemon_med: 1.9, daemon_high: 1.0,
  },
  moraleDps: 1.3,
  baseDamage: { dps: 2.5, min: 10, max: 12, minD: 1.0 },
};
