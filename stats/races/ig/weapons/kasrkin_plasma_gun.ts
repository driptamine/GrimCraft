import type { WeaponProfile } from '../../../../../src/combat/stats.js';

// Wiki: Kasrkin — Plasma Gun (Range 30, Refire 1 s, Accuracy 50%,
// Requires Tactica Control). Slower refire than the Guardsmen variant,
// so it registers under its own key.
export const KASRKIN_PLASMA_GUN: WeaponProfile = {
  name: 'Kasrkin Plasma Gun',
  range: 30,
  refire: 1,
  accuracy: 0.5,
  dps: {
    infantry_low: 27.0, infantry_med: 25.1, infantry_high: 22.5,
    infantry_hmed: 20.3, infantry_hhi: 16.1, infantry_cmdr: 7.1,
    vehicle_low: 2.8, vehicle_med: 1.3, vehicle_high: 0.5, vehicle_air: 2.8,
    building_low: 3.4, building_med: 1.5, building_high: 0.8,
    daemon_med: 35.4, daemon_high: 0.6,
  },
  moraleDps: 3.8,
  baseDamage: { dps: 15.05, min: 81, max: 99, minD: 0.5 },
};
