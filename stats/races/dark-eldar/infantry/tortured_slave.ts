import type { UnitStats } from '../../../types.js';
import worker from '../../../../animations/dark-eldar/worker.json';

export const torturedSlave: UnitStats = {
  name: 'Tortured Slave',
  model: 'models/dark eldar/infantry/tortured_slave.glb',
  animations: worker,
  cost: 80,
  time: 2,
};
