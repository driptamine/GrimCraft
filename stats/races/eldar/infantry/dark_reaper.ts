import type { UnitStats } from '../../../types.js';
import soldier from '../../../../animations/eldar/soldier.json';

export const darkReaper: UnitStats = {
  name: 'dark_reaper',
  model: 'models/eldar/infantry/dark_reaper.glb',
  animations: soldier,
  hiddenNodes: ['Eldar_Flag', 'Eldar_Flag_Pole'],
  icon: 'assets/icons/Eldar/Units/Elite/dark_reaper_icon.png',
  cost: 100,
  time: 3,
  size: 5,
  attackRange: 22,
  damage: 12,
  hp: 450,
  armor: 'infantry_high',
  weapon: 'reaper_launcher',
  stationaryFireOnly: true,
};
