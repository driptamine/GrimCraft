import type { UnitStats } from '../../../types.js';
import worker from '../../../../animations/eldar/worker.json';

export const bonesinger: UnitStats = {
  name: 'Bonesinger',
  model: 'models/eldar/infantry/bonesinger.glb',
  animations: worker,
  cost: 80,
  time: 2,
};
