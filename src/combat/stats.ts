/**
 * Dawn of War combat stats, transcribed from the RelicWiki pages under
 * settings/wiki/. DPS values are the wiki's effective damage-per-second
 * against each armour class, so they already include accuracy and refire.
 *
 * Weapon profiles live per race in stats/races/<faction>/weapons/*.ts and
 * are registered in WEAPONS below. Units link to a profile with the `weapon`
 * key of their stats/races/<faction>/infantry/*.ts block.
 *
 * Per-shot damage = DPS × refire × cadence compensation. The game slows some
 * projectile types (beam/laser/lightning) by a shared cadence multiplier, so
 * the caller must pass that multiplier in to keep the effective DPS intact.
 */

import { LASGUN } from '../../stats/races/ig/weapons/lasgun.js';
import { BAYONET } from '../../stats/races/ig/weapons/bayonet.js';
import { LASPISTOL } from '../../stats/races/ig/weapons/laspistol.js';
import { GRENADE_LAUNCHER } from '../../stats/races/ig/weapons/grenade_launcher.js';
import { PLASMA_GUN } from '../../stats/races/ig/weapons/plasma_gun.js';
import { HELLGUN } from '../../stats/races/ig/weapons/hellgun.js';
import { KASRKIN_GRENADE_LAUNCHER } from '../../stats/races/ig/weapons/kasrkin_grenade_launcher.js';
import { KASRKIN_PLASMA_GUN } from '../../stats/races/ig/weapons/kasrkin_plasma_gun.js';
import { BOLTER } from '../../stats/races/chaos/weapons/bolter.js';
import { KNIFE } from '../../stats/races/chaos/weapons/knife.js';
import { HEAVY_BOLTER } from '../../stats/races/chaos/weapons/heavy_bolter.js';
import { CHAOS_PLASMA_GUN } from '../../stats/races/chaos/weapons/chaos_plasma_gun.js';
import { SPACE_MARINE_BOLTER } from '../../stats/races/space-marines/weapons/space_marine_bolter.js';
import { STORM_BOLTER } from '../../stats/races/space-marines/weapons/storm_bolter.js';
import { SHURIKEN_CATAPULT } from '../../stats/races/eldar/weapons/shuriken_catapult.js';
import { REAPER_LAUNCHER } from '../../stats/races/eldar/weapons/reaper_launcher.js';
import { SLUGGA } from '../../stats/races/orks/weapons/slugga.js';
import { CHOPPA } from '../../stats/races/orks/weapons/choppa.js';
import { SHOOTA } from '../../stats/races/orks/weapons/shoota.js';
import { GAUSS_FLAYER } from '../../stats/races/necrons/weapons/gauss_flayer.js';
import { PULSE_RIFLE } from '../../stats/races/tau/weapons/pulse_rifle.js';
import { SORORITAS_BOLTER } from '../../stats/races/sob/weapons/sororitas_bolter.js';

export const ARMOR_CLASSES = [
  'infantry_low',
  'infantry_med',
  'infantry_high',
  'infantry_hmed',
  'infantry_hhi',
  'infantry_cmdr',
  'vehicle_low',
  'vehicle_med',
  'vehicle_high',
  'vehicle_air',
  'building_low',
  'building_med',
  'building_high',
  'daemon_med',
  'daemon_high',
] as const;

export type ArmorClass = typeof ARMOR_CLASSES[number];

export const DEFAULT_ARMOR_CLASS: ArmorClass = 'infantry_med';

export const ARMOR_LABELS: Record<ArmorClass, string> = {
  infantry_low: 'Infantry Low',
  infantry_med: 'Infantry Medium',
  infantry_high: 'Infantry High',
  infantry_hmed: 'Infantry Heavy Medium',
  infantry_hhi: 'Infantry Heavy High',
  infantry_cmdr: 'Commander',
  vehicle_low: 'Vehicle Low',
  vehicle_med: 'Vehicle Medium',
  vehicle_high: 'Vehicle High',
  vehicle_air: 'Vehicle Air',
  building_low: 'Building Low',
  building_med: 'Building Medium',
  building_high: 'Building High',
  daemon_med: 'Daemon Medium',
  daemon_high: 'Daemon High',
};

export interface WeaponProfile {
  name: string;
  range: number;
  /** Seconds between shots (wiki "Refire Rate"). */
  refire: number;
  /** 0..1 hit chance as listed by the wiki. DPS already accounts for it. */
  accuracy: number;
  melee?: boolean;
  dps: Partial<Record<ArmorClass, number>>;
  moraleDps?: number;
  baseDamage?: { dps: number; min: number; max: number; minD: number };
}

const SWORD: WeaponProfile = {
  name: 'Sword',
  range: 1.5,
  refire: 1,
  accuracy: 1,
  melee: true,
  dps: {
    infantry_low: 14.7, infantry_med: 18.1, infantry_high: 14.3,
    infantry_hmed: 14.7, infantry_hhi: 14.4, infantry_cmdr: 7.3,
    vehicle_low: 3.0, vehicle_med: 3.0, vehicle_high: 3.0, vehicle_air: 3.0,
    building_low: 14.7, building_med: 3.9, building_high: 3.0,
    daemon_med: 14.3, daemon_high: 3.0,
  },
  moraleDps: 0.3,
  baseDamage: { dps: 0.5, min: 15, max: 30, minD: 0 },
};

export const WEAPONS: Record<string, WeaponProfile> = {
  lasgun: LASGUN,
  bayonet: BAYONET,
  laspistol: LASPISTOL,
  sword: SWORD,
  grenade_launcher: GRENADE_LAUNCHER,
  plasma_gun: PLASMA_GUN,
  hellgun: HELLGUN,
  kasrkin_grenade_launcher: KASRKIN_GRENADE_LAUNCHER,
  kasrkin_plasma_gun: KASRKIN_PLASMA_GUN,
  bolter: BOLTER,
  knife: KNIFE,
  heavy_bolter: HEAVY_BOLTER,
  chaos_plasma_gun: CHAOS_PLASMA_GUN,
  space_marine_bolter: SPACE_MARINE_BOLTER,
  storm_bolter: STORM_BOLTER,
  shuriken_catapult: SHURIKEN_CATAPULT,
  reaper_launcher: REAPER_LAUNCHER,
  slugga: SLUGGA,
  choppa: CHOPPA,
  shoota: SHOOTA,
  gauss_flayer: GAUSS_FLAYER,
  pulse_rifle: PULSE_RIFLE,
  sororitas_bolter: SORORITAS_BOLTER,
};

export function getWeapon(key: string | null | undefined): WeaponProfile | null {
  if (!key) {
    return null;
  }
  return WEAPONS[key] || null;
}

/** Effective DPS of a weapon against one armour class. */
export function dpsAgainst(weapon: WeaponProfile | null | undefined, armorClass: ArmorClass): number {
  if (!weapon) {
    return 0;
  }
  const value = weapon.dps[armorClass];
  if (value !== undefined) {
    return value;
  }
  // Unlisted combinations fall back to the generic infantry line so a target
  // never takes zero damage just because a column was omitted.
  return weapon.dps.infantry_low ?? 0;
}

/**
 * Convert wiki DPS into one projectile's damage.
 *
 * `cadenceMult` compensates for the game's projectile-type cadence slowdown
 * (beam/laser/lightning fire at 1/2.5 speed), keeping real DPS equal to the
 * wiki value.
 */
export function damagePerShot(
  weapon: WeaponProfile | null | undefined,
  armorClass: ArmorClass,
  cadenceMult = 1,
): number {
  if (!weapon) {
    return 0;
  }
  return dpsAgainst(weapon, armorClass) * weapon.refire * cadenceMult;
}
