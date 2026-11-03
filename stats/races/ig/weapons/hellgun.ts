import type { WeaponProfile } from '../../../../../src/combat/stats.js';

// Wiki: Kasrkin — Hellgun (Range 40, Refire 1 s, Accuracy 50%, Default Weapon).
export const HELLGUN: WeaponProfile = {
  name: 'Hellgun',
  range: 40,
  refire: 1,
  accuracy: 0.5,
  dps: {
    infantry_low: 21.1, infantry_med: 19.3, infantry_high: 17.7,
    infantry_hmed: 16.0, infantry_hhi: 12.4, infantry_cmdr: 9.5,
    vehicle_low: 3.7, vehicle_med: 1.7, vehicle_high: 0.7, vehicle_air: 3.7,
    building_low: 12.1, building_med: 6.1, building_high: 4.0,
    daemon_med: 25.5, daemon_high: 0.8,
  },
  moraleDps: 1.8,
  baseDamage: { dps: 7.05, min: 65, max: 75, minD: 0.5 },
};
