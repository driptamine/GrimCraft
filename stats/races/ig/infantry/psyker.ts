import type { UnitStats } from '../../../types.js';
import imperial_guardsmen from '../../../../animations/ig/infantry/imperial_guardsmen.json';

export const psyker: UnitStats = {
  name: 'psyker',
  model: 'models/ig/infantry/sanctioned_psyker.glb',
  animations: imperial_guardsmen,
  icon: 'assets/icons/Imperial Guard/Units/Basic/guard_squad_psyker.png',
  cost: 140,
  time: 6,
  hp: 180,
  size: 1,
  attackRange: 26,
  damage: 18,
};
