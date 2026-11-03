import type { UnitStats } from '../../../types.js';
import imperial_guardsmen from '../../../../animations/ig/infantry/imperial_guardsmen.json';

export const commissar: UnitStats = {
  name: 'commissar',
  model: 'models/ig/infantry/commissar.glb',
  animations: imperial_guardsmen,
  icon: 'assets/icons/Imperial Guard/Units/Commanders/guard_squad_commissar.png',
  cost: 150,
  time: 6,
  hp: 250,
  size: 1,
  attackRange: 22,
  damage: 12,
};
