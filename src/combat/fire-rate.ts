// Live Kasrkin hellgun cadence. Damage per burst is adjusted by the caller
// so changing visual frequency preserves the weapon's effective DPS.
export const KASRKIN_FIRE_RATE_DEFAULT = 10;
export const KASRKIN_FIRE_RATE_MIN = 0.4;
export const KASRKIN_FIRE_RATE_MAX = 10;
export const KASRKIN_FIRE_RATE_STORAGE_KEY = 'grimcraft-kasrkin-fire-rate';

let fireRate: number | undefined;

function validRate(value: unknown): number {
  const rate = Number(value);
  return Number.isFinite(rate) && rate > 0
    ? Math.min(KASRKIN_FIRE_RATE_MAX, Math.max(KASRKIN_FIRE_RATE_MIN, rate))
    : KASRKIN_FIRE_RATE_DEFAULT;
}

export function kasrkinFireRate(): number {
  if (fireRate === undefined) {
    try {
      fireRate = validRate(localStorage.getItem(KASRKIN_FIRE_RATE_STORAGE_KEY));
    } catch (_) {
      fireRate = KASRKIN_FIRE_RATE_DEFAULT;
    }
  }
  return fireRate;
}

export function setKasrkinFireRate(value: unknown): number {
  fireRate = validRate(value);
  try {
    localStorage.setItem(KASRKIN_FIRE_RATE_STORAGE_KEY, String(fireRate));
  } catch (_) { /* storage unavailable */ }
  return fireRate;
}

export function isKasrkinHellgun(soldier: any, squad: any): boolean {
  const projectile = soldier.projectileType || squad.projectileType || 'bullet';
  return (soldier.unitType || squad.unitType) === 'kasrkin'
    && (!soldier.weapon || soldier.weapon === 'hellgun')
    && (projectile === 'beam' || projectile === 'laser' || projectile === 'bullet');
}
