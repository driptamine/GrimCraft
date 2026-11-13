import type { WeaponProfile } from '../../../../src/combat/stats.js';

// Wiki: Chaos Space Marine Squad — Bolter (Refire 0.5 s).
export const BOLTER: WeaponProfile = {
  name: 'Bolter',
  range: 25,
  refire: 0.5,
  accuracy: 0.6,
  dps: {
    infantry_low: 8.7, infantry_med: 11.5, infantry_high: 9.7,
    infantry_hmed: 9.9, infantry_hhi: 9.7, infantry_cmdr: 4.8,
    vehicle_low: 3.0, vehicle_med: 3.0, vehicle_high: 3.0, vehicle_air: 3.0,
    building_low: 7.4, building_med: 3.0, building_high: 3.0,
    daemon_med: 9.7, daemon_high: 3.0,
  },
  moraleDps: 2.4,
  baseDamage: { dps: 4, min: 14, max: 17, minD: 2.5 },
};
