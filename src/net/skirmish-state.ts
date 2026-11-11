import * as THREE from 'three';
import { makeHellgunLaserMesh } from '../fx/hellgun-laser.js';
import { makeLasgunLaserMesh } from '../fx/lasgun-laser.js';
import { NecronLightning } from '../fx/necron-lightning.js';
import { makeBlasterBoltMesh } from '../fx/blaster-bolt.js';
import { makeReaperBoltMesh } from '../fx/reaper-bolt.js';
import { makePlasmaBoltMesh, makePlasmaFinalBoltMesh } from '../fx/plasma-bolt.js';
import { setMeleeWeaponVisible } from '../render/melee-weapons.js';
import { _setPlanterBannerVisible } from '../systems/squad.js';
import { World } from '../core/ecs.js';
import * as E from '../entities/entities.js';
import * as M from '../meshes.js';
import { scene, camera, setRequisition, setEnergy, setKills, setResearchContext, setGameOver } from '../core/scene.js';
import { disposeMeshComponent, _soldierDie } from '../systems/combat.js';
import { systemParticle } from '../systems/projectiles.js';
import { _groundAt, _snapTerrainBegin, _snapMeshToTerrain } from '../systems/terrain.js';
import { systemStrategicPoint } from '../systems/points.js';
import { applySquadWeaponVisuals } from '../entities/entities.js';
import { updateHUD } from '../core/hud.js';
export function unpackValue(value: any): any {
    if (!value || typeof value !== 'object')
        return value;
    if (value.$v)
        return new THREE.Vector3().fromArray(value.$v);
    if (value.$c)
        return new THREE.Color().fromArray(value.$c);
    if (Array.isArray(value))
        return value.map(unpackValue);
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, unpackValue(v)]));
}
const mainKinds = ['squad', 'building', 'structure', 'builder', 'strategicPoint', 'vehicle', 'apc', 'airfield', 'jet', 'soldier'];
function kindOf(record: any): string { return mainKinds.find(k => record.components[k]) || Object.keys(record.components).find(k => k !== 'networkOwner') || ''; }
function createReplica(world: any, record: any): void {
    const kind = kindOf(record), c = unpackValue(record.components[kind]);
    const p = c?.position || new THREE.Vector3().fromArray(record.transform?.p || [0, 0, 0]);
    world.withEntityId(record.id, () => {
        switch (kind) {
            case 'squad': return E.createSquadEntity(world, c.team, p.x, p.z, 0, c.unitType, c.faction);
            case 'soldier': return E.createSoldierEntity(world, c.squadId, c.formIdx, c.unitType);
            case 'builder': return E.createBuilderEntity(world, p.x, p.z, c.team, c.faction);
            case 'building': return E.createBuildingEntity(world, c.type, p, c.team, c.faction);
            case 'structure': return E.createStructureEntity(world, c.type, p, c.faction, c.team);
            case 'strategicPoint': return E.createStrategicPointEntity(world, p.x, p.z, c.kind);
            case 'vehicle': return E.createVehicleEntity(world, c.team, c.name, c.model, c.icon, p, c.projectileType, c.faction);
            case 'apc': return E.createApcEntity(world, p, c.faction, c.team);
            case 'airfield': return E.createAirfieldEntity(world, p, c.faction, c.team);
            case 'jet': return E.createJetEntity(world, p, c.team, c.faction);
            default: {
                const id = world.createEntity([kind]);
                let root: any;
                if (kind === 'beam')
                    root = c.projectileType === 'hellgun_laser' ? makeHellgunLaserMesh(c.length || 1) : makeLasgunLaserMesh(c.length || 1);
                else if (kind === 'laserBullet' && c.projectileType === 'hellgun_laser')
                    root = makeHellgunLaserMesh(8, 'z');
                else if (/blaster/i.test(kind))
                    root = makeBlasterBoltMesh();
                else if (/reaper/i.test(kind))
                    root = makeReaperBoltMesh();
                else if (/plasmaFinal/i.test(kind))
                    root = makePlasmaFinalBoltMesh();
                else if (/plasma/i.test(kind))
                    root = makePlasmaBoltMesh();
                else if (/missile/i.test(kind))
                    root = M.makeMissileMesh();
                else if (/grenade/i.test(kind))
                    root = M.makeGrenadeMesh();
                else if (/plasma/i.test(kind))
                    root = M.makePlasmaBulletMesh();
                else if (/laser|beam|lightning|blaster|reaper/i.test(kind))
                    root = M.makeLaserBulletMesh();
                else
                    root = M.makeBulletMesh();
                root.position.copy(p);
                world.add(id, 'mesh', { root });
                return id;
            }
        }
    });
}
export function applySkirmishSnapshot(world: any, snapshot: any, playerId: number): void {
    const incoming = new Set(snapshot.entities.map((e: any) => e.id));
    for (const id of world._entities) {
        if (id >= 1000000000 || incoming.has(id))
            continue;
        if(world.has(id,'soldier')){_soldierDie(world,id,false);continue;}
        const mesh = world.get(id, 'mesh');
        if (mesh)
            disposeMeshComponent(mesh);
        world.destroyEntity(id);
    }
    world._flushDestroyed();
    const records = [...snapshot.entities].sort((a: any, b: any) => {
        const rank = (r: any) => kindOf(r) === 'squad' ? 0 : kindOf(r) === 'soldier' ? 2 : 1;
        return rank(a) - rank(b);
    });
    for (const record of records) {
        if (!world._entities.has(record.id))
            createReplica(world, record);
        for (const [name, data] of Object.entries(record.components)) {
            const existing = world.get(record.id, name);
            if (existing)
                Object.assign(existing, unpackValue(data));
            else
                world.add(record.id, name, unpackValue(data));
            if (mainKinds.includes(name) && name !== 'strategicPoint') {
                const c = world.get(record.id, name);
                c.owner = record.components.networkOwner?.id;
            }
        }
        const mesh = world.get(record.id, 'mesh');
        // Replica squads own no single root (soldiers carry their own meshes):
        // skip the transform block instead of crashing the snapshot loop.
        if (mesh?.root && record.transform) {
            const t = record.transform;
            mesh._terrainRelative = snapshot.heightMode === 'terrain';
            mesh._serverPosition = new THREE.Vector3().fromArray(t.p);
            if (!mesh._receivedTransform)
                mesh.root.position.copy(mesh._serverPosition);
            mesh._receivedTransform = true;
            mesh.root.rotation.set(...t.r);
            mesh.root.visible = t.visible;
            if (!mainKinds.some(k => record.components[k]))
                mesh.root.scale.fromArray(t.s);
            // Actor factories own GLB scale.
        }
        const kind = kindOf(record), c = world.get(record.id, kind);
        if (['building', 'structure', 'airfield'].includes(kind) && !c.constructing && !c.pendingWorker && mesh?.scaffold)
            E._finishConstruction(world, record.id, c, kind);
        if (kind === 'strategicPoint') {
            if (c.hasListeningPost && !c.lpMesh)
                c.lpMesh = M.buildListeningPostMesh(c.position, c.owner, { listeningPostEntityId: record.id, faction: c.faction });
            if (!c.hasListeningPost && c.lpMesh) {
                c.lpMesh.removeFromParent();
                c.lpMesh = null;
            }
            if (mesh.gemMat) {
                mesh.gemMat.color.setRGB(...(c.owner === 'blue' ? [.13, .4, 1] : c.owner === 'red' ? [.87, .13, .07] : [1, 1, 1]));
            }
        }
        if (kind === 'squad')
            applySquadWeaponVisuals(world, record.id);
    }
    const account = snapshot.players.find((a: any) => a.id === playerId);
    if (account) {
        setRequisition(account.requisition);
        setEnergy(account.energy);
        setKills(account.kills);
        setResearchContext(new Set(account.research));
    }
    if (snapshot.winner && (!snapshot.phase || snapshot.phase==='running')) {
        setGameOver(true);
        const text = document.getElementById('winText');
        if (text)
            text.textContent = `${snapshot.winner.toUpperCase()} WINS`;
        const win = document.getElementById('win');
        if (win)
            win.style.display = 'flex';
    }
    updateHUD();
}
// Cosmetic tracers use authoritative shot events; they never run damage systems.
function replicaShot(world: any, soldierId: number, soldier: any, mesh: any): void {
    const target = world.get(soldier.targetId, 'mesh')?.root;
    if (!target) return;
    const squad = world.get(soldier.squadId, 'squad');
    const projectileType = String(soldier.projectileType || squad?.projectileType || '').toLowerCase();
    const gaussWeapon = soldier.weapon === 'gauss_flayer' || (!soldier.weapon && squad?.faction === 'necrons');
    const usesLightning = projectileType === 'lightning' || (!soldier.projectileType && gaussWeapon);
    const from = E.getSoldierMuzzlePos(world, soldierId);
    if (!usesLightning) from.y = Math.max(from.y, mesh.root.position.y + 1.05);
    const to = target.position.clone().add(new THREE.Vector3(0, 1, 0));
    const direction = to.clone().sub(from), length = direction.length();
    if (length < .001) return;
    const shotId = world.createEntity(['replicaShot']);
    world.add(shotId, 'replicaShot', { age: 0 });
    if (usesLightning) {
        const lightning = new NecronLightning(scene);
        lightning.fire(from, to);
        world.add(shotId, 'mesh', { root: lightning.root, lightning });
        return;
    }
    const root = soldier.weapon === 'hellgun' ? makeHellgunLaserMesh(length)
        : soldier.weapon === 'lasgun' ? makeLasgunLaserMesh(length)
        : new THREE.Mesh(new THREE.CylinderGeometry(.025, .025, length, 6), new THREE.MeshBasicMaterial({ color: 0xffbc70, transparent: true, opacity: .85 }));
    root.position.copy(from).add(to).multiplyScalar(.5);
    root.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
    scene.add(root);
    world.add(shotId, 'mesh', { root });
}
export function initReplicaSystems(world: World): void {
    world.useReplicaIds();
    world.addSystem(systemParticle);
    world.addSystem((w: any, dt: number) => {
        _snapTerrainBegin();
        for (const shotId of w.query('replicaShot')) {
            const shot = w.get(shotId, 'replicaShot'), mesh = w.get(shotId, 'mesh');
            shot.age += dt;
            const finished = mesh?.lightning ? !mesh.lightning.update(dt) : shot.age > .15;
            if (finished) {
                disposeMeshComponent(mesh);
                w.destroyEntity(shotId);
            }
        }
        for (const id of w.query('mesh')) {
            const mesh = w.get(id, 'mesh');
            const root = mesh.root;
            if (!root) {
                const sq = w.get(id, 'squad');
                if (sq && mesh.hpBar) {
                    mesh.hpBar.position.copy(sq.position).add(new THREE.Vector3(0, 3, 0));
                    const soldiers = sq.soldiers.map((sid: number) => w.get(sid, 'soldier')).filter(Boolean);
                    const hp = soldiers.reduce((n: number, s: any) => n + s.hp, 0), max = soldiers.reduce((n: number, s: any) => n + s.maxHp, 0);
                    M.updateHpBar(mesh.hpBar, max ? hp / max : 0);
                    mesh.hpBar.visible = !!sq.selected;
                }
                continue;
            }
            const target = mesh._serverPosition;
            const soldier = w.get(id, 'soldier'), builder = w.get(id, 'builder');
            if (target) {
                const y = target.y + (mesh._terrainRelative && !w.has(id,'jet') ? _groundAt(target.x,target.z) : 0);
                const moved = Math.hypot(root.position.x - target.x, root.position.z - target.z) > .08;
                root.position.lerp(new THREE.Vector3(target.x, y, target.z), 1 - Math.exp(-dt * 20));
                if (soldier || builder) {
                    const actor = soldier || builder;
                    if(soldier){const squad=w.get(soldier.squadId,'squad');const selected=!!squad?.selected;if(mesh._selectionState!==selected){if(root._selMat){root._selMat.opacity=selected ? .9 : 0;root._selMat.transparent=true;}if(root._selDisc)root._selDisc.visible=selected;mesh._selectionState=selected;}if(mesh.hpBar)mesh.hpBar.visible=selected;const melee=actor.meleeTimer>0;if(mesh._meleeWeapon!==melee){setMeleeWeaponVisible(root,melee);mesh._meleeWeapon=melee;}}
                    if(soldier && actor.shotSerial!=null && actor.shotSerial!==mesh._replicaShotSerial){if(mesh._replicaShotSerial!=null)replicaShot(w,id,actor,mesh);mesh._replicaShotSerial=actor.shotSerial;}
                    const moving=actor.moving??moved;
                    const reaction = actor.hitReactionTimer > 0 && actor.hitReactionAnim;
                    const flying = soldier?._flyStage || 0;
                    const anim = reaction || (actor.animation==='idle'&&moving?'run':actor.animation) || (flying === 1 ? 'flyLaunch' : flying === 2 ? 'flyIdle' : flying === 3 ? 'flyLand' : actor.meleeTimer > 0 ? 'melee' : actor.shootTimer > 0 ? (moved ? 'shootMove' : 'shoot') : builder?.isBuilding ? 'build' : builder?.repairTarget != null ? 'repair' : moved ? 'run' : 'idle');
                    const serial = anim==='melee'?actor.meleeAttackSerial:reaction?actor._meleeReactionIndex:undefined;
                    const restart = serial != null && serial !== mesh._replicaAttackSerial;
                    if (anim === 'melee' && actor.meleeAttackSerial !== mesh._replicaMeleeSerial) {
                        root._nextMeleeAttack?.();
                        mesh._replicaMeleeSerial = actor.meleeAttackSerial;
                        const variant = root._animGroups?.[`meleeVariant${((actor.meleeAttackSerial || 1) - 1) % 3 + 1}`];
                        if (variant)
                            root._animGroups.melee = variant;
                    }
                    const changed=mesh._replicaAnim!==anim;
                    const repeat=['shoot','shootMove','capture1','capture2'].includes(anim)&&root._currentAnim===null;
                    if (changed || restart || repeat) {
                        root._playAnim?.(anim, !['melee', 'shoot', 'shootMove', 'hitL', 'hitR', 'hitBlock', 'flyLaunch', 'flyLand', 'flagPlant1', 'flagPlant2', 'capture1', 'capture2'].includes(anim), restart||changed);
                        mesh._replicaAnim = anim;
                        mesh._replicaAttackSerial = serial;
                        if (soldier)
                            _setPlanterBannerVisible(soldier, root, anim === 'flagPlant1');
                    }
                    if(!root._playAnim){mesh._walkTime=(mesh._walkTime||0)+dt*9;const swing=moving?Math.sin(mesh._walkTime)*.45:0;if(root._legL)root._legL.rotation.x=swing;if(root._legR)root._legR.rotation.x=-swing;if(root._armR)root._armR.rotation.x=anim==='melee'?Math.sin(mesh._walkTime)*1.1:anim.startsWith('shoot')?-1.2:-swing*.5;}
                }
            }
            if(mesh._terrainRelative && ['building','structure','airfield'].some(kind=>w.has(id,kind)))_snapMeshToTerrain(mesh);
            const c = soldier || builder || w.get(id, 'building') || w.get(id, 'structure') || w.get(id, 'vehicle') || w.get(id, 'jet') || w.get(id, 'airfield');
            if (mesh.hpBar && c) {
                mesh.hpBar.position.copy(root.position);
                mesh.hpBar.position.y += soldier || builder?.hp ? 0.08 : 4.5;
                M.updateHpBar(mesh.hpBar, c.hp / c.maxHp);
            }
            if (mesh.constructBar && c) {
                mesh.constructBar.visible = !!c.constructing;
                mesh.constructBar.position.copy(root.position).add(new THREE.Vector3(0, 5.5, 0));
                M.updateHpBar(mesh.constructBar, c.constructProgress / c.constructTime);
            }
        }
        systemStrategicPoint(w, dt);
    });
}
