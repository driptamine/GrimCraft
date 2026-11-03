import type { WeaponProfile } from '../../../../../src/combat/stats.js';

// Wiki: Guardsmen Squad — Bayonet (Melee, Refire 1 s, Accuracy 100%).
export const BAYONET: WeaponProfile = {
  name: 'Bayonet',
  range: 1.5,
  refire: 1,
  accuracy: 1,
  melee: true,
  dps: {
    infantry_low: 7.7, infantry_med: 7.0, infantry_high: 6.4,
    infantry_hmed: 4.2, infantry_hhi: 5.2, infantry_cmdr: 1.5,
    vehicle_low: 1.0, vehicle_med: 1.3, vehicle_high: 1.0, vehicle_air: 1.0,
    building_low: 1.4, building_med: 1.0, building_high: 1.0,
    daemon_med: 2.5, daemon_high: 1.0,
  },
  moraleDps: 1.0,
  baseDamage: { dps: 2.0, min: 13, max: 15, minD: 1.0 },
};
