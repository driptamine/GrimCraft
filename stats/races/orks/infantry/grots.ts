import type { UnitStats } from '../../../types.js';
import worker from '../../../../animations/orks/worker.json';

export const grots: UnitStats = {
  name: 'Grots',
  model: 'models/orks/infantry/grots.glb',
  animations: worker,
  cost: 80,
  time: 2,
};
