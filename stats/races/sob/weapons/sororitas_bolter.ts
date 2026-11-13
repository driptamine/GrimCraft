import type { WeaponProfile } from '../../../../src/combat/stats.js';

// Wiki: Battle Sister Squad — Bolter (Range 25, Refire 0.5 s, Accuracy 60%,
// Default Weapon). Sororitas variant: own line, separate key.
export const SORORITAS_BOLTER: WeaponProfile = {
  name: 'Sororitas Bolter',
  range: 25,
  refire: 0.5,
  accuracy: 0.6,
  dps: {
    infantry_low: 6.2, infantry_med: 7.6, infantry_high: 6.9,
    infantry_hmed: 6.2, infantry_hhi: 6.9, infantry_cmdr: 3.5,
    vehicle_low: 3.0, vehicle_med: 3.5, vehicle_high: 3.0, vehicle_air: 3.0,
    building_low: 5.5, building_med: 3.0, building_high: 3.0,
    daemon_med: 5.5, daemon_high: 3.0,
  },
  moraleDps: 2.4,
  baseDamage: { dps: 4, min: 10, max: 13, minD: 2.5 },
};
