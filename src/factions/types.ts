// Shared faction config types (plan: define once, import everywhere).
// The nine faction data files stay untyped data — their inferred shapes are
// checked against FactionConfig once, at the FACTIONS map in factions.ts.
// Soldier stat blocks live in stats/races/<faction>/infantry/*.ts as
// UnitStats; these aliases keep the faction-side names working.
import type { UnitStats } from '../../stats/types.js';

export interface FactionInfantryEntry extends UnitStats {}

export interface FactionUnitEntry extends UnitStats {}

export interface FactionAddonEntry {
  name?: string;
  icon?: string;
  cost?: number;
  power?: number;
  time?: number;
  unlocks?: string;
  requiresTier?: number;
  tier?: number;
  scanner?: boolean;
}

export interface FactionResearchEntry {
  key?: string;
  name?: string;
  desc?: string;
  icon?: string;
  cost?: number;
  power?: number;
  time?: number;
  requires?: string[];
}

export interface FactionStructureEntry {
  type?: string;
  model?: string;
  name?: string;
  icon?: string;
  cost?: number;
  time?: number;
  hiddenNodes?: string[];
  production?: ProductionItem[];
  addons?: FactionAddonEntry[];
  research?: FactionResearchEntry[];
}

// Structure production lists mix two shapes: unit objects
// ({model, name, cost, time}) and bare vehicle model filenames
// (["chaos_rhino.glb", ...]). Consumers narrow with typeof.
export type ProductionItem = string | {
  model?: string;
  name?: string;
  icon?: string;
  cost?: number;
  time?: number;
  requires?: string[];
};

export interface FactionIcons {
  [key: string]: string | FactionIcons;
}

export interface FactionConfig {
  name?: string;
  hq?: string;
  icons?: FactionIcons;
  buildOrder?: (string | null)[];
  infantry?: FactionInfantryEntry[];
  units?: FactionUnitEntry[];
  structures?: FactionStructureEntry[];
  teamcolours?: Record<string, string>;
  [key: string]: unknown;
}

// String keys for now (FACTIONS is a Record); narrow to the union once
// call sites stop passing free-form strings.
export type FactionKey = string;
