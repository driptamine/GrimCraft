/**
 * Per-unit stat blocks, transcribed from the wiki pages under settings/wiki/.
 *
 * Layout: stats/races/<faction>/infantry/<unit>.ts holds every soldier entry
 * (both trainable squads and attachable singles such as sergeants), mirroring
 * the `infantry` and `units` arrays in src/factions/*.ts. Vehicle registries
 * live in stats/races/<faction>/vehicles/ (empty until vehicles are modeled).
 *
 * Verified against wiki so far: Guardsmen Squad (Guardsmen, Sergeant),
 * Chaos Space Marine Squad. Other entries are moved verbatim from the old
 * inline faction data until their wiki pages are transcribed.
 */

export interface UnitStats {
  model?: string;
  hiddenNodes?: string[];
  // Animation JSON varies per model ({idle/run/...} vs {phases: {...}}),
  // so the field stays unknown; readers narrow per use.
  animations?: unknown;
  name?: string;
  icon?: string;
  cost?: number;
  time?: number;
  hp?: number;
  damage?: number;
  attackRange?: number;
  movementSpeedMultiplier?: number;
  // Armor class key from src/combat/stats.ts (e.g. 'infantry_med').
  armor?: string;
  // Weapon profile key from src/combat/stats.ts (e.g. 'lasgun').
  weapon?: string;
  // Initial soldiers on spawn / maximum soldiers in the squad (wiki 5/9).
  size?: number;
  squadSize?: number;
  reinforceCost?: number;
  reinforceTime?: number;
  canFly?: boolean;
  stationaryFireOnly?: boolean;
}
