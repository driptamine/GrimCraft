import type { WeaponProfile } from '../../../../../src/combat/stats.js';

// Wiki: Kasrkin — Grenade Launcher (Range 40, Refire 3 s, Accuracy 100%,
// Area of Effect 2.5, Requires Tactica Control). Stronger than the Guardsmen
// variant, so it registers under its own key.
export const KASRKIN_GRENADE_LAUNCHER: WeaponProfile = {
  name: 'Kasrkin Grenade Launcher',
  range: 40,
  refire: 3,
  accuracy: 1,
  dps: {
    infantry_low: 20.2, infantry_med: 27.7, infantry_high: 25.2,
    infantry_hmed: 22.9, infantry_hhi: 11.2, infantry_cmdr: 5.2,
    vehicle_low: 7.1, vehicle_med: 6.9, vehicle_high: 5.2, vehicle_air: 6.9,
    building_low: 9.2, building_med: 5.2, building_high: 5.2,
    daemon_med: 10.6, daemon_high: 5.2,
  },
  moraleDps: 3.3,
  baseDamage: { dps: 20.05, min: 125, max: 150, minD: 15.5 },
};
