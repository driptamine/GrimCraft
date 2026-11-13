import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { World } from '../src/core/ecs.js';
import { structureFootprint, selectionFootprint, worldFootprint, insideFootprint, canWorkAtStructure, constructionWorkPosition, constructionApproachWaypoint, segmentEntersFootprint } from '../src/core/structure-footprint.js';
const types = ['hq', 'infantry_command', 'mechanized', 'mars_pattern', 'listening_post', 'plasma_generator', 'tactica_control', 'turret'];

test('measured profiles preserve the different widths, depths and model origins', () => {
  const post = structureFootprint({ type: 'listening_post', faction: 'ig' }, true);
  assert.ok(post.maxX-post.minX > post.maxZ-post.minZ);
  const generator = structureFootprint({ type: 'plasma_generator', faction: 'ig' }, true);
  assert.ok(generator.maxZ-generator.minZ > generator.maxX-generator.minX);
  assert.ok((generator.minX+generator.maxX)/2 < -1);
  assert.deepEqual(structureFootprint({type:'hq-anim',faction:'ig'},true), structureFootprint({type:'hq',faction:'ig'},true));
  assert.deepEqual(structureFootprint({type:'barracks',faction:'ig'},true), structureFootprint({type:'infantry_command',faction:'ig'},true));
  assert.equal(canWorkAtStructure({x:4,z:0},{type:'hq',faction:'ig',position:{x:0,z:0}}),false,'the old four-unit offset is inside the HQ drop');
});

for (const type of types) {
  test(`${type}: work positions and approach routes stay outside the landed drop`, () => {
    const site = { type, faction:'ig', constructing:true, position:{x:3,z:-8} }, bounds = worldFootprint(site);
    for (const start of [{x:-30,z:-30},{x:30,z:-30},{x:-30,z:30},{x:30,z:30}]) {
      const goal = constructionWorkPosition(site,start);
      assert.equal(canWorkAtStructure(goal,site),true);assert.equal(insideFootprint(goal,bounds,.65),false);
      assert.ok(goal.z < bounds.minZ || goal.x > bounds.maxX,'use a visible front or right face');
      let current = {...start};
      for (let step=0; step<500 && Math.hypot(current.x-goal.x,current.z-goal.z)>.1;step++) {
        const waypoint = constructionApproachWaypoint(current,goal,site);
        const distance = Math.hypot(waypoint.x-current.x,waypoint.z-current.z), fraction = Math.min(1,.3/(distance||1));
        const next = {x:current.x+(waypoint.x-current.x)*fraction,z:current.z+(waypoint.z-current.z)*fraction};
        assert.equal(segmentEntersFootprint(current,next,bounds),false,'approach must not cross the model');current=next;
      }
      assert.ok(Math.hypot(current.x-goal.x,current.z-goal.z)<.11,'worker can reach the external work position');
    }
  });
}

test('real builder movement and collision keep workers outside while they build', async () => {
  globalThis.window = { addEventListener() {} };
  globalThis.document = { getElementById:()=>null,querySelector:()=>null };
  const sceneModule = await import('../src/core/scene.js');
  const scene = new THREE.Scene();scene._registerShadows=()=>{};
  sceneModule.__setSceneCameraForTests(scene,{target:new THREE.Vector3()});
  const { systemBuilder } = await import('../src/systems/builder.js');
  const { systemStructureCollision } = await import('../src/systems/structures.js');
  const { assignConstructionWork,hasActiveConstructionWorker } = await import('../src/systems/construction.js');
  for (const type of types) for (const start of [[-25,-25],[-25,25],[25,-25],[25,25]]) {
    const world=new World();sceneModule.setWorld(world);
    const siteId=world.createEntity([]),site={type,faction:'ig',team:'blue',position:new THREE.Vector3(),constructing:true,constructTime:15,constructProgress:0,requiresWorker:true,pendingWorker:true,deliveryTime:1,deliveryProgress:1};
    world.add(siteId,'building',site);
    const workerId=world.createEntity([]),root=new THREE.Group();root.position.set(start[0],0,start[1]);root._playAnim=()=>{};
    const worker={team:'blue',faction:'ig',hp:100,speed:7,walkTime:0,buildTargetSP:null,repairTarget:null,stance:'stand'};
    world.add(workerId,'builder',worker);world.add(workerId,'mesh',{root});assignConstructionWork(world,workerId,siteId,site);
    for(let tick=0;tick<600&&!worker.isBuilding;tick++){
      systemBuilder(world,.05);systemStructureCollision(world,.05);
      assert.equal(insideFootprint(root.position,worldFootprint(site),.49),false,`${type}: walking worker entered the drop`);
    }
    assert.equal(worker.isBuilding,true,`${type}: worker did not reach the building`);
    const before=root.position.clone();systemStructureCollision(world,.05);
    assert.ok(root.position.distanceTo(before)<1e-6,'working position must not fight the collider');
    assert.equal(hasActiveConstructionWorker(world,siteId,site),true);
    root.position.set(0,0,0);worker.isBuilding=true;systemStructureCollision(world,.05);
    assert.equal(insideFootprint(root.position,worldFootprint(site),.49),false,'working workers are also expelled if they were inside');
  }
});

test('selection rectangles use model dimensions and retain alignment after the HQ rotation', async () => {
  const { makeStructureSelRing } = await import('../src/meshes/hud.js');
  for (const type of types) {
    const root=new THREE.Group();if(type==='hq')root.rotation.y=Math.PI/2;
    const site={type,faction:'ig',constructing:true},bounds=selectionFootprint(site);
    const ring=makeStructureSelRing(root,site,3.5),material=ring._material;
    root.updateMatrixWorld(true);
    const actual=new THREE.Box3().setFromObject(ring);
    assert.ok(Math.abs(actual.min.x-(bounds.minX-.065))<1e-5);
    assert.ok(Math.abs(actual.max.x-(bounds.maxX+.065))<1e-5);
    assert.ok(Math.abs(actual.min.z-(bounds.minZ-.065))<1e-5);
    assert.ok(Math.abs(actual.max.z-(bounds.maxZ+.065))<1e-5);
    ring._setBounds(selectionFootprint(site,false));assert.equal(ring._material,material);
    root.traverse(node=>{if(node.geometry)node.geometry.dispose()});material.dispose();
  }
});
