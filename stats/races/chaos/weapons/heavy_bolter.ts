import type { WeaponProfile } from '../../../../../src/combat/stats.js';

// Wiki: Chaos Space Marine Squad — Heavy Bolter (Refire 0.4 s,
// Requires Chaos Armoury).
export const HEAVY_BOLTER: WeaponProfile = {
  name: 'Heavy Bolter',
  range: 35,
  refire: 0.4,
  accuracy: 0.65,
  dps: {
    infantry_low: 37.7, infantry_med: 28.0, infantry_high: 28.0,
    infantry_hmed: 28.0, infantry_hhi: 25.2, infantry_cmdr: 10.4,
    vehicle_low: 6.2, vehicle_med: 3.3, vehicle_high: 3.3, vehicle_air: 6.2,
    building_low: 11.2, building_med: 3.6, building_high: 3.3,
    daemon_med: 20.9, daemon_high: 3.3,
  },
  moraleDps: 7.3,
  baseDamage: { dps: 9, min: 31, max: 38, minD: 2 },
};
