import type { UnitStats } from '../../../types.js';
import soldier from '../../../../animations/necrons/soldier.json';

export const necronWarrior: UnitStats = {
  name: 'Necron Warrior',
  model: 'models/necrons/infantry/necron_basic_warrior.glb',
  animations: soldier,
  cost: 100,
  time: 3,
  armor: 'infantry_hmed',
  weapon: 'gauss_flayer',
  movementSpeedMultiplier: .5,
};
