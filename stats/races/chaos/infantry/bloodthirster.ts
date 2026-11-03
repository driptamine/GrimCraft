import type { UnitStats } from '../../../types.js';
import bloodthirster from '../../../../animations/chaos/bloodthirster.json';

export const bloodthirsterStats: UnitStats = {
  name: 'bloodthirster',
  model: 'models/chaos/infantry/bloodthirster.glb',
  animations: bloodthirster,
  hiddenNodes: ['independant_bloodthirster_axe'],
  cost: 400,
  time: 12,
  hp: 1500,
  size: 1,
  attackRange: 5,
  damage: 60,
  canFly: true,
};
