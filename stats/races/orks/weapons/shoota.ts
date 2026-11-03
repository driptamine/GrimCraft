import type { WeaponProfile } from '../../../../../src/combat/stats.js';

// Wiki: Shoota Boy Squad — Shoota (Range 25, Refire 0.7 s, Accuracy 60%,
// Default Weapon). Cannot target air (wiki N/A) so vehicle_air is 0.
export const SHOOTA: WeaponProfile = {
  name: 'Shoota',
  range: 25,
  refire: 0.7,
  accuracy: 0.6,
  dps: {
    infantry_low: 8.2, infantry_med: 10.1, infantry_high: 8.8,
    infantry_hmed: 8.2, infantry_hhi: 6.0, infantry_cmdr: 3.9,
    vehicle_low: 3.0, vehicle_med: 3.0, vehicle_high: 3.0, vehicle_air: 0,
    building_low: 6.8, building_med: 3.0, building_high: 3.0,
    daemon_med: 8.0, daemon_high: 3.0,
  },
  moraleDps: 1.7,
  baseDamage: { dps: 4, min: 20.8, max: 24.8, minD: 3.5 },
};
