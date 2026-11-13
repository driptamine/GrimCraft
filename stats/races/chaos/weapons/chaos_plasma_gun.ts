import type { WeaponProfile } from '../../../../src/combat/stats.js';

// Wiki: Chaos Space Marine Squad — Plasma Gun (Range 30, Refire 0.5 s,
// Accuracy 60%, Requires Unholy Monastery and Chaos Armoury). Chaos variant:
// hotter line than the IG Plasma Gun, so it registers under its own key.
// Gameplay tuning: one shot per second.
export const CHAOS_PLASMA_GUN: WeaponProfile = {
  name: 'Chaos Plasma Gun',
  range: 30,
  refire: 1,
  accuracy: 0.6,
  dps: {
    infantry_low: 44.4, infantry_med: 79.8, infantry_high: 66.0,
    infantry_hmed: 60.5, infantry_hhi: 53.4, infantry_cmdr: 36.5,
    vehicle_low: 14.5, vehicle_med: 7.2, vehicle_high: 3.0, vehicle_air: 14.5,
    building_low: 13.2, building_med: 8.4, building_high: 4.7,
    daemon_med: 53.7, daemon_high: 3.0,
  },
  moraleDps: 6.0,
  baseDamage: { dps: 10, min: 105, max: 115, minD: 2.5 },
};
