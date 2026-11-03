import type { UnitStats } from '../../../types.js';
import imperial_guardsmen from '../../../../animations/ig/infantry/imperial_guardsmen.json';

export const heavyWeaponsTeam: UnitStats = {
  name: 'heavy_weapons_team',
  model: 'models/ig/infantry/heavy_weapon_platoon.glb',
  animations: imperial_guardsmen,
  icon: 'assets/icons/Imperial Guard/Units/Basic/guard_heavy_weapons_team.png',
  cost: 150,
  time: 6,
  hp: 130,
  size: 3,
  attackRange: 30,
  damage: 14,
};
