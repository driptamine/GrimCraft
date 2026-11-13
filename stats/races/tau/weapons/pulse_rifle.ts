import type { WeaponProfile } from '../../../../src/combat/stats.js';

// Wiki: Fire Warrior Team — Pulse Rifle (Range 35, Refire 1.5 s,
// Accuracy 70%, Default Weapon).
export const PULSE_RIFLE: WeaponProfile = {
  name: 'Pulse Rifle',
  range: 35,
  refire: 1.5,
  accuracy: 0.7,
  dps: {
    infantry_low: 9.5, infantry_med: 16.4, infantry_high: 16.4,
    infantry_hmed: 15.6, infantry_hhi: 11.0, infantry_cmdr: 5.7,
    vehicle_low: 2.5, vehicle_med: 2.5, vehicle_high: 1.6, vehicle_air: 2.5,
    building_low: 4.7, building_med: 3.2, building_high: 1.6,
    daemon_med: 11.0, daemon_high: 1.4,
  },
  moraleDps: 0.5,
  baseDamage: { dps: 2, min: 63, max: 72, minD: 3 },
};
