import * as THREE from 'three';
import { updateHUD } from '../hud.js';
import { updateHpBar } from '../meshes.js';
import { JET_ALT, JET_ATTACK_RANGE, JET_SPEED, world } from '../scene.js';
import { childMeshes, disposeObj } from '../three-helpers.js';
import { spawnParticles } from './combat.js';
import { _snapMeshToTerrain, _snapTerrainBegin } from './terrain.js';


export function systemAirfield(world, deltaTime) {
  _snapTerrainBegin();
  for (const id of world.query('airfield', 'mesh')) {
    const airfield = world.get(id, 'airfield');
    const meshComponent = world.get(id, 'mesh');
    if (!airfield || !meshComponent) {
      continue;
    }
    _snapMeshToTerrain(meshComponent);
    if (airfield.constructing) {
      airfield.constructProgress += deltaTime;
      if (meshComponent.root && meshComponent.scaffold) {
        const pulse = 0.85 + 0.15 * Math.sin(airfield.constructProgress * 6);
        childMeshes(meshComponent.root).forEach((m) => {
          if (m.material && !m._isSelRingBar) {
            m.material.opacity = pulse * 0.38;
            m.material.transparent = true;
          }
        });
      }
      if (meshComponent.constructBar) {
        meshComponent.constructBar.visible = true;
        meshComponent.constructBar.position.copy(airfield.position);
        meshComponent.constructBar.position.y = 5.5;
        updateHpBar(meshComponent.constructBar, Math.min(1, airfield.constructProgress / airfield.constructTime));
      }
      if (airfield.constructProgress >= airfield.constructTime && !window._multiplayerMode && !meshComponent._realMeshBuilt) {
        if (meshComponent.scaffold) {
          childMeshes(meshComponent.scaffold).forEach((m) => {
            if (m.material) {
              m.material.dispose();
            }
            disposeObj(m);
          });
          disposeObj(meshComponent.scaffold);
          meshComponent.scaffold = null;
        }
        if (meshComponent.constructBar) {
          childMeshes(meshComponent.constructBar).forEach((m) => {
            if (m.material) {
              m.material.dispose();
            }
            disposeObj(m);
          });
          disposeObj(meshComponent.constructBar);
          meshComponent.constructBar = null;
        }
        meshComponent.root = meshComponent._meshFactory();
        meshComponent._realMeshBuilt = true;
        airfield.constructing = false;
        if (meshComponent.hpBar) {
          meshComponent.hpBar.visible = true;
        }
        updateHUD();
      }
      continue;
    }
    airfield.beaconT += deltaTime;
    if (meshComponent.root && meshComponent.root._beaconMat) {
      const on = Math.sin(airfield.beaconT * 5) > 0.2;
      meshComponent.root._beaconMat.emissive.setRGB(on ? 1 : 0.1, on ? 0.1 : 0, 0);
    }
    if (airfield.queue.length > 0) {
      airfield.queue[0].progress += deltaTime;
      if (meshComponent.prodBar) {
        meshComponent.prodBar.visible = true;
        meshComponent.prodBar.position.copy(airfield.position);
        meshComponent.prodBar.position.y = 8.5;
        if (meshComponent.prodBar._fg?.material) {
          meshComponent.prodBar._fg.material.color.setRGB(0.2, 0.7, 1);
        }
        updateHpBar(meshComponent.prodBar, airfield.queue[0].progress / airfield.queue[0].total);
      }
      if (airfield.queue[0].progress >= airfield.queue[0].total && !window._multiplayerMode) {
        airfield.queue.shift();
        const spawnPt = new THREE.Vector3(airfield.position.x + 8, JET_ALT, airfield.position.z);
        const jetId = createJetEntity(world, spawnPt);
        if (airfield.rallyPoint) {
          const jet = world.get(jetId, 'jet');
          if (jet) {
            jet.moveOrder = new THREE.Vector3(airfield.rallyPoint.x, JET_ALT, airfield.rallyPoint.z);
            jet.waitOrders = false;
          }
        }
        if (airfield.queue.length === 0 && meshComponent.prodBar) {
          meshComponent.prodBar.visible = false;
        }
        if (airfield.rallyPoint) {
          airfield.rallyPoint = null;
        }
        updateHUD();
      }
    } else if (meshComponent.prodBar) {
      meshComponent.prodBar.visible = false;
    }
    if (!airfield.constructing) {
      meshComponent.hpBar.position.copy(airfield.position);
      meshComponent.hpBar.position.y = 7;
      updateHpBar(meshComponent.hpBar, airfield.hp / airfield.maxHp);
    }
  }
}


export function systemJet(world, deltaTime) {
  for (const id of world.query('jet', 'mesh')) {
    const jet = world.get(id, 'jet');
    const meshComponent = world.get(id, 'mesh');
    if (!jet || !meshComponent) {
      continue;
    }
    jet.flameT += deltaTime;
    jet.attackCd = Math.max(0, jet.attackCd - deltaTime);
    jet.strafeCd = Math.max(0, jet.strafeCd - deltaTime);
    if (jet.shootFlashT > 0) {
      jet.shootFlashT = Math.max(0, jet.shootFlashT - deltaTime);
    }
    const isShooting = jet.shootFlashT > 0;
    [-0.55, 0.55].forEach((ex) => {
      const fm = meshComponent.root[`_flameMat_${ex}`];
      if (!fm) {
        return;
      }
      if (isShooting) {
        fm.opacity = 0.15;
        fm.transparent = true;
      } else {
        fm.opacity = 0.65 + 0.25 * Math.sin(jet.flameT * 18 + ex * 3);
        fm.transparent = true;
      }
    });
    meshComponent.hpBar.position.set(jet.position.x, jet.position.y + 2.5, jet.position.z);
    updateHpBar(meshComponent.hpBar, jet.hp / jet.maxHp);
    if (jet.moveOrder) {
      const dx = jet.moveOrder.x - jet.position.x;
      const dz = jet.moveOrder.z - jet.position.z;
      const distance = Math.hypot(dx, dz);
      if (distance < 3) {
        jet.holdPos = jet.position.clone();
        jet.orbitAngle = Math.atan2(jet.position.x - jet.holdPos.x, jet.position.z - jet.holdPos.z);
        jet.moveOrder = null;
        jet.waitOrders = false;
      } else {
        const inverse = 1 / distance;
        jet.position.x += (dx * inverse) * JET_SPEED * deltaTime;
        jet.position.z += (dz * inverse) * JET_SPEED * deltaTime;
        jet.position.y += (JET_ALT - jet.position.y) * 2 * deltaTime;
        meshComponent.root.rotation.y = Math.atan2(dx * inverse, dz * inverse);
        jet.bankAngle = jet.bankAngle * 0.92 + 0.18 * 0.08;
        meshComponent.root.rotation.z = jet.bankAngle * -1;
        meshComponent.root.position.copy(jet.position);
        continue;
      }
    }
    if (jet.waitOrders || jet.patrolMode === 'hold') {
      jet.position.y += (JET_ALT - jet.position.y) * 2 * deltaTime;
      meshComponent.root.rotation.z = 0;
      meshComponent.root.position.copy(jet.position);
      continue;
    }
    if (jet.forcedTargetSqId !== null && !world.has(jet.forcedTargetSqId, 'squad')) {
      jet.forcedTargetSqId = null;
    }
    let closestSquadId = null;
    let minDistance = Infinity;
    for (const squadId of world.query('squad')) {
      const squadComponent = world.get(squadId, 'squad');
      if (!squadComponent || squadComponent.team === jet.team) {
        continue;
      }
      const distance = new THREE.Vector3(squadComponent.position.x, 0, squadComponent.position.z).distanceTo(new THREE.Vector3(jet.position.x, 0, jet.position.z));
      if (distance < minDistance) {
        minDistance = distance;
        closestSquadId = squadId;
      }
    }
    const attackSqId = jet.forcedTargetSqId !== null ? jet.forcedTargetSqId : closestSquadId;
    const attackSq = attackSqId !== null ? world.get(attackSqId, 'squad') : null;
    const attackDistance = attackSq
      ? new THREE.Vector3(attackSq.position.x, 0, attackSq.position.z).distanceTo(new THREE.Vector3(jet.position.x, 0, jet.position.z))
      : Infinity;
    const isAttacking = attackSq && attackDistance < JET_ATTACK_RANGE;
    if (isAttacking) {
      jet.position.y += (JET_ALT - jet.position.y) * 2 * deltaTime;
      const tdx = attackSq.position.x - jet.position.x;
      const tdz = attackSq.position.z - jet.position.z;
      meshComponent.root.rotation.y = Math.atan2(tdx, tdz);
      jet.bankAngle = jet.bankAngle * 0.85;
    } else {
      const cx = jet.patrolMode === 'orbit' ? jet.holdPos.x : 0;
      const cz = jet.patrolMode === 'orbit' ? jet.holdPos.z : 0;
      jet.orbitAngle += jet.orbitSpeed * deltaTime;
      const tx = cx + Math.sin(jet.orbitAngle) * jet.orbitR;
      const tz = cz + Math.cos(jet.orbitAngle) * jet.orbitR;
      const dx = tx - jet.position.x;
      const dz = tz - jet.position.z;
      const dist = Math.hypot(dx, dz) || 1;
      jet.position.x += (dx / dist) * JET_SPEED * deltaTime;
      jet.position.z += (dz / dist) * JET_SPEED * deltaTime;
      jet.position.y += (JET_ALT - jet.position.y) * 2 * deltaTime;
      if (!isShooting) {
        jet.bankAngle = jet.bankAngle * 0.92 + 0.28 * 0.08;
      }
      const tanX = Math.cos(jet.orbitAngle);
      const tanZ = -Math.sin(jet.orbitAngle);
      meshComponent.root.rotation.y = Math.atan2(tanX, tanZ);
    }
    if (jet.attackCd <= 0 && isAttacking) {
      createMissileEntity(world, jet.position.clone(), attackSqId);
      jet.attackCd = 1 / jet.attackRate;
      jet.shootFlashT = 0.18;
      spawnParticles(jet.position.clone(), new THREE.Color(1, 0.7, 0.2), 4);
    }
    meshComponent.root.rotation.z = jet.bankAngle * -1;
    meshComponent.root.position.copy(jet.position);
  }
}
