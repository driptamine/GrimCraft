import type { UnitStats } from '../../../types.js';
import worker from '../../../../animations/space-marines/worker.json';

export const servitor: UnitStats = {
  name: 'Servitor',
  model: 'models/space marines/troops/servitor.glb',
  animations: worker,
  cost: 80,
  time: 2,
};
