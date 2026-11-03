import type { UnitStats } from '../../../types.js';
import soldier from '../../../../animations/space-marines/soldier.json';

export const greyKnight: UnitStats = {
  name: 'grey_knight',
  model: 'models/space marines/troops/grey_knight.glb',
  animations: soldier,
  icon: 'assets/icons/Space Marines/Units/Elite/space_marine_icon_grey_knights.png',
  cost: 150,
  time: 5,
  hp: 250,
  armor: 'infantry_hmed',
  weapon: 'storm_bolter',
  size: 5,
  attackRange: 20,
  damage: 16,
};
