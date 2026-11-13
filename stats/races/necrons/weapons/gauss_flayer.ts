import type { WeaponProfile } from '../../../../src/combat/stats.js';

// Wiki: Necron Warriors — Gauss Flayer (Range 17, Refire 1 s, Accuracy 80%,
// Default Weapon).
export const GAUSS_FLAYER: WeaponProfile = {
  name: 'Gauss Flayer',
  range: 17,
  refire: 1,
  accuracy: 0.8,
  dps: {
    infantry_low: 6.6, infantry_med: 15.4, infantry_high: 11.0,
    infantry_hmed: 9.9, infantry_hhi: 7.7, infantry_cmdr: 5.5,
    vehicle_low: 3.3, vehicle_med: 3.3, vehicle_high: 3.2, vehicle_air: 3.3,
    building_low: 6.6, building_med: 4.4, building_high: 3.2,
    daemon_med: 7.4, daemon_high: 3.2,
  },
  moraleDps: 4,
  baseDamage: { dps: 10, min: 24, max: 31, minD: 4 },
};
