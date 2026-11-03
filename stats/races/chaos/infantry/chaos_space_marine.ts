import type { UnitStats } from '../../../types.js';
import chaos_space_marine from '../../../../animations/chaos/chaos_space_marine.json';

// Wiki: Chaos Space Marine Squad — Hitpoints 375/0.5, Armour Infantry Heavy
// Medium, Reinforce 50 req / 9 s, Build 190 req / 26.4 s, Squad Size 4/10.
export const chaosSpaceMarine: UnitStats = {
  name: 'Chaos Space Marine',
  model: 'models/chaos/infantry/chaos_space_marine.glb',
  animations: chaos_space_marine,
  cost: 190,
  time: 26.4,
  hp: 375,
  armor: 'infantry_hmed',
  weapon: 'bolter',
  size: 4,
  squadSize: 10,
  reinforceCost: 50,
  reinforceTime: 9,
  hiddenNodes: [
    'chaos_banner',
    'marine_sergeant_banner_rod',
    'chaos_rocket_launcher',
    'chaos_heavy_bolter',
    'chaos_heavy_bolter_belt',
    'chaos_missiles',
    'chaos_knife',
    'chaos_plasma_rifle',
    'chaos_flamer',
  ],
};
