import * as THREE from 'three';
import { createBeamEntity, createBulletEntity, createLaserBulletEntity, createPlasmaBulletEntity } from '../entities.js';
import { updateHUD } from '../hud.js';
import { updateHpBar } from '../meshes.js';
import { currentBounds, selSquads, setSelSquads, world } from '../scene.js';
import { HILL_RELEASE_DIST } from '../../pathfinding/avoid.js';
import { clampStepToRoute, exitsStraight, updateMoverRoute } from '../../pathfinding/astar-integrated.js';
import { disposeMeshComponent, spawnParticles } from './combat.js';
import { _avoidDir, _groundAt, _snapTerrainBegin } from './terrain.js';


export function systemApc(world, deltaTime) {
  _snapTerrainBegin();
  for (const id of world.query('apc', 'mesh')) {
    const apc = world.get(id, 'apc');
    const meshComponent = world.get(id, 'mesh');
    if (!apc || !meshComponent) {
      continue;
    }
    apc.selected = selSquads.includes(id);
    if (apc.queue && apc.queue.length > 0) {
      apc.queue[0].progress += deltaTime;
      if (apc.queue[0].progress >= apc.queue[0].total) {
        apc.queue.shift();
        updateHUD();
      }
    }
    if (apc.moveOrder) {
      const dx = apc.moveOrder.x - apc.position.x;
      const dz = apc.moveOrder.z - apc.position.z;
      const distance = Math.hypot(dx, dz);
      if (distance < 1) {
        apc.moveOrder = null;
      } else {
        const routeTarget = updateMoverRoute(apc, apc.position, apc.moveOrder) || apc.moveOrder;
        const rdx = routeTarget.x - apc.position.x;
        const rdz = routeTarget.z - apc.position.z;
        const rlen = Math.hypot(rdx, rdz) || 1;
        const _ad = exitsStraight(apc, apc.position.x, apc.position.z)
          ? { x: rdx / rlen, z: rdz / rlen }
          : _avoidDir(apc, apc.position.x, apc.position.z, rdx / rlen, rdz / rlen, distance, HILL_RELEASE_DIST);
        {
          const step = clampStepToRoute(apc, apc.position.x, apc.position.z, _ad.x * apc.speed * deltaTime, _ad.z * apc.speed * deltaTime);
          apc.position.x += step[0];
          apc.position.z += step[1];
        }
        apc.position.x = Math.max(-currentBounds(), Math.min(currentBounds(), apc.position.x));
        apc.position.z = Math.max(-currentBounds(), Math.min(currentBounds(), apc.position.z));
        meshComponent.root.rotation.y = Math.atan2(_ad.x, _ad.z);
      }
    }
    apc.position.y = _groundAt(apc.position.x, apc.position.z);
    meshComponent.root.position.copy(apc.position);
    for (const passId of apc.passengers) {
      const squadComponent = world.get(passId, 'squad');
      const builderComponent = world.get(passId, 'builder');
      if (squadComponent) {
        squadComponent.position.copy(apc.position);
      }
      if (builderComponent) {
        const builderMeshComponent = world.get(passId, 'mesh');
        if (builderMeshComponent?.root) {
          builderMeshComponent.root.position.copy(apc.position);
        }
      }
    }
    apc.attackCd = Math.max(0, apc.attackCd - deltaTime);
    let closest = null;
    let minDistance = Infinity;
    for (const squadId of world.query('squad')) {
      const squadComponent = world.get(squadId, 'squad');
      if (!squadComponent || squadComponent.team === apc.team) {
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
        const distance = apc.position.distanceTo(soldierMeshComponent.root.position);
        if (distance < minDistance && distance <= apc.attackRange) {
          minDistance = distance;
          closest = soldierId;
        }
      }
    }
    if (closest) {
      const enemyMeshComponent = world.get(closest, 'mesh');
      if (enemyMeshComponent && meshComponent.root._turret) {
        const dx = enemyMeshComponent.root.position.x - apc.position.x;
        const dz = enemyMeshComponent.root.position.z - apc.position.z;
        meshComponent.root._turret.rotation.y = Math.atan2(dx, dz);
        if (minDistance > apc.attackRange * .85 && !apc.moveOrder && !apc.selected) {
          const enemyPosition = enemyMeshComponent.root.position;
          apc.moveOrder = new THREE.Vector3(enemyPosition.x, 0, enemyPosition.z);
        }
      }
      if (apc.attackCd <= 0) {
        const projectileType = apc.projectileType || 'laser';
        if (projectileType === 'bullet') {
          createBulletEntity(world, apc.position, apc.team, id, closest);
        } else if (projectileType === 'plasma') {
          createPlasmaBulletEntity(world, apc.position, apc.team, id, closest);
        } else {
          createLaserBulletEntity(world, apc.position, apc.team, id, closest);
        }
        const laserSlowdown = projectileType === 'laser' ? 2.5 : 1;
        apc.attackCd = (1 / apc.attackRate) * laserSlowdown;
        apc.laserPulse = 0.08;
      }
    }
    if (apc.laserPulse > 0) {
      apc.laserPulse -= deltaTime;
      if (meshComponent.root._laserTipMat) {
        meshComponent.root._laserTipMat.emissive.setRGB(1, 0, 0);
      }
    } else {
      if (meshComponent.root._laserTipMat) {
        meshComponent.root._laserTipMat.emissive.setRGB(.4, 0, 0);
      }
    }
    meshComponent.hpBar.position.copy(apc.position);
    meshComponent.hpBar.position.y = 3.5;
    updateHpBar(meshComponent.hpBar, apc.hp / apc.maxHp);
    if (apc.hp <= 0) {
      _apcEjectPassengers(world, apc);
      spawnParticles(apc.position.clone(), new THREE.Color(1, .53, 0), 30);
      disposeMeshComponent(meshComponent);
      if (selSquads.includes(id)) {
        setSelSquads(selSquads.filter((s) => s !== id));
      }
      world.destroyEntity(id);
    }
  }
}


export function systemVehicle(world, deltaTime) {
  _snapTerrainBegin();
  for (const id of world.query('vehicle', 'mesh')) {
    const vehicle = world.get(id, 'vehicle');
    const meshComponent = world.get(id, 'mesh');
    if (!vehicle || !meshComponent) {
      continue;
    }
    vehicle.selected = selSquads.includes(id);
    if (vehicle.moveOrder) {
      const dx = vehicle.moveOrder.x - vehicle.position.x;
      const dz = vehicle.moveOrder.z - vehicle.position.z;
      const distance = Math.hypot(dx, dz);
      if (distance < 1) {
        vehicle.moveOrder = null;
      } else {
        const routeTarget = updateMoverRoute(vehicle, vehicle.position, vehicle.moveOrder) || vehicle.moveOrder;
        const rdx = routeTarget.x - vehicle.position.x;
        const rdz = routeTarget.z - vehicle.position.z;
        const rlen = Math.hypot(rdx, rdz) || 1;
        const _vd = exitsStraight(vehicle, vehicle.position.x, vehicle.position.z)
          ? { x: rdx / rlen, z: rdz / rlen }
          : _avoidDir(vehicle, vehicle.position.x, vehicle.position.z, rdx / rlen, rdz / rlen, distance, HILL_RELEASE_DIST);
        {
          const step = clampStepToRoute(vehicle, vehicle.position.x, vehicle.position.z, _vd.x * vehicle.speed * deltaTime, _vd.z * vehicle.speed * deltaTime);
          vehicle.position.x += step[0];
          vehicle.position.z += step[1];
        }
        vehicle.position.x = Math.max(-currentBounds(), Math.min(currentBounds(), vehicle.position.x));
        vehicle.position.z = Math.max(-currentBounds(), Math.min(currentBounds(), vehicle.position.z));
        meshComponent.root.rotation.y = Math.atan2(_vd.x, _vd.z);
      }
    }
    vehicle.position.y = _groundAt(vehicle.position.x, vehicle.position.z);
    meshComponent.root.position.copy(vehicle.position);
    vehicle.attackCd = Math.max(0, vehicle.attackCd - deltaTime);
    let closest = null;
    let minDistance = Infinity;
    for (const squadId of world.query('squad')) {
      const squadComponent = world.get(squadId, 'squad');
      if (!squadComponent || squadComponent.team === vehicle.team) {
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
        const distance = vehicle.position.distanceTo(soldierMeshComponent.root.position);
        if (distance < minDistance && distance <= vehicle.attackRange) {
          minDistance = distance;
          closest = soldierId;
        }
      }
    }
    if (closest) {
      const enemyMeshComponent = world.get(closest, 'mesh');
      if (enemyMeshComponent && meshComponent.root._turret) {
        const dx = enemyMeshComponent.root.position.x - vehicle.position.x;
        const dz = enemyMeshComponent.root.position.z - vehicle.position.z;
        meshComponent.root._turret.rotation.y = Math.atan2(dx, dz);
      }
      if (vehicle.attackCd <= 0) {
        const projectileType = vehicle.projectileType || 'laser';
        if (projectileType === 'beam') {
          createBeamEntity(world, vehicle.position, vehicle.team, id, closest);
        } else if (projectileType === 'bullet') {
          createBulletEntity(world, vehicle.position, vehicle.team, id, closest);
        } else {
          createLaserBulletEntity(world, vehicle.position, vehicle.team, id, closest);
        }
        const laserSlowdown = (projectileType === 'laser' || projectileType === 'beam') ? 2.5 : 1;
        vehicle.attackCd = (1 / vehicle.attackRate) * laserSlowdown;
        vehicle.laserPulse = 0.08;
      }
    }
    if (vehicle.laserPulse > 0) {
      vehicle.laserPulse -= deltaTime;
      if (meshComponent.root._laserTipMat) {
        meshComponent.root._laserTipMat.emissive.setRGB(1, 0, 0);
      }
    } else if (meshComponent.root._laserTipMat) {
      meshComponent.root._laserTipMat.emissive.setRGB(.4, 0, 0);
    }
    meshComponent.hpBar.position.copy(vehicle.position);
    meshComponent.hpBar.position.y = 3.5;
    updateHpBar(meshComponent.hpBar, vehicle.hp / vehicle.maxHp);
    if (vehicle.hp <= 0) {
      spawnParticles(vehicle.position.clone(), new THREE.Color(1, .53, 0), 30);
      disposeMeshComponent(meshComponent);
      if (selSquads.includes(id)) {
        setSelSquads(selSquads.filter((s) => s !== id));
      }
      world.destroyEntity(id);
    }
  }
}


export function _apcEjectPassengers(world, apc) {
  const toUnload = [...apc.passengers];
  apc.passengers = [];
  toUnload.forEach((uid, i) => {
    const squadComponent = world.get(uid, 'squad');
    const builderComponent = world.get(uid, 'builder');
    const offset = new THREE.Vector3((i - (toUnload.length - 1) / 2) * 5, 0, 3);
    if (squadComponent) {
      squadComponent.position.set(apc.position.x + offset.x, 0, apc.position.z + offset.z);
      squadComponent.stopped = false;
      squadComponent.soldiers.forEach((soldierId) => {
        if (soldierId) {
          const soldierMeshComponent = world.get(soldierId, 'mesh');
          if (soldierMeshComponent) {
            soldierMeshComponent.root.visible = true;
            soldierMeshComponent.root.position.copy(squadComponent.position);
          }
        }
      });
      const squadMeshComponent = world.get(uid, 'mesh');
      if (squadMeshComponent?.hpBar) {
        squadMeshComponent.hpBar.visible = true;
      }
    }
    if (builderComponent) {
      const builderMeshComponent = world.get(uid, 'mesh');
      if (builderMeshComponent?.root) {
        builderMeshComponent.root.visible = true;
        builderMeshComponent.root.position.set(apc.position.x + offset.x, 0, apc.position.z + offset.z);
      }
    }
  });
}
