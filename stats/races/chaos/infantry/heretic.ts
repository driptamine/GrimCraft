import type { UnitStats } from '../../../types.js';
import worker from '../../../../animations/chaos/worker.json';

export const heretic: UnitStats = {
  name: 'Heretic',
  model: 'models/chaos/infantry/heretic.glb',
  animations: worker,
  cost: 80,
  time: 2,
};
