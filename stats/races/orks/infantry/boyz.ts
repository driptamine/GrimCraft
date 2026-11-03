import type { UnitStats } from '../../../types.js';
import soldier from '../../../../animations/orks/soldier.json';

export const boyz: UnitStats = {
  name: 'Boyz',
  model: 'models/orks/infantry/boyz.glb',
  animations: soldier,
  cost: 100,
  time: 3,
  armor: 'infantry_high',
  weapon: 'slugga',
  hiddenNodes: [
    'ork_flag', 
    'ork_flag_pole',
    'boyz_helmet',
    'boyz_rokkit_launcha',
    'boyz_rokkit',
    'boyz_legs_burna',


    'boyz_helmet_spiked',
    'boyz_helmet_cage',

    'boyz_big_shoota',
    'boyz_big_shoota_ammo',
    
    'boyz_burna',
    'boyz_burna_goggles',
    'boyz_burna_bakpak',



  ],
};
