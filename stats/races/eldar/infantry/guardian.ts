import type { UnitStats } from '../../../types.js';
import soldier from '../../../../animations/eldar/soldier.json';

export const guardian: UnitStats = {
  name: 'Guardian',
  model: 'models/eldar/infantry/guardian.glb',
  animations: soldier,
  cost: 100,
  time: 3,
  armor: 'infantry_med',
  weapon: 'shuriken_catapult',
  hiddenNodes: ['Eldar_Flag', 'Eldar_Flag_Pole'],
};
