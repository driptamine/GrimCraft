import { ACTIVE_KEY, parseMod, type BalanceMod, type BalanceWeapon } from './model.js';

declare global { interface Window { _multiplayerMode?: unknown; } }

let localMod: BalanceMod | null | undefined;
let networkMod: BalanceMod | null = null;
export function storedBalanceMod(): BalanceMod | null {
  try { const saved = localStorage.getItem(ACTIVE_KEY);return saved ? parseMod(saved) : null; } catch { return null; }
}
export function setNetworkBalanceMod(mod: BalanceMod | null): void { networkMod = mod; }
export function activeBalanceMod(): BalanceMod | null {
  if (typeof window !== 'undefined' && window._multiplayerMode) return networkMod;
  if (localMod === undefined) localMod = storedBalanceMod();
  return localMod;
}
export function balanceWeapon(key: string | null | undefined): BalanceWeapon | null {
  const weapons = activeBalanceMod()?.weapons;
  return key && weapons && Object.hasOwn(weapons, key) ? weapons[key] : null;
}
