import type { WeaponProfile } from '../../../../../src/combat/stats.js';

// Wiki: Chaos Space Marine Squad — Knife (Melee, Refire 1 s).
export const KNIFE: WeaponProfile = {
  name: 'Knife',
  range: 1.5,
  refire: 1,
  accuracy: 0.65,
  melee: true,
  dps: {
    infantry_low: 9.5, infantry_med: 11.7, infantry_high: 9.2,
    infantry_hmed: 9.5, infantry_hhi: 9.3, infantry_cmdr: 7.0,
    vehicle_low: 1.6, vehicle_med: 1.6, vehicle_high: 1.6, vehicle_air: 1.6,
    building_low: 9.5, building_med: 2.5, building_high: 1.6,
    daemon_med: 9.2, daemon_high: 1.6,
  },
  moraleDps: 1.6,
  baseDamage: { dps: 5, min: 33, max: 40, minD: 2.5 },
};
