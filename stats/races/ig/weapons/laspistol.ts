import type { WeaponProfile } from '../../../../../src/combat/stats.js';

// Wiki: Guardsmen Squad Sergeant — Laspistol.
export const LASPISTOL: WeaponProfile = {
  name: 'Laspistol',
  range: 27,
  refire: 1,
  accuracy: 0.5,
  dps: {
    infantry_low: 8.3, infantry_med: 11.0, infantry_high: 7.0,
    infantry_hmed: 5.7, infantry_hhi: 3.3, infantry_cmdr: 4.6,
    vehicle_low: 0.9, vehicle_med: 0.3, vehicle_high: 0.3, vehicle_air: 0.9,
    building_low: 7.1, building_med: 1.9, building_high: 0.3,
    daemon_med: 6.4, daemon_high: 1.3,
  },
  moraleDps: 0.1,
  baseDamage: { dps: 0.5, min: 21, max: 30, minD: 0.5 },
};
