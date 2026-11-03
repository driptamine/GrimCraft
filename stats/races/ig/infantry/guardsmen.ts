import type { UnitStats } from '../../../types.js';
import imperial_guardsmen from '../../../../animations/ig/infantry/imperial_guardsmen.json';

// Wiki: Guardsmen Squad — Hit Points 160/0.5, Armour Infantry Medium,
// Reinforce 20 req / 7 s, Build 160 req / 20 s, Squad Size 5/9.
export const guardsmen: UnitStats = {
  name: 'Guardsmen',
  model: 'models/ig/infantry/guardsmen.glb',
  animations: imperial_guardsmen,
  icon: 'assets/icons/Imperial Guard/Units/Basic/guard_squad_guardsmen.png',
  cost: 160,
  time: 20,
  hp: 160,
  armor: 'infantry_med',
  weapon: 'lasgun',
  size: 5,
  squadSize: 9,
  reinforceCost: 20,
  reinforceTime: 7,
  hiddenNodes: [
    'guard_banner',
    'guard_banner_rod',

    // 'guardsmen_lasgun',
    'guardsmen_grenade_launcher',
    'guardsmen_plasma_pistol',
    'guardsmen_flamer',

    // All four heads stay unmerged so each soldier shows exactly one
    // (see applyGuardsmanHead in meshes/soldiers.js).
    'guardsmen_head01',
    'guardsmen_head02',
    'guardsmen_head03',
    'guardsmen_head04',

  ],
};
