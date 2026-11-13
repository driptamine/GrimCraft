import type { WeaponProfile } from '../../../../src/combat/stats.js';

// Weapon profiles for this race, transcribed from the wiki Damage Per
// Second tables. Empty until transcribed; entries mirror the shape of
// stats/races/ig/weapons/*.ts and register in src/combat/stats.ts.
export const raceWeapons: Record<string, WeaponProfile> = {};
