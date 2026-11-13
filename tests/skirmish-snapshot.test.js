import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import * as THREE from 'three';

register('./node-esm-hooks.mjs', import.meta.url);
globalThis.window = globalThis;
globalThis.document = {
  getElementById: () => null,
  createElement: () => ({ style: {}, getContext: () => null, addEventListener(){}, appendChild(){}, setAttribute(){} }),
  head: { appendChild(){} }, body: { appendChild(){} },
  addEventListener(){},
};
const sceneMod = await import('../src/core/scene.js');
const headlessScene = new THREE.Scene();
headlessScene._registerShadows = () => {};
sceneMod.__setSceneCameraForTests(headlessScene, { target: new THREE.Vector3() });
const { World } = await import('../src/core/ecs.js');
const { applySkirmishSnapshot, initReplicaSystems } = await import('../src/net/skirmish-state.js');

// Minimal schema-2 snapshot in the exact shape the Go server emits.
// The squad carries no single root mesh (soldiers do), which used to crash
// the transform block and silently kill the snapshot stream.
const snapshot = {
  schema: 2,
  tick: 7,
  players: [{ id: 1, team: 'blue', faction: 'ig', requisition: 1500, energy: 100, kills: 0, research: [] }],
  entities: [
    {
      id: 10,
      components: {
        squad: {
          team: 'blue', faction: 'ig', unitType: '', position: { $v: [-24, 0, -6] },
          facing: { $v: [1, 0, 0] }, speed: 6, attackRange: 18, detectionRange: 30,
          maxSquadSize: 13, reinforceCost: 20, reinforceTime: 7, grenadeCd: 0,
          grenadeReloadTime: 3, idleTime: 0, reinforceQueue: [], reinforceProgress: 0,
          grenadeQueue: [], grenadeProgress: 0, plasmaQueue: [], plasmaProgress: 0,
          moveOrder: null, stopped: true, captureOrderSpId: null, capturingSpId: null,
          autoChase: false, projectileType: 'Bullet', soldiers: [101, null],
          forcedTarget: null, autoReinforce: false, attackMode: 'ranged', stance: 'ranged',
        },
        networkOwner: { id: 1 },
      },
      transform: { p: [-24, 0, -6], r: [0, 0, 0], visible: true, s: [1, 1, 1] },
    },
    {
      id: 101,
      components: {
        soldier: {
          squadId: 10, formIdx: 1, unitType: '', hp: 100, maxHp: 100,
          attackCooldown: 0, meleeTimer: 0, shootTimer: 0, hitReactionTimer: 0, animation: 'idle',
        },
        networkOwner: { id: 1 },
      },
      transform: { p: [-24, 0, -6], r: [0, 0, 0], visible: true, s: [1, 1, 1] },
    },
    {
      id: 6,
      components: {
        building: {
          type: 'hq', position: { $v: [-40, 0, -12] }, team: 'blue', faction: 'ig',
          hp: 2000, maxHp: 2000, queue: [], researchQueue: [], addons: [], tier: 1,
          rallyPoint: { $v: [-40, 0, -2] }, constructing: false,
          constructProgress: 0, constructTime: 0,
        },
        networkOwner: { id: 1 },
      },
      transform: { p: [-40, 0, -12], r: [0, 0, 0], visible: true, s: [1, 1, 1] },
    },
    {
      id: 7,
      components: {
        builder: {
          team: 'blue', faction: 'ig', hp: 60, maxHp: 60, speed: 7,
          stance: 'stand', attackMove: false, meleeOrder: false,
          isBuilding: false, buildProgress: 0,
        },
        networkOwner: { id: 1 },
      },
      transform: { p: [-30, 0, -12], r: [0, 0, 0], visible: true, s: [1, 1, 1] },
    },
    {
      id: 5,
      components: {
        strategicPoint: {
          kind: 'point', position: { $v: [0, 0, 0] }, owner: null, faction: '',
          captureProgress: 0, captureRadius: 4.5, hasListeningPost: false,
          lpTier: 0, researchQueue: [],
        },
        networkOwner: { id: 0 },
      },
      transform: { p: [0, 0, 0], r: [0, 0, 0], visible: true, s: [1, 1, 1] },
    },
  ],
};

describe('skirmish snapshot', () => {
  it('applies a server snapshot with rootless squads without throwing', () => {
    const world = new World();
    world.useReplicaIds();
    applySkirmishSnapshot(world, snapshot, 1);
    assert.equal(world.query('squad').length, 1);
    assert.equal(world.query('soldier').length, 1);
    assert.equal(world.query('building').length, 1);
    assert.equal(world.query('builder').length, 1);
    assert.equal(world.query('strategicPoint').length, 1);
  });
});

it('renders Go HQ, worker and relic above the SGB terrain', () => {
  const world = new World();
  sceneMod.setWorld(world);
  const root = new THREE.Group(); root.position.y = 10;
  window.__sgbTerrainRoot = root;
  window.__sgbSampleHeight = () => 5;
  const replica = structuredClone(snapshot);
  replica.heightMode = 'terrain';
  const relic = structuredClone(replica.entities.find(e => e.components.strategicPoint));
  relic.id = 8; relic.components.strategicPoint.kind = 'relic';
  replica.entities.push(relic);
  initReplicaSystems(world);
  applySkirmishSnapshot(world, replica, 1);
  world.tick(1);
  for (const id of [6,7,8,101]) {
    const mesh = world.get(id, 'mesh');
    assert.ok(mesh.root.visible);
    assert.ok(mesh.root.position.y >= 14.9, `entity ${id} was buried: ${mesh.root.position.y}`);
  }
  delete window.__sgbTerrainRoot; delete window.__sgbSampleHeight;
});

it('plays authoritative action slots, repeats capture clips and cycles melee variants', () => {
  const world = new World();sceneMod.setWorld(world);initReplicaSystems(world);
  const state=structuredClone(snapshot);applySkirmishSnapshot(world,state,1);
  const root=world.get(101,'mesh').root,played=[];
  root._playAnim=(name,loop,force)=>{played.push({name,loop,force});root._currentAnim=name};
  root._nextMeleeAttack=()=>{};root._animGroups={meleeVariant1:{},meleeVariant2:{},meleeVariant3:{}};
  const actor=state.entities.find(e=>e.id===101).components.soldier;
  const show=(animation,extra={})=>{Object.assign(actor,{animation,shootTimer:0,meleeTimer:0,hitReactionTimer:0,moving:false},extra);state.tick++;applySkirmishSnapshot(world,state,1);world.tick(.1);return played.at(-1)};
  assert.equal(show('run',{moving:true}).name,'run');
  assert.equal(show('shootMove',{moving:true,shootTimer:.5,shotSerial:1}).name,'shootMove');
  assert.equal(show('shoot',{shootTimer:.5}).name,'shoot');
  show('melee',{meleeTimer:2.5,meleeAttackSerial:1});assert.equal(root._animGroups.melee,root._animGroups.meleeVariant1);
  show('melee',{meleeTimer:2.5,meleeAttackSerial:2});assert.equal(root._animGroups.melee,root._animGroups.meleeVariant2);
  assert.equal(show('hitL',{hitReactionTimer:.45,hitReactionAnim:'hitL',_meleeReactionIndex:1}).name,'hitL');
  for(const name of ['flagPlant1','flagPlant2','capture1','capture2','idle']){
    const action=show(name);assert.equal(action.name,name);
    if(name==='capture2')assert.equal(action.loop,true,'final capture animation loops until the server ends capture');
    if(['flagPlant1','flagPlant2','capture1'].includes(name))assert.equal(action.loop,false);
  }
  show('capture2');const before=played.length;root._currentAnim=null;world.tick(.1);assert.equal(played.length,before+1);assert.equal(played.at(-1).loop,true);
  const worker=state.entities.find(e=>e.id===7).components.builder;
  const workerRoot=world.get(7,'mesh').root;workerRoot._playAnim=name=>{workerRoot._currentAnim=name};
  for(const name of ['run','build','repair','idle']){worker.animation=name;state.tick++;applySkirmishSnapshot(world,state,1);world.tick(.1);assert.equal(workerRoot._currentAnim,name)}
  const hp=world.get(101,'soldier').hp;
  assert.equal(hp,100,'visual animation playback must not apply damage');
});

it('keeps selection footprints on selected network soldiers across snapshots',()=>{
 const world=new World();sceneMod.setWorld(world);initReplicaSystems(world);
 const state=structuredClone(snapshot);applySkirmishSnapshot(world,state,1);
 const sq=world.get(10,'squad');sq.selected=true;world.tick(.1);
 const root=world.get(101,'mesh').root;
 assert.equal(root._selDisc.visible,true);assert.equal(root._selMat.opacity,.9);
 state.tick++;applySkirmishSnapshot(world,state,1);world.tick(.1);
 assert.equal(sq.selected,true);assert.equal(root._selDisc.visible,true);
 sq.selected=false;world.tick(.1);assert.equal(root._selDisc.visible,false);
});

it('network Necron shots use animated green lightning without applying local damage', () => {
  const world = new World();sceneMod.setWorld(world);initReplicaSystems(world);
  const state = structuredClone(snapshot);
  const squad = state.entities.find(entity => entity.id === 10).components.squad;
  squad.faction = 'necrons'; // Go still sends its generic Bullet projectile type.
  const actor = state.entities.find(entity => entity.id === 101).components.soldier;
  Object.assign(actor, { shotSerial: 0, targetId: 102, animation: 'shoot', shootTimer: .5 });
  const enemy = structuredClone(state.entities.find(entity => entity.id === 101));
  enemy.id = 102;enemy.components.soldier.shotSerial = 0;enemy.components.soldier.targetId = null;
  enemy.transform.p = [-8, 4, -6];state.entities.push(enemy);
  applySkirmishSnapshot(world, state, 1);world.tick(.016);
  assert.equal(world.query('replicaShot').length, 0, 'initial snapshot does not replay old gunfire');
  const shooter = world.get(101, 'mesh').root;
  const muzzle = new THREE.Object3D();muzzle.name = 'marker_gun_muzzle_ctr_out';muzzle.position.set(.5, 1.4, .2);shooter.add(muzzle);
  actor.shotSerial = 1;state.tick++;applySkirmishSnapshot(world, state, 1);world.tick(.016);
  const [shotId] = world.query('replicaShot');assert.ok(shotId);
  const { lightning, root } = world.get(shotId, 'mesh');
  assert.equal(root.name, 'necron_lightning');assert.equal(lightning.alive, true);
  assert.ok(lightning._path[0].distanceTo(muzzle.getWorldPosition(new THREE.Vector3())) < 1e-6);
  assert.ok(lightning._path.at(-1).distanceTo(world.get(102, 'mesh').root.position.clone().add(new THREE.Vector3(0, 1, 0))) < 1e-6);
  assert.equal(world.query('beam').length, 0, 'cosmetic shot never starts the local damage system');
  assert.equal(world.get(102, 'soldier').hp, 100);
  world.tick(.17);assert.equal(lightning.alive, true, 'lightning keeps its full duration instead of the tracer lifetime');
  world.tick(.17);assert.equal(world.has(shotId, 'replicaShot'), false);assert.equal(root.parent, null);
  assert.equal(world.get(102, 'soldier').hp, 100);
});
