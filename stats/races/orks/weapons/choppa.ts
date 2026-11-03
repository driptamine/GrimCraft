import type { WeaponProfile } from '../../../../../src/combat/stats.js';

// Wiki: Slugga Boy Squad — Choppa (Melee, Refire 1.5 s, Accuracy 60%).
export const CHOPPA: WeaponProfile = {
  name: 'Choppa',
  range: 1.5,
  refire: 1.5,
  accuracy: 0.6,
  melee: true,
  dps: {
    infantry_low: 8.2, infantry_med: 8.2, infantry_high: 7.3,
    infantry_hmed: 6.6, infantry_hhi: 5.9, infantry_cmdr: 4.4,
    vehicle_low: 2.9, vehicle_med: 1.5, vehicle_high: 1.5, vehicle_air: 1.5,
    building_low: 3.7, building_med: 1.8, building_high: 1.5,
    daemon_med: 3.7, daemon_high: 1.5,
  },
  moraleDps: 3,
  baseDamage: { dps: 15, min: 32, max: 41, minD: 3.8 },
};
