import type { UnitStats } from '../../../types.js';
import worker from '../../../../animations/necrons/worker.json';

export const builderScarab: UnitStats = {
  name: 'Builder Scarab',
  model: 'models/necrons/infantry/builder_scarab.glb',
  animations: worker,
  cost: 80,
  time: 2,
};
