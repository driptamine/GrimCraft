import type { WeaponProfile } from '../../../../../src/combat/stats.js';

// Wiki: Guardsmen Squad — Plasma Gun (Refire 0.5 s, Accuracy 65%,
// Requires Tactica Control and Battle Command).
export const PLASMA_GUN: WeaponProfile = {
  name: 'Plasma Gun',
  range: 25,
  refire: 0.5,
  accuracy: 0.65,
  dps: {
    infantry_low: 31.5, infantry_med: 29.0, infantry_high: 25.7,
    infantry_hmed: 22.9, infantry_hhi: 20.4, infantry_cmdr: 7.3,
    vehicle_low: 8.7, vehicle_med: 7.3, vehicle_high: 7.3, vehicle_air: 8.7,
    building_low: 14.3, building_med: 8.3, building_high: 7.3,
    daemon_med: 20.0, daemon_high: 7.3,
  },
  moraleDps: 9.8,
  baseDamage: { dps: 15.05, min: 34, max: 54, minD: 5.6 },
};
