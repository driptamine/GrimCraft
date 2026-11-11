// Infantry model variant: new-authored GLBs vs the classic ones.
// Zero-dependency leaf module: safe to import from anywhere (no import cycle
// possible). The TopBar toggle flips this at runtime; loaders resolve paths
// through resolveInfantryModel, so both boot and live reload pick it up.
//
// Two independent switches: 'marine' (space_marine.glb <-> space-marine.glb)
// and 'guardsman' (guardsmen.glb <-> guardsmen.glb). Sergeants and every
// other unit keep their configured models in both modes.
export const INFANTRY_MODEL_NEW = 'new';
export const INFANTRY_MODEL_CLASSIC = 'classic';

export const INFANTRY_MODEL_UNITS = ['marine', 'guardsman'] as const;
export type InfantryModelUnit = (typeof INFANTRY_MODEL_UNITS)[number];

const INFANTRY_MODEL_TABLE: Record<InfantryModelUnit, { classic: string; latest: string }> = {
  marine: {
    classic: 'models/space marines/troops/space_marine.glb',
    latest: 'models/space-marine.glb',
  },
  guardsman: {
    classic: 'models/ig/infantry/guardsmen.glb',
    latest: 'models/guardsmen.glb',
  },
};

const INFANTRY_MODEL_STORAGE_PREFIX = 'grimcraft-infantry-model-';

const _classicToUnit = new Map<string, InfantryModelUnit>();
const _latestToUnit = new Map<string, InfantryModelUnit>();
for (const unit of INFANTRY_MODEL_UNITS) {
  _classicToUnit.set(INFANTRY_MODEL_TABLE[unit].classic, unit);
  _latestToUnit.set(INFANTRY_MODEL_TABLE[unit].latest, unit);
}

export function infantryModelUnitForPath(path: unknown): InfantryModelUnit | null {
  const key = String(path || '');
  return _classicToUnit.get(key) ?? _latestToUnit.get(key) ?? null;
}

export function isSwappableInfantryModel(path: unknown): boolean {
  return infantryModelUnitForPath(path) !== null;
}

// Pure resolution: explicit URL param wins, then the stored preference,
// then the default. Mirrors model-source.ts so ?models=new works everywhere.
export function resolveInfantryVariant({ query = '', stored = '' }: { query?: unknown; stored?: unknown } = {}): string {
  const q = String(query || '').toLowerCase();
  if (q === INFANTRY_MODEL_NEW || q === INFANTRY_MODEL_CLASSIC) return q;
  const s = String(stored || '').toLowerCase();
  if (s === INFANTRY_MODEL_NEW || s === INFANTRY_MODEL_CLASSIC) return s;
  return INFANTRY_MODEL_CLASSIC;
}

const _variant: Record<InfantryModelUnit, string | null> = { marine: null, guardsman: null };

function _readInputs(unit: InfantryModelUnit): { query: string; stored: string } {
  let query = '';
  let stored = '';
  try {
    if (typeof window !== 'undefined' && window.location) {
      const params = new URLSearchParams(window.location.search);
      query = params.get('models') || params.get(`models-${unit}`) || '';
    }
  } catch (_) { /* ignore malformed URLs */ }
  try {
    if (typeof localStorage !== 'undefined') {
      stored = localStorage.getItem(INFANTRY_MODEL_STORAGE_PREFIX + unit) || '';
    }
  } catch (_) { /* storage unavailable */ }
  return { query, stored };
}

export function getInfantryModelVariant(unit: InfantryModelUnit): string {
  if (!_variant[unit]) {
    _variant[unit] = resolveInfantryVariant(_readInputs(unit));
  }
  return _variant[unit] as string;
}

export function useNewInfantryModel(unit: InfantryModelUnit): boolean {
  return getInfantryModelVariant(unit) === INFANTRY_MODEL_NEW;
}

export function setInfantryModelVariant(unit: InfantryModelUnit, variant: string): string {
  const next = variant === INFANTRY_MODEL_NEW ? INFANTRY_MODEL_NEW : INFANTRY_MODEL_CLASSIC;
  _variant[unit] = next;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(INFANTRY_MODEL_STORAGE_PREFIX + unit, next);
    }
  } catch (_) { /* storage unavailable */ }
  return next;
}

export function toggleInfantryModelVariant(unit: InfantryModelUnit): string {
  return setInfantryModelVariant(unit, useNewInfantryModel(unit) ? INFANTRY_MODEL_CLASSIC : INFANTRY_MODEL_NEW);
}

// Map a stats model path to the file that should actually load. Unknown
// paths (sergeants, vehicles, structures) resolve to themselves.
export function resolveInfantryModel(path: unknown): string {
  const key = String(path || '');
  const unit = _classicToUnit.get(key);
  if (unit && useNewInfantryModel(unit)) {
    return INFANTRY_MODEL_TABLE[unit].latest;
  }
  return key;
}
