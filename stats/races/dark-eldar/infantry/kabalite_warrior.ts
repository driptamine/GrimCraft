import type { UnitStats } from '../../../types.js';
import soldier from '../../../../animations/dark-eldar/soldier.json';

export const kabaliteWarrior: UnitStats = {
  name: 'Kabalite Warrior',
  model: 'models/dark eldar/infantry/warrior.glb',
  animations: soldier,
  cost: 100,
  time: 3,
  hiddenNodes: ['dark_eldar_banner', 'dark_eldar_flag_pole'],
};
