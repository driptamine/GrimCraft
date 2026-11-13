import type { WeaponProfile } from '../../../../src/combat/stats.js';

// Wiki: Guardsmen Squad — Grenade Launcher (Range 40, Refire 3 s,
// Accuracy 100%, Area of Effect 2.5, Requires Tactica Control).
export const GRENADE_LAUNCHER: WeaponProfile = {
  name: 'Grenade Launcher',
  range: 40,
  refire: 3,
  accuracy: 1,
  dps: {
    infantry_low: 19.1, infantry_med: 26.2, infantry_high: 23.8,
    infantry_hmed: 21.7, infantry_hhi: 10.6, infantry_cmdr: 3.5,
    vehicle_low: 6.7, vehicle_med: 6.5, vehicle_high: 3.5, vehicle_air: 6.5,
    building_low: 8.7, building_med: 4.3, building_high: 3.5,
    daemon_med: 10.0, daemon_high: 3.5,
  },
  moraleDps: 2.5,
  baseDamage: { dps: 15.05, min: 113, max: 147, minD: 10.5 },
};
