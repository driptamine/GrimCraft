import type { UnitStats } from '../../../types.js';
import imperial_guardsmen from '../../../../animations/ig/infantry/imperial_guardsmen.json';

export const kasrkin: UnitStats = {
  name: 'kasrkin',
  model: 'models/ig/infantry/kasrkin.glb',
  animations: imperial_guardsmen,
  hiddenNodes: [
    'guard_banner_rod',
    'guard_banner',

    'kasrkin_grenade_launcher',
    'karskin_flamer',
    // 'karskin_hellgun',
    'karskin_plasmagun'


  ],
  icon: 'assets/icons/Imperial Guard/Units/Elite/guard_squad_kasrkin.png',
  cost: 200,
  time: 35,
  hp: 385,
  armor: 'infantry_hmed',
  weapon: 'hellgun',
  size: 5,
  attackRange: 24,
  damage: 13,
  reinforceCost: 50,
  reinforceTime: 10,
};
