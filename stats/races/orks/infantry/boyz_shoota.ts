import type { UnitStats } from '../../../types.js';
import soldier from '../../../../animations/orks/soldier.json';

export const boyzShoota: UnitStats = {
  name: 'boyz_shoota',
  model: 'models/orks/infantry/boyz_shoota.glb',
  animations: soldier,
  hiddenNodes: ['ork_flag', 'ork_flag_pole'],
  icon: 'assets/icons/Orks/Units/Basic/shoota_boyz_icon.png',
  cost: 100,
  time: 3,
  size: 5,
  attackRange: 22,
  damage: 12,
  armor: 'infantry_high',
  weapon: 'shoota',
};
