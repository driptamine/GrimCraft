// Pure balance data and calculations. This module never imports game state or Three.js.
export const ARMOR_TYPES = ['infantry_low', 'infantry_med', 'infantry_high', 'infantry_hmed', 'infantry_hhi', 'infantry_cmdr', 'vehicle_low', 'vehicle_med', 'vehicle_high', 'vehicle_air', 'building_low', 'building_med', 'building_high', 'daemon_med', 'daemon_high'] as const;
export type BalanceArmor = typeof ARMOR_TYPES[number];
export interface BalanceWeapon {
  name: string;
  mode: 'dps' | 'ap';
  minDamage: number;
  maxDamage: number;
  minimumDamage: number;
  accuracy: number;
  movingAccuracy: number;
  refire: number;
  range: number;
  armorPiercing: Record<BalanceArmor, number | null>;
  dps: Record<BalanceArmor, number>;
}
export interface BalanceMod {
  schemaVersion: 1;
  id: string;
  name: string;
  version: string;
  weapons: Record<string, BalanceWeapon>;
}
export const DRAFT_KEY = 'grimcraft-balance-draft-v1';
export const ACTIVE_KEY = 'grimcraft-balance-active-v1';
export function newMod(): BalanceMod {
  return { schemaVersion: 1, id: 'my-balance', name: 'My Balance Mod', version: '1.0.0', weapons: {} };
}
export function clone<T>(value: T): T { return JSON.parse(JSON.stringify(value)); }
export function validateMod(value: unknown): string[] {
  const errors: string[] = [];
  if (!value || typeof value !== 'object' || Array.isArray(value)) return ['Мод должен быть объектом JSON.'];
  const mod = value as BalanceMod;
  if (mod.schemaVersion !== 1) errors.push('Поддерживается schemaVersion: 1.');
  if (typeof mod.id !== 'string' || !/^[a-zA-Z0-9_-]{1,80}$/.test(mod.id)) errors.push('ID: 1–80 букв, цифр, дефисов или подчёркиваний.');
  for (const field of ['name', 'version'] as const) {
    if (typeof mod[field] !== 'string' || !mod[field].trim() || mod[field].length > 120) errors.push(`Заполните ${field} (до 120 символов).`);
  }
  if (!mod.weapons || typeof mod.weapons !== 'object' || Array.isArray(mod.weapons) || Object.keys(mod.weapons).length > 128) return [...errors, 'Ожидается таблица weapons (до 128 записей).'];
  for (const [key, weapon] of Object.entries(mod.weapons)) {
    const fail = (message: string) => errors.push(`${key}: ${message}`);
    if (!/^[a-z][a-z0-9_]{0,79}$/.test(key) || ['constructor', 'prototype'].includes(key)) { fail('недопустимый ключ оружия');continue; }
    if (!weapon || typeof weapon !== 'object' || Array.isArray(weapon)) { fail('ожидается объект оружия');continue; }
    if (typeof weapon.name !== 'string' || !weapon.name.trim() || weapon.name.length > 120) fail('заполните название');
    if (weapon.mode !== 'ap' && weapon.mode !== 'dps') fail('mode должен быть ap или dps');
    const bounds = { minDamage: [0, 1e6], maxDamage: [0, 1e6], minimumDamage: [0, 1e6], accuracy: [0, 1], movingAccuracy: [0, 1], refire: [.05, 300], range: [0, 1000] };
    for (const [field, [minimum, maximum]] of Object.entries(bounds)) {
      const number = weapon[field as keyof BalanceWeapon];
      if (typeof number !== 'number' || !Number.isFinite(number) || number < minimum || number > maximum) fail(`${field}: допустимо ${minimum}–${maximum}`);
    }
    if (weapon.minDamage > weapon.maxDamage) fail('Min не должен превышать Max');
    for (const armor of ARMOR_TYPES) {
      const piercing = weapon.armorPiercing?.[armor], dps = weapon.dps?.[armor];
      if (piercing !== null && (typeof piercing !== 'number' || !Number.isFinite(piercing) || piercing < 0 || piercing > 100)) fail(`${armor}: AP должен быть 0–100% или null`);
      if (weapon.mode === 'ap' && piercing === null) fail(`${armor}: задайте AP; неизвестное значение нельзя считать нулём`);
      if (typeof dps !== 'number' || !Number.isFinite(dps) || dps < 0 || dps > 1e7) fail(`${armor}: недопустимый DPS`);
      if (weapon.mode === 'dps' && weapon.accuracy === 0 && dps > 0) fail(`${armor}: при нулевой точности DPS должен быть нулевым`);
    }
  }
  return errors;
}
export function parseMod(text: string): BalanceMod {
  if (text.length > 512_000) throw new Error('Файл мода слишком большой (максимум 512 КБ).');
  const value = JSON.parse(text);
  const errors = validateMod(value);
  if (errors.length) throw new Error(errors.join('\n'));
  return value;
}
export function expectedHit(weapon: BalanceWeapon, armor: BalanceArmor): number | null {
  if (weapon.mode === 'dps') return weapon.accuracy > 0 ? weapon.dps[armor] * weapon.refire / weapon.accuracy : 0;
  const piercing = weapon.armorPiercing[armor];
  return piercing == null ? null : Math.max((weapon.minDamage + weapon.maxDamage) / 2 * piercing / 100, weapon.minimumDamage);
}
export function weaponDps(weapon: BalanceWeapon, armor: BalanceArmor, moving = false): number | null {
  if (weapon.mode === 'dps') return moving ? (weapon.accuracy > 0 ? weapon.dps[armor] * weapon.movingAccuracy / weapon.accuracy : 0) : weapon.dps[armor];
  const hit = expectedHit(weapon, armor);
  return hit == null ? null : hit * (moving ? weapon.movingAccuracy : weapon.accuracy) / weapon.refire;
}
export function approximatePiercing(weapon: BalanceWeapon): BalanceWeapon {
  const result = clone(weapon), average = (weapon.minDamage + weapon.maxDamage) / 2;
  for (const armor of ARMOR_TYPES) {
    const damage = expectedHit({ ...weapon, mode: 'dps' }, armor) || 0;
    result.armorPiercing[armor] = average > 0 && damage > weapon.minimumDamage + 1e-9 && damage <= average
      ? Math.round(damage / average * 10000) / 100 : null;
  }
  return result;
}
