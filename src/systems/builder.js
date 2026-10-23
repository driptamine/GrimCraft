import * as THREE from 'three';
import { createBuildingEntity, createStructureEntity } from '../entities.js';
import { updateHUD } from '../hud.js';
import { buildListeningPostMesh } from '../meshes.js';
import {
  COSTS,
  currentBounds,
  requisition,
  setRequisition,
  world,
} from '../scene.js';
import { HILL_RELEASE_DIST } from '../../pathfinding/avoid.js';
import { clampStepToRoute, exitsStraight, updateMoverRoute } from '../../pathfinding/astar-integrated.js';
import { _soldierTakeDamage, spawnParticles } from './combat.js';
import { _avoidDir, _groundAt, _snapTerrainBegin } from './terrain.js';

// Shared particle colors/offsets: repair/hit ticks run per builder per
// frame, so per-tick Color/Vector3 churn is pure waste.
const _builderHitColor = new THREE.Color(1, 0.5, 0);
const _repairColor = new THREE.Color(0.3, 1, 0.4);
const _repairOffset = new THREE.Vector3(0, 1.2, 0);


export function systemBuilder(world, deltaTime) {
  _snapTerrainBegin();
  for (const id of world.query('builder', 'mesh')) {
    const builderComponent = world.get(id, 'builder');
    const meshComponent = world.get(id, 'mesh');
    if (!builderComponent || !meshComponent) {
      continue;
    }
    meshComponent.root.position.y = _groundAt(meshComponent.root.position.x, meshComponent.root.position.z);
    if (builderComponent.buildTargetSP !== null && !builderComponent.isBuilding) {
      const strategicPoint = world.get(builderComponent.buildTargetSP, 'strategicPoint');
      if (strategicPoint) {
        const distance = meshComponent.root.position.distanceTo(strategicPoint.position);
        if (distance < 5) {
          builderComponent.isBuilding = true;
          builderComponent.moveTarget = null;
        }
      }
    }
    if (builderComponent.buildTarget && !builderComponent.isBuilding) {
      const distance = meshComponent.root.position.distanceTo(builderComponent.buildTarget.position);
      if (distance < 5) {
        builderComponent.isBuilding = true;
        builderComponent.moveTarget = null;
      }
    }
    if (!builderComponent.isBuilding) {
      _builderCombat(world, builderComponent, meshComponent, deltaTime);
      _builderRepair(world, builderComponent, meshComponent, deltaTime);
    }
    if (builderComponent.isBuilding) {
      builderComponent.buildProgress += deltaTime;
      if (meshComponent.root._playAnim) {
        meshComponent.root._playAnim('build');
      }
      const totalTime = builderComponent.buildTargetSP !== null ? 2 : 3;
      if (builderComponent.buildProgress >= totalTime) {
        _builderFinish(world, id, builderComponent);
      }
      continue;
    }
    if (builderComponent.moveTarget) {
      const dx = builderComponent.moveTarget.x - meshComponent.root.position.x;
      const dz = builderComponent.moveTarget.z - meshComponent.root.position.z;
      const distance = Math.hypot(dx, dz);
      if (distance < .3) {
        builderComponent.moveTarget = null;
        if ((builderComponent.buildTarget || builderComponent.buildTargetSP !== null) && !builderComponent.isBuilding) {
          builderComponent.isBuilding = true;
        }
      } else {
        const routeTarget = updateMoverRoute(builderComponent, meshComponent.root.position, builderComponent.moveTarget)
          || builderComponent.moveTarget;
        const rdx = routeTarget.x - meshComponent.root.position.x;
        const rdz = routeTarget.z - meshComponent.root.position.z;
        const rlen = Math.hypot(rdx, rdz) || 1;
        const _bd = exitsStraight(builderComponent, meshComponent.root.position.x, meshComponent.root.position.z)
          ? { x: rdx / rlen, z: rdz / rlen }
          : _avoidDir(builderComponent, meshComponent.root.position.x, meshComponent.root.position.z, rdx / rlen, rdz / rlen, distance, HILL_RELEASE_DIST);
        {
          const step = clampStepToRoute(builderComponent, meshComponent.root.position.x, meshComponent.root.position.z, _bd.x * builderComponent.speed * deltaTime, _bd.z * builderComponent.speed * deltaTime);
          meshComponent.root.position.x += step[0];
          meshComponent.root.position.z += step[1];
        }
        meshComponent.root.position.x = Math.max(-currentBounds(), Math.min(currentBounds(), meshComponent.root.position.x));
        meshComponent.root.position.z = Math.max(-currentBounds(), Math.min(currentBounds(), meshComponent.root.position.z));
        meshComponent.root.rotation.y = Math.atan2(_bd.x, _bd.z);
        if (meshComponent.root._playAnim) {
          meshComponent.root._playAnim('run');
        }
        builderComponent.walkTime += deltaTime * 8;
        const sway = Math.sin(builderComponent.walkTime) * .32;
        if (meshComponent.root._legL) {
          meshComponent.root._legL.rotation.x = sway;
          meshComponent.root._legR.rotation.x = -sway;
        }
        if (meshComponent.root._armL) {
          meshComponent.root._armL.rotation.x = -sway;
          meshComponent.root._armR.rotation.x = sway * .5;
        }
      }
    } else {
      if (meshComponent.root._playAnim) {
        meshComponent.root._playAnim('idle');
      }
      if (meshComponent.root._legL) {
        meshComponent.root._legL.rotation.x *= .85;
        meshComponent.root._legR.rotation.x *= .85;
      }
      if (meshComponent.root._armL) {
        meshComponent.root._armL.rotation.x *= .85;
        meshComponent.root._armR.rotation.x *= .85;
      }
    }
  }
}


export function _builderCombat(world, b, m, deltaTime) {
  if (b.attackCd === undefined) b.attackCd = 0;
  b.attackCd = Math.max(0, b.attackCd - deltaTime);
  if (b.repairTarget !== null) {
    return;
  }
  const autoEngage = b.attackMove || b.stance === 'ranged';
  if (!autoEngage) {
    return;
  }
  let enemyId = null;
  let minDistSq = Infinity;
  const aggroRange = b.meleeOrder ? 8 : 14;
  const aggroRangeSq = aggroRange * aggroRange;
  for (const squadId of world.query('squad')) {
    const esq = world.get(squadId, 'squad');
    if (!esq || esq.team === b.team) {
      continue;
    }
    const distSq = m.root.position.distanceToSquared(esq.position);
    if (distSq < minDistSq && distSq < aggroRangeSq) {
      minDistSq = distSq;
      enemyId = squadId;
    }
  }
  if (enemyId === null) {
    return;
  }
  const esq = world.get(enemyId, 'squad');
  const range = b.meleeOrder ? Math.min(b.attackRange, 3.5) : b.attackRange;
  if (minDistSq <= range * range) {
    b.moveTarget = null;
    m.root.rotation.y = Math.atan2(esq.position.x - m.root.position.x, esq.position.z - m.root.position.z);
    if (b.attackCd <= 0) {
      const soldierId = esq.soldiers.find((sid) => sid !== null && world.has(sid, 'soldier'));
      if (soldierId !== undefined) {
        _soldierTakeDamage(world, soldierId, b.attackDamage);
        const smc = world.get(soldierId, 'mesh');
        if (smc) {
          spawnParticles(smc.root.position, _builderHitColor, 4);
        }
        b.attackCd = 1.0;
      }
    }
  } else if (b.moveTarget === null) {
    b.moveTarget = esq.position.clone();
  }
}


export function _builderRepair(world, b, m, deltaTime) {
  if (b.repairTarget === null) {
    return;
  }
  const comp = world.get(b.repairTarget, 'building') || world.get(b.repairTarget, 'structure') || world.get(b.repairTarget, 'vehicle') || world.get(b.repairTarget, 'airfield');
  if (!comp) {
    b.repairTarget = null;
    return;
  }
  const maxHp = comp.maxHp || comp.hp;
  const dist = m.root.position.distanceTo(comp.position);
  if (dist > 3.5) {
    b.moveTarget = comp.position.clone();
    return;
  }
  b.moveTarget = null;
  b.attackMove = false;
  if (b.repairPulseT === undefined) b.repairPulseT = 0;
  b.repairPulseT += deltaTime;
  if (m.root._playAnim) {
    m.root._playAnim('repair');
  }
  if (b.repairPulseT >= 0.2) {
    b.repairPulseT = 0;
    comp.hp = Math.min(maxHp, comp.hp + 10);
    spawnParticles(comp.position.clone().add(_repairOffset), _repairColor, 2);
    if (comp.hp >= maxHp) {
      b.repairTarget = null;
    }
  }
}


export function _builderFinish(world, id, builderComponent) {
  if (builderComponent.buildTargetSP !== null) {
    const strategicPoint = world.get(builderComponent.buildTargetSP, 'strategicPoint');
    if (strategicPoint && strategicPoint.owner === builderComponent.team && !strategicPoint.hasListeningPost) {
      setRequisition(requisition - COSTS.listeningPost);
      strategicPoint.hasListeningPost = true;
      strategicPoint.lpTier = 1;
      strategicPoint.faction = builderComponent.faction;
      strategicPoint.lpMesh = buildListeningPostMesh(strategicPoint.position, builderComponent.team, { listeningPostEntityId: builderComponent.buildTargetSP, faction: builderComponent.faction });
    }
    builderComponent.buildTargetSP = null;
  } else if (builderComponent.buildTarget) {
    const { type, position, pendingEntityId } = builderComponent.buildTarget;
    if (pendingEntityId !== undefined) {
      const comp = world.get(pendingEntityId, 'building') || world.get(pendingEntityId, 'structure') || world.get(pendingEntityId, 'airfield');
      if (comp) {
        if (!comp.constructing) {
          setRequisition(requisition - COSTS[type]);
          comp.constructProgress = 0;
        }
        comp.constructing = true;
      }
    } else {
      if (type === 'barracks' || type === 'infantry_command' || type === 'greater_sacrificial_circle') {
        createBuildingEntity(world, type, position, builderComponent.team, builderComponent.faction);
      } else if (['tower', 'turret', 'thermoGen', 'towerBase', 'gunTurret', 'plasma_generator', 'tactica_control', 'mars_pattern', 'thermo_generator', 'mines'].includes(type)) {
        createStructureEntity(world, type, position, builderComponent.faction, builderComponent.team);
      } else if (type === 'mechanized') {
        createBuildingEntity(world, type, position, builderComponent.team, builderComponent.faction);
      }
    }
    builderComponent.buildTarget = null;
  }
  builderComponent.buildProgress = 0;
  builderComponent.isBuilding = false;
  updateHUD();
}
