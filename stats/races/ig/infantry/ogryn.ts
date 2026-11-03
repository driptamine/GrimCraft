import type { UnitStats } from '../../../types.js';
import imperial_guardsmen from '../../../../animations/ig/infantry/imperial_guardsmen.json';

export const ogryn: UnitStats = {
  name: 'ogryn',
  model: 'models/ig/infantry/ogryn.glb',
  animations: imperial_guardsmen,
  hiddenNodes: ['guard_banner_rod', 'guard_banner'],
  icon: 'assets/icons/Imperial Guard/Units/Elite/guard_squad_ogryns.png',
  cost: 160,
  time: 7,
  hp: 240,
  size: 4,
  attackRange: 14,
  damage: 20,
};
