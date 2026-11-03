import type { UnitStats } from '../../../types.js';
import soldier from '../../../../animations/sob/soldier.json';

export const battleSister: UnitStats = {
  name: 'Battle Sister',
  model: 'models/sob/infantry/battle_sister.glb',
  animations: soldier,
  cost: 100,
  time: 3,
  armor: 'infantry_hmed',
  weapon: 'sororitas_bolter',
  hiddenNodes: ['sb_obj_banner', 'sb_obj_flagpole'],
};
