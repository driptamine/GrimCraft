import type { UnitStats } from '../../../types.js';
import imperial_guardsmen from '../../../../animations/ig/infantry/imperial_guardsmen.json';

export const vindicare: UnitStats = {
  name: 'vindicare',
  model: 'models/ig/infantry/vindicare_temple_assassin.glb',
  animations: imperial_guardsmen,
  icon: 'assets/icons/Imperial Guard/Units/Elite/guard_squad_assassin.png',
  cost: 160,
  time: 7,
  hp: 200,
  size: 1,
  attackRange: 34,
  damage: 25,
};
