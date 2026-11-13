import { WEAPONS } from '../combat/stats.js';
import { ARMOR_TYPES, type BalanceWeapon } from './model.js';

// This catalogue loads stat files only; it never loads factions, meshes or scene state.
export const BASE_WEAPONS: Record<string, BalanceWeapon> = Object.fromEntries(Object.entries(WEAPONS)
  .filter(([key, weapon]) => !weapon.melee && !key.includes('grenade_launcher'))
  .map(([key, weapon]) => [key, {
  name: weapon.name, mode: 'dps', minDamage: weapon.baseDamage?.min ?? 0, maxDamage: weapon.baseDamage?.max ?? 0,
  minimumDamage: weapon.baseDamage?.minD ?? 0, accuracy: weapon.accuracy, movingAccuracy: weapon.melee ? weapon.accuracy : .15,
  refire: weapon.refire, range: weapon.range,
  armorPiercing: Object.fromEntries(ARMOR_TYPES.map(armor => [armor, null])),
  dps: Object.fromEntries(ARMOR_TYPES.map(armor => [armor, weapon.dps[armor] ?? weapon.dps.infantry_low ?? 0])),
} as BalanceWeapon]));

export const WEAPON_FACTIONS: Record<string, string> = {
  lasgun: 'Imperial Guard', bayonet: 'Imperial Guard', laspistol: 'Imperial Guard', sword: 'Imperial Guard',
  grenade_launcher: 'Imperial Guard', plasma_gun: 'Imperial Guard', hellgun: 'Imperial Guard', kasrkin_grenade_launcher: 'Imperial Guard', kasrkin_plasma_gun: 'Imperial Guard',
  bolter: 'Chaos', knife: 'Chaos', heavy_bolter: 'Chaos', chaos_plasma_gun: 'Chaos',
  space_marine_bolter: 'Space Marines', space_marine_heavy_bolter: 'Space Marines', storm_bolter: 'Space Marines', shuriken_catapult: 'Eldar', reaper_launcher: 'Eldar',
  slugga: 'Orks', choppa: 'Orks', shoota: 'Orks', gauss_flayer: 'Necrons', pulse_rifle: 'Tau', sororitas_bolter: 'Sisters of Battle',
};
