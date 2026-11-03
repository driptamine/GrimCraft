import type { UnitStats } from '../../../types.js';
import imperial_guardsmen from '../../../../animations/ig/infantry/imperial_guardsmen.json';

export const commandSquad: UnitStats = {
  name: 'command_squad',
  model: 'models/ig/infantry/imperial_captain.glb',
  animations: imperial_guardsmen,
  icon: 'assets/icons/Imperial Guard/Units/Basic/guard_squad_command_squad.png',
  cost: 200,
  time: 8,
  hp: 170,
  size: 5,
  attackRange: 22,
  damage: 12,
};
