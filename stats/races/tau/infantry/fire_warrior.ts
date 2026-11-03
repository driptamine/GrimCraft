import type { UnitStats } from '../../../types.js';
import soldier from '../../../../animations/tau/soldier.json';

export const fireWarrior: UnitStats = {
  name: 'Fire Warrior',
  model: 'models/tau/infantry/fire_warrior.glb',
  animations: soldier,
  cost: 100,
  time: 3,
  armor: 'infantry_hmed',
  weapon: 'pulse_rifle',
  hiddenNodes: ['tau_banner', 'tau_banner_rod'],
};
