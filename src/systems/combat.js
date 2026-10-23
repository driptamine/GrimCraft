import * as THREE from 'three';
import { infantryImmortal } from '../hud/store.js';
import {
  PLAYER,
  TEAM_COLOR,
  kills,
  particles,
  setKills,
  world,
} from '../scene.js';
import { childMeshes, disposeObj, mkSharedMesh } from '../three-helpers.js';
import { isGuardsmanMesh } from '../blood/blood-splat.js';
import { spawnBloodLiquid } from '../blood/blood-liquid-splat.js';


export function findClosestEnemySoldier(world, team, fromPos, squadIds = null) {
  // Squared comparisons pick the same winner without a sqrt per soldier;
  // the single sqrt runs once for the winner so `distance` stays exact.
  // Callers may pass a precomputed squad list to skip the per-call query.
  let winner = null;
  let minDistSq = Infinity;
  const ids = squadIds !== null ? squadIds : world.query('squad');
  for (const squadEntityId of ids) {
    const squadComponent = world.get(squadEntityId, 'squad');
    if (!squadComponent || squadComponent.team === team) {
      continue;
    }
    for (const soldierEntityId of squadComponent.soldiers) {
      if (soldierEntityId === null) {
        continue;
      }
      const soldierComponent = world.get(soldierEntityId, 'soldier');
      if (!soldierComponent) {
        continue;
      }
      if (soldierComponent.cloaked && soldierComponent.revealTimer <= 0) {
        continue;
      }
      const meshComponent = world.get(soldierEntityId, 'mesh');
      if (!meshComponent) {
        continue;
      }
      const distSq = fromPos.distanceToSquared(meshComponent.root.position);
      if (distSq < minDistSq) {
        minDistSq = distSq;
        winner = { soldierEntityId, squad: squadComponent, squadEntityId };
      }
    }
  }
  if (!winner) {
    return null;
  }
  winner.distance = Math.sqrt(minDistSq);
  return winner;
}


export function disposeMeshComponent(meshComponent) {
  if (!meshComponent) {
    return;
  }
  if (meshComponent.root) {
    if (meshComponent.root._animGroups) {
      Object.values(meshComponent.root._animGroups).forEach((ag) => {
        try {
          ag.stop();
          ag.dispose();
        } catch (e) {
          // Intentionally empty
        }
      });
      meshComponent.root._animGroups = {};
    }
    if (meshComponent.root._instanceData) {
      try {
        meshComponent.root._instanceData.animationGroups.forEach((ag) => {
          try {
            ag.stop();
            ag.dispose();
          } catch (e) {
            // Intentionally empty
          }
        });
        meshComponent.root._instanceData.rootNodes.forEach((n) => {
          try {
            childMeshes(n).forEach((m) => disposeObj(m));
            disposeObj(n);
          } catch (e) {
            // Intentionally empty
          }
        });
      } catch (e) {
        // Intentionally empty
      }
      meshComponent.root._instanceData = null;
    }
    childMeshes(meshComponent.root).forEach((m) => disposeObj(m));
    disposeObj(meshComponent.root);
  }
  if (meshComponent.hpBar) {
    childMeshes(meshComponent.hpBar).forEach((m) => disposeObj(m));
    disposeObj(meshComponent.hpBar);
  }
  if (meshComponent.prodBar) {
    childMeshes(meshComponent.prodBar).forEach((m) => disposeObj(m));
    disposeObj(meshComponent.prodBar);
  }
  if (meshComponent.selRing) {
    if (meshComponent.selRing.material) {
      meshComponent.selRing.material.dispose();
    }
    disposeObj(meshComponent.selRing);
  }
  if (meshComponent.reinBar) {
    childMeshes(meshComponent.reinBar).forEach((m) => disposeObj(m));
    disposeObj(meshComponent.reinBar);
  }
  if (meshComponent.grenadeSetupBar) {
    childMeshes(meshComponent.grenadeSetupBar).forEach((m) => disposeObj(m));
    disposeObj(meshComponent.grenadeSetupBar);
  }
  if (meshComponent.group) {
    childMeshes(meshComponent.group).forEach((m) => disposeObj(m));
    disposeObj(meshComponent.group);
  }
  if (meshComponent.capRing) {
    disposeObj(meshComponent.capRing);
  }
  if (meshComponent.lpMesh) {
    childMeshes(meshComponent.lpMesh).forEach((m) => disposeObj(m));
    disposeObj(meshComponent.lpMesh);
  }
}


// One shared box for every hit particle: spawnParticles runs per hit with
// several particles each, so per-particle geometry churn is pure waste.
const _particleGeo = new THREE.BoxGeometry(.1, .1, .1);
_particleGeo.userData.shared = true;

export function spawnParticles(position, color, count) {
  for (let i = 0; i < count; i++) {
    const particleMesh = mkSharedMesh(_particleGeo, 'pt');
    particleMesh.position.copy(position);
    const particleMaterial = new THREE.MeshBasicMaterial();
    particleMaterial.color.copy(color);
    particleMaterial.opacity = 1;
    particleMesh.material = particleMaterial;
    const vx = (Math.random() - .5) * 8;
    const vy = Math.random() * 6 + 1;
    const vz = (Math.random() - .5) * 8;
    particles.push({
      mesh: particleMesh,
      material: particleMaterial,
      vx,
      vy,
      vz,
      life: .45 + Math.random() * .35,
      age: 0,
    });
  }
}


export function _bulletDestroy(world, id, meshComponent) {
  disposeObj(meshComponent.root);
  world.destroyEntity(id);
}


export function _soldierTakeDamage(world, soldierId, damage) {
  const soldierComponent = world.get(soldierId, 'soldier');
  if (!soldierComponent) {
    return;
  }
  if (infantryImmortal) {
    const squadComponent = world.get(soldierComponent.squadId, 'squad');
    if (squadComponent && squadComponent.team === PLAYER) {
      return;
    }
  }
  soldierComponent.hp -= damage;
  soldierComponent.flashTimer = .12;
  const hitMesh = world.get(soldierId, 'mesh');
  if (hitMesh && hitMesh.root && isGuardsmanMesh(hitMesh.root)) {
    const p = hitMesh.root.position;
    spawnBloodLiquid({ x: p.x, y: p.y + 1.1, z: p.z }, soldierComponent.hp <= 0 ? 1.6 : 1);
  }
  if (soldierComponent.hp <= 0) {
    _soldierDie(world, soldierId, true);
  }
}


export function disposeSoldierHud(meshComponent) {
  try {
    childMeshes(meshComponent.hpBar).forEach((m) => disposeObj(m));
    disposeObj(meshComponent.hpBar);
  } catch (e) { /* ignore */ }
  if (meshComponent.reloadBar) {
    try {
      childMeshes(meshComponent.reloadBar).forEach((m) => disposeObj(m));
      disposeObj(meshComponent.reloadBar);
    } catch (e) { /* ignore */ }
  }
  if (meshComponent.root) {
    ['_selDisc', '_teamRing', '_selRing'].forEach((key) => {
      const ring = meshComponent.root[key];
      if (ring) {
        try {
          ring.visible = false;
          ring.visible = false;
          disposeObj(ring);
        } catch (e) { /* ignore */ }
      }
    });
    if (meshComponent.root._blobShadow) {
      try {
        meshComponent.root._blobShadow.visible = false;
      } catch (e) { /* ignore */ }
    }
  }
}


export function disposeSoldierMeshes(meshComponent) {
  try {
    childMeshes(meshComponent.root).forEach((m) => disposeObj(m));
    disposeObj(meshComponent.root);
  } catch (e) { /* ignore */ }
  disposeSoldierHud(meshComponent);
}


export function _soldierDie(world, soldierId, countKill) {
  const soldierComponent = world.get(soldierId, 'soldier');
  const meshComponent = world.get(soldierId, 'mesh');
  if (!soldierComponent) {
    return;
  }
  if (countKill === undefined) {
    countKill = false;
  }
  if (countKill) {
    setKills(kills + 1);
  }
  const team = world.get(soldierComponent.squadId, 'squad')?.team || 'blue';
  if (meshComponent) {
    spawnParticles(meshComponent.root.position, TEAM_COLOR[team].projectile, 8);
    disposeSoldierHud(meshComponent);
    if (meshComponent.root._dieAnims && meshComponent.root._dieAnims.length) {
      const ag = meshComponent.root._dieAnims[Math.floor(Math.random() * meshComponent.root._dieAnims.length)];
      try {
        Object.values(meshComponent.root._animGroups).forEach((g) => {
          try {
            g.stop();
          } catch (e) { /* ignore */ }
        });
        ag.loopAnimation = false;
        ag.onAnimationGroupEndObservable.clear();
        ag.reset();
        ag.start(false, 1.0);
        let disposed = false;
        const disposeAfter = () => {
          if (disposed) {
            return;
          }
          disposed = true;
          disposeSoldierMeshes(meshComponent);
        };
        ag.onAnimationGroupEndObservable.addOnce(disposeAfter);
        setTimeout(disposeAfter, (ag.getDuration() + 1) * 1000);
      } catch (e) {
        console.warn('die anim error', e);
      }
    } else {
      disposeSoldierMeshes(meshComponent);
    }
  }
  const squad = world.get(soldierComponent.squadId, 'squad');
  if (squad) {
    const idx = squad.soldiers.indexOf(soldierId);
    if (idx >= 0) {
      squad.soldiers[idx] = null;
    }
  }
  world.destroyEntity(soldierId);
}
