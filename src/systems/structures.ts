import { clampStepToRoute } from '../../pathfinding/astar-integrated.js';
import * as THREE from 'three';
import {
  _finishConstruction,
  createBuilderEntity,
  createBulletEntity,
  createSquadEntity,
  createVehicleEntity,
  findUnitConfig,
  updateBuildingConstructionVisual,
} from '../entities/entities.js';
import { playerFaction, resolveFactionKey } from '../factions.js';
import { updateHUD } from '../core/hud.js';
import { updateHpBar } from '../meshes.js';
import {
  AIRFIELD_BOUNDS,
  PLASMA_RATE_PER,
  energy,
  setEnergy,
  setResearchedTech,
  world,
} from '../core/scene.js';
import { childMeshes } from '../render/three-helpers.js';
import { _snapMeshToTerrain, _snapTerrainBegin } from './terrain.js';
import { hasAnimatedConstruction } from '../render/construction-animation.js';
import { hasActiveConstructionWorker } from './construction.js';
import { worldFootprint } from '../core/structure-footprint.js';


export function systemBuilding(world: any, deltaTime: number) {
  _snapTerrainBegin();
  for (const id of world.query('building', 'mesh')) {
    const buildingComponent = world.get(id, 'building');
    const meshComponent = world.get(id, 'mesh');
    if (!buildingComponent || !meshComponent) {
      continue;
    }
    _snapMeshToTerrain(meshComponent);
    if ((buildingComponent.requiresWorker || hasAnimatedConstruction(buildingComponent)) && (buildingComponent.constructing || buildingComponent.pendingWorker)) {
      buildingComponent.pendingWorker = !hasActiveConstructionWorker(world, id, buildingComponent);
    }
    let constructionDelta = deltaTime;
    if ((buildingComponent.constructing || buildingComponent.pendingWorker) && buildingComponent.deliveryTime > 0) {
      const deliveryDelta = Math.min(deltaTime, Math.max(0, buildingComponent.deliveryTime - buildingComponent.deliveryProgress));
      buildingComponent.deliveryProgress += deliveryDelta;
      constructionDelta -= deliveryDelta;
    }
    if (buildingComponent.pendingWorker) {
      updateBuildingConstructionVisual(world, id, buildingComponent);
      continue;
    }
    if (buildingComponent.constructing) {
      buildingComponent.constructProgress += constructionDelta;
      const animated = updateBuildingConstructionVisual(world, id, buildingComponent);
      if (!animated && meshComponent.root && meshComponent.scaffold) {
        const pulse = 0.85 + 0.15 * Math.sin(buildingComponent.constructProgress * 6);
        childMeshes(meshComponent.root).forEach((m) => {
          if (m.material && !m._isSelRingBar) {
            const mat = m.material as THREE.MeshStandardMaterial;
            mat.opacity = pulse * 0.38;
            mat.transparent = true;
          }
        });
      }
      if (meshComponent.constructBar) {
        meshComponent.constructBar.visible = true;
        meshComponent.constructBar.position.copy(buildingComponent.position);
        meshComponent.constructBar.position.y = 5.5;
        updateHpBar(meshComponent.constructBar, Math.min(1, buildingComponent.constructProgress / buildingComponent.constructTime));
      }
      if (buildingComponent.constructProgress >= buildingComponent.constructTime) {
        if (!window._multiplayerMode) {
          _finishConstruction(world, id, buildingComponent, 'building');
        }
      }
      continue;
    }
    if (buildingComponent.type === 'mechanized' && buildingComponent.researchQueue && buildingComponent.researchQueue.length > 0) {
      const item = buildingComponent.researchQueue[0];
      item.progress += deltaTime;
      if (item.progress >= item.total) {
        buildingComponent.researchQueue.shift();
        setResearchedTech(item.key);
        updateHUD();
      }
    }
    if (buildingComponent.queue.length > 0) {
      buildingComponent.queue[0].progress += deltaTime;
      if (buildingComponent.queue[0].progress >= buildingComponent.queue[0].total) {
        if (!window._multiplayerMode) {
          const type = buildingComponent.queue[0].type;
          buildingComponent.queue.shift();
          const spawnPt = new THREE.Vector3(buildingComponent.position.x - 6, 0, buildingComponent.position.z);
          if (type === 'squad') {
            const defaultSquad = findUnitConfig(resolveFactionKey(buildingComponent.faction, playerFaction), null);
            const squadId = createSquadEntity(world, buildingComponent.team, spawnPt.x, spawnPt.z, defaultSquad?.size ?? 5, null, buildingComponent.faction);
            if (buildingComponent.rallyPoint) {
              const squadComponent = world.get(squadId, 'squad');
              if (squadComponent) {
                squadComponent.moveOrder = buildingComponent.rallyPoint.clone();
              }
            }
          } else if (type === 'builder') {
            const builderId = createBuilderEntity(world, spawnPt.x, spawnPt.z, buildingComponent.team, buildingComponent.faction);
            if (buildingComponent.rallyPoint) {
              const builderComponent = world.get(builderId, 'builder');
              if (builderComponent) {
                builderComponent.moveTarget = buildingComponent.rallyPoint.clone();
              }
            }
          } else if (buildingComponent.type === 'mechanized' || buildingComponent.type === 'mars_pattern') {
            const item = (buildingComponent.production || []).find((p: any) => p.name === type);
            if (item?.model) {
              const vehicleId = createVehicleEntity(world, buildingComponent.team, item.name, item.model, item.icon, spawnPt, item.projectileType, buildingComponent.faction);
              if (buildingComponent.rallyPoint) {
                const vehicleComponent = world.get(vehicleId, 'vehicle');
                if (vehicleComponent) {
                  vehicleComponent.moveOrder = buildingComponent.rallyPoint.clone();
                }
              }
            }
          } else {
            const unitFaction = resolveFactionKey(buildingComponent.faction, playerFaction);
            const unitConfig = findUnitConfig(unitFaction, type);
            const squadId = unitConfig
              ? createSquadEntity(world, buildingComponent.team, spawnPt.x, spawnPt.z, unitConfig.size ?? 5, type, buildingComponent.faction)
              : createSquadEntity(world, buildingComponent.team, spawnPt.x, spawnPt.z, 5, null, buildingComponent.faction);
            if (buildingComponent.rallyPoint) {
              const squadComponent = world.get(squadId, 'squad');
              if (squadComponent) {
                squadComponent.moveOrder = buildingComponent.rallyPoint.clone();
              }
            }
          }
          updateHUD();
        }
      }
    }
    meshComponent.root?._vehicleProductionAnimation?.update(buildingComponent.queue);
    if (!buildingComponent.constructing) {
      meshComponent.hpBar.position.copy(buildingComponent.position);
      meshComponent.hpBar.position.y = 4.5;
      updateHpBar(meshComponent.hpBar, buildingComponent.hp / buildingComponent.maxHp);
    }
  }
}


export function systemStructure(world: any, deltaTime: number) {
  _snapTerrainBegin();
  for (const id of world.query('structure', 'mesh')) {
    const structureComponent = world.get(id, 'structure');
    const meshComponent = world.get(id, 'mesh');
    if (!structureComponent || !meshComponent) {
      continue;
    }
    _snapMeshToTerrain(meshComponent);
    if ((structureComponent.requiresWorker || hasAnimatedConstruction(structureComponent)) && (structureComponent.constructing || structureComponent.pendingWorker)) {
      structureComponent.pendingWorker = !hasActiveConstructionWorker(world, id, structureComponent);
    }
    let constructionDelta = deltaTime;
    if ((structureComponent.constructing || structureComponent.pendingWorker) && structureComponent.deliveryTime > 0) {
      const deliveryDelta = Math.min(deltaTime, Math.max(0, structureComponent.deliveryTime - structureComponent.deliveryProgress));
      structureComponent.deliveryProgress += deliveryDelta;
      constructionDelta -= deliveryDelta;
    }
    if (structureComponent.pendingWorker) {
      updateBuildingConstructionVisual(world, id, structureComponent);
      continue;
    }
    if (structureComponent.constructing) {
      structureComponent.constructProgress += constructionDelta;
      const animated = updateBuildingConstructionVisual(world, id, structureComponent);
      if (!animated && meshComponent.root && meshComponent.scaffold) {
        const pulse = 0.85 + 0.15 * Math.sin(structureComponent.constructProgress * 6);
        childMeshes(meshComponent.root).forEach((m) => {
          if (m.material && !m._isSelRingBar) {
            const mat = m.material as THREE.MeshStandardMaterial;
            mat.opacity = pulse * 0.38;
            mat.transparent = true;
          }
        });
      }
      if (meshComponent.constructBar) {
        meshComponent.constructBar.visible = true;
        meshComponent.constructBar.position.copy(structureComponent.position);
        meshComponent.constructBar.position.y = 5.5;
        updateHpBar(meshComponent.constructBar, Math.min(1, structureComponent.constructProgress / structureComponent.constructTime));
      }
      if (structureComponent.constructProgress >= structureComponent.constructTime) {
        _finishConstruction(world, id, structureComponent, 'structure');
      }
      continue;
    }
    if (['tower', 'turret', 'towerBase', 'gunTurret'].includes(structureComponent.type)) {
      structureComponent.attackCd = Math.max(0, structureComponent.attackCd - deltaTime);
      let closest = null;
      let minDistance = Infinity;
      for (const squadId of world.query('squad')) {
        const squadComponent = world.get(squadId, 'squad');
        if (!squadComponent || squadComponent.team === structureComponent.team) {
          continue;
        }
        for (const soldierId of squadComponent.soldiers) {
          if (soldierId === null || !world.has(soldierId, 'soldier')) {
            continue;
          }
          const soldierMeshComponent = world.get(soldierId, 'mesh');
          if (!soldierMeshComponent) {
            continue;
          }
          const distance = structureComponent.position.distanceTo(soldierMeshComponent.root.position);
          if (distance < minDistance && distance <= structureComponent.attackRange) {
            minDistance = distance;
            closest = soldierId;
          }
        }
      }
      if (closest) {
        const enemyMeshComponent = world.get(closest, 'mesh');
        if (enemyMeshComponent) {
          const dx = enemyMeshComponent.root.position.x - structureComponent.position.x;
          const dz = enemyMeshComponent.root.position.z - structureComponent.position.z;
          if (meshComponent.root._turret) {
            meshComponent.root._turret.rotation.y = Math.atan2(dx, dz);
          }
          if (structureComponent.attackCd <= 0) {
            const fakeFiringPos = meshComponent.root._turret ? meshComponent.root._turret.absolutePosition.clone() : structureComponent.position.clone();
            if (structureComponent.type === 'gunTurret') {
              const angle = meshComponent.root._turret ? meshComponent.root._turret.rotation.y : 0;
              const px = Math.cos(angle);
              const pz = -Math.sin(angle);
              const leftPosition = fakeFiringPos.clone();
              leftPosition.x -= px * 0.38;
              leftPosition.z -= pz * 0.38;
              const rightPosition = fakeFiringPos.clone();
              rightPosition.x += px * 0.38;
              rightPosition.z += pz * 0.38;
              createBulletEntity(world, leftPosition, structureComponent.team, id, closest);
              createBulletEntity(world, rightPosition, structureComponent.team, id, closest);
              if (meshComponent.root._muzzleMatL) {
                meshComponent.root._muzzleMatL.opacity = 0.9;
                meshComponent.root._muzzleMatL.transparent = true;
                meshComponent.root._muzzleMatL.color.setRGB(1, 0.6, 0);
              }
              if (meshComponent.root._muzzleMatR) {
                meshComponent.root._muzzleMatR.opacity = 0.9;
                meshComponent.root._muzzleMatR.transparent = true;
                meshComponent.root._muzzleMatR.color.setRGB(1, 0.6, 0);
              }
              setTimeout(() => {
                if (meshComponent.root._muzzleMatL) {
                  meshComponent.root._muzzleMatL.opacity = 0;
                  meshComponent.root._muzzleMatL.transparent = true;
                }
                if (meshComponent.root._muzzleMatR) {
                  meshComponent.root._muzzleMatR.opacity = 0;
                  meshComponent.root._muzzleMatR.transparent = true;
                }
              }, 60);
            } else {
              createBulletEntity(world, fakeFiringPos, structureComponent.team, id, closest);
            }
            structureComponent.attackCd = 1 / structureComponent.attackRate;
          }
        }
      }
      if (meshComponent.root._coin) {
        meshComponent.root._coin.rotation.y += deltaTime * 2;
      }
      const hpBarY = structureComponent.type === 'towerBase' ? 6 : structureComponent.type === 'gunTurret' ? 4.5 : 8.5;
      meshComponent.hpBar.position.copy(structureComponent.position);
      meshComponent.hpBar.position.y = hpBarY;
      updateHpBar(meshComponent.hpBar, structureComponent.hp / structureComponent.maxHp);
    } else {
      structureComponent.pulseT += deltaTime;
      const pulse = Math.sin(structureComponent.pulseT * 3) * .5 + .5;
      if (meshComponent.root._coreGlowMat) {
        // HQ glow is a lit material (emissive), plasma-generator core is unlit (color).
        const coreGlowMat = meshComponent.root._coreGlowMat;
        if (coreGlowMat.isMeshStandardMaterial) {
          coreGlowMat.emissive.setRGB(0, 0.67 + pulse * .33, 0.27 + pulse * .27);
        } else if (coreGlowMat.color) {
          coreGlowMat.color.setRGB(0, 0.67 + pulse * .33, 0.27 + pulse * .27);
        }
      }
      if (meshComponent.root._meter) {
        meshComponent.root._meter.material.opacity = .4 + pulse * .6;
        meshComponent.root._meter.material.transparent = true;
        meshComponent.root._meter.rotation.y += deltaTime * 2;
      }
      if (['thermoGen', 'thermo_generator', 'plasma_generator'].includes(structureComponent.type)) {
        structureComponent.energyTimer += deltaTime * (PLASMA_RATE_PER * 0.1);
        if (structureComponent.energyTimer >= 1) {
          const gained = Math.floor(structureComponent.energyTimer);
          structureComponent.energyTimer -= gained;
          setEnergy(Math.min(10000, energy + gained));
        }
      }
      if (structureComponent.type === 'tactica_control' && structureComponent.researchQueue && structureComponent.researchQueue.length > 0) {
        const item = structureComponent.researchQueue[0];
        item.progress += deltaTime;
        if (item.progress >= item.total) {
          structureComponent.researchQueue.shift();
          setResearchedTech(item.key);
          updateHUD();
        }
      }
      meshComponent.hpBar.position.copy(structureComponent.position);
      meshComponent.hpBar.position.y = 6.5;
      updateHpBar(meshComponent.hpBar, structureComponent.hp / structureComponent.maxHp);
    }
  }
}


export function systemStructureCollision(world: any, deltaTime: number) {
  const blockers: number[][] = [];
  for (const id of world.query('building')) {
    const b = world.get(id, 'building');
    if (b) {
      const bounds = worldFootprint(b);
      blockers.push([(bounds.minX + bounds.maxX) / 2, (bounds.minZ + bounds.maxZ) / 2, (bounds.maxX - bounds.minX) / 2, (bounds.maxZ - bounds.minZ) / 2]);
    }
  }
  for (const id of world.query('structure')) {
    const s = world.get(id, 'structure');
    if (s) {
      const bounds = worldFootprint(s);
      blockers.push([(bounds.minX + bounds.maxX) / 2, (bounds.minZ + bounds.maxZ) / 2, (bounds.maxX - bounds.minX) / 2, (bounds.maxZ - bounds.minZ) / 2]);
    }
  }
  for (const id of world.query('airfield')) {
    const a = world.get(id, 'airfield');
    if (a) blockers.push([a.position.x, a.position.z, AIRFIELD_BOUNDS, AIRFIELD_BOUNDS]);
  }
  if (blockers.length === 0) {
    return;
  }
  const resolve = (px: number, pz: number, r: number) => {
    const fromX = px;
    const fromZ = pz;
    for (let i = 0; i < blockers.length; i++) {
      const bx = blockers[i][0];
      const bz = blockers[i][1];
      const hx = blockers[i][2];
      const hz = blockers[i][3];
      const dx = px - bx;
      const dz = pz - bz;
      const ox = hx + r - Math.abs(dx);
      const oz = hz + r - Math.abs(dz);
      if (ox > 0 && oz > 0) {
        if (ox < oz) {
          px += dx > 0 ? ox : -ox;
        } else {
          pz += dz > 0 ? oz : -oz;
        }
      }
    }
    const step = clampStepToRoute({}, fromX, fromZ, px - fromX, pz - fromZ);
    return [fromX + step[0], fromZ + step[1]];
  };
  for (const id of world.query('squad')) {
    const s = world.get(id, 'squad');
    if (!s) continue;
    const [nx, nz] = resolve(s.position.x, s.position.z, 0.5);
    s.position.x = nx;
    s.position.z = nz;
  }
  for (const id of world.query('builder', 'mesh')) {
    const b = world.get(id, 'builder');
    const m = world.get(id, 'mesh');
    if (!b || !m) continue;
    const [nx, nz] = resolve(m.root.position.x, m.root.position.z, 0.5);
    m.root.position.x = nx;
    m.root.position.z = nz;
  }
  for (const id of world.query('apc')) {
    const a = world.get(id, 'apc');
    if (!a) continue;
    const [nx, nz] = resolve(a.position.x, a.position.z, 1.2);
    a.position.x = nx;
    a.position.z = nz;
  }
  for (const id of world.query('vehicle')) {
    const v = world.get(id, 'vehicle');
    if (!v) continue;
    const [nx, nz] = resolve(v.position.x, v.position.z, 1);
    v.position.x = nx;
    v.position.z = nz;
  }
}
