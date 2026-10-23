import * as THREE from 'three';
import {
  createBeamEntity,
  createBlasterBulletEntity,
  createBulletEntity,
  createGrenadeEntity,
  createLaserBulletEntity,
  createLightningEntity,
  createPlasmaBulletEntity,
  createPlasmaFinalBulletEntity,
  createReaperBulletEntity,
  createSoldierEntity,
  getSoldierMuzzlePos,
  upgradeToGrenadier,
} from '../entities.js';
import { FACTIONS } from '../factions.js';
import { updateHUD } from '../hud.js';
import { updateHpBar } from '../meshes.js';
import { attachPlasmaMuzzleFlash, updatePlasmaMuzzleFlash } from '../plasma-bolt.js';
import {
  FLY_CLIMB,
  FLY_CRUISE_ALT,
  FLY_DESCEND,
  FLY_LAND_RADIUS,
  FLY_SPEED,
  FORMATION,
  PLAYER,
  SQUAD_SCATTER,
  TEAM_COLOR,
  attackMode,
  currentBounds,
  selSquads,
  setSelSquads,
  world,
} from '../scene.js';
import { HILL_SLOT_RELEASE_DIST } from '../../pathfinding/avoid.js';
import {
  CAPTURE_PROGRESS_RATE,
  CAPTURE_SEQUENCE,
  PLANTER_SPEED_MULT,
  captureClipDone,
  captureSlotTarget,
  computeSoldierYaw,
  guardCaptureAnim,
  isCaptureEngaged,
  isFleeingMove,
  isPlantingDone,
  isPointCapturedBy,
  nextCaptureStage,
  nextGuardCaptureStage,
  planterBannerShown,
  planterPlantYaw,
  planterStandTarget,
  shouldHoldForCapture,
  shouldTickCapture,
} from '../soldier-aim.js';
import { childMeshes, disposeObj, findNodesByName } from '../three-helpers.js';
import { getRideInfo, yieldSlotBehind } from '../camera-fps.js';
import { findClosestEnemySoldier } from './combat.js';
import { _strategicPointUpdateOwner } from './points.js';
import { _avoidDir, _groundAt, _snapTerrainBegin, _steerSquadFacing } from './terrain.js';
import { clampStepToRoute, exitsStraight, updateMoverRoute, updateSquadRoute } from '../../pathfinding/astar-integrated.js';


export function systemSoldier(world, deltaTime) {
  for (const id of world.query('soldier', 'mesh')) {
    const soldierComponent = world.get(id, 'soldier');
    const meshComponent = world.get(id, 'mesh');
    if (!soldierComponent || !meshComponent || !meshComponent.root) {
      continue;
    }

    const squadComponent = world.get(soldierComponent.squadId, 'squad');
    const teamColor = TEAM_COLOR[squadComponent?.team || 'blue'].emissive;

    if (soldierComponent.shootTimer > 0) {
      soldierComponent.shootTimer -= deltaTime;
    }
    if (soldierComponent.revealTimer > 0) {
      soldierComponent.revealTimer -= deltaTime;
    }
    updatePlasmaMuzzleFlash(meshComponent.root, deltaTime);
    if (soldierComponent.flashTimer > 0) {
      soldierComponent.flashTimer -= deltaTime;
      const flashColor = new THREE.Color(0.8, 0.8, 0.2);
      if (meshComponent.root._bodyMat) {
        meshComponent.root._bodyMat.emissive.copy(flashColor);
      } else {
        childMeshes(meshComponent.root).forEach((m) => {
          if (m.material && m.material.emissive) {
            m.material.emissive.copy(flashColor);
          }
        });
      }
    } else {
      if (meshComponent.root._bodyMat) {
        meshComponent.root._bodyMat.emissive.copy(teamColor);
      } else {
        childMeshes(meshComponent.root).forEach((m) => {
          if (m.material && m.material.emissive && !m._isSelRingBar && !m._isTeamRing) {
            m.material.emissive.copy(teamColor);
          }
        });
      }
    }
    meshComponent.hpBar.position.copy(meshComponent.root.position);
    meshComponent.hpBar.position.y = 0.06;
    meshComponent.hpBar.position.z = meshComponent.root.position.z - 1.1;
    updateHpBar(meshComponent.hpBar, soldierComponent.hp / soldierComponent.maxHp);
    if (meshComponent.reloadBar) {
      meshComponent.reloadBar.position.copy(meshComponent.root.position);
      meshComponent.reloadBar.position.y = 0.14;
      meshComponent.reloadBar.position.z = meshComponent.root.position.z - 1.1;
      const reloadTime = squadComponent ? squadComponent.grenadeReloadTime : 8;
      const cd = squadComponent ? squadComponent.grenadeCd : 0;
      const percentage = reloadTime > 0 ? Math.max(0, Math.min(1, 1 - cd / reloadTime)) : 1;
      updateHpBar(meshComponent.reloadBar, percentage);
      meshComponent.reloadBar.visible = percentage < 0.999;
    }
  }
}

// Guard banner props stay hidden at spawn; the planter shows them only
// while flag_plant_1 plays, then the point's own banner pair pops into
// the socket when flag_plant_2 ends.
export const PLANTER_BANNER_NODES = ['guard_banner', 'guard_banner_rod'];


export function _planterHasPlantAnims(root) {
  return !!root._animGroups?.flagPlant1 && !!root._animGroups?.flagPlant2;
}


export function _setPlanterBannerVisible(soldierComponent, root, visible) {
  if (!soldierComponent || !root) {
    return;
  }
  if (!!soldierComponent._bannerShown === !!visible) {
    return;
  }
  soldierComponent._bannerShown = !!visible;
  if (!root._bannerNodes) {
    root._bannerNodes = findNodesByName(root, PLANTER_BANNER_NODES);
  }
  for (const node of root._bannerNodes) {
    node.visible = !!visible;
  }
}


export function _playPlanterSequence(soldierComponent, root) {
  if (soldierComponent._captureDone) {
    _setPlanterBannerVisible(soldierComponent, root, false);
    root._playAnim('idle');
    return;
  }
  const { stage, want } = nextCaptureStage(
    soldierComponent.captureStage,
    root._currentAnim,
    soldierComponent._capturePrev,
  );
  soldierComponent.captureStage = stage;
  if (!root._animGroups?.[want]) {
    _setPlanterBannerVisible(soldierComponent, root, false);
    root._playAnim('idle');
    return;
  }
  // Capture clips (stage 2+) wait until the planter backed off the center;
  // without the gate the first capture clip would flash for the single tick
  // between flag_plant_2 ending and the walk-out starting.
  if (stage >= 2 && !soldierComponent._planterBackedOff) {
    _setPlanterBannerVisible(soldierComponent, root, false);
    root._playAnim('idle');
    return;
  }
  const last = CAPTURE_SEQUENCE.length - 1;
  if (stage >= last && captureClipDone(want, soldierComponent._capturePrev, root._currentAnim)) {
    _setPlanterBannerVisible(soldierComponent, root, false);
    soldierComponent._captureDone = true;
    root._playAnim('idle');
    return;
  }
  if (root._currentAnim !== want) {
    root._playAnim(want, false);
  }
  soldierComponent._capturePrev = root._currentAnim;
  // Visibility trails the play call: the banner shows only on the ticks
  // flag_plant_1 is actually the current clip.
  _setPlanterBannerVisible(soldierComponent, root, planterBannerShown({ currentAnim: root._currentAnim }));
}


export function _captureHoldTarget(world, squadComponent) {
  if (!squadComponent.moveOrder) {
    return null;
  }
  for (const spId of world.query('strategicPoint')) {
    const sp = world.get(spId, 'strategicPoint');
    if (!sp) {
      continue;
    }
    if (shouldHoldForCapture({
      orderX: squadComponent.moveOrder.x,
      orderZ: squadComponent.moveOrder.z,
      squadX: squadComponent.position.x,
      squadZ: squadComponent.position.z,
      spX: sp.position.x,
      spZ: sp.position.z,
      captureRadius: sp.captureRadius,
    })) {
      return sp;
    }
  }
  return null;
}


export function systemSquad(world, deltaTime) {
  _snapTerrainBegin();
  // One snapshot for every enemy search this tick (safe: lookups below
  // tolerate entities destroyed mid-loop via the usual get() guards).
  const allSquadIds = world.query('squad');
  for (const squadEntityId of world.query('squad', 'mesh')) {
    const squadComponent = world.get(squadEntityId, 'squad');
    const meshComponent = world.get(squadEntityId, 'mesh');
    if (!squadComponent || !meshComponent) {
      continue;
    }
    const aliveSols = squadComponent.soldiers.filter((s) => s !== null && world.has(s, 'soldier'));
    if (aliveSols.length === 0) {
      childMeshes(meshComponent.hpBar).forEach((m) => disposeObj(m));
      disposeObj(meshComponent.hpBar);
      if (meshComponent.reinBar) {
        childMeshes(meshComponent.reinBar).forEach((m) => disposeObj(m));
        disposeObj(meshComponent.reinBar);
      }
      if (meshComponent.grenadeSetupBar) {
        childMeshes(meshComponent.grenadeSetupBar).forEach((m) => disposeObj(m));
        disposeObj(meshComponent.grenadeSetupBar);
      }
      if (selSquads.includes(squadEntityId)) {
        setSelSquads(selSquads.filter((s) => s !== squadEntityId));
        updateHUD();
      }
      world.destroyEntity(squadEntityId);
      continue;
    }
    let moving = false;
    let enemy;
    if (squadComponent.forcedSoldierId && world.has(squadComponent.forcedSoldierId, 'soldier')) {
      const enemyMeshComponent = world.get(squadComponent.forcedSoldierId, 'mesh');
      if (enemyMeshComponent) {
        const distance = squadComponent.position.distanceTo(enemyMeshComponent.root.position);
        enemy = { soldierEntityId: squadComponent.forcedSoldierId, distance };
        const dx = enemyMeshComponent.root.position.x - squadComponent.position.x;
        const dz = enemyMeshComponent.root.position.z - squadComponent.position.z;
        const length = Math.hypot(dx, dz) || 1;
        if (squadComponent.team !== PLAYER) {
          if (distance > squadComponent.attackRange && !squadComponent.moveOrder) {
            const huntTarget = updateMoverRoute(squadComponent, squadComponent.position, enemyMeshComponent.root.position, { tag: 'hunt', keyPrecision: 4 }) || enemyMeshComponent.root.position;
            const hdx = huntTarget.x - squadComponent.position.x;
            const hdz = huntTarget.z - squadComponent.position.z;
            const hlen = Math.hypot(hdx, hdz) || 1;
            squadComponent.facing.set(hdx / hlen, 0, hdz / hlen);
            if (!exitsStraight(squadComponent, squadComponent.position.x, squadComponent.position.z)) {
              _steerSquadFacing(squadComponent, length);
            }
            {
              const step = clampStepToRoute(squadComponent, squadComponent.position.x, squadComponent.position.z, squadComponent.facing.x * squadComponent.speed * deltaTime, squadComponent.facing.z * squadComponent.speed * deltaTime);
              squadComponent.position.x += step[0];
              squadComponent.position.z += step[1];
            }
            squadComponent.position.x = Math.max(-currentBounds(), Math.min(currentBounds(), squadComponent.position.x));
            squadComponent.position.z = Math.max(-currentBounds(), Math.min(currentBounds(), squadComponent.position.z));
            moving = true;
          }
        } else if (attackMode === 'melee') {
          if (distance > squadComponent.attackRange && !squadComponent.moveOrder) {
            squadComponent.facing.set(dx / length, 0, dz / length);
            if (!exitsStraight(squadComponent, squadComponent.position.x, squadComponent.position.z)) {
              _steerSquadFacing(squadComponent, length);
            }
            {
              const step = clampStepToRoute(squadComponent, squadComponent.position.x, squadComponent.position.z, squadComponent.facing.x * squadComponent.speed * deltaTime, squadComponent.facing.z * squadComponent.speed * deltaTime);
              squadComponent.position.x += step[0];
              squadComponent.position.z += step[1];
            }
            squadComponent.position.x = Math.max(-currentBounds(), Math.min(currentBounds(), squadComponent.position.x));
            squadComponent.position.z = Math.max(-currentBounds(), Math.min(currentBounds(), squadComponent.position.z));
            moving = true;
          }
        } else {
          squadComponent.facing.set(dx / length, 0, dz / length);
          if (distance > squadComponent.attackRange) {
            if (!exitsStraight(squadComponent, squadComponent.position.x, squadComponent.position.z)) {
              _steerSquadFacing(squadComponent, length);
            }
            {
              const step = clampStepToRoute(squadComponent, squadComponent.position.x, squadComponent.position.z, squadComponent.facing.x * squadComponent.speed * deltaTime, squadComponent.facing.z * squadComponent.speed * deltaTime);
              squadComponent.position.x += step[0];
              squadComponent.position.z += step[1];
            }
            squadComponent.position.x = Math.max(-currentBounds(), Math.min(currentBounds(), squadComponent.position.x));
            squadComponent.position.z = Math.max(-currentBounds(), Math.min(currentBounds(), squadComponent.position.z));
            moving = true;
          }
        }
      }
    } else if (squadComponent.forcedSoldierId) {
      squadComponent.forcedSoldierId = null;
    }
    if (!enemy && !squadComponent.forcedSoldierId && squadComponent.forcedTarget && world.has(squadComponent.forcedTarget, 'squad')) {
      const forcedTargetSquad = world.get(squadComponent.forcedTarget, 'squad');
      const forcedTargetSoldiers = forcedTargetSquad?.soldiers?.filter((soldierId) => soldierId !== null && world.has(soldierId, 'soldier')) ?? [];
      if (forcedTargetSoldiers.length > 0) {
        let best = null;
        let bestDistance = Infinity;
        forcedTargetSoldiers.forEach((soldierId) => {
          const meshComponent = world.get(soldierId, 'mesh');
          if (!meshComponent) {
            return;
          }
          const distance = squadComponent.position.distanceTo(meshComponent.root.position);
          if (distance < bestDistance) {
            bestDistance = distance;
            best = { soldierEntityId: soldierId, distance };
          }
        });
        enemy = best;
        if (enemy) {
          const enemyMeshComponent = world.get(enemy.soldierEntityId, 'mesh');
          if (enemyMeshComponent) {
            const dx = enemyMeshComponent.root.position.x - squadComponent.position.x;
            const dz = enemyMeshComponent.root.position.z - squadComponent.position.z;
            const length = Math.hypot(dx, dz) || 1;
            if (squadComponent.team !== PLAYER) {
              if (enemy.distance > squadComponent.attackRange && !squadComponent.moveOrder) {
                const huntTarget = updateMoverRoute(squadComponent, squadComponent.position, enemyMeshComponent.root.position, { tag: 'hunt', keyPrecision: 4 }) || enemyMeshComponent.root.position;
                const hdx = huntTarget.x - squadComponent.position.x;
                const hdz = huntTarget.z - squadComponent.position.z;
                const hlen = Math.hypot(hdx, hdz) || 1;
                squadComponent.facing.set(hdx / hlen, 0, hdz / hlen);
                if (!exitsStraight(squadComponent, squadComponent.position.x, squadComponent.position.z)) {
                  _steerSquadFacing(squadComponent, length);
                }
                {
                  const step = clampStepToRoute(squadComponent, squadComponent.position.x, squadComponent.position.z, squadComponent.facing.x * squadComponent.speed * deltaTime, squadComponent.facing.z * squadComponent.speed * deltaTime);
                  squadComponent.position.x += step[0];
                  squadComponent.position.z += step[1];
                }
                squadComponent.position.x = Math.max(-currentBounds(), Math.min(currentBounds(), squadComponent.position.x));
                squadComponent.position.z = Math.max(-currentBounds(), Math.min(currentBounds(), squadComponent.position.z));
                moving = true;
              }
            } else if (attackMode === 'melee') {
              if (enemy.distance > squadComponent.attackRange && !squadComponent.moveOrder) {
                const huntTarget = updateMoverRoute(squadComponent, squadComponent.position, enemyMeshComponent.root.position, { tag: 'hunt', keyPrecision: 4 }) || enemyMeshComponent.root.position;
                const hdx = huntTarget.x - squadComponent.position.x;
                const hdz = huntTarget.z - squadComponent.position.z;
                const hlen = Math.hypot(hdx, hdz) || 1;
                squadComponent.facing.set(hdx / hlen, 0, hdz / hlen);
                if (!exitsStraight(squadComponent, squadComponent.position.x, squadComponent.position.z)) {
                  _steerSquadFacing(squadComponent, length);
                }
                {
                  const step = clampStepToRoute(squadComponent, squadComponent.position.x, squadComponent.position.z, squadComponent.facing.x * squadComponent.speed * deltaTime, squadComponent.facing.z * squadComponent.speed * deltaTime);
                  squadComponent.position.x += step[0];
                  squadComponent.position.z += step[1];
                }
                squadComponent.position.x = Math.max(-currentBounds(), Math.min(currentBounds(), squadComponent.position.x));
                squadComponent.position.z = Math.max(-currentBounds(), Math.min(currentBounds(), squadComponent.position.z));
                moving = true;
              }
            } else {
              let aimX = dx;
              let aimZ = dz;
              if (enemy.distance > squadComponent.attackRange) {
                const huntTarget = updateMoverRoute(squadComponent, squadComponent.position, enemyMeshComponent.root.position, { tag: 'hunt', keyPrecision: 4 }) || enemyMeshComponent.root.position;
                aimX = huntTarget.x - squadComponent.position.x;
                aimZ = huntTarget.z - squadComponent.position.z;
              }
              const alen = Math.hypot(aimX, aimZ) || 1;
              squadComponent.facing.set(aimX / alen, 0, aimZ / alen);
              if (enemy.distance > squadComponent.attackRange) {
                if (!exitsStraight(squadComponent, squadComponent.position.x, squadComponent.position.z)) {
                  _steerSquadFacing(squadComponent, length);
                }
                {
                  const step = clampStepToRoute(squadComponent, squadComponent.position.x, squadComponent.position.z, squadComponent.facing.x * squadComponent.speed * deltaTime, squadComponent.facing.z * squadComponent.speed * deltaTime);
                  squadComponent.position.x += step[0];
                  squadComponent.position.z += step[1];
                }
                squadComponent.position.x = Math.max(-currentBounds(), Math.min(currentBounds(), squadComponent.position.x));
                squadComponent.position.z = Math.max(-currentBounds(), Math.min(currentBounds(), squadComponent.position.z));
                moving = true;
              }
            }
          }
        }
      } else {
        squadComponent.forcedTarget = null;
        enemy = findClosestEnemySoldier(world, squadComponent.team, squadComponent.position, allSquadIds);
      }
    } else if (!enemy) {
      enemy = findClosestEnemySoldier(world, squadComponent.team, squadComponent.position, allSquadIds);
    }
    if (!window._multiplayerMode) {
      if (squadComponent.flyOrder && !squadComponent.stopped) {
        const dx = squadComponent.flyOrder.x - squadComponent.position.x;
        const dz = squadComponent.flyOrder.z - squadComponent.position.z;
        const distance = Math.hypot(dx, dz);
        if (distance < FLY_LAND_RADIUS) {
          squadComponent.flyOrder = null;
          squadComponent.stopped = true;
        } else {
          moving = true;
          const inverse = 1 / distance;
          squadComponent.facing.set(dx * inverse, 0, dz * inverse);
          _steerSquadFacing(squadComponent, distance);
          squadComponent.position.x += squadComponent.facing.x * FLY_SPEED * deltaTime;
          squadComponent.position.z += squadComponent.facing.z * FLY_SPEED * deltaTime;
          squadComponent.position.x = Math.max(-currentBounds(), Math.min(currentBounds(), squadComponent.position.x));
          squadComponent.position.z = Math.max(-currentBounds(), Math.min(currentBounds(), squadComponent.position.z));
        }
      } else if (squadComponent.moveOrder && !squadComponent.stopped) {
        const dx = squadComponent.moveOrder.x - squadComponent.position.x;
        const dz = squadComponent.moveOrder.z - squadComponent.position.z;
        const distance = Math.hypot(dx, dz);
        const holdSp = _captureHoldTarget(world, squadComponent);
        if (distance < .6) {
          squadComponent.moveOrder = null;
        } else if (holdSp) {
          const hx = holdSp.position.x - squadComponent.position.x;
          const hz = holdSp.position.z - squadComponent.position.z;
          const hlen = Math.hypot(hx, hz) || 1;
          squadComponent.facing.set(hx / hlen, 0, hz / hlen);
        } else {
          moving = true;
          // A* waypoints when the straight line is blocked; arrival is still
          // measured against the order itself, local avoidance still applies.
          const routeTarget = updateSquadRoute(squadComponent) || squadComponent.moveOrder;
          const rdx = routeTarget.x - squadComponent.position.x;
          const rdz = routeTarget.z - squadComponent.position.z;
          const rlen = Math.hypot(rdx, rdz) || 1;
          squadComponent.facing.set(rdx / rlen, 0, rdz / rlen);
          if (!exitsStraight(squadComponent, squadComponent.position.x, squadComponent.position.z)) {
            _steerSquadFacing(squadComponent, distance);
          }
          {
            const step = clampStepToRoute(squadComponent, squadComponent.position.x, squadComponent.position.z, squadComponent.facing.x * squadComponent.speed * deltaTime, squadComponent.facing.z * squadComponent.speed * deltaTime);
            squadComponent.position.x += step[0];
            squadComponent.position.z += step[1];
          }
          squadComponent.position.x = Math.max(-currentBounds(), Math.min(currentBounds(), squadComponent.position.x));
          squadComponent.position.z = Math.max(-currentBounds(), Math.min(currentBounds(), squadComponent.position.z));
        }
      } else if (enemy && !squadComponent.stopped && enemy.distance <= squadComponent.detectionRange && enemy.distance > squadComponent.attackRange && squadComponent.autoChase && (squadComponent.team !== PLAYER || attackMode === 'melee')) {
        moving = true;
        const enemyPosition = world.get(enemy.soldierEntityId, 'mesh')?.root.position;
        if (enemyPosition) {
          const huntTarget = updateMoverRoute(squadComponent, squadComponent.position, enemyPosition, { tag: 'hunt', keyPrecision: 4 }) || enemyPosition;
          const hdx = huntTarget.x - squadComponent.position.x;
          const hdz = huntTarget.z - squadComponent.position.z;
          const hlen = Math.hypot(hdx, hdz) || 1;
          const length = Math.hypot(enemyPosition.x - squadComponent.position.x, enemyPosition.z - squadComponent.position.z) || 1;
          squadComponent.facing.set(hdx / hlen, 0, hdz / hlen);
          if (!exitsStraight(squadComponent, squadComponent.position.x, squadComponent.position.z)) {
            _steerSquadFacing(squadComponent, length);
          }
          {
            const step = clampStepToRoute(squadComponent, squadComponent.position.x, squadComponent.position.z, squadComponent.facing.x * squadComponent.speed * deltaTime, squadComponent.facing.z * squadComponent.speed * deltaTime);
            squadComponent.position.x += step[0];
            squadComponent.position.z += step[1];
          }
          squadComponent.position.x = Math.max(-currentBounds(), Math.min(currentBounds(), squadComponent.position.x));
          squadComponent.position.z = Math.max(-currentBounds(), Math.min(currentBounds(), squadComponent.position.z));
        }
      } else if (enemy && !squadComponent.stopped && enemy.distance <= squadComponent.detectionRange && !squadComponent.autoChase && enemy.distance <= squadComponent.attackRange) {
        const enemyPosition = world.get(enemy.soldierEntityId, 'mesh')?.root.position;
        if (enemyPosition) {
          const dx = enemyPosition.x - squadComponent.position.x;
          const dz = enemyPosition.z - squadComponent.position.z;
          const length = Math.hypot(dx, dz) || 1;
          squadComponent.facing.set(dx / length, 0, dz / length);
        }
      } else if (enemy && !squadComponent.stopped && enemy.distance <= squadComponent.detectionRange && enemy.distance > squadComponent.attackRange && attackMode === 'ranged') {
        const enemyPosition = world.get(enemy.soldierEntityId, 'mesh')?.root.position;
        if (enemyPosition) {
          const dx = enemyPosition.x - squadComponent.position.x;
          const dz = enemyPosition.z - squadComponent.position.z;
          const length = Math.hypot(dx, dz) || 1;
          squadComponent.facing.set(dx / length, 0, dz / length);
        }
      }
    } else {
      moving = squadComponent.speed > 0.1 && (squadComponent.moveOrder !== null || !squadComponent.stopped);
    }
    // Logic plane follows the rendered surface: 3D range checks stay true on hills.
    squadComponent.position.y = _groundAt(squadComponent.position.x, squadComponent.position.z);
    if (enemy && enemy.distance <= squadComponent.attackRange) {
      const enemyPosition = world.get(enemy.soldierEntityId, 'mesh')?.root.position;
      if (enemyPosition) {
        const dx = enemyPosition.x - squadComponent.position.x;
        const dz = enemyPosition.z - squadComponent.position.z;
        const length = Math.hypot(dx, dz) || 1;
        squadComponent.facing.set(dx / length, 0, dz / length);
      }
      // Stationary-fire units (dark reapers) hold while the squad moves.
      const fireUnit = squadComponent.unitType
        ? FACTIONS[squadComponent.faction]?.units?.find((u) => u.name === squadComponent.unitType)
        : null;
      // Flying squads hold fire until every soldier touches down.
      let airborne = !!squadComponent.flyOrder;
      if (!airborne && fireUnit?.canFly) {
        for (const soldierId of aliveSols) {
          if ((world.get(soldierId, 'soldier')?._flyStage || 0) > 0) {
            airborne = true;
            break;
          }
        }
      }
      const holdFire = (moving && fireUnit?.stationaryFireOnly) || airborne;
      if (!holdFire && !window._multiplayerMode) {
        _squadFireAll(world, squadEntityId, squadComponent, aliveSols, deltaTime, enemy);
      }
    } else {
      for (const soldierId of aliveSols) {
        const soldierComponent = world.get(soldierId, 'soldier');
        if (soldierComponent) {
          soldierComponent.attackCooldown = Math.max(0, soldierComponent.attackCooldown - deltaTime);
        }
      }
    }
    if (!window._multiplayerMode) {
      squadComponent.grenadeCd = Math.max(0, squadComponent.grenadeCd - deltaTime);
      if (moving) {
        squadComponent.idleTime = 0;
      } else {
        squadComponent.idleTime += deltaTime;
      }
      const grenadierSolIds = aliveSols.filter((soldierId) => {
        const soldierComponent = world.get(soldierId, 'soldier');
        return soldierComponent && soldierComponent.isGrenadier;
      });
      if (squadComponent.idleTime >= 1 && squadComponent.grenadeCd <= 0 && grenadierSolIds.length > 0 && enemy && enemy.distance <= squadComponent.attackRange + 8) {
        const enemyMesh = world.get(enemy.soldierEntityId, 'mesh')?.root;
        if (enemyMesh) {
          squadComponent.grenadeCd = squadComponent.grenadeReloadTime;
          squadComponent.idleTime = 0;
          for (const grenadierSolId of grenadierSolIds) {
            const target = enemyMesh.position.clone();
            target.x += (Math.random() - 0.5) * 2.5;
            target.z += (Math.random() - 0.5) * 2.5;
            createGrenadeEntity(world, grenadierSolId, target);
          }
        }
      }
      squadComponent.capturingSpId = null;
      for (const spId of world.query('strategicPoint')) {
        const strategicPoint = world.get(spId, 'strategicPoint');
        if (!strategicPoint) {
          continue;
        }
        const distance = squadComponent.position.distanceTo(strategicPoint.position);
        const squadInside = distance < strategicPoint.captureRadius;
        let soldierInside = false;
        for (const soldierId of aliveSols) {
          const soldierMesh = world.get(soldierId, 'mesh');
          if (soldierMesh && soldierMesh.root.position.distanceTo(strategicPoint.position) < strategicPoint.captureRadius) {
            soldierInside = true;
            break;
          }
        }
        const orderedHold = squadComponent.moveOrder != null && shouldHoldForCapture({
          orderX: squadComponent.moveOrder.x,
          orderZ: squadComponent.moveOrder.z,
          squadX: squadComponent.position.x,
          squadZ: squadComponent.position.z,
          spX: strategicPoint.position.x,
          spZ: strategicPoint.position.z,
          captureRadius: strategicPoint.captureRadius,
        });
        if (shouldTickCapture({ captureOrderSpId: squadComponent.captureOrderSpId, spId, squadInside, soldierInside })) {
          const speed = CAPTURE_PROGRESS_RATE * deltaTime;
          if (squadComponent.team === 'blue') {
            strategicPoint.captureProgress = Math.min(1, strategicPoint.captureProgress + speed);
          } else {
            strategicPoint.captureProgress = Math.max(-1, strategicPoint.captureProgress - speed);
          }
          strategicPoint._capTicked = true;
          _strategicPointUpdateOwner(world, spId, strategicPoint, squadComponent.faction);
          if (strategicPoint.owner === squadComponent.team
            && squadComponent.moveOrder != null
            && squadComponent.moveOrder.distanceTo(strategicPoint.position) < strategicPoint.captureRadius) {
            squadComponent.moveOrder = null;
          }
        }
        if (isCaptureEngaged({ squadInside, soldierInside, orderedHold }) && squadComponent.captureOrderSpId === spId) {
          squadComponent.capturingSpId = spId;
        }
      }
    }
    {
      const visualFacing = squadComponent.visualFacing;
      const targetFacing = squadComponent.facing;
      const curAngle = Math.atan2(visualFacing.x, visualFacing.z);
      const targetAngle = Math.atan2(targetFacing.x, targetFacing.z);
      let difference = targetAngle - curAngle;
      while (difference > Math.PI) {
        difference -= Math.PI * 2;
      }
      while (difference < -Math.PI) {
        difference += Math.PI * 2;
      }
      if (moving) {
        visualFacing.set(targetFacing.x, 0, targetFacing.z);
      } else {
        const rotSpeed = 4.5;
        const step = difference * Math.min(1, rotSpeed * deltaTime);
        const newAngle = curAngle + step;
        visualFacing.set(Math.sin(newAngle), 0, Math.cos(newAngle));
      }
    }
    const visualFacing = squadComponent.visualFacing;
    const yawAngle = Math.atan2(visualFacing.x, visualFacing.z);
    // Order edge (Q/RMB): stopped flipped or a fresh move/attack order
    // appeared. Anim switches cut instantly on this frame (bypass the
    // shoot lock). Arrival (order cleared, stopped untouched) is not an
    // edge: the squad settles into formation naturally.
    const edgeNow = (squadComponent.stopped ? 4 : 0)
      | (squadComponent.moveOrder ? 2 : 0)
      | (squadComponent.forcedSoldierId ? 1 : 0);
    const edgePrev = squadComponent._animEdgePrev;
    const orderEdge = edgePrev !== undefined && edgePrev !== edgeNow
      && (((edgePrev ^ edgeNow) & 4) !== 0 || (edgeNow & 3) !== 0);
    squadComponent._animEdgePrev = edgeNow;
    const engagedSp = squadComponent.capturingSpId != null
      ? world.get(squadComponent.capturingSpId, 'strategicPoint')
      : null;
    const engagedOwner = engagedSp ? engagedSp.owner : null;
    // While riding this squad in fps/third, squadmates yield: their slots
    // slide behind the ridden soldier so nobody blocks the camera or the
    // crosshair. Snapshotted per tick; the ridden soldier keeps his slot.
    const ride = getRideInfo();
    const rideHere = ride && ride.squadId === squadEntityId ? ride : null;
    const rideRoot = rideHere ? world.get(rideHere.soldierId, 'mesh')?.root : null;
    for (const soldierId of aliveSols) {
      const soldierComponent = world.get(soldierId, 'soldier');
      const soldierMeshComponent = world.get(soldierId, 'mesh');
      if (!soldierComponent || !soldierMeshComponent) {
        continue;
      }
      const f = FORMATION[soldierComponent.formIdx];
      if (soldierComponent.scatter) {
        const scatter = soldierComponent.scatter;
        scatter.vy -= 18 * deltaTime;
        soldierMeshComponent.root.position.x += scatter.vx * deltaTime;
        soldierMeshComponent.root.position.y += scatter.vy * deltaTime;
        soldierMeshComponent.root.position.z += scatter.vz * deltaTime;
        soldierMeshComponent.root.rotation.x += 3 * deltaTime;
        soldierMeshComponent.root.rotation.z += 2 * deltaTime;
        if (soldierMeshComponent.root._blobShadow) {
          soldierMeshComponent.root._blobShadow.visible = false;
        }
        scatter.time += deltaTime;
        const scatterGroundY = _groundAt(soldierMeshComponent.root.position.x, soldierMeshComponent.root.position.z);
        if (soldierMeshComponent.root.position.y <= scatterGroundY && scatter.time > .12) {
          soldierMeshComponent.root.position.y = scatterGroundY;
          soldierComponent.scatter = null;
          soldierComponent.stagger = 0.9 + Math.random() * .4;
          soldierMeshComponent.root.rotation.y = Math.random() * Math.PI * 2;
          soldierMeshComponent.hpBar.visible = true;
          if (soldierMeshComponent.root._blobShadow) {
            soldierMeshComponent.root._blobShadow.visible = true;
          }
        }
        continue;
      }
      if (soldierComponent.stagger > 0) {
        soldierComponent.stagger -= deltaTime;
        const rise = Math.min(1, deltaTime * 6);
        soldierMeshComponent.root.rotation.x *= (1 - rise);
        soldierMeshComponent.root.rotation.z *= (1 - rise);
        continue;
      }
      // Daemon flight stages: 0 grounded, 1 launch, 2 cruise, 3 land.
      // A fresh fly order launches; any cleared order lands in place.
      if (squadComponent.flyOrder && (soldierComponent._flyStage || 0) === 0) {
        soldierComponent._flyStage = 1;
      } else if (!squadComponent.flyOrder && (soldierComponent._flyStage || 0) !== 0 && soldierComponent._flyStage !== 3) {
        soldierComponent._flyStage = 3;
      }
      if (soldierComponent._flyStage === 1 || soldierComponent._flyStage === 2) {
        soldierComponent.flyAlt = Math.min(FLY_CRUISE_ALT, (soldierComponent.flyAlt || 0) + FLY_CLIMB * deltaTime);
      } else if (soldierComponent._flyStage === 3) {
        const alt = (soldierComponent.flyAlt || 0) - FLY_DESCEND * deltaTime;
        if (alt <= 0) {
          soldierComponent.flyAlt = 0;
          soldierComponent._flyStage = 0;
          soldierComponent._flyLaunched = false;
          soldierComponent._flyLanded = false;
        } else {
          soldierComponent.flyAlt = alt;
        }
      }
      const onCaptureDuty = squadComponent.capturingSpId != null && !moving;
      const isPlanter = onCaptureDuty && aliveSols.indexOf(soldierId) === 0;
      let tx = squadComponent.position.x + f.x * SQUAD_SCATTER;
      let tz = squadComponent.position.z + f.z * SQUAD_SCATTER;
      let planterLeaving = false;
      if (onCaptureDuty) {
        const strategicPoint = world.get(squadComponent.capturingSpId, 'strategicPoint');
        if (strategicPoint) {
          // The planter backs off the center once the flag plants are done
          // (stage 2+); the capture clips wait until he arrives (see the
          // _planterBackedOff gate in _playPlanterSequence).
          const planterLeaves = isPlanter && isPlantingDone({
            captureStage: soldierComponent.captureStage,
            hasPlantAnims: _planterHasPlantAnims(soldierMeshComponent.root),
          });
          planterLeaving = planterLeaves;
          if (planterLeaves) {
            const target = planterStandTarget({
              centerX: strategicPoint.position.x,
              centerZ: strategicPoint.position.z,
              squadX: squadComponent.position.x,
              squadZ: squadComponent.position.z,
            });
            tx = target.x;
            tz = target.z;
          } else {
            const target = captureSlotTarget({
              isPlanter,
              slotX: tx,
              slotZ: tz,
              centerX: strategicPoint.position.x,
              centerZ: strategicPoint.position.z,
              soldierX: soldierMeshComponent.root.position.x,
              soldierZ: soldierMeshComponent.root.position.z,
              kind: strategicPoint.kind,
            });
            tx = target.x;
            tz = target.z;
          }
        }
      }
      if (rideHere && rideRoot && soldierId !== rideHere.soldierId) {
        const yielded = yieldSlotBehind(
          tx, tz, rideRoot.position.x, rideRoot.position.z,
          rideHere.dx, rideHere.dz, aliveSols.indexOf(soldierId),
        );
        if (yielded) {
          tx = yielded[0];
          tz = yielded[1];
        }
      }
      const MAX_LAG = 5.0;
      const rawLag = Math.hypot(tx - soldierMeshComponent.root.position.x, tz - soldierMeshComponent.root.position.z);
      if (rawLag > MAX_LAG) {
        const lagInv = 1 / rawLag;
        tx = soldierMeshComponent.root.position.x + (tx - soldierMeshComponent.root.position.x) * lagInv * MAX_LAG;
        tz = soldierMeshComponent.root.position.z + (tz - soldierMeshComponent.root.position.z) * lagInv * MAX_LAG;
      }
      const distanceToSlot = Math.hypot(tx - soldierMeshComponent.root.position.x, tz - soldierMeshComponent.root.position.z);
      const pace = isPlanter ? PLANTER_SPEED_MULT : Math.min(2.0, 0.3 + distanceToSlot * 0.6);
      const soldierRunSpeed = soldierComponent.moveSpeed * pace;
      // Stop freezes the squad in place (DoW semantics): no formation
      // settling, idle on the same frame. Capture duty keeps walking.
      const soldierMoving = distanceToSlot > 0.04
        && !(squadComponent.stopped && squadComponent.moveOrder === null && !onCaptureDuty);
      if (isPlanter && planterLeaving && !soldierMoving) {
        soldierComponent._planterBackedOff = true;
      }
      let moveAngle = 0;
      if (soldierMoving) {
        const inverse = 1 / distanceToSlot;
        let mdx = (tx - soldierMeshComponent.root.position.x) * inverse;
        let mdz = (tz - soldierMeshComponent.root.position.z) * inverse;
        const _steered = _avoidDir(soldierComponent, soldierMeshComponent.root.position.x, soldierMeshComponent.root.position.z, mdx, mdz, distanceToSlot, HILL_SLOT_RELEASE_DIST);
        mdx = _steered.x;
        mdz = _steered.z;
        const step = Math.min(distanceToSlot, soldierRunSpeed * deltaTime);
        soldierMeshComponent.root.position.x += mdx * step;
        soldierMeshComponent.root.position.z += mdz * step;
        moveAngle = Math.atan2(mdx, mdz);
      }
      soldierComponent._fleeing = moving && soldierMoving && isFleeingMove(moveAngle, yawAngle);
      // Pre-plant the planter squares up to the post (with the rod-side yaw
      // offset) so the flag_plant_1 end pose drops the butt in the socket.
      let aimAngle = yawAngle + soldierComponent.idleYawOffset;
      if (isPlanter && engagedSp && !isPlantingDone({
        captureStage: soldierComponent.captureStage,
        hasPlantAnims: _planterHasPlantAnims(soldierMeshComponent.root),
      })) {
        aimAngle = planterPlantYaw({
          soldierX: soldierMeshComponent.root.position.x,
          soldierZ: soldierMeshComponent.root.position.z,
          centerX: engagedSp.position.x,
          centerZ: engagedSp.position.z,
          kind: engagedSp.kind,
        });
      }
      soldierMeshComponent.root.rotation.y = computeSoldierYaw({
        shooting: soldierComponent.shootTimer > 0,
        moving: soldierMoving,
        moveAngle,
        aimAngle,
        currentYaw: soldierMeshComponent.root.rotation.y,
        deltaTime,
        fleeing: soldierComponent._fleeing,
      });
      const soldierGroundY = _groundAt(soldierMeshComponent.root.position.x, soldierMeshComponent.root.position.z);
      soldierMeshComponent.root.position.y = soldierGroundY + (soldierComponent.flyAlt || 0);
      const isWalking = soldierMoving || moving;
      if (soldierMeshComponent.root._playAnim) {
        const isShooting = soldierComponent.shootTimer > 0;
        const capturing = squadComponent.capturingSpId != null && !isShooting && !isWalking;
        if (squadComponent.capturingSpId == null) {
          soldierComponent.captureStage = 0;
          soldierComponent._guardStage = 0;
          soldierComponent._capturePrev = null;
          soldierComponent._captureDone = false;
          soldierComponent._planterBackedOff = false;
          soldierComponent._captureKey = null;
          _setPlanterBannerVisible(soldierComponent, soldierMeshComponent.root, false);
        } else {
          const effortKey = `${squadComponent.capturingSpId}|${engagedOwner}|${isPlanter ? 'p' : 'g'}`;
          if (soldierComponent._captureKey !== effortKey && engagedOwner !== squadComponent.team) {
            soldierComponent.captureStage = 0;
            soldierComponent._guardStage = 0;
            soldierComponent._capturePrev = null;
            soldierComponent._captureDone = false;
            soldierComponent._planterBackedOff = false;
          }
          soldierComponent._captureKey = effortKey;
          if (!capturing) {
            soldierComponent._capturePrev = null;
          }
        }
        const flyStage = soldierComponent._flyStage || 0;
        if (flyStage > 0) {
          const flyRoot = soldierMeshComponent.root;
          if (flyStage === 1) {
            if (!soldierComponent._flyLaunched) {
              flyRoot._playAnim('flyLaunch', false, true);
              soldierComponent._flyLaunched = true;
            } else if (flyRoot._currentAnim === null || (soldierComponent.flyAlt || 0) >= FLY_CRUISE_ALT) {
              soldierComponent._flyStage = 2;
            }
          }
          if (soldierComponent._flyStage === 2 && flyRoot._currentAnim !== 'flyIdle') {
            flyRoot._playAnim('flyIdle', true, true);
          } else if (soldierComponent._flyStage === 3 && !soldierComponent._flyLanded) {
            flyRoot._playAnim('flyLand', false, true);
            soldierComponent._flyLanded = true;
          }
        } else if (isShooting) {
          if (isWalking) {
            soldierMeshComponent.root._playAnim('shootMove', false, orderEdge);
          } else {
            soldierMeshComponent.root._playAnim('shoot', false, orderEdge);
          }
        } else if (isWalking) {
          soldierMeshComponent.root._playAnim('run', undefined, orderEdge);
          if (isPlanter) {
            // Walking plays 'run': the carried banner stays hidden until
            // flag_plant_1 itself starts.
            _setPlanterBannerVisible(soldierComponent, soldierMeshComponent.root, false);
          }
        } else if (capturing && !isPlanter) {
          const guardRoot = soldierMeshComponent.root;
          if (engagedSp != null && isPointCapturedBy(engagedSp.owner, squadComponent.team)) {
            soldierComponent._captureDone = true;
            guardRoot._playAnim('idle');
          } else {
            let { stage, want } = nextGuardCaptureStage(
              soldierComponent._guardStage,
              guardRoot._currentAnim,
              soldierComponent._capturePrev,
            );
            if (stage === 0 && !guardRoot._animGroups?.[want] && guardRoot._animGroups?.[guardCaptureAnim(1)]) {
              stage = 1;
              want = guardCaptureAnim(aliveSols.indexOf(soldierId));
            }
            soldierComponent._guardStage = stage;
            if (!guardRoot._animGroups?.[want]) {
              guardRoot._playAnim('idle');
            } else {
              if (guardRoot._currentAnim !== want) {
                guardRoot._playAnim(want, false);
              }
              soldierComponent._capturePrev = guardRoot._currentAnim;
            }
          }
        } else if (capturing) {
          _playPlanterSequence(soldierComponent, soldierMeshComponent.root);
          if (isPlanter && engagedSp && engagedSp.raiseFrom == null
            && isPlantingDone({
              captureStage: soldierComponent.captureStage,
              hasPlantAnims: _planterHasPlantAnims(soldierMeshComponent.root),
            })) {
            engagedSp.raiseFrom = Math.min(1, Math.abs(engagedSp.captureProgress || 0));
          }
        } else {
          soldierMeshComponent.root._playAnim('idle', undefined, orderEdge);
        }
      }
      soldierComponent.walkTime += deltaTime * (isWalking ? 9 : 1.8);
      if (isWalking) {
        const sway = Math.sin(soldierComponent.walkTime) * 0.33;
        if (soldierMeshComponent.root._legL) {
          soldierMeshComponent.root._legL.rotation.x = sway;
          soldierMeshComponent.root._legR.rotation.x = -sway;
        }
        if (soldierMeshComponent.root._armL) {
          soldierMeshComponent.root._armL.rotation.x = -sway * 0.8;
          soldierMeshComponent.root._armR.rotation.x = sway * 0.4;
        }
        soldierMeshComponent.root.position.y = soldierGroundY + (soldierComponent.flyAlt || 0) + Math.abs(Math.sin(soldierComponent.walkTime)) * 0.06;
      } else {
        const breathe = Math.sin(soldierComponent.walkTime + soldierComponent.idlePhase) * 0.04;
        const sway = Math.sin(soldierComponent.walkTime * 0.7 + soldierComponent.idlePhase) * 0.015;
        if (soldierMeshComponent.root._legL) {
          soldierMeshComponent.root._legL.rotation.x *= (1 - Math.min(1, deltaTime * 6));
          soldierMeshComponent.root._legR.rotation.x *= (1 - Math.min(1, deltaTime * 6));
        }
        if (soldierMeshComponent.root._armL) {
          soldierMeshComponent.root._armL.rotation.x = breathe - 0.05;
          soldierMeshComponent.root._armR.rotation.x = -breathe * 0.6 + 0.03;
          soldierMeshComponent.root._armL.rotation.z = sway + 0.08;
          soldierMeshComponent.root._armR.rotation.z = -sway - 0.08;
        }
        soldierMeshComponent.root.position.y = soldierGroundY + (soldierComponent.flyAlt || 0) + breathe * 0.3;
      }
      if (soldierMeshComponent.root._blobShadow) {
        soldierMeshComponent.root._blobShadow.position.y = 0.015 - (soldierMeshComponent.root.position.y - soldierGroundY);
      }
    }
    if (squadComponent.reinforceQueue.length > 0) {
      squadComponent.reinforceProgress += deltaTime;
      if (squadComponent.reinforceProgress >= 7.0) {
        squadComponent.reinforceProgress = 0;
        const { formIdx } = squadComponent.reinforceQueue.shift();
        if (squadComponent.soldiers[formIdx] === null || !world.has(squadComponent.soldiers[formIdx], 'soldier')) {
          const soldierId = createSoldierEntity(world, squadEntityId, formIdx);
          const soldierMeshComponent = world.get(soldierId, 'mesh');
          const f = FORMATION[formIdx];
          const reX = squadComponent.position.x + f.x * SQUAD_SCATTER;
          const reZ = squadComponent.position.z + f.z * SQUAD_SCATTER;
          soldierMeshComponent.root.position.set(reX, _groundAt(reX, reZ), reZ);
          squadComponent.soldiers[formIdx] = soldierId;
          if (squadComponent.selected) {
            // Fresh factory rings start visible=false: opacity alone leaves
            // the torus invisible on the field, so lift the flag as well.
            const selRoot = soldierMeshComponent.root;
            if (selRoot._selMat) {
              selRoot._selMat.opacity = .9;
              selRoot._selMat.transparent = true;
            }
            if (selRoot._selDisc) {
              selRoot._selDisc.visible = true;
            }
          }
        }
        if (squadComponent.reinforceQueue.length === 0) {
          squadComponent.reinforceProgress = 0;
        }
        updateHUD();
      }
      if (meshComponent.reinBar) {
        meshComponent.reinBar.visible = true;
        meshComponent.reinBar.position.copy(squadComponent.position);
        meshComponent.reinBar.position.y = 3.48;
        updateHpBar(meshComponent.reinBar, squadComponent.reinforceProgress / 7.0);
      }
    } else {
      if (meshComponent.reinBar) {
        meshComponent.reinBar.visible = false;
      }
    }
    const hasGrenadier = aliveSols.some((soldierId) => {
      const soldierComponent = world.get(soldierId, 'soldier');
      return soldierComponent && soldierComponent.isGrenadier;
    });
    const enemyNearby = enemy && enemy.distance <= squadComponent.attackRange + 8;
    const showSetupBar = hasGrenadier && !moving && squadComponent.grenadeCd <= 0 && squadComponent.idleTime < 1 && enemyNearby;
    if (meshComponent.grenadeSetupBar) {
      if (showSetupBar) {
        meshComponent.grenadeSetupBar.visible = true;
        meshComponent.grenadeSetupBar.position.copy(squadComponent.position);
        meshComponent.grenadeSetupBar.position.y = squadComponent.reinforceQueue.length > 0 ? 3.72 : 3.48;
        updateHpBar(meshComponent.grenadeSetupBar, squadComponent.idleTime / 1.0);
      } else {
        meshComponent.grenadeSetupBar.visible = false;
      }
    }
    if (squadComponent.grenadeQueue.length > 0) {
      squadComponent.grenadeProgress += deltaTime;
      if (squadComponent.grenadeProgress >= 2.0) {
        squadComponent.grenadeProgress = 0;
        const { solId: soldierEntityId } = squadComponent.grenadeQueue.shift();
        if (soldierEntityId !== null && world.has(soldierEntityId, 'soldier')) {
          upgradeToGrenadier(world, soldierEntityId);
        }
        if (squadComponent.grenadeQueue.length === 0) {
          squadComponent.grenadeProgress = 0;
        }
        updateHUD();
      }
    }
  }
}


export function _squadFireAll(world, squadEntityId, squadComponent, aliveSols, deltaTime, enemy) {
  for (const soldierId of aliveSols) {
    const soldierComponent = world.get(soldierId, 'soldier');
    if (!soldierComponent) {
      continue;
    }
    if (soldierComponent._fleeing) {
      continue;
    }
    soldierComponent.attackCooldown = Math.max(0, soldierComponent.attackCooldown - deltaTime);
    if (soldierComponent.attackCooldown <= 0) {
      const soldierMeshComponent = world.get(soldierId, 'mesh');
      if (soldierMeshComponent && world.has(enemy.soldierEntityId, 'soldier')) {
        const damageMult = soldierComponent.damageMult || 1;
        if (soldierComponent.cloaked) {
          soldierComponent.revealTimer = 2.5;
        }
        const projectileType = squadComponent.projectileType || 'bullet';
        if (projectileType === 'beam') {
          createBeamEntity(world, soldierMeshComponent.root.position, squadComponent.team, soldierId, enemy.soldierEntityId, damageMult);
        } else if (projectileType === 'lightning') {
          const muzzlePos = getSoldierMuzzlePos(world, soldierId);
          createLightningEntity(world, muzzlePos, squadComponent.team, soldierId, enemy.soldierEntityId, damageMult);
        } else if (projectileType === 'laser') {
          createLaserBulletEntity(world, soldierMeshComponent.root.position, squadComponent.team, soldierId, enemy.soldierEntityId, damageMult);
        } else if (projectileType === 'plasma') {
          createPlasmaBulletEntity(world, soldierMeshComponent.root.position, squadComponent.team, soldierId, enemy.soldierEntityId, damageMult);
        } else if (projectileType === 'plasma-final') {
          createPlasmaFinalBulletEntity(world, soldierMeshComponent.root.position, squadComponent.team, soldierId, enemy.soldierEntityId, damageMult);
          attachPlasmaMuzzleFlash(soldierMeshComponent.root);
        } else if (projectileType === 'blaster') {
          createBlasterBulletEntity(world, soldierMeshComponent.root.position, squadComponent.team, soldierId, enemy.soldierEntityId, damageMult);
        } else if (projectileType === 'reaper') {
          createReaperBulletEntity(world, soldierMeshComponent.root.position, squadComponent.team, soldierId, enemy.soldierEntityId, damageMult);
        } else {
          createBulletEntity(world, soldierMeshComponent.root.position, squadComponent.team, soldierId, enemy.soldierEntityId, damageMult);
        }
        soldierComponent.flashTimer = .06;
        soldierComponent.shootTimer = 0.4;
      }
      const ptRate = squadComponent.projectileType === 'laser' ? 2.5 : squadComponent.projectileType === 'beam' ? 2.5 : squadComponent.projectileType === 'lightning' ? 2.5 : 1;
      soldierComponent.attackCooldown = (1 / soldierComponent.attackRate) * ptRate;
    }
  }
}
