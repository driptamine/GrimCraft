import * as THREE from 'three';
import { PLAYER } from '../core/scene.js';
import { childMeshes } from '../render/three-helpers.js';
import { makeBarracksMesh, makeBuildingConstructionMesh, makeConfigStructureMesh, makeGunTurretMesh, makeHQMesh, makeThermoMesh, makeTowerBaseMesh, makeTowerMesh } from './buildings.js';
import { getStructureConfig, resolveFactionKey } from '../factions.js';
import { hasAnimatedConstruction } from '../render/construction-animation.js';
import type { ConstructionPhases } from '../render/construction-animation.js';
import { makeAirfieldMesh, makeApcMesh } from './vehicles.js';
import type { AnyGroup, AnyMesh, MetaPayload } from './types.js';


export const LEGACY_GHOST_TYPES = new Set([
  'barracks', 'infantry_command', 'hq', 'tower', 'turret', 'towerBase',
  'thermoGen', 'gunTurret', 'apc', 'mechanized', 'airfield',
]);


// Placement/scaffold ghosts use the real structure model for every
// config-driven type; only legacy procedural types keep bespoke ghosts.
export function ghostUsesConfigModel(type: string): boolean {
  return !LEGACY_GHOST_TYPES.has(type);
}


export function makeGhostMesh(type: string, pos: THREE.Vector3, meta: MetaPayload, teamKey: string = PLAYER, options: { completedPose?: boolean } = {}): AnyGroup | undefined {
  let root: AnyGroup | undefined;
  if (options.completedPose) {
    const faction = resolveFactionKey(meta.faction);
    const modelType = faction === 'ig' && type === 'hq' ? 'hq-anim' : type === 'barracks' && faction === 'ig' ? 'infantry_command' : type;
    const phases = (getStructureConfig(faction, modelType)?.animations as { phases?: ConstructionPhases } | undefined)?.phases;
    if (phases && hasAnimatedConstruction({ type, faction })) root = makeBuildingConstructionMesh(modelType, pos, teamKey, { ...meta, faction }, phases) || undefined;
  }

  if (root) {
    root._constructionAnimation.finish();
  } else if (ghostUsesConfigModel(type)) {
    root = makeConfigStructureMesh(type, pos, teamKey, meta);
  } else if (type === 'barracks' || type === 'infantry_command') {
    root = makeBarracksMesh(pos, teamKey, meta);
  } else if (type === 'hq') {
    root = makeHQMesh(pos, teamKey, meta);
  } else if (type === 'tower' || type === 'turret') {
    root = makeTowerMesh(pos, teamKey, meta);
  } else if (type === 'towerBase') {
    root = makeTowerBaseMesh(pos, teamKey, meta);
  } else if (type === 'thermoGen') {
    root = makeThermoMesh(pos, teamKey, meta);
  } else if (type === 'gunTurret') {
    root = makeGunTurretMesh(pos, teamKey, meta);
  } else if (type === 'apc') {
    root = makeApcMesh(pos, teamKey, meta);
  } else if (type === 'mechanized') {
    root = makeApcMesh(pos, teamKey, meta);
  } else if (type === 'airfield') {
    root = makeAirfieldMesh(pos, teamKey, meta);
  }

  if (!root) {
    return root;
  }
  const ghostEmissive = new THREE.Color(0.2, 0.7, 1.0);
  childMeshes(root).forEach((mesh) => {
    if (!mesh.material) {
      return;
    }
    const sourceMat = mesh.material as THREE.Material;
    const ghostMaterial = sourceMat.clone() as THREE.MeshStandardMaterial & { isMeshStandardMaterial?: unknown };
    ghostMaterial.name = 'ghost_mat_' + Math.random();
    if (ghostMaterial.isMeshStandardMaterial) {
      ghostMaterial.color.setRGB(0, 0, 0);
      ghostMaterial.emissive.copy(ghostEmissive);
    } else if ((ghostMaterial as { color?: THREE.Color }).color) {
      (ghostMaterial as { color?: THREE.Color }).color!.copy(ghostEmissive);
    }
    ghostMaterial.opacity = 0.2;
    ghostMaterial.transparent = true;
    mesh.material = ghostMaterial;
    mesh.userData.pickable = false;
  });
  if (root._ring) {
    root._ring.visible = true;
    root._ring.visible = true;
    if (root._ringMat) root._ringMat.opacity = 0.35; root._ringMat.transparent = true;
  }
  root._isGhost = true;
  return root;
}
