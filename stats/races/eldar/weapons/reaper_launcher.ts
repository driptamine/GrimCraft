import type { WeaponProfile } from '../../../../src/combat/stats.js';

// Wiki: Dark Reaper Squad — Reaper Launcher (Range 30, Refire 1 s,
// Accuracy 60%). Cannot be fired while moving.
export const REAPER_LAUNCHER: WeaponProfile = {
  name: 'Reaper Launcher',
  range: 30,
  refire: 1,
  accuracy: 0.6,
  dps: {
    infantry_low: 13.7, infantry_med: 12.6, infantry_high: 12.6,
    infantry_hmed: 11.5, infantry_hhi: 7.4, infantry_cmdr: 6.3,
    vehicle_low: 7.4, vehicle_med: 4.2, vehicle_high: 2.1, vehicle_air: 7.4,
    building_low: 7.0, building_med: 2.4, building_high: 2.1,
    daemon_med: 7.4, daemon_high: 2.1,
  },
  moraleDps: 3.0,
  baseDamage: { dps: 10, min: 30, max: 40, minD: 0.5 },
};
