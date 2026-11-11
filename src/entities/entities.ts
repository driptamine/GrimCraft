import * as THREE from 'three';

import {
  scene,
  world,
  PLAYER,
  SQUAD_MAX,
  SQUAD_SCATTER,
  FORMATION,
  TAG,
  COSTS,
  researchedTech,
  JET_ALT,
  JET_SPEED,
  _allHitboxes,
} from '../core/scene.js';
import { bump } from '../hud/store.js';
import {
  toggleInfantryModelVariant,
  type InfantryModelUnit,
} from '../render/infantry-model-variant.js';
import {
  makeSoldierMesh,
  makeHpBar,
  makeBarracksMesh,
  makeHQMesh,
  makeTowerMesh,
  makeTowerBaseMesh,
  makeThermoMesh,
  makeGunTurretMesh,
  makeConfigStructureMesh,
  makeApcMesh,
  makeVehicleMesh,
  makeAirfieldMesh,
  makeStrategicPointMesh,
  makeGhostMesh,
  makeSquareSelRing,
  makeJetMesh,
  makeMissileMesh,
  updateHpBar,
} from '../meshes.js';
import { updateHUD } from '../core/hud.js';
import { FACTIONS, playerFaction, enemyFaction, resolveFactionKey, reloadInfantryVariantContainers } from '../factions.js';
import { DEFAULT_ARMOR_CLASS, getWeapon } from '../combat/stats.js';
import { NecronLightning } from '../fx/necron-lightning.js';
import { makePlasmaBoltMesh, makePlasmaFinalBoltMesh } from '../fx/plasma-bolt.js';
import { makeBlasterBoltMesh } from '../fx/blaster-bolt.js';
import { makeReaperBoltMesh } from '../fx/reaper-bolt.js';
import { HELLGUN_LASER_NAME, makeHellgunLaserMesh } from '../fx/hellgun-laser.js';
import { LASGUN_LASER_NAME, makeLasgunLaserMesh } from '../fx/lasgun-laser.js';
import { PLASMA_CLOUD_PUFF, PLASMA_CLOUD_PUFF_COUNT, makePlasmaCloudPuffMesh, plasmaCloudPuffOffset } from '../fx/plasma-cloud-puff.js';
import { attachPlasmaCloudBlaster } from '../fx/plasma-cloud-blaster.js';
import { mkBox, mkSphere, mkCylinder, mkPlane, mkGroup, disposeObj, childMeshes, descendants } from '../render/three-helpers.js';

// ══════════════════════════════════════════════════════════════════════════════
//  ENTITIES
// ══════════════════════════════════════════════════════════════════════════════

export function _applySuperiorVisuals(mesh: any) {
  if (!mesh) {
    return;
  }
  if (mesh._helmTopMesh) {
    const material = new THREE.MeshStandardMaterial();
    material.color = new THREE.Color(0.6, 0.2, 1);
    material.emissive = new THREE.Color(0.3, 0, 0.5);
    mesh._helmTopMesh.material = material;
  }
}

export function _toggleMeshNode(root: any, name: any, enabled: any) {
  if (!root) {
    return;
  }
  const wanted = name.toLowerCase();
  descendants(root).forEach((child) => {
    const childName = child.name.toLowerCase();
    if (childName === wanted || childName.startsWith(wanted + '_inst_')) {
      child.visible = enabled;
      child.visible = enabled;
      child.userData.pickable = enabled;
    }
  });
  // The pistol glow rides the hand bone (skinned mesh nodes never move), so
  // hiding the gun must hide the assembly explicitly — same for showing.
  if (wanted === 'guardsmen_plasma_pistol' && typeof root.getObjectByName === 'function') {
    const glow = root.getObjectByName('plasma_pistol_glow');
    if (glow) {
      glow.visible = enabled;
    }
  }
}

export function _applyPlasmaVisuals(mesh: any) {
  if (!mesh) {
    return;
  }
  _toggleMeshNode(mesh, 'guardsmen_lasgun', false);
  _toggleMeshNode(mesh, 'guardsmen_plasma_pistol', true);
}

export function _applyGrenadierVisuals(mesh: any) {
  if (!mesh) {
    return;
  }
  if (mesh._helmTopMesh) {
    const material = new THREE.MeshStandardMaterial();
    material.color = new THREE.Color(1, 0.5, 0);
    material.emissive = new THREE.Color(0.6, 0.3, 0);
    mesh._helmTopMesh.material = material;
  }
  _toggleMeshNode(mesh, 'guardsmen_lasgun', false);
  _toggleMeshNode(mesh, 'guardsmen_grenade_launcher', true);
}

export function applySquadWeaponVisuals(world: any, squadEntityId: any) {
  const squadComponent = world.get(squadEntityId, 'squad');
  if (!squadComponent) {
    return;
  }
  squadComponent.soldiers.forEach((soldierId: any) => {
    if (!soldierId || !world.has(soldierId, 'soldier')) {
      return;
    }
    const soldier = world.get(soldierId, 'soldier');
    const root = world.get(soldierId, 'mesh')?.root;
    if (!root) {
      return;
    }
    if (soldier?.isGrenadier) {
      return;
    }
    const effective = squadComponent.projectileType === PLASMA_CLOUD_PUFF
      ? PLASMA_CLOUD_PUFF : soldier?.projectileType || squadComponent.projectileType;
    if (effective === 'plasma' || effective === 'plasma-final' || effective === PLASMA_CLOUD_PUFF) {
      _applyPlasmaVisuals(root);
    } else {
      _toggleMeshNode(root, 'guardsmen_lasgun', true);
      _toggleMeshNode(root, 'guardsmen_plasma_pistol', false);
    }
  });
}

// Tear down one soldier root so it can be replaced: stops and disposes the
// animation groups and the instantiated GLB data, then removes every child
// mesh. Mirrors the soldier branch of disposeMeshComponent (combat.ts), but
// keeps the HUD bars — they outlive the swap and are reattached to the mesh
// component by the caller.
function _disposeSoldierRootForSwap(root: any): void {
  if (!root) {
    return;
  }
  if (root._animGroups) {
    Object.values(root._animGroups).forEach((ag: any) => {
      try {
        ag.stop();
        ag.dispose();
      } catch (_) { /* already disposed */ }
    });
    root._animGroups = {};
  }
  if (root._instanceData) {
    try {
      root._instanceData.dispose?.();
      root._instanceData.animationGroups.forEach((ag: any) => {
        try {
          ag.stop();
          ag.dispose();
        } catch (_) { /* already disposed */ }
      });
      root._instanceData.rootNodes.forEach((n: any) => {
        try {
          childMeshes(n).forEach((m) => disposeObj(m));
          disposeObj(n);
        } catch (_) { /* already disposed */ }
      });
    } catch (_) { /* already disposed */ }
    root._instanceData = null;
  }
  childMeshes(root).forEach((m) => disposeObj(m));
  if (root.parent) {
    root.parent.remove(root);
  }
  disposeObj(root);
  for (let i = _allHitboxes.length - 1; i >= 0; i--) {
    if (_allHitboxes[i].userData?.disposed) _allHitboxes.splice(i, 1);
  }
}

// Re-instantiate every live basic-infantry mesh from the (possibly
// reloaded) faction containers. Only meshes tagged `_variantSoldier` at
// creation take part — sergeants, specialists and vehicles resolve to named
// units[] entries and keep their models. HP bars, squad state, cooldowns
// and selection all live outside the mesh, so they survive the swap; the
// per-frame selection sync re-applies the squad's `selected` flag to the
// fresh meshes on the next tick.
export function swapInfantryVariantMeshes(targetWorld: any = world): number {
  if (!targetWorld) {
    return 0;
  }
  let swapped = 0;
  for (const soldierId of targetWorld.query('soldier')) {
    const soldier = targetWorld.get(soldierId, 'soldier');
    const meshComponent = targetWorld.get(soldierId, 'mesh');
    const old = meshComponent?.root;
    if (!soldier || !meshComponent || !old || !old._variantSoldier) {
      continue;
    }
    if ((soldier.hp ?? 1) <= 0) {
      continue; // dying/dead: leave the death animation alone
    }
    const squad = targetWorld.get(soldier.squadId, 'squad');
    const team = squad?.team ?? PLAYER;
    const faction = resolveFactionKey(squad?.faction, team === PLAYER ? playerFaction : enemyFaction);
    const parent = old.parent || null;
    _disposeSoldierRootForSwap(old);
    const mesh = makeSoldierMesh(team, {
      soldierEntityId: soldierId,
      squadEntityId: soldier.squadId,
      unitType: soldier.unitType || undefined,
      faction,
    });
    (mesh as any)._variantSoldier = true;
    mesh.position.copy(old.position);
    mesh.quaternion.copy(old.quaternion);
    mesh.scale.copy(old.scale);
    if (parent) {
      parent.add(mesh);
    } else if (scene) {
      scene.add(mesh);
    }
    if (soldier.isSuperior) {
      _applySuperiorVisuals(mesh);
    }
    meshComponent.root = mesh;
    childMeshes(mesh).forEach((m) => {
      if (m.userData) {
        m.userData.squadEntityId = soldier.squadId;
      }
    });
    swapped++;
  }
  // Re-apply per-squad weapon visuals (lasgun/plasma/blaster visibility).
  for (const squadId of targetWorld.query('squad')) {
    applySquadWeaponVisuals(targetWorld, squadId);
  }
  return swapped;
}

// Flip one infantry model variant (marine/guardsman), reload the matching
// faction containers, and live-swap every affected soldier mesh. Returns
// the selected variant ('new' | 'classic') plus the swapped mesh count.
export async function toggleInfantryModel(targetWorld: any, unit: InfantryModelUnit): Promise<{ variant: string; swapped: number }> {
  const variant = toggleInfantryModelVariant(unit);
  bump('topbar');
  try {
    await reloadInfantryVariantContainers();
  } catch (error) {
    console.warn('[INFANTRY-MODEL] container reload failed, swapping against existing containers', error);
  }
  const swapped = swapInfantryVariantMeshes(targetWorld);
  bump('topbar');
  return { variant, swapped };
}

function _makeReloadBar(teamKey: any) {
  const bar = makeHpBar(1.2, teamKey);
  bar._fg.material.color = new THREE.Color(1, 1, 1);
  bar._bg.material.color = new THREE.Color(0.2, 0.2, 0.2);
  return bar;
}

const COMMAND_SQUAD_COMPOSITION = ['command_squad', 'psyker', 'priest'];

function _resolveSoldierUnitType(squadUnitType: any, formIdx: number, unitType: any = null) {
  if (unitType) {
    return unitType;
  }
  if (squadUnitType === 'command_squad') {
    return COMMAND_SQUAD_COMPOSITION[(formIdx - 1) % COMMAND_SQUAD_COMPOSITION.length];
  }
  return squadUnitType || null;
}

function _normalizeUnitKey(value: any): string {
  return String(value ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function _unitEntryMatches(entry: any, key: string): boolean {
  if (!entry || !key) {
    return false;
  }
  if (_normalizeUnitKey(entry.name) === key) {
    return true;
  }
  const model = String(entry.model ?? '');
  const base = (model.split('/').pop() || '').replace(/\.glb$/i, '');
  return _normalizeUnitKey(base) === key;
}

/**
 * Resolve the stats/config entry for a soldier type.
 *
 * Wiki squads such as Guardsmen and Chaos Space Marines live in `infantry`,
 * not `units`, so named squads must fall back there. A null unit type is the
 * faction's default soldier (infantry[1]).
 */
export function findUnitConfig(factionKey: string, unitType: any = null): any {
  const faction = FACTIONS[factionKey];
  if (!faction) {
    return null;
  }
  if (!unitType) {
    return faction.infantry?.[1] || null;
  }
  const key = _normalizeUnitKey(unitType);
  if (!key) {
    return faction.infantry?.[1] || null;
  }
  const unit = (faction.units || []).find((u) => _unitEntryMatches(u, key));
  if (unit) {
    return unit;
  }
  return (faction.infantry || []).find((u) => _unitEntryMatches(u, key)) || null;
}

export function createSoldierEntity(world: any, squadId: any, formIdx: number, unitType: any = null) {
  const squadComponent = world.get(squadId, 'squad');
  const isSuperior = (formIdx === 0);
  const isGrenadier = false;

  unitType = _resolveSoldierUnitType(squadComponent?.unitType, formIdx, unitType);
  if (isSuperior && (!squadComponent?.unitType || squadComponent.unitType === 'guardsmen')) {
    unitType = 'sergeant';
  }
  const soldierFaction = resolveFactionKey(squadComponent?.faction, squadComponent?.team === PLAYER ? playerFaction : enemyFaction);
  const unitConfig: any = findUnitConfig(soldierFaction, unitType);
  const movementSpeedMultiplier = unitConfig?.movementSpeedMultiplier
    ?? findUnitConfig(soldierFaction, squadComponent?.unitType)?.movementSpeedMultiplier ?? 1;
  const weaponProfile = getWeapon(unitConfig?.weapon);

  let maxHp = unitConfig?.hp ?? (isSuperior ? 150 : 100);
  const isGuardsman = !unitType || unitType === 'guardsmen' || unitType === 'sergeant';
  if (isGuardsman) {
    if (researchedTech.has('death_before_dishonor')) maxHp += 15;
    if (researchedTech.has('battle_armor')) maxHp = Math.round(maxHp * 1.25);
    if (researchedTech.has('will_of_the_emperor')) maxHp += 25;
  }
  if (unitType === 'command_squad' && researchedTech.has('uncommon_valor')) maxHp += 100;
  if (unitType === 'kasrkin' && researchedTech.has('kasrkin_armor')) maxHp = Math.round(maxHp * 1.25);
  const cloaked = unitType === 'vindicare' && researchedTech.has('infiltration_research');

  const id = world.createEntity([TAG.soldier]);
  world.add(id, 'soldier', {
    squadId,
    formIdx,
    unitType: unitType || null,
    hp: maxHp,
    maxHp,
    attackCooldown: 0,
    attackRate: weaponProfile ? 1 / weaponProfile.refire : 2.4 + Math.random() * 0.8,
    armorClass: unitConfig?.armor || DEFAULT_ARMOR_CLASS,
    weapon: unitConfig?.weapon || null,
    walkTime: Math.random() * Math.PI * 2,
    flashTimer: 0,
    shootTimer: 0,
    meleeTimer: 0,
    hitReactionTimer: 0,
    hitReactionAnim: null,
    _hitReactionSide: null,
    scatter: null,
    stagger: 0,
    flyAlt: 0,
    _flyStage: 0,
    isGrenadier,
    isSuperior,
    projectileType: null,
    moveSpeed: (5.8 + Math.random() * 2.2) * movementSpeedMultiplier,
    idlePhase: Math.random() * Math.PI * 2,
    idleYawOffset: (Math.random() - 0.5) * 0.08,
    cloaked,
    revealTimer: 0,
    damageMult: isGuardsman && researchedTech.has('weapon_specialization')
      ? 1.5
      : (unitType === 'ogryn' && researchedTech.has('powered_bayonets') ? 1.25 : 1),
  });

  const mesh = makeSoldierMesh(squadComponent.team, {
    soldierEntityId: id,
    squadEntityId: squadId,
    unitType: unitType || undefined,
    faction: soldierFaction,
  });
  if (isGrenadier) {
    _applyGrenadierVisuals(mesh);
  } else if (squadComponent.projectileType === 'plasma' || squadComponent.projectileType === 'plasma-final' || squadComponent.projectileType === PLASMA_CLOUD_PUFF) {
    _applyPlasmaVisuals(mesh);
  }
  if (isSuperior) {
    _applySuperiorVisuals(mesh);
  }

  const hpBar = makeHpBar(1.2, squadComponent.team);
  hpBar.visible = false;
  let reloadBar: any = null;
  if (isGrenadier) {
    reloadBar = _makeReloadBar(squadComponent.team);
  }

  world.add(id, 'mesh', { root: mesh, hpBar, reloadBar });
  return id;
}

export function createSquadEntity(world: any, team: any, cx: number, cz: number, initSize = 5, unitType: any = null, faction: any = null) {
  if (unitType === 'command_squad') {
    initSize = 3 + Math.floor(Math.random() * 3);
  }
  const id = world.createEntity([TAG.squad]);
  const initFacing = new THREE.Vector3(0, 0, team === PLAYER ? 1 : -1);
  const factionKey = resolveFactionKey(faction, team === PLAYER ? playerFaction : enemyFaction);
  const unitConfig: any = findUnitConfig(factionKey, unitType);
  const weaponProfile = getWeapon(unitConfig?.weapon);
  let attackRange = unitConfig?.attackRange ?? weaponProfile?.range ?? (22 + Math.random() * 4);
  let speed = (5.5 + Math.random() * 1.5) * (unitConfig?.movementSpeedMultiplier ?? 1);
  const isGuardsman = !unitType || unitType === 'guardsmen';
  if (isGuardsman && researchedTech.has('satellite_targeting')) attackRange *= 1.2;
  if (unitType === 'kasrkin' && researchedTech.has('genetic_enhancement')) speed *= 1.33;
  const sergeantConfig = (FACTIONS[factionKey]?.units || []).find((u) => u.name === 'sergeant') || null;
  world.add(id, 'squad', {
    team,
    faction: factionKey,
    unitType: unitType || null,
    position: new THREE.Vector3(cx, 0, cz),
    facing: initFacing.clone(),
    visualFacing: initFacing.clone(),
    speed,
    attackRange,
    detectionRange: 40,
    maxSquadSize: unitConfig?.squadSize ?? SQUAD_MAX,
    reinforceCost: unitConfig?.reinforceCost ?? COSTS.reinforce,
    reinforceTime: unitConfig?.reinforceTime ?? 7,
    sergeantCost: sergeantConfig?.reinforceCost ?? sergeantConfig?.cost ?? unitConfig?.reinforceCost ?? COSTS.reinforce,
    sergeantTime: sergeantConfig?.reinforceTime ?? sergeantConfig?.time ?? unitConfig?.reinforceTime ?? 7,
    grenadeCd: 0,
    grenadeReloadTime: 3,
    idleTime: 0,
    reinforceQueue: [],
    reinforceProgress: 0,
    grenadeQueue: [],
    grenadeProgress: 0,
    plasmaQueue: [],
    plasmaProgress: 0,
    moveOrder: null,
    stopped: false,
    flyOrder: null,
    // Explicit right-click capture order: strategicPoint id, or null. Only
    // squads carrying this order tick capture progress (proximity alone
    // never caps). Cleared by new orders, Q stop, attack/fly orders.
    captureOrderSpId: null,
    capturingSpId: null,
    selected: false,
    autoChase: team !== PLAYER,
    projectileType: unitType === 'dark_reaper' ? 'reaper' : (factionKey === 'tau' ? 'blaster' : (factionKey === 'necrons' ? 'lightning' : (team !== PLAYER ? 'bullet' : 'beam'))),
    soldiers: Array(SQUAD_MAX).fill(null),
    forcedTarget: null,
    forcedSoldierId: null,
    autoReinforce: false,
  });
  const hpBar = makeHpBar(2.8, team);
  hpBar.visible = false;
  const reinBar = makeHpBar(2.8, team);
  reinBar._fg.material.color = new THREE.Color(0.1, 0.9, 1.0);
  reinBar.visible = false;

  const grenadeSetupBar = makeHpBar(2.8, team);
  grenadeSetupBar._fg.material.color = new THREE.Color(1.0, 0.55, 0.0);
  grenadeSetupBar._bg.material.color = new THREE.Color(0.18, 0.10, 0.0);
  grenadeSetupBar.visible = false;
  world.add(id, 'mesh', { hpBar, reinBar, grenadeSetupBar });

  const squadComponent = world.get(id, 'squad');
  for (let i = 1; i <= initSize; i++) {
    if (i >= SQUAD_MAX) {
      break;
    }
    const soldierEntityId = createSoldierEntity(world, id, i, unitType);
    const formation = FORMATION[i];
    const soldierMesh = world.get(soldierEntityId, 'mesh').root;
    soldierMesh.position.set(cx + formation.x * SQUAD_SCATTER, 0, cz + formation.z * SQUAD_SCATTER);
    childMeshes(soldierMesh).forEach((mesh) => {
      if (mesh.userData) {
        mesh.userData.squadEntityId = id;
      }
    });
    squadComponent.soldiers[i] = soldierEntityId;
  }
  return id;
}

export function createBuilderEntity(world: any, x: number, z: number, team: any = PLAYER, faction: any = null) {
  const id = world.createEntity([TAG.builder]);
  const factionKey = resolveFactionKey(faction, team === PLAYER ? playerFaction : enemyFaction);
  world.add(id, 'builder', {
    team,
    faction: factionKey,
    hp: 60,
    maxHp: 60,
    speed: 7,
    moveTarget: null,
    buildTarget: null,
    buildTargetSP: null,
    buildProgress: 0,
    isBuilding: false,
    walkTime: 0,
    selected: false,
    stance: 'stand',
    attackMove: false,
    meleeOrder: false,
    repairTarget: null,
    attackCd: 0,
    attackRange: 12,
    attackDamage: 8,
    repairPulseT: 0,
  });
  const mesh = makeSoldierMesh('builder', { builderEntityId: id, team, faction: factionKey });
  const bodyMat = (mesh as any)._bodyMaterial;
  if (bodyMat) {
    bodyMat.color = new THREE.Color(1, 0.67, 0.13);
    bodyMat.emissive = new THREE.Color(0.27, 0.13, 0);
  }
  mesh.position.set(x, 0, z);
  const hpBar = makeHpBar(1.2, team);
  hpBar.visible = false;
  world.add(id, 'mesh', { root: mesh, hpBar });
  return id;
}

export function _attachScaffoldSelRing(root: any, type: string) {
  const _scaffoldRingSizes = {
    barracks: 3.5,
    infantry_command: 3.5,
    tower: 2.5,
    towerBase: 2.5,
    thermoGen: 3.5,
    gunTurret: 2.25,
    apc: 2.5,
    mechanized: 5,
    airfield: 8.0,
  };
  const size = _scaffoldRingSizes[type as keyof typeof _scaffoldRingSizes] ?? 3.0;
  const ring = makeSquareSelRing(root, size, 0.13, 0.06);
  root._ring = ring;
  root._ringMaterial = ring._material;
  ring._material.opacity = 0;
  ring._material.transparent = true;
}

export function makeConstructBar(width: number) {
  const grp: any = mkGroup(`cbar_${Math.random()}`);
  const backgroundPlane = mkPlane('cbarbg', width, 0.16, true);
  backgroundPlane.rotation.x = -Math.PI / 2;
  grp.add(backgroundPlane);
  const bgMaterial = new THREE.MeshBasicMaterial();
  bgMaterial.color = new THREE.Color(0.12, 0.10, 0.02);
  backgroundPlane.material = bgMaterial;
  const foregroundPlane = mkPlane('cbarfg', width, 0.16, true);
  foregroundPlane.rotation.x = -Math.PI / 2;
  foregroundPlane.position.y = 0.007;
  grp.add(foregroundPlane);
  const fgMaterial = new THREE.MeshBasicMaterial();
  fgMaterial.color = new THREE.Color(1.0, 0.75, 0.1);
  foregroundPlane.material = fgMaterial;
  grp._fg = foregroundPlane;
  grp._bg = backgroundPlane;
  grp._width = width;
  grp.visible = false;
  return grp;
}

export function _finishConstruction(world: any, id: any, comp: any, compKey: any) {
  const meshComponent = world.get(id, 'mesh');
  if (!meshComponent || meshComponent._realMeshBuilt) {
    return;
  }
  if (meshComponent.scaffold) {
    childMeshes(meshComponent.scaffold).forEach((mesh) => {
      if (mesh.material) {
        (mesh.material as THREE.Material).dispose();
      }
      disposeObj(mesh);
    });
    disposeObj(meshComponent.scaffold);
    meshComponent.scaffold = null;
  }
  if (meshComponent.constructBar) {
    childMeshes(meshComponent.constructBar).forEach((mesh) => {
      if (mesh.material) {
        (mesh.material as THREE.Material).dispose();
      }
      disposeObj(mesh);
    });
    disposeObj(meshComponent.constructBar);
    meshComponent.constructBar = null;
  }
  let root: any;
  if (compKey === 'building') {
    const meta = { buildingEntityId: id, faction: comp.faction };
    if (meshComponent._meshFactory) {
      root = meshComponent._meshFactory();
    } else {
      root = (comp.type === 'barracks' || comp.type === 'infantry_command')
        ? makeBarracksMesh(comp.position, comp.team || PLAYER, meta)
        : makeHQMesh(comp.position, comp.team || PLAYER, meta);
    }
  } else {
    root = meshComponent._meshFactory ? meshComponent._meshFactory() : null;
  }
  if (!root) {
    return;
  }
  meshComponent.root = root;
  meshComponent._realMeshBuilt = true;
  comp.constructing = false;
  if (meshComponent.hpBar) {
    meshComponent.hpBar.visible = true;
  }
  updateHUD();
}

export function createBuildingEntity(world: any, type: any, position: any, team: any = PLAYER, faction: any = null) {
  const id = world.createEntity([TAG.building]);
  const factionKey = resolveFactionKey(faction, team === PLAYER ? playerFaction : enemyFaction);
  const structureConfig = FACTIONS[factionKey]?.structures?.find((s) => s.type === type);
  world.add(id, 'building', {
    type,
    position: position.clone(),
    team,
    faction: factionKey,
    hp: type === 'hq' ? 2000 : type === 'mechanized' ? 800 : 400,
    maxHp: type === 'hq' ? 2000 : type === 'mechanized' ? 800 : 400,
    queue: [],
    production: structureConfig?.production || [],
    researchQueue: [],
    addons: [],
    tier: 1,
    selected: false,
    rallyPoint: new THREE.Vector3(position.x, 0, position.z + 10),
    constructing: true,
    constructProgress: 0,
    constructTime: type === 'hq' ? 0 : (type === 'barracks' || type === 'infantry_command' || type === 'mechanized' ? 8 : 5),
  });
  const scaffold = makeGhostMesh(type, position, { buildingEntityId: id, faction: factionKey }, team);
  _attachScaffoldSelRing(scaffold, type);
  const constructBar = makeConstructBar(type === 'hq' ? 8 : 4);
  const hpBar = makeHpBar(type === 'hq' ? 8 : 4, team);
  hpBar.visible = false;
  const meta = { buildingEntityId: id, faction: factionKey };
  childMeshes(scaffold).forEach((mesh) => {
    if (mesh.userData === undefined || mesh.userData === null) {
      mesh.userData = meta;
    }
    if (!mesh._isSelRingBar) {
      mesh.userData.pickable = true;
    }
  });
  world.add(id, 'mesh', {
    root: scaffold,
    scaffold,
    constructBar,
    hpBar,
    _realMeshBuilt: false,
    _meshFactory: type === 'hq'
      ? (() => makeHQMesh(position, team, meta))
      : ((type === 'barracks' || type === 'infantry_command') ? (() => makeBarracksMesh(position, team, meta)) : (type === 'mechanized' ? (() => makeApcMesh(position, team, meta)) : (type === 'greater_sacrificial_circle' ? (() => makeConfigStructureMesh(type, position, team, meta)) : null))),
  });

  if (type === 'hq') {
    const comp = world.get(id, 'building');
    comp.constructing = false;
    comp.constructProgress = 1.0;
    setTimeout(() => _finishConstruction(world, id, comp, 'building'), 100);
  }

  return id;
}

export function createStructureEntity(world: any, type: any, position: any, faction: any = null, team: any = PLAYER) {
  const id = world.createEntity([TAG.structure]);
  const factionKey = resolveFactionKey(faction, playerFaction);
  const meta = { structureEntityId: id, faction: factionKey };
  let hp = 200;
  let attackRange = 0;
  let attackRate = 0;
  let _meshFactory: any;
  if (type === 'tower' || type === 'turret') {
    hp = 300;
    attackRange = 28;
    attackRate = 0.8;
    _meshFactory = () => makeTowerMesh(position, team, meta);
  } else if (type === 'towerBase') {
    hp = 350;
    attackRange = 32;
    attackRate = 1.2;
    _meshFactory = () => {
      const result = makeTowerBaseMesh(position, team, meta);
      for (const spId of world.query('strategicPoint')) {
        const strategicPoint = world.get(spId, 'strategicPoint');
        if (strategicPoint && strategicPoint.position.distanceTo(position) < 2) {
          strategicPoint.hasTowerBase = true;
          break;
        }
      }
      return result;
    };
  } else if (type === 'gunTurret') {
    hp = 280;
    attackRange = 22;
    attackRate = 2.5;
    _meshFactory = () => makeGunTurretMesh(position, team, meta);
  } else {
    hp = type === 'thermo_generator' || type === 'plasma_generator' ? 260 : 200;
    _meshFactory = () => makeConfigStructureMesh(type, position, team, meta);
  }
  const scaffold = makeGhostMesh(type, position, meta);
  _attachScaffoldSelRing(scaffold, type);
  childMeshes(scaffold).forEach((mesh) => {
    if (!mesh.userData) {
      mesh.userData = meta;
    }
    if (!mesh._isSelRingBar) {
      mesh.userData.pickable = true;
    }
  });
  const constructBar = makeConstructBar(4);
  world.add(id, 'structure', {
    type,
    team,
    faction: factionKey,
    position: position.clone(),
    hp,
    maxHp: hp,
    attackRange,
    attackRate,
    attackCd: 0,
    reqTimer: 0,
    energyTimer: 0,
    pulseT: 0,
    selected: false,
    constructing: true,
    constructProgress: 0,
    constructTime: type === 'tower' || type === 'towerBase' ? 7 : type === 'gunTurret' ? 6 : 5,
    researchQueue: [],
  });
  const hpBar = makeHpBar(type === 'tower' || type === 'towerBase' ? 3.5 : type === 'gunTurret' ? 3 : 3, team);
  hpBar.visible = false;
  world.add(id, 'mesh', { root: scaffold, scaffold, constructBar, hpBar, _realMeshBuilt: false, _meshFactory });
  return id;
}

export function createStrategicPointEntity(world: any, x: number, z: number, kind: string = 'point') {
  const id = world.createEntity([TAG.strategicPoint]);
  const viz = makeStrategicPointMesh(x, z, kind);
  viz.group.traverse((child: any) => {
    if (child.isMesh) {
      child.userData.strategicPointEntityId = id;
    }
  });
  world.add(id, 'strategicPoint', {
    kind,
    position: new THREE.Vector3(x, 0, z),
    owner: null,
    faction: null,
    captureProgress: 0,
    // Unowned progress drains toward 0 the moment capping stops.
    // Owned points (|progress| === 1) are exempt.
    // |progress| latched when the planter finished flag_plant_2 (null until
    // then): the assembly rise scrubs from this mark to full capture.
    raiseFrom: null,
    // Open/close gate for a capture order that is still on its way: elapsed
    // wait, whether the planter has started approaching, and his last
    // distance (to detect the distance actually shrinking).
    _openWaited: 0,
    _openApproaching: false,
    _openLastDistance: null,
    // Covers the ~7-8 wide point/relic models so stands and clicks on the
    // model register; the guard ring (CAPTURE_GUARD_DISTANCE) sits outside it.
    captureRadius: 4.5,
    hasListeningPost: false,
    hasTowerBase: false,
    lpTier: 0,
    researchQueue: [],
    reqTimer: 0,
    lpMesh: null,
  });
  world.add(id, 'mesh', { ...viz, root: viz.group });
  return id;
}

export function createBulletEntity(world: any, ownerMeshPos: any, ownerTeam: any, ownerEntityRef: any, targetSoldierId: any, damageMult = 1, damageOverride: number | null = null) {
  const id = world.createEntity([TAG.bullet]);
  const targetMesh = world.get(targetSoldierId, 'mesh')?.root;
  if (!targetMesh) {
    return null;
  }
  const ownerPosition = ownerMeshPos;
  const targetPosition = targetMesh.position;
  const dx = targetPosition.x - ownerPosition.x;
  const dy = targetPosition.y - ownerPosition.y;
  const dz = targetPosition.z - ownerPosition.z;
  const length = Math.hypot(dx, dy, dz) || 1;
  const speed = 28 + Math.random() * 6;
  const mesh = mkBox('bullet', 0.04, 0.04, 0.5);
  mesh.position.copy(ownerPosition);
  mesh.position.y = 1.05;
  const bulletMaterial = new THREE.MeshStandardMaterial();
  bulletMaterial.color = new THREE.Color(0.87, 0.67, 0);
  bulletMaterial.emissive = new THREE.Color(0.53, 0.4, 0);
  mesh.material = bulletMaterial;
  world.add(id, 'bullet', {
    team: ownerTeam,
    targetId: targetSoldierId,
    ownerRef: ownerEntityRef,
    vx: (dx / length) * speed,
    vy: ((dy + 0.02) / length) * speed,
    vz: (dz / length) * speed,
    damage: damageOverride ?? (8 + Math.random() * 5) * damageMult,
    age: 0,
  });
  world.add(id, 'mesh', { root: mesh });
  return id;
}

export function createPlasmaBulletEntity(world: any, ownerMeshPos: any, ownerTeam: any, ownerEntityRef: any, targetSoldierId: any, damageMult = 1, damageOverride: number | null = null) {
  const id = world.createEntity([TAG.bullet]);
  const targetMesh = world.get(targetSoldierId, 'mesh')?.root;
  if (!targetMesh) {
    return null;
  }
  const ownerPosition = ownerMeshPos;
  const targetPosition = targetMesh.position;
  const dx = targetPosition.x - ownerPosition.x;
  const dy = targetPosition.y - ownerPosition.y;
  const dz = targetPosition.z - ownerPosition.z;
  const length = Math.hypot(dx, dy, dz) || 1;
  const speed = 32 + Math.random() * 8;
  const mesh = makePlasmaBoltMesh();
  mesh.position.copy(ownerPosition);
  mesh.position.y = 1.05;
  world.add(id, 'bullet', {
    team: ownerTeam,
    targetId: targetSoldierId,
    ownerRef: ownerEntityRef,
    projectileType: 'plasma',
    vx: (dx / length) * speed,
    vy: ((dy + 0.02) / length) * speed,
    vz: (dz / length) * speed,
    rx: (Math.random() - 0.5) * 8,
    ry: (Math.random() - 0.5) * 8,
    rz: (Math.random() - 0.5) * 8,
    damage: damageOverride ?? (14 + Math.random() * 6) * damageMult,
    age: 0,
  });
  world.add(id, 'mesh', { root: mesh });
  return id;
}

// Plasma Final: same plasma bolt pipeline, but a heavier warhead — bigger
// bolt, harder hit. Built on createPlasmaBulletEntity so the mesh, flight
// and system handling stay identical.
export function createPlasmaFinalBulletEntity(world: any, ownerMeshPos: any, ownerTeam: any, ownerEntityRef: any, targetSoldierId: any, damageMult = 1, damageOverride: number | null = null) {
  const id = createPlasmaBulletEntity(world, ownerMeshPos, ownerTeam, ownerEntityRef, targetSoldierId, damageMult, damageOverride);
  if (id === null) {
    return null;
  }
  const bullet = world.get(id, 'bullet');
  bullet.projectileType = 'plasma-final';
  if (damageOverride === null) {
    bullet.damage = (20 + Math.random() * 8) * damageMult;
  }
  // Swap the plain bolt for the plasma-fx dressed one (same contract for
  // systemPlasmaBullet: filaments/tendrils/arcs/crackle).
  const oldRoot = world.get(id, 'mesh')?.root;
  const finalRoot = makePlasmaFinalBoltMesh();
  finalRoot.position.copy(oldRoot ? oldRoot.position : ownerMeshPos);
  if (oldRoot) {
    disposeObj(oldRoot);
  }
  world.get(id, 'mesh').root = finalRoot;
  return id;
}

/** Seven compact projectiles share one plasma shot's damage budget. */
export function createPlasmaCloudPuffVolley(world: any, origin: THREE.Vector3, team: string, ownerId: number, targetId: number, damageMult = 1, damageOverride: number | null = null): number[] {
  const target = world.get(targetId, 'mesh')?.root;
  if (!target || !world.has(targetId, 'soldier')) return [];
  const aim = target.getWorldPosition(new THREE.Vector3());
  aim.y += 1;
  const direction = aim.clone().sub(origin).normalize();
  const right = new THREE.Vector3(direction.z, 0, -direction.x);
  if (right.lengthSq() < 1e-8) right.set(1, 0, 0);
  right.normalize();
  const up = new THREE.Vector3().crossVectors(direction, right).normalize();
  const damage = (damageOverride ?? (14 + Math.random() * 6) * damageMult) / PLASMA_CLOUD_PUFF_COUNT;
  const ids: number[] = [];
  const shotLength = origin.distanceTo(aim);
  for (let index = 0; index < PLASMA_CLOUD_PUFF_COUNT; index++) {
    const id = world.createEntity([TAG.bullet]);
    const mesh = makePlasmaCloudPuffMesh(index);
    const angle = index * Math.PI * 2 / PLASMA_CLOUD_PUFF_COUNT;
    mesh.position.copy(origin)
      .addScaledVector(direction, plasmaCloudPuffOffset(index, shotLength))
      .addScaledVector(right, Math.cos(angle) * 0.045).addScaledVector(up, Math.sin(angle) * 0.045);
    mesh.lookAt(aim);
    if (index === 0) attachPlasmaCloudBlaster(mesh, mesh.position.distanceTo(aim));
    // One shared speed keeps the arranged cluster intact for the whole flight.
    const velocity = aim.clone().sub(mesh.position).normalize().multiplyScalar(35);
    world.add(id, 'bullet', {
      team, targetId, ownerRef: ownerId, projectileType: PLASMA_CLOUD_PUFF, puffVariant: index,
      vx: velocity.x, vy: velocity.y, vz: velocity.z, damage, age: 0, travelled: 0,
    });
    world.add(id, 'mesh', { root: mesh });
    scene?.add(mesh);
    ids.push(id);
  }
  return ids;
}

export function createBlasterBulletEntity(world: any, ownerMeshPos: any, ownerTeam: any, ownerEntityRef: any, targetSoldierId: any, damageMult = 1, damageOverride: number | null = null) {
  const id = world.createEntity([TAG.bullet]);
  const targetMesh = world.get(targetSoldierId, 'mesh')?.root;
  if (!targetMesh) {
    return null;
  }
  const ownerPosition = ownerMeshPos;
  const targetPosition = targetMesh.position;
  const dx = targetPosition.x - ownerPosition.x;
  const dy = targetPosition.y - ownerPosition.y;
  const dz = targetPosition.z - ownerPosition.z;
  const length = Math.hypot(dx, dy, dz) || 1;
  const speed = 30 + Math.random() * 4;
  const mesh = makeBlasterBoltMesh();
  mesh.position.copy(ownerPosition);
  mesh.position.y = 1.05;
  world.add(id, 'bullet', {
    team: ownerTeam,
    targetId: targetSoldierId,
    ownerRef: ownerEntityRef,
    projectileType: 'blaster',
    vx: (dx / length) * speed,
    vy: ((dy + 0.02) / length) * speed,
    vz: (dz / length) * speed,
    damage: damageOverride ?? (11 + Math.random() * 4) * damageMult,
    age: 0,
  });
  world.add(id, 'mesh', { root: mesh });
  return id;
}

export function createReaperBulletEntity(world: any, ownerMeshPos: any, ownerTeam: any, ownerEntityRef: any, targetSoldierId: any, damageMult = 1, damageOverride: number | null = null) {
  const id = world.createEntity([TAG.bullet]);
  const targetMesh = world.get(targetSoldierId, 'mesh')?.root;
  if (!targetMesh) {
    return null;
  }
  const ownerPosition = ownerMeshPos;
  const targetPosition = targetMesh.position;
  const dx = targetPosition.x - ownerPosition.x;
  const dy = targetPosition.y - ownerPosition.y;
  const dz = targetPosition.z - ownerPosition.z;
  const length = Math.hypot(dx, dy, dz) || 1;
  const speed = 26 + Math.random() * 4;
  const mesh = makeReaperBoltMesh();
  mesh.position.copy(ownerPosition);
  mesh.position.y = 1.05;
  world.add(id, 'bullet', {
    team: ownerTeam,
    targetId: targetSoldierId,
    ownerRef: ownerEntityRef,
    projectileType: 'reaper',
    vx: (dx / length) * speed,
    vy: ((dy + 0.02) / length) * speed,
    vz: (dz / length) * speed,
    damage: damageOverride ?? (13 + Math.random() * 5) * damageMult,
    age: 0,
  });
  world.add(id, 'mesh', { root: mesh });
  return id;
}

export function createApcEntity(world: any, position: any, faction: any = null, team: any = PLAYER) {
  const id = world.createEntity(['apc']);
  const factionKey = resolveFactionKey(faction, playerFaction);
  world.add(id, 'apc', {
    team,
    faction: factionKey,
    position: position.clone(),
    hp: 500,
    maxHp: 500,
    speed: 4.5,
    attackRange: 30,
    attackCd: 0,
    attackRate: 1.5,
    moveOrder: null,
    selected: false,
    detectionRange: 38,
    laserPulse: 0,
    passengers: [],
    maxPassengers: 2,
    playerControlled: true,
    projectileType: 'laser',
    queue: [],
  });
  const meta = { apcEntityId: id, faction: factionKey };
  const root = makeApcMesh(position, team, meta);
  const hpBar = makeHpBar(3, team);
  hpBar.visible = false;
  world.add(id, 'mesh', { root, hpBar });
  return id;
}

export function createVehicleEntity(world: any, team: any, name: any, model: any, icon: any, position: any, projectileType: any = 'laser', faction: any = null) {
  const id = world.createEntity(['vehicle']);
  const factionKey = resolveFactionKey(faction, team === PLAYER ? playerFaction : enemyFaction);
  world.add(id, 'vehicle', {
    team,
    faction: factionKey,
    name,
    model,
    icon,
    position: position.clone(),
    hp: 500,
    maxHp: 500,
    speed: 4.5,
    attackRange: 30,
    attackCd: 0,
    attackRate: 1.5,
    moveOrder: null,
    selected: false,
    detectionRange: 38,
    laserPulse: 0,
    projectileType,
  });
  const meta = { vehicleEntityId: id, faction: factionKey };
  const root = makeVehicleMesh(model, position, team, meta);
  const hpBar = makeHpBar(3, team);
  hpBar.visible = false;
  world.add(id, 'mesh', { root, hpBar });
  return id;
}

export function createLaserBulletEntity(world: any, ownerPos: any, ownerTeam: any, ownerId: any, targetSoldierId: any, damageMult = 1, damageOverride: number | null = null, exactOrigin = false) {
  const id = world.createEntity(['laserBullet']);
  const targetMesh = world.get(targetSoldierId, 'mesh')?.root;
  if (!targetMesh) {
    return null;
  }
  const ownerPosition = ownerPos.clone();
  if (!exactOrigin) ownerPosition.y = 2.3;
  const targetPosition = targetMesh.position.clone();
  targetPosition.y = 1;
  const dx = targetPosition.x - ownerPosition.x;
  const dy = targetPosition.y - ownerPosition.y;
  const dz = targetPosition.z - ownerPosition.z;
  const length = Math.hypot(dx, dy, dz) || 1;
  const speed = 65;
  const hellgun = world.get(ownerId, 'soldier')?.weapon === 'hellgun';
  const mesh = hellgun ? makeHellgunLaserMesh(8, 'z') : mkBox('laser', 0.02, 0.02, 8.0);
  mesh.position.copy(ownerPosition);
  mesh.rotation.y = Math.atan2(dx, dz);
  if (exactOrigin) {
    // Anchor the back of the streak at the muzzle, with no geometry behind it.
    if (!hellgun) mesh.geometry.translate(0, 0, 4);
    mesh.lookAt(targetPosition);
  }
  if (!hellgun) {
    const laserMaterial = new THREE.MeshBasicMaterial();
    laserMaterial.color = new THREE.Color(1, 0, 0);
    mesh.material = laserMaterial;
  }
  world.add(id, 'laserBullet', {
    team: ownerTeam,
    targetId: targetSoldierId,
    ownerRef: ownerId,
    exactOrigin,
    projectileType: hellgun ? HELLGUN_LASER_NAME : 'laser',
    vx: (dx / length) * speed,
    vy: (dy / length) * speed,
    vz: (dz / length) * speed,
    damage: damageOverride ?? (12 + Math.random() * 6) * damageMult,
    age: 0,
  });
  world.add(id, 'mesh', { root: mesh });
  return id;
}

export function createBeamEntity(world: any, ownerPos: any, ownerTeam: any, ownerId: any, targetSoldierId: any, damageMult = 1, exactY = false, damageOverride: number | null = null) {
  const id = world.createEntity(['beam']);
  const targetMesh = world.get(targetSoldierId, 'mesh')?.root;
  if (!targetMesh) {
    return null;
  }
  const startPos = ownerPos.clone();
  // Squad fire passes feet positions (legacy chest height); FPS passes an
  // exact muzzle point that must survive untouched.
  if (!exactY) startPos.y = 1.05;
  const endPos = targetMesh.position.clone();
  endPos.y = 1.0;
  const dx = endPos.x - startPos.x;
  const dy = endPos.y - startPos.y;
  const dz = endPos.z - startPos.z;
  const length = Math.hypot(dx, dy, dz) || 1;
  const weapon = world.get(ownerId, 'soldier')?.weapon;
  const hellgun = weapon === 'hellgun';
  const lasgun = weapon === 'lasgun';
  const mesh = hellgun ? makeHellgunLaserMesh(length)
    : lasgun ? makeLasgunLaserMesh(length) : mkCylinder('beam', 0.02, 0.05, length, 10);
  const from = new THREE.Vector3(dx, dy, dz).normalize();
  const quat = new THREE.Quaternion();
  quat.setFromUnitVectors(new THREE.Vector3(0, 1, 0), from);
  mesh.quaternion.copy(quat);
  mesh.position.copy(startPos.clone().add(endPos).multiplyScalar(0.5));
  if (!hellgun && !lasgun) {
    const beamMaterial = new THREE.MeshBasicMaterial();
    beamMaterial.color = new THREE.Color(1, 92 / 255, 92 / 255);
    beamMaterial.opacity = 0.92;
    beamMaterial.transparent = true;
    mesh.material = beamMaterial;
  }
  const damage = damageOverride ?? (10 + Math.random() * 8) * damageMult;
  world.add(id, 'beam', {
    length,
    team: ownerTeam,
    targetId: targetSoldierId,
    ownerRef: ownerId,
    projectileType: hellgun ? HELLGUN_LASER_NAME : lasgun ? LASGUN_LASER_NAME : 'beam',
    age: 0,
    damage,
    hit: false,
  });
  world.add(id, 'mesh', { root: mesh });
  return id;
}

// How far past the muzzle-tip marker the shot origin extends along the
// barrel axis, so the bolt visually overlaps the gun tip instead of
// stopping just short of it.
const MUZZLE_TIP_EXTENSION = 0.5;

// Muzzle world position for projectiles: prefers gun-tip markers
// (necron gauss_flayer: marker_gun_muzzle_ctr_out), extended slightly along
// the barrel axis; falls back to chest height above the soldier's feet when
// the model has no muzzle nodes.
export function getSoldierMuzzlePos(world: any, soldierId: any, weapon: string | null = null) {
  const root = world.get(soldierId, 'mesh')?.root;
  const fallback = root ? root.position.clone() : new THREE.Vector3();
  fallback.y += 1.05;
  if (!root) {
    return fallback;
  }
  if (weapon === PLASMA_CLOUD_PUFF) {
    const muzzle = root.getObjectByName('marker_plasma_muzzle');
    return muzzle ? muzzle.getWorldPosition(new THREE.Vector3()) : fallback;
  }
  if (weapon === 'hellgun') {
    // kasrkin.glb names the hellgun's barrel marker "lasgun". It rides
    // bone_ig_hand_weapon_r, so world position follows the animated gun.
    // Do not select the plasma/flamer markers present in the same model,
    // or apply the extra extension used by Necron gun-tip markers.
    const muzzle = root.getObjectByName('marker_hellgun_muzzle')
      || root.getObjectByName('marker_lasgun_muzzle');
    return muzzle ? muzzle.getWorldPosition(new THREE.Vector3()) : fallback;
  }
  let best: any = null;
  let bestScore = Infinity;
  let base: any = null;
  descendants(root).forEach((child) => {
    const name = String(child.name || '').toLowerCase();
    if (name.includes('gun') && name.includes('base') && !base) {
      base = child;
    }
    if (!name.includes('muzzle')) {
      return;
    }
    let score = 2;
    if (name.includes('out') || name.includes('tip')) {
      score = 0;
    } else if (name.includes('end')) {
      score = 1;
    }
    if (score < bestScore) {
      bestScore = score;
      best = child;
    }
  });
  if (!best) {
    return fallback;
  }
  const tipPos = best.getWorldPosition(new THREE.Vector3());
  if (base) {
    const basePos = base.getWorldPosition(new THREE.Vector3());
    const barrelDir = tipPos.clone().sub(basePos);
    if (barrelDir.lengthSq() > 1e-8) {
      barrelDir.normalize();
      tipPos.addScaledVector(barrelDir, MUZZLE_TIP_EXTENSION);
    }
  }
  return tipPos;
}

export function createLightningEntity(world: any, ownerPos: any, ownerTeam: any, ownerId: any, targetSoldierId: any, damageMult = 1, damageOverride: number | null = null) {
  const id = world.createEntity(['beam']);
  const targetMesh = world.get(targetSoldierId, 'mesh')?.root;
  if (!targetMesh) {
    return null;
  }
  const startPos = ownerPos.clone();
  const endPos = targetMesh.position.clone();
  endPos.y += 1.0;
  const lightning = new NecronLightning(scene, {});
  lightning.fire(startPos, endPos);
  const damage = damageOverride ?? (10 + Math.random() * 8) * damageMult;
  world.add(id, 'beam', {
    team: ownerTeam,
    targetId: targetSoldierId,
    ownerRef: ownerId,
    age: 0,
    damage,
    hit: false,
  });
  world.add(id, 'mesh', { root: lightning.root, lightning });
  return id;
}

export function createAirfieldEntity(world: any, position: any, faction: any = null, team: any = PLAYER) {
  const id = world.createEntity(['airfield']);
  const factionKey = resolveFactionKey(faction, playerFaction);
  const meta = { airfieldEntityId: id, faction: factionKey };
  const healthPoints = 500;
  world.add(id, 'airfield', {
    team,
    faction: factionKey,
    position: position.clone(),
    hp: healthPoints,
    maxHp: healthPoints,
    queue: [],
    selected: false,
    constructing: true,
    constructProgress: 0,
    constructTime: 10,
    beaconT: 0,
    rallyPoint: null,
  });
  const scaffold = makeGhostMesh('airfield', position, meta, team);
  _attachScaffoldSelRing(scaffold, 'airfield');
  const constructBar = makeConstructBar(8);
  const hpBar = makeHpBar(7, team);
  const prodBar = makeHpBar(7, team);
  hpBar.visible = false;
  world.add(id, 'mesh', {
    root: scaffold,
    scaffold,
    constructBar,
    hpBar,
    prodBar,
    _realMeshBuilt: false,
    _meshFactory: () => makeAirfieldMesh(position, team, meta),
  });
  return id;
}

export function createJetEntity(world: any, spawnPos: any, team: any = PLAYER, faction: any = null) {
  const id = world.createEntity(['jet']);
  const startAngle = Math.random() * Math.PI * 2;
  const orbitR = 28 + Math.random() * 12;
  const jetEntityId = id;
  world.add(id, 'jet', {
    team,
    faction: resolveFactionKey(faction,playerFaction),
    hp: 250,
    maxHp: 250,
    position: new THREE.Vector3(spawnPos.x, JET_ALT, spawnPos.z),
    orbitAngle: startAngle,
    orbitR,
    orbitSpeed: (JET_SPEED / orbitR),
    attackCd: 0,
    attackRate: 1.0,
    strafeCd: 0,
    strafe: null,
    bankAngle: 0,
    selected: false,
    flameT: 0,
    shootFlashT: 0,
    waitOrders: true,
    patrolMode: 'orbit',
    holdPos: new THREE.Vector3(spawnPos.x, JET_ALT, spawnPos.z),
    forcedTargetSqId: null,
  });
  const mesh = makeJetMesh(new THREE.Vector3(spawnPos.x, JET_ALT, spawnPos.z), team, { jetEntityId, faction: resolveFactionKey(faction,playerFaction) });
  const hpBar = makeHpBar(3.5, team);
  hpBar.visible = false;
  world.add(id, 'mesh', { root: mesh, hpBar });
  return id;
}

export function createMissileEntity(world: any, pos: any, targetSqId: any) {
  const id = world.createEntity(['missile']);
  const mesh = makeMissileMesh();
  mesh.position.copy(pos);
  const team = world.get(targetSqId, 'squad')?.team === PLAYER ? 'red' : PLAYER;
  world.add(id, 'missile', {
    team,
    targetSqId,
    targetSoldierId: null,
    vx: 0,
    vy: 0,
    vz: 0,
    damage: 45,
    age: 0,
  });
  world.add(id, 'mesh', { root: mesh });
  return id;
}

export function upgradeToGrenadier(world: any, sid: any) {
  const soldierComponent = world.get(sid, 'soldier');
  if (!soldierComponent) {
    return;
  }
  soldierComponent.isGrenadier = true;
  // Older builds bumped every grenadier to 150 HP. Keep higher wiki health
  // (e.g. Guardsmen at 160) instead of lowering it on upgrade.
  if (!soldierComponent.maxHp || soldierComponent.maxHp < 150) {
    soldierComponent.hp = 150;
    soldierComponent.maxHp = 150;
  }
  const meshComponent = world.get(sid, 'mesh');
  if (meshComponent) {
    if (meshComponent.root) {
      _applyGrenadierVisuals(meshComponent.root);
    }
    meshComponent.reloadBar = _makeReloadBar(PLAYER);
  }
}

export function upgradeToPlasma(world: any, sid: any) {
  const soldierComponent = world.get(sid, 'soldier');
  if (!soldierComponent) {
    return;
  }
  soldierComponent.projectileType = 'plasma';
  const meshComponent = world.get(sid, 'mesh');
  if (meshComponent?.root) {
    _applyPlasmaVisuals(meshComponent.root);
  }
}

export function createGrenadeEntity(w: any, ownerSoldierId: any, targetPos: any) {
  const id = w.createEntity([TAG.grenade]);
  const ownerMesh = w.get(ownerSoldierId, 'mesh')?.root;
  if (!ownerMesh) {
    return null;
  }
  const ownerSol = w.get(ownerSoldierId, 'soldier');

  const mesh = mkSphere('grenade', 0.25, 8);
  mesh.position.copy(ownerMesh.position);
  mesh.position.y = 1.2;
  const grenadeMaterial = new THREE.MeshStandardMaterial();
  grenadeMaterial.color = new THREE.Color(0.18, 0.18, 0.18);
  grenadeMaterial.emissive = new THREE.Color(0.08, 0.08, 0.08);
  mesh.material = grenadeMaterial;

  const deltaX = targetPos.x - mesh.position.x;
  const deltaZ = targetPos.z - mesh.position.z;
  const distance = Math.hypot(deltaX, deltaZ) || 1;
  const gravity = 16;
  const speed = Math.sqrt(distance * gravity);
  const maxSpeed = 26;
  const scale = Math.min(1, maxSpeed / Math.sqrt(speed * 0.707 * speed * 0.707 * 2));

  w.add(id, 'grenade', {
    team: ownerSol.squadId ? w.get(ownerSol.squadId, 'squad')?.team : PLAYER,
    ownerSoldierId,
    vx: (deltaX / distance) * speed * 0.707 * scale,
    vy: speed * 0.707 * scale,
    vz: (deltaZ / distance) * speed * 0.707 * scale,
    age: 0,
    blastR: 5.5,
    blastDmg: 30,
    scatterF: 9,
  });
  w.add(id, 'mesh', { root: mesh });
  return id;
}
