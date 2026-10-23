import * as THREE from 'three';

import {
  scene,
  world,
  PLAYER,
  SQUAD_MAX,
  SQUAD_SCATTER,
  FORMATION,
  TAG,
  researchedTech,
} from './scene.js';
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
  updateHpBar,
} from './meshes.js';
import { updateHUD } from './hud.js';
import { FACTIONS, playerFaction, enemyFaction, resolveFactionKey } from './factions.js';
import { NecronLightning } from './necron-lightning.js';
import { makePlasmaBoltMesh, makePlasmaFinalBoltMesh } from './plasma-bolt.js';
import { makeBlasterBoltMesh } from './blaster-bolt.js';
import { makeReaperBoltMesh } from './reaper-bolt.js';
import { mkBox, mkSphere, mkCylinder, mkPlane, mkGroup, disposeObj, childMeshes, descendants } from './three-helpers.js';

// ══════════════════════════════════════════════════════════════════════════════
//  ENTITIES
// ══════════════════════════════════════════════════════════════════════════════

export function _applySuperiorVisuals(mesh) {
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

export function _toggleMeshNode(root, name, enabled) {
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

export function _applyPlasmaVisuals(mesh) {
  if (!mesh) {
    return;
  }
  _toggleMeshNode(mesh, 'guardsmen_lasgun', false);
  _toggleMeshNode(mesh, 'guardsmen_plasma_pistol', true);
}

export function _applyGrenadierVisuals(mesh) {
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

export function applySquadWeaponVisuals(world, squadEntityId) {
  const squadComponent = world.get(squadEntityId, 'squad');
  if (!squadComponent) {
    return;
  }
  const isPlasma = squadComponent.projectileType === 'plasma' || squadComponent.projectileType === 'plasma-final';
  squadComponent.soldiers.forEach((soldierId) => {
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
    if (isPlasma) {
      _applyPlasmaVisuals(root);
    } else {
      _toggleMeshNode(root, 'guardsmen_lasgun', true);
      _toggleMeshNode(root, 'guardsmen_plasma_pistol', false);
    }
  });
}

function _makeReloadBar(teamKey) {
  const bar = makeHpBar(1.2, teamKey);
  bar._fg.material.color = new THREE.Color(1, 1, 1);
  bar._bg.material.color = new THREE.Color(0.2, 0.2, 0.2);
  return bar;
}

const COMMAND_SQUAD_COMPOSITION = ['command_squad', 'psyker', 'priest'];

function _resolveSoldierUnitType(squadUnitType, formIdx, unitType = null) {
  if (unitType) {
    return unitType;
  }
  if (squadUnitType === 'command_squad') {
    return COMMAND_SQUAD_COMPOSITION[(formIdx - 1) % COMMAND_SQUAD_COMPOSITION.length];
  }
  return squadUnitType || null;
}

export function createSoldierEntity(world, squadId, formIdx, unitType = null) {
  const squadComponent = world.get(squadId, 'squad');
  const isSuperior = (formIdx === 0);
  const isGrenadier = false;

  unitType = _resolveSoldierUnitType(squadComponent?.unitType, formIdx, unitType);
  if (isSuperior && (!squadComponent?.unitType || squadComponent.unitType === 'guardsmen')) {
    unitType = 'sergeant';
  }
  const soldierFaction = resolveFactionKey(squadComponent?.faction, squadComponent?.team === PLAYER ? playerFaction : enemyFaction);
  let unitConfig = null;
  if (unitType) {
    unitConfig = FACTIONS[soldierFaction]?.units?.find((u) => u.name === unitType) || null;
  }

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
    attackRate: 2.4 + Math.random() * 0.8,
    walkTime: Math.random() * Math.PI * 2,
    flashTimer: 0,
    shootTimer: 0,
    scatter: null,
    stagger: 0,
    flyAlt: 0,
    _flyStage: 0,
    isGrenadier,
    isSuperior,
    moveSpeed: 5.8 + Math.random() * 2.2,
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
  } else if (squadComponent.projectileType === 'plasma' || squadComponent.projectileType === 'plasma-final') {
    _applyPlasmaVisuals(mesh);
  }
  if (isSuperior) {
    _applySuperiorVisuals(mesh);
  }

  const hpBar = makeHpBar(1.2, squadComponent.team);
  let reloadBar = null;
  if (isGrenadier) {
    reloadBar = _makeReloadBar(squadComponent.team);
  }

  world.add(id, 'mesh', { root: mesh, hpBar, reloadBar });
  return id;
}

export function createSquadEntity(world, team, cx, cz, initSize = 5, unitType = null, faction = null) {
  if (unitType === 'command_squad') {
    initSize = 3 + Math.floor(Math.random() * 3);
  }
  const id = world.createEntity([TAG.squad]);
  const initFacing = new THREE.Vector3(0, 0, team === PLAYER ? 1 : -1);
  const factionKey = resolveFactionKey(faction, team === PLAYER ? playerFaction : enemyFaction);
  const unitConfig = unitType ? FACTIONS[factionKey]?.units?.find((u) => u.name === unitType) || null : null;
  let attackRange = unitConfig?.attackRange ?? (22 + Math.random() * 4);
  let speed = 5.5 + Math.random() * 1.5;
  const isGuardsman = !unitType || unitType === 'guardsmen';
  if (isGuardsman && researchedTech.has('satellite_targeting')) attackRange *= 1.2;
  if (unitType === 'kasrkin' && researchedTech.has('genetic_enhancement')) speed *= 1.33;
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
    grenadeCd: 0,
    grenadeReloadTime: 3,
    idleTime: 0,
    reinforceQueue: [],
    reinforceProgress: 0,
    grenadeQueue: [],
    grenadeProgress: 0,
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

export function createBuilderEntity(world, x, z, team = PLAYER, faction = null) {
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
  if (mesh._bodyMaterial) {
    mesh._bodyMaterial.color = new THREE.Color(1, 0.67, 0.13);
    mesh._bodyMaterial.emissive = new THREE.Color(0.27, 0.13, 0);
  }
  mesh.position.set(x, 0, z);
  world.add(id, 'mesh', { root: mesh });
  return id;
}

export function _attachScaffoldSelRing(root, type) {
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
  const size = _scaffoldRingSizes[type] ?? 3.0;
  const ring = makeSquareSelRing(root, size, 0.13, 0.06);
  root._ring = ring;
  root._ringMaterial = ring._material;
  ring._material.opacity = 0;
  ring._material.transparent = true;
}

export function makeConstructBar(width) {
  const grp = mkGroup(`cbar_${Math.random()}`);
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

export function _finishConstruction(world, id, comp, compKey) {
  const meshComponent = world.get(id, 'mesh');
  if (!meshComponent || meshComponent._realMeshBuilt) {
    return;
  }
  if (meshComponent.scaffold) {
    childMeshes(meshComponent.scaffold).forEach((mesh) => {
      if (mesh.material) {
        mesh.material.dispose();
      }
      disposeObj(mesh);
    });
    disposeObj(meshComponent.scaffold);
    meshComponent.scaffold = null;
  }
  if (meshComponent.constructBar) {
    childMeshes(meshComponent.constructBar).forEach((mesh) => {
      if (mesh.material) {
        mesh.material.dispose();
      }
      disposeObj(mesh);
    });
    disposeObj(meshComponent.constructBar);
    meshComponent.constructBar = null;
  }
  let root;
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

export function createBuildingEntity(world, type, position, team = PLAYER, faction = null) {
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

export function createStructureEntity(world, type, position, faction = null, team = PLAYER) {
  const id = world.createEntity([TAG.structure]);
  const factionKey = resolveFactionKey(faction, playerFaction);
  const meta = { structureEntityId: id, faction: factionKey };
  let hp = 200;
  let attackRange = 0;
  let attackRate = 0;
  let _meshFactory;
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
      const result = makeTowerBaseMesh(position, meta);
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

export function createStrategicPointEntity(world, x, z, kind = 'point') {
  const id = world.createEntity([TAG.strategicPoint]);
  const viz = makeStrategicPointMesh(x, z, kind);
  viz.group.traverse((child) => {
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

export function createBulletEntity(world, ownerMeshPos, ownerTeam, ownerEntityRef, targetSoldierId, damageMult = 1) {
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
    damage: (8 + Math.random() * 5) * damageMult,
    age: 0,
  });
  world.add(id, 'mesh', { root: mesh });
  return id;
}

export function createPlasmaBulletEntity(world, ownerMeshPos, ownerTeam, ownerEntityRef, targetSoldierId, damageMult = 1) {
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
    damage: (14 + Math.random() * 6) * damageMult,
    age: 0,
  });
  world.add(id, 'mesh', { root: mesh });
  return id;
}

// Plasma Final: same plasma bolt pipeline, but a heavier warhead — bigger
// bolt, harder hit. Built on createPlasmaBulletEntity so the mesh, flight
// and system handling stay identical.
export function createPlasmaFinalBulletEntity(world, ownerMeshPos, ownerTeam, ownerEntityRef, targetSoldierId, damageMult = 1) {
  const id = createPlasmaBulletEntity(world, ownerMeshPos, ownerTeam, ownerEntityRef, targetSoldierId, damageMult);
  if (id === null) {
    return null;
  }
  const bullet = world.get(id, 'bullet');
  bullet.projectileType = 'plasma-final';
  bullet.damage = (20 + Math.random() * 8) * damageMult;
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

export function createBlasterBulletEntity(world, ownerMeshPos, ownerTeam, ownerEntityRef, targetSoldierId, damageMult = 1) {
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
    damage: (11 + Math.random() * 4) * damageMult,
    age: 0,
  });
  world.add(id, 'mesh', { root: mesh });
  return id;
}

export function createReaperBulletEntity(world, ownerMeshPos, ownerTeam, ownerEntityRef, targetSoldierId, damageMult = 1) {
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
    damage: (13 + Math.random() * 5) * damageMult,
    age: 0,
  });
  world.add(id, 'mesh', { root: mesh });
  return id;
}

export function createApcEntity(world, position, faction = null) {
  const id = world.createEntity(['apc']);
  const factionKey = resolveFactionKey(faction, playerFaction);
  world.add(id, 'apc', {
    team: PLAYER,
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
  const root = makeApcMesh(position, PLAYER, meta);
  const hpBar = makeHpBar(3, PLAYER);
  world.add(id, 'mesh', { root, hpBar });
  return id;
}

export function createVehicleEntity(world, team, name, model, icon, position, projectileType = 'laser', faction = null) {
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
  world.add(id, 'mesh', { root, hpBar });
  return id;
}

export function createLaserBulletEntity(world, ownerPos, ownerTeam, ownerId, targetSoldierId, damageMult = 1) {
  const id = world.createEntity(['laserBullet']);
  const targetMesh = world.get(targetSoldierId, 'mesh')?.root;
  if (!targetMesh) {
    return null;
  }
  const ownerPosition = ownerPos.clone();
  ownerPosition.y = 2.3;
  const targetPosition = targetMesh.position.clone();
  targetPosition.y = 1;
  const dx = targetPosition.x - ownerPosition.x;
  const dy = targetPosition.y - ownerPosition.y;
  const dz = targetPosition.z - ownerPosition.z;
  const length = Math.hypot(dx, dy, dz) || 1;
  const speed = 65;
  const mesh = mkBox('laser', 0.02, 0.02, 8.0);
  mesh.position.copy(ownerPosition);
  mesh.rotation.y = Math.atan2(dx, dz);
  const laserMaterial = new THREE.MeshBasicMaterial();
  laserMaterial.color = new THREE.Color(1, 0, 0);
  mesh.material = laserMaterial;
  world.add(id, 'laserBullet', {
    team: ownerTeam,
    targetId: targetSoldierId,
    ownerRef: ownerId,
    vx: (dx / length) * speed,
    vy: (dy / length) * speed,
    vz: (dz / length) * speed,
    damage: (12 + Math.random() * 6) * damageMult,
    age: 0,
  });
  world.add(id, 'mesh', { root: mesh });
  return id;
}

export function createBeamEntity(world, ownerPos, ownerTeam, ownerId, targetSoldierId, damageMult = 1, exactY = false) {
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
  const mesh = mkCylinder('beam', 0.02, 0.05, length, 10);
  const from = new THREE.Vector3(dx, dy, dz).normalize();
  const quat = new THREE.Quaternion();
  quat.setFromUnitVectors(new THREE.Vector3(0, 1, 0), from);
  mesh.quaternion.copy(quat);
  mesh.position.copy(startPos.clone().add(endPos).multiplyScalar(0.5));
  const beamMaterial = new THREE.MeshBasicMaterial();
  beamMaterial.color = new THREE.Color(1, 92 / 255, 92 / 255);
  beamMaterial.opacity = 0.92;
  beamMaterial.transparent = true;
  mesh.material = beamMaterial;
  const damage = (10 + Math.random() * 8) * damageMult;
  world.add(id, 'beam', {
    team: ownerTeam,
    targetId: targetSoldierId,
    ownerRef: ownerId,
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
export function getSoldierMuzzlePos(world, soldierId) {
  const root = world.get(soldierId, 'mesh')?.root;
  const fallback = root ? root.position.clone() : new THREE.Vector3();
  fallback.y = 1.05;
  if (!root) {
    return fallback;
  }
  let best = null;
  let bestScore = Infinity;
  let base = null;
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

export function createLightningEntity(world, ownerPos, ownerTeam, ownerId, targetSoldierId, damageMult = 1) {
  const id = world.createEntity(['beam']);
  const targetMesh = world.get(targetSoldierId, 'mesh')?.root;
  if (!targetMesh) {
    return null;
  }
  const startPos = ownerPos.clone();
  const endPos = targetMesh.position.clone();
  endPos.y = 1.0;
  const lightning = new NecronLightning(scene, {});
  lightning.fire(startPos, endPos);
  const damage = (10 + Math.random() * 8) * damageMult;
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

export function createAirfieldEntity(world, position, faction = null) {
  const id = world.createEntity(['airfield']);
  const factionKey = resolveFactionKey(faction, playerFaction);
  const meta = { airfieldEntityId: id, faction: factionKey };
  const healthPoints = 500;
  world.add(id, 'airfield', {
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
  const scaffold = makeGhostMesh('airfield', position, meta);
  _attachScaffoldSelRing(scaffold, 'airfield');
  const constructBar = makeConstructBar(8);
  const hpBar = makeHpBar(7, PLAYER);
  const prodBar = makeHpBar(7, PLAYER);
  hpBar.visible = false;
  world.add(id, 'mesh', {
    root: scaffold,
    scaffold,
    constructBar,
    hpBar,
    prodBar,
    _realMeshBuilt: false,
    _meshFactory: () => makeAirfieldMesh(position, PLAYER, meta),
  });
  return id;
}

export function createJetEntity(world, spawnPos) {
  const id = world.createEntity(['jet']);
  const startAngle = Math.random() * Math.PI * 2;
  const orbitR = 28 + Math.random() * 12;
  const jetEntityId = id;
  world.add(id, 'jet', {
    team: PLAYER,
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
  const mesh = makeJetMesh(new THREE.Vector3(spawnPos.x, JET_ALT, spawnPos.z), PLAYER, { jetEntityId });
  const hpBar = makeHpBar(3.5, PLAYER);
  world.add(id, 'mesh', { root: mesh, hpBar });
  return id;
}

export function createMissileEntity(world, pos, targetSqId) {
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

export function upgradeToGrenadier(world, sid) {
  const soldierComponent = world.get(sid, 'soldier');
  if (!soldierComponent) {
    return;
  }
  soldierComponent.isGrenadier = true;
  soldierComponent.hp = 150;
  soldierComponent.maxHp = 150;
  const meshComponent = world.get(sid, 'mesh');
  if (meshComponent) {
    if (meshComponent.root) {
      _applyGrenadierVisuals(meshComponent.root);
    }
    meshComponent.reloadBar = _makeReloadBar(PLAYER);
  }
}

export function createGrenadeEntity(w, ownerSoldierId, targetPos) {
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
