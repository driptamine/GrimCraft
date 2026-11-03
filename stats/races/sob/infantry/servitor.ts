import type { UnitStats } from '../../../types.js';
import worker from '../../../../animations/sob/worker.json';

export const servitor: UnitStats = {
  name: 'Servitor',
  model: 'models/sob/infantry/servitor.glb',
  animations: worker,
  cost: 80,
  time: 2,
};
