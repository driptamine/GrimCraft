import type { UnitStats } from '../../../types.js';
import imperial_guardsmen from '../../../../animations/ig/infantry/imperial_guardsmen.json';

// Wiki: Guardsmen Squad Sergeant — Hitpoints 200/0.5, Armour Infantry Heavy
// Medium, Ranged Laspistol, Melee Power Sword, Build 55 req / 15 s.
export const sergeant: UnitStats = {
  name: 'sergeant',
  model: 'models/ig/infantry/guardsmen_sergeant.glb',
  animations: imperial_guardsmen,
  hiddenNodes: ['guard_banner', 'guard_banner_rod'],
  icon: 'assets/icons/Imperial Guard/Units/Basic/guard_sargeant_icon.png',
  cost: 55,
  time: 15,
  hp: 200,
  armor: 'infantry_hmed',
  weapon: 'laspistol',
  size: 1,
  attackRange: 27,
  damage: 12,
  reinforceCost: 55,
  reinforceTime: 15,
};
