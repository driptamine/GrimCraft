import * as THREE from 'three';
import { updatePlasmaBoltCrackle } from '../plasma-bolt.js';
import {
  PLAYER,
  addBeforeRender,
  getDeltaTime,
  grenadeCallbacks,
  particles,
  removeBeforeRender,
  world,
} from '../scene.js';
import { childMeshes, disposeObj, mkBox, mkDisc } from '../three-helpers.js';
import { _bulletDestroy, _soldierTakeDamage, spawnParticles } from './combat.js';
import { _groundAt, _snapTerrainBegin } from './terrain.js';

export const _boltLookTarget = new THREE.Vector3();
export const _boltFlashWhite = new THREE.Color(1, 1, 1);


export function systemBullet(world, deltaTime) {
  if (window._multiplayerMode) {
    return;
  }
  _snapTerrainBegin();
  // APC/vehicle rosters are fixed for the tick (this loop never creates or
  // destroys them — it only damages), so query once instead of per bullet.
  const apcIds = world.query('apc');
  const vehicleIds = world.query('vehicle');
  for (const id of world.query('bullet', 'mesh')) {
    const bulletComponent = world.get(id, 'bullet');
    const meshComponent = world.get(id, 'mesh');
    if (!bulletComponent || !meshComponent) {
      continue;
    }
    // Plasma (and any future typed projectile sharing the 'bullet' component)
    // is owned by its own system; processing it here too would age/move it
    // twice per frame and kill it mid-flight with gravity it never should take.
    if (bulletComponent.projectileType && bulletComponent.projectileType !== 'bullet') {
      continue;
    }
    bulletComponent.age += deltaTime;
    if (bulletComponent.age > 2) {
      _bulletDestroy(world, id, meshComponent);
      continue;
    }
    bulletComponent.vy -= 6 * deltaTime;
    meshComponent.root.position.x += bulletComponent.vx * deltaTime;
    meshComponent.root.position.y += bulletComponent.vy * deltaTime;
    meshComponent.root.position.z += bulletComponent.vz * deltaTime;
    meshComponent.root.rotation.y = Math.atan2(bulletComponent.vx, bulletComponent.vz);
    const targetMeshComponent = world.get(bulletComponent.targetId, 'mesh');
    if (targetMeshComponent && world.has(bulletComponent.targetId, 'soldier')) {
      const distance = meshComponent.root.position.distanceTo(targetMeshComponent.root.position);
      if (distance < .6) {
        _soldierTakeDamage(world, bulletComponent.targetId, bulletComponent.damage);
        spawnParticles(meshComponent.root.position, new THREE.Color(.87, .67, 0), 3);
        _bulletDestroy(world, id, meshComponent);
        continue;
      }
    }
    if (meshComponent.root.position.y < _groundAt(meshComponent.root.position.x, meshComponent.root.position.z) + .05) {
      _bulletDestroy(world, id, meshComponent);
    }
    if (bulletComponent.team !== PLAYER) {
      for (const apcId of apcIds) {
        const apc = world.get(apcId, 'apc');
        if (!apc || apc.team !== PLAYER) {
          continue;
        }
        if (meshComponent.root.position.distanceToSquared(apc.position) < 6.25) {
          apc.hp -= bulletComponent.damage * 0.4;
          _bulletDestroy(world, id, meshComponent);
          break;
        }
      }
      for (const vehicleId of vehicleIds) {
        const vehicle = world.get(vehicleId, 'vehicle');
        if (!vehicle || vehicle.team !== PLAYER) {
          continue;
        }
        if (meshComponent.root.position.distanceToSquared(vehicle.position) < 6.25) {
          vehicle.hp -= bulletComponent.damage * 0.4;
          _bulletDestroy(world, id, meshComponent);
          break;
        }
      }
    }
  }
}


export function systemGrenade(world, deltaTime) {
  _snapTerrainBegin();
  for (const id of world.query('grenade', 'mesh')) {
    const grenadeComponent = world.get(id, 'grenade');
    const meshComponent = world.get(id, 'mesh');
    if (!grenadeComponent || !meshComponent) {
      continue;
    }
    grenadeComponent.age += deltaTime;
    meshComponent.root.rotation.x += deltaTime * 7;
    meshComponent.root.rotation.z += deltaTime * 5;
    if (window._multiplayerMode) {
      continue;
    }
    if (grenadeComponent.age > 6) {
      _grenadeExplode(world, id, grenadeComponent, meshComponent);
      continue;
    }
    grenadeComponent.vy -= 16 * deltaTime;
    meshComponent.root.position.x += grenadeComponent.vx * deltaTime;
    meshComponent.root.position.y += grenadeComponent.vy * deltaTime;
    meshComponent.root.position.z += grenadeComponent.vz * deltaTime;
    const smokeTrailTimer = grenadeComponent.smokeAcc !== undefined ? (grenadeComponent.smokeAcc += deltaTime) : (grenadeComponent.smokeAcc = 0);
    if (smokeTrailTimer >= 0.03) {
      grenadeComponent.smokeAcc = 0;
      const smokePos = meshComponent.root.position.clone();
      const smokeMesh = mkBox('smoke', .18, .18, .18);
      smokeMesh.position.copy(smokePos);
      const smokeMat = new THREE.MeshBasicMaterial();
      smokeMat.color = new THREE.Color(.5, .5, .5);
      smokeMat.opacity = .75;
      smokeMat.transparent = true;
      smokeMesh.material = smokeMat;
      particles.push({
        mesh: smokeMesh,
        material: smokeMat,
        vx: (Math.random() - .5) * .5,
        vy: .15 + Math.random() * .35,
        vz: (Math.random() - .5) * .5,
        life: 1.6 + Math.random() * .8,
        age: 0,
        alpha: .75,
        grow: .5 + Math.random() * .4,
        noGravity: true,
      });
    }
    const grenadeGroundY = _groundAt(meshComponent.root.position.x, meshComponent.root.position.z);
    if (meshComponent.root.position.y <= grenadeGroundY + .1) {
      meshComponent.root.position.y = grenadeGroundY + .1;
      _grenadeExplode(world, id, grenadeComponent, meshComponent);
    }
  }
}


export function _grenadeExplode(world, id, grenadeComponent, meshComponent) {
  const pos = meshComponent.root.position.clone();
  disposeObj(meshComponent.root);
  world.destroyEntity(id);
  spawnParticles(pos, new THREE.Color(1, .53, 0), 40);
  spawnParticles(pos, new THREE.Color(1, .87, .27), 18);
  spawnParticles(new THREE.Vector3(pos.x, .5, pos.z), new THREE.Color(1, 1, 1), 12);
  [.6, .35].forEach((dur, ri) => {
    const ring = mkDisc('explosion_ring', .45, 32, true);
    ring.rotation.x = -Math.PI / 2;
    ring.position.copy(pos);
    ring.position.y = .05;
    const rm = new THREE.MeshBasicMaterial();
    rm.color = ri ? new THREE.Color(1, 1, 1) : new THREE.Color(1, .53, 0);
    rm.opacity = .85;
    rm.transparent = true;
    ring.material = rm;
    let age = 0;
    grenadeCallbacks.push((dt2) => {
      age += dt2;
      const time = age / dur;
      const scale = 1 + time * (ri ? 6 : 12);
      ring.scale.set(scale, scale, scale);
      rm.opacity = .85 * (1 - time);
      rm.transparent = true;
      if (age >= dur) {
        disposeObj(ring);
        return true;
      }
      return false;
    });
  });
  for (const squadId of world.query('squad')) {
    const squadComponent = world.get(squadId, 'squad');
    if (!squadComponent) {
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
      const distance = pos.distanceTo(soldierMeshComponent.root.position);
      if (distance <= grenadeComponent.blastR) {
        const damageAmount = grenadeComponent.blastDmg * (1 - distance / grenadeComponent.blastR);
        _soldierTakeDamage(world, soldierId, damageAmount);
        const soldier = world.get(soldierId, 'soldier');
        if (soldier && soldier.hp > 0) {
          const dx = soldierMeshComponent.root.position.x - pos.x;
          const dz = soldierMeshComponent.root.position.z - pos.z;
          const len = Math.hypot(dx, dz) || 0.01;
          const force = grenadeComponent.scatterF * (1 - distance / grenadeComponent.blastR * .5);
          soldier.scatter = {
            vx: (dx / len) * force,
            vy: 4 + Math.random() * 4,
            vz: (dz / len) * force,
            time: 0,
          };
          soldier.stagger = 0;
          soldierMeshComponent.hpBar.visible = false;
        }
      }
    }
  }
}


export function systemLaserBullet(world, deltaTime) {
  if (window._multiplayerMode) {
    return;
  }
  for (const id of world.query('laserBullet', 'mesh')) {
    const bulletComponent = world.get(id, 'laserBullet');
    const meshComponent = world.get(id, 'mesh');
    if (!bulletComponent || !meshComponent) {
      continue;
    }
    bulletComponent.age += deltaTime;
    if (bulletComponent.age > 1.5) {
      disposeObj(meshComponent.root);
      world.destroyEntity(id);
      continue;
    }
    meshComponent.root.position.x += bulletComponent.vx * deltaTime;
    meshComponent.root.position.y += bulletComponent.vy * deltaTime;
    meshComponent.root.position.z += bulletComponent.vz * deltaTime;
    meshComponent.root.rotation.y = Math.atan2(bulletComponent.vx, bulletComponent.vz);
    const targetMeshComponent = world.get(bulletComponent.targetId, 'mesh');
    if (targetMeshComponent && world.has(bulletComponent.targetId, 'soldier')) {
      const distance = meshComponent.root.position.distanceTo(targetMeshComponent.root.position);
      if (distance < .8) {
        _soldierTakeDamage(world, bulletComponent.targetId, bulletComponent.damage);
        spawnParticles(meshComponent.root.position, new THREE.Color(1, 0, 0), 5);
        disposeObj(meshComponent.root);
        world.destroyEntity(id);
        continue;
      }
    }
  }
}


export function systemBeam(world, deltaTime) {
  for (const id of world.query('beam', 'mesh')) {
    const beamComponent = world.get(id, 'beam');
    const meshComponent = world.get(id, 'mesh');
    if (!beamComponent || !meshComponent) {
      continue;
    }
    beamComponent.age += deltaTime;
    if (!beamComponent.hit) {
      const targetMeshComponent = world.get(beamComponent.targetId, 'mesh');
      if (targetMeshComponent && world.has(beamComponent.targetId, 'soldier')) {
        _soldierTakeDamage(world, beamComponent.targetId, beamComponent.damage);
        // spawnParticles(meshComponent.root.position, new THREE.Color(1, 0, 0), 5);
        beamComponent.hit = true;
      }
    }
    if (meshComponent.lightning) {
      if (!meshComponent.lightning.update(deltaTime)) {
        meshComponent.lightning.dispose();
        world.destroyEntity(id);
      }
      continue;
    }
    const fade = Math.max(0, 1 - beamComponent.age / 0.18);
    if (meshComponent.root.material) {
      meshComponent.root.material.opacity = fade * 0.92;
      meshComponent.root.material.transparent = true;
    }
    if (beamComponent.age > 0.18) {
      disposeObj(meshComponent.root);
      world.destroyEntity(id);
    }
  }
}


export function systemReaperBullet(world, deltaTime) {
  for (const id of world.query('bullet', 'mesh')) {
    const bulletComponent = world.get(id, 'bullet');
    if (!bulletComponent || bulletComponent.projectileType?.toLowerCase() !== 'reaper') {
      continue;
    }
    const meshComponent = world.get(id, 'mesh');
    if (!meshComponent) {
      continue;
    }
    bulletComponent.age += deltaTime;
    _boltLookTarget.set(
      meshComponent.root.position.x + bulletComponent.vx,
      meshComponent.root.position.y + bulletComponent.vy,
      meshComponent.root.position.z + bulletComponent.vz,
    );
    meshComponent.root.lookAt(_boltLookTarget);
    if (window._multiplayerMode) {
      continue;
    }
    if (bulletComponent.age > 2.5) {
      disposeObj(meshComponent.root);
      world.destroyEntity(id);
      continue;
    }
    meshComponent.root.position.x += bulletComponent.vx * deltaTime;
    meshComponent.root.position.y += bulletComponent.vy * deltaTime;
    meshComponent.root.position.z += bulletComponent.vz * deltaTime;
    const targetMeshComponent = world.get(bulletComponent.targetId, 'mesh');
    if (targetMeshComponent && world.has(bulletComponent.targetId, 'soldier')) {
      // Troops anchor at the feet while the bolt flies at chest height: test
      // the hit against the chest or every shot sails through the body.
      _boltLookTarget.copy(targetMeshComponent.root.position);
      _boltLookTarget.y += 1.0;
      const distance = meshComponent.root.position.distanceTo(_boltLookTarget);
      if (distance < 1.0) {
        _soldierTakeDamage(world, bulletComponent.targetId, bulletComponent.damage);
        spawnParticles(meshComponent.root.position, _boltFlashWhite, 6);
        spawnParticles(meshComponent.root.position, new THREE.Color(0.9, 0.95, 1.0), 10);
        disposeObj(meshComponent.root);
        world.destroyEntity(id);
        continue;
      }
    }
  }
}


export function systemBlasterBullet(world, deltaTime) {
  for (const id of world.query('bullet', 'mesh')) {
    const bulletComponent = world.get(id, 'bullet');
    if (!bulletComponent || bulletComponent.projectileType?.toLowerCase() !== 'blaster') {
      continue;
    }
    const meshComponent = world.get(id, 'mesh');
    if (!meshComponent) {
      continue;
    }
    bulletComponent.age += deltaTime;
    // Long thin bolt flies nose-first along its velocity.
    _boltLookTarget.set(
      meshComponent.root.position.x + bulletComponent.vx,
      meshComponent.root.position.y + bulletComponent.vy,
      meshComponent.root.position.z + bulletComponent.vz,
    );
    meshComponent.root.lookAt(_boltLookTarget);
    if (window._multiplayerMode) {
      continue;
    }
    if (bulletComponent.age > 2.5) {
      disposeObj(meshComponent.root);
      world.destroyEntity(id);
      continue;
    }
    meshComponent.root.position.x += bulletComponent.vx * deltaTime;
    meshComponent.root.position.y += bulletComponent.vy * deltaTime;
    meshComponent.root.position.z += bulletComponent.vz * deltaTime;
    const targetMeshComponent = world.get(bulletComponent.targetId, 'mesh');
    if (targetMeshComponent && world.has(bulletComponent.targetId, 'soldier')) {
      // Troops anchor at the feet while the bolt flies at chest height: test
      // the hit against the chest or every shot sails through the body.
      _boltLookTarget.copy(targetMeshComponent.root.position);
      _boltLookTarget.y += 1.0;
      const distance = meshComponent.root.position.distanceTo(_boltLookTarget);
      if (distance < 1.0) {
        _soldierTakeDamage(world, bulletComponent.targetId, bulletComponent.damage);
        spawnParticles(meshComponent.root.position, _boltFlashWhite, 4);
        spawnParticles(meshComponent.root.position, new THREE.Color(0.4, 0.7, 1.0), 10);
        disposeObj(meshComponent.root);
        world.destroyEntity(id);
        continue;
      }
    }
  }
}


export function systemPlasmaBullet(world, deltaTime) {
  for (const id of world.query('bullet', 'mesh')) {
    const bulletComponent = world.get(id, 'bullet');
    if (!bulletComponent || !['plasma', 'plasma-final'].includes(bulletComponent.projectileType?.toLowerCase())) {
      continue;
    }
    const meshComponent = world.get(id, 'mesh');
    if (!meshComponent) {
      continue;
    }
    bulletComponent.age += deltaTime;
    // Elongated bolt flies nose-first along its velocity; filaments swirl.
    _boltLookTarget.set(
      meshComponent.root.position.x + bulletComponent.vx,
      meshComponent.root.position.y + bulletComponent.vy,
      meshComponent.root.position.z + bulletComponent.vz,
    );
    meshComponent.root.lookAt(_boltLookTarget);
    const filaments = meshComponent.root.userData.filaments;
    if (filaments) {
      filaments.rotation.z += deltaTime * 6;
    }
    updatePlasmaBoltCrackle(meshComponent.root, bulletComponent.age);
    if (window._multiplayerMode) {
      continue;
    }
    if (bulletComponent.age > 2.5) {
      disposeObj(meshComponent.root);
      world.destroyEntity(id);
      continue;
    }
    meshComponent.root.position.x += bulletComponent.vx * deltaTime;
    meshComponent.root.position.y += bulletComponent.vy * deltaTime;
    meshComponent.root.position.z += bulletComponent.vz * deltaTime;
    const targetMeshComponent = world.get(bulletComponent.targetId, 'mesh');
    if (targetMeshComponent && world.has(bulletComponent.targetId, 'soldier')) {
      // Troops anchor at the feet while the bolt flies at chest height: test
      // the hit against the chest or every shot sails through the body.
      _boltLookTarget.copy(targetMeshComponent.root.position);
      _boltLookTarget.y += 1.0;
      const distance = meshComponent.root.position.distanceTo(_boltLookTarget);
      if (distance < 1.0) {
        _soldierTakeDamage(world, bulletComponent.targetId, bulletComponent.damage);
        spawnParticles(meshComponent.root.position, _boltFlashWhite, 5);
        spawnParticles(meshComponent.root.position, new THREE.Color(0.45, 0.7, 1.0), 12);
        disposeObj(meshComponent.root);
        world.destroyEntity(id);
        continue;
      }
    }
  }
}


export function systemParticle(world, deltaTime) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.age += deltaTime;
    if (!p.noGravity) p.vy -= 12 * deltaTime;
    p.mesh.position.x += p.vx * deltaTime;
    p.mesh.position.y += p.vy * deltaTime;
    p.mesh.position.z += p.vz * deltaTime;
    p.material.opacity = Math.max(0, (p.alpha ?? 1) * (1 - p.age / p.life));
    p.material.transparent = true;
    if (p.grow) {
      const s = 1 + p.grow * (p.age / p.life);
      p.mesh.scale.set(s, s, s);
    }
    p.mesh.rotation.x += deltaTime * 10;
    p.mesh.rotation.y += deltaTime * 7;
    if (p.age >= p.life) {
      disposeObj(p.mesh);
      particles.splice(i, 1);
    }
  }
}


export function systemMissile(world, deltaTime) {
  _snapTerrainBegin();
  for (const id of world.query('missile', 'mesh')) {
    const missileComponent = world.get(id, 'missile');
    const meshComponent = world.get(id, 'mesh');
    if (!missileComponent || !meshComponent) {
      continue;
    }
    missileComponent.age += deltaTime;
    if (meshComponent.root._exhaustMat) {
      meshComponent.root._exhaustMat.opacity = 0.7 + 0.3 * Math.sin(missileComponent.age * 22);
      meshComponent.root._exhaustMat.transparent = true;
    }
    if (window._multiplayerMode) {
      continue;
    }
    if (missileComponent.age > 4) {
      childMeshes(meshComponent.root).forEach((c) => disposeObj(c));
      disposeObj(meshComponent.root);
      world.destroyEntity(id);
      continue;
    }
    {
      let tx;
      let tz;
      const solMesh = missileComponent.targetSoldierId != null
        ? world.get(missileComponent.targetSoldierId, 'mesh')?.root
        : null;
      if (solMesh) {
        tx = solMesh.position.x - meshComponent.root.position.x;
        tz = solMesh.position.z - meshComponent.root.position.z;
      } else {
        const squadComponent = world.get(missileComponent.targetSqId, 'squad');
        if (squadComponent) {
          const alive = squadComponent.soldiers.filter((soldierId) => soldierId !== null && world.has(soldierId, 'soldier'));
          if (alive.length) {
            missileComponent.targetSoldierId = alive[Math.floor(Math.random() * alive.length)];
          }
          tx = squadComponent.position.x - meshComponent.root.position.x;
          tz = squadComponent.position.z - meshComponent.root.position.z;
        }
      }
      if (tx !== undefined) {
        const len = Math.hypot(tx, tz) || 1;
        const turnRate = 4 * deltaTime;
        missileComponent.vx += (tx / len) * 35 * turnRate;
        missileComponent.vz += (tz / len) * 35 * turnRate;
        const spd = Math.hypot(missileComponent.vx, missileComponent.vy, missileComponent.vz);
        const scale = 35 / (spd || 1);
        missileComponent.vx *= scale;
        missileComponent.vz *= scale;
      }
    }
    if (meshComponent.root.position.y > 1.5) {
      missileComponent.vy -= 6 * deltaTime;
    }
    meshComponent.root.position.x += missileComponent.vx * deltaTime;
    meshComponent.root.position.y += missileComponent.vy * deltaTime;
    meshComponent.root.position.z += missileComponent.vz * deltaTime;
    meshComponent.root.rotation.y = Math.atan2(missileComponent.vx, missileComponent.vz);
    meshComponent.root.rotation.x = Math.atan2(-missileComponent.vy, Math.hypot(missileComponent.vx, missileComponent.vz));
    if (meshComponent.root._exhaustMat) {
      meshComponent.root._exhaustMat.opacity = 0.7 + 0.3 * Math.sin(missileComponent.age * 22);
      meshComponent.root._exhaustMat.transparent = true;
    }
    let exploded = false;
    if (missileComponent.targetSoldierId != null && world.has(missileComponent.targetSoldierId, 'soldier')) {
      const lockedMesh = world.get(missileComponent.targetSoldierId, 'mesh')?.root;
      if (lockedMesh && meshComponent.root.position.distanceTo(lockedMesh.position) < 1.5) {
        _soldierTakeDamage(world, missileComponent.targetSoldierId, missileComponent.damage);
        spawnParticles(meshComponent.root.position.clone(), new THREE.Color(1, 0.6, 0.1), 20);
        spawnParticles(meshComponent.root.position.clone(), new THREE.Color(1, 1, 0.3), 8);
        const ring = mkDisc('mexp', 0.5, 32, true);
        ring.rotation.x = -Math.PI / 2;
        ring.position.copy(meshComponent.root.position);
        ring.position.y = 0.08;
        const rm = new THREE.MeshBasicMaterial();
        rm.color = new THREE.Color(1, 0.5, 0.1);
        rm.opacity = 0.8;
        rm.transparent = true;
        ring.material = rm;
        let rAge = 0;
        const rObs = addBeforeRender(() => {
          rAge += getDeltaTime();
          const scale = 1 + rAge * 9;
          ring.scale.set(scale, scale, scale);
          rm.opacity = 0.8 * (1 - rAge / 0.6);
          rm.transparent = true;
          if (rAge >= 0.6) {
            disposeObj(ring);
            removeBeforeRender(rObs);
          }
        });
        childMeshes(meshComponent.root).forEach((c) => disposeObj(c));
        disposeObj(meshComponent.root);
        world.destroyEntity(id);
        exploded = true;
      }
    }
    if (exploded) {
      continue;
    }
    for (const squadId of world.query('squad')) {
      const squadComponent = world.get(squadId, 'squad');
      if (!squadComponent || squadComponent.team === missileComponent.team) {
        continue;
      }
      const squadDistance = meshComponent.root.position.distanceTo(squadComponent.position);
      if (squadDistance < 4) {
        for (const soldierId of squadComponent.soldiers) {
          if (soldierId === null || !world.has(soldierId, 'soldier')) {
            continue;
          }
          const soldierMeshComponent = world.get(soldierId, 'mesh');
          if (!soldierMeshComponent) {
            continue;
          }
          const distance = meshComponent.root.position.distanceTo(soldierMeshComponent.root.position);
          if (distance < 5) {
            _soldierTakeDamage(world, soldierId, missileComponent.damage * (1 - distance / 5));
          }
        }
        spawnParticles(meshComponent.root.position.clone(), new THREE.Color(1, 0.6, 0.1), 30);
        spawnParticles(meshComponent.root.position.clone(), new THREE.Color(1, 1, 0.3), 12);
        spawnParticles(meshComponent.root.position.clone(), new THREE.Color(0.6, 0.6, 0.6), 18);
        const ring = mkDisc('mexp', 0.5, 32, true);
        ring.rotation.x = -Math.PI / 2;
        ring.position.copy(meshComponent.root.position);
        ring.position.y = 0.08;
        const rm = new THREE.MeshBasicMaterial();
        rm.color = new THREE.Color(1, 0.5, 0.1);
        rm.opacity = 0.8;
        rm.transparent = true;
        ring.material = rm;
        let rAge = 0;
        const rObs = addBeforeRender(() => {
          rAge += getDeltaTime();
          const scale = 1 + rAge * 9;
          ring.scale.set(scale, scale, scale);
          rm.opacity = 0.8 * (1 - rAge / 0.6);
          rm.transparent = true;
          if (rAge >= 0.6) {
            disposeObj(ring);
            removeBeforeRender(rObs);
          }
        });
        childMeshes(meshComponent.root).forEach((c) => disposeObj(c));
        disposeObj(meshComponent.root);
        world.destroyEntity(id);
        exploded = true;
        break;
      }
    }
    if (exploded) {
      continue;
    }
    const missileGroundY = _groundAt(meshComponent.root.position.x, meshComponent.root.position.z);
    if (meshComponent.root.position.y <= missileGroundY + 0.1) {
      spawnParticles(meshComponent.root.position.clone(), new THREE.Color(1, 0.5, 0.1), 14);
      childMeshes(meshComponent.root).forEach((c) => disposeObj(c));
      disposeObj(meshComponent.root);
      world.destroyEntity(id);
    }
  }
}
