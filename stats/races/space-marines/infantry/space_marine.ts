import type { UnitStats } from '../../../types.js';
import soldier from '../../../../animations/space-marines/soldier.json';

export const spaceMarine: UnitStats = {
  name: 'Space Marine',
  model: 'models/space marines/troops/space_marine.glb',
  animations: soldier,
  cost: 100,
  time: 3,
  armor: 'infantry_hmed',
  weapon: 'space_marine_bolter',
  hiddenNodes: [
    'marine_missile_launcher',
    'marine_missile',
    'marine_knife',
    'marine_heavy_bolter_wheel',
    'marine_heavy_bolter_belt',
    'marine_heavy_bolter_backpack',
    'marine_heavy_bolter',
    'marine_grenade',
    'marine_flamer',
    'marine_banner_rod',
    'marine_banner',
    'marine_backpack_missiles',
  ],
};
