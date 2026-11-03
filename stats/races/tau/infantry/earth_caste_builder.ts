import type { UnitStats } from '../../../types.js';
import worker from '../../../../animations/tau/worker.json';

export const earthCasteBuilder: UnitStats = {
  name: 'Earth Caste Builder',
  model: 'models/tau/infantry/earth_caste_builder.glb',
  animations: worker,
  cost: 80,
  time: 2,
};
