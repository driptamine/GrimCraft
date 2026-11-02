// Shared faction config types (plan: define once, import everywhere).
// The nine faction data files stay untyped data — their inferred shapes are
// checked against FactionConfig once, at the FACTIONS map in factions.ts.
// Every field is optional because per-faction shapes differ (some lack
// units/structures); the index signature keeps string-keyed lookups working.
export interface FactionInfantryEntry {
  model?: string;
  hiddenNodes?: string[];
  // Animation JSON varies per model ({idle/run/...} vs {phases: {...}}),
  // so the field stays unknown; readers narrow per use.
  animations?: unknown;
  name?: string;
  cost?: number;
  time?: number;
}

export interface FactionUnitEntry {
  name?: string;
  model?: string;
  hiddenNodes?: string[];
  canFly?: boolean;
  stationaryFireOnly?: boolean;
  icon?: string;
  cost?: number;
  time?: number;
  hp?: number;
  damage?: number;
  attackRange?: number;
  size?: number;
}

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
