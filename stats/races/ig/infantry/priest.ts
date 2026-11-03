import type { UnitStats } from '../../../types.js';
import imperial_guardsmen from '../../../../animations/ig/infantry/imperial_guardsmen.json';

export const priest: UnitStats = {
  name: 'priest',
  model: 'models/ig/infantry/priest.glb',
  animations: imperial_guardsmen,
  icon: 'assets/icons/Imperial Guard/Units/Commanders/guard_squad_priest.png',
  cost: 140,
  time: 6,
  hp: 180,
  size: 1,
  attackRange: 12,
  damage: 10,
};
