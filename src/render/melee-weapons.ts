import type { Object3D } from 'three';
import { findNodesByName } from './three-helpers.js';

// Ranged weapon -> knife swaps shown while a soldier fights in melee.
// Node names come from the source GLBs; they must survive the skinned merge
// (see SOLDIER_SWITCHED_NODES) so they can still be found at runtime.
export interface MeleeWeaponSwap {
  melee: string;
  ranged: string;
}

export const MELEE_WEAPON_SWAPS: readonly MeleeWeaponSwap[] = [
  { melee: 'chaos_knife', ranged: 'chaos_bolter' },
];

export const MELEE_WEAPON_NODES: readonly string[] = MELEE_WEAPON_SWAPS
  .flatMap(({ melee, ranged }) => [melee, ranged]);

function _toggle(root: Object3D, name: string, visible: boolean): void {
  for (const node of findNodesByName(root, name)) {
    node.visible = visible;
    node.userData.pickable = visible;
  }
}

// Melee mode keeps the knife out for the whole fight; leaving melee restores
// the ranged weapon. Models without these nodes are untouched.
export function setMeleeWeaponVisible(
  root: Object3D | null | undefined,
  melee: boolean,
  swaps: readonly MeleeWeaponSwap[] = MELEE_WEAPON_SWAPS,
): void {
  if (!root) {
    return;
  }
  for (const swap of swaps) {
    _toggle(root, swap.melee, melee);
    _toggle(root, swap.ranged, !melee);
  }
}
