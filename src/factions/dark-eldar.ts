import { torturedSlave } from '../../stats/races/dark-eldar/infantry/tortured_slave.js';
import { kabaliteWarrior } from '../../stats/races/dark-eldar/infantry/kabalite_warrior.js';

export default {
  name: 'Dark Eldar',
  hq: 'models/dark eldar/structures/kabal_fortress.glb',
  infantry: [
    torturedSlave,
    kabaliteWarrior,
  ],
  structures: [],
  icons: {},
};
