import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
const canvas = { style: {}, getBoundingClientRect: () => ({ left:0,top:0,width:800,height:600 }) };
globalThis.window = { addEventListener() {} };
globalThis.document = { getElementById: id => id === 'renderCanvas' ? canvas : null, querySelector: () => null };
const core = await import('../src/core/scene.js');
const { World } = await import('../src/core/ecs.js');
const { FACTIONS, factionContainers } = await import('../src/factions.js');
const ghosts = await import('../src/input/build-ghost.js');
const { setModelSource } = await import('../src/render/model-source.js');
const { setMouseX, setMouseY } = await import('../src/input/camera.js');

function fixture() {
  const scene = new THREE.Scene();scene._registerShadows = () => {};
  const camera = new THREE.OrthographicCamera(-40,40,30,-30,.1,200);camera.position.set(0,80,0);camera.up.set(0,0,-1);camera.lookAt(0,0,0);camera.updateMatrixWorld(true);camera.target = new THREE.Vector3();
  setMouseX(500);setMouseY(300);
  core.__setSceneCameraForTests(scene,camera);
  const world = new World();core.setWorld(world);core.setRequisition(500);setModelSource('glb');
  const workerId = world.createEntity([]), root = new THREE.Group();root.position.set(9,0,-1);
  world.add(workerId,'builder',{team:'blue',faction:'ig',hp:100});world.add(workerId,'mesh',{root});core.setSelBuilder(workerId);
  const point = (x,z,owner='blue',hasListeningPost=false,height=0) => {
    const id=world.createEntity([]);world.add(id,'strategicPoint',{position:new THREE.Vector3(x,0,z),owner,hasListeningPost});
    const root=new THREE.Group();root.position.set(x,height,z);world.add(id,'mesh',{root});return id;
  };
  const near=point(10,0,'blue',false,7.5), far=point(20,0,'blue',false,2);
  point(9,-1,'red');point(9,-1,'blue',true);
  const template=new THREE.Group(), bone=new THREE.Group();bone.name='main_body';template.add(bone);
  const sourceTexture=new THREE.DataTexture(new Uint8Array([128,128,128,0]),1,1,THREE.RGBAFormat);
  const sourceMaterial=new THREE.MeshStandardMaterial({color:0x808080,map:sourceTexture});
  const geometry=new THREE.BoxGeometry(4,3,6),vertexCount=geometry.attributes.position.count;
  const weights=new Float32Array(vertexCount*4);for(let index=0;index<vertexCount;index++)weights[index*4]=1;
  geometry.setAttribute('skinIndex',new THREE.Uint16BufferAttribute(new Uint16Array(vertexCount*4),4));geometry.setAttribute('skinWeight',new THREE.Float32BufferAttribute(weights,4));
  const skinBone=new THREE.Bone();skinBone.name='post_skin_bone';bone.add(skinBone);
  const body=new THREE.SkinnedMesh(geometry,sourceMaterial);body.name='post_body';bone.add(body);template.updateMatrixWorld(true);body.bind(new THREE.Skeleton([skinBone]));
  const crate=new THREE.Mesh(new THREE.BoxGeometry(50,50,50),sourceMaterial);crate.name='crate_test';template.add(crate);
  const phases=FACTIONS.ig.structures.find(entry=>entry.type==='listening_post').animations.phases;
  const clips=Object.values(phases).flat().map(name=>new THREE.AnimationClip(name,name==='build_placement'?0:1,[new THREE.VectorKeyframeTrack('main_body.position',name==='build_bunker_rise'?[0,1]:[0],name==='build_bunker_rise'?[2,-5,-1,2,1.5,-1]:[2,-5,-1])]));
  const previous=factionContainers.ig.structures.listening_post;
  factionContainers.ig.structures.listening_post={scene:template,animations:clips,meshes:[body,crate],_hiddenNodes:['crate_'],dispose(){}};
  return {world,near,far,point,sourceMaterial,sourceTexture,restore(){ghosts.cancelBuild();core.setSelBuilder(null);factionContainers.ig.structures.listening_post=previous;body.geometry.dispose();crate.geometry.dispose();sourceMaterial.dispose();sourceTexture.dispose();}};
}

test('all eligible captured points show finished ghosts and boxes alongside the independent cursor preview',()=>{
  const f=fixture();try{
    ghosts.startBuild('listening_post');
    assert.equal(ghosts._listeningPostGhostTarget,f.near);
    assert.deepEqual([...ghosts._listeningPostPointPreviews.keys()],[f.near,f.far]);
    assert.ok(ghosts._buildGhost.position.distanceTo(new THREE.Vector3(10,7.5,0))<1e-6);
    const previews=[...ghosts._listeningPostPointPreviews.values()];
    for(const [id,height] of [[f.near,7.5],[f.far,2]]){
      const preview=ghosts._listeningPostPointPreviews.get(id),point=f.world.get(id,'strategicPoint');
      assert.notEqual(preview.ghost,ghosts._buildGhost);assert.notEqual(preview.footprint,ghosts._buildFootprint);
      assert.equal(preview.ghost.visible,true);assert.equal(preview.footprint.visible,true);
      assert.deepEqual(preview.ghost.position.toArray(),[point.position.x,height,point.position.z]);
      assert.deepEqual(preview.footprint.position.toArray(),[point.position.x+2,height+1.5,point.position.z-1]);
      assert.equal(preview.ghost.getObjectByName('main_body').position.y,1.5);
      assert.equal(preview.ghost.getObjectByName('crate_test').visible,false);
      assert.equal(preview.ghost.getObjectByName('post_body').frustumCulled,false);
      assert.deepEqual([preview.footprint.geometry.parameters.width,preview.footprint.geometry.parameters.height,preview.footprint.geometry.parameters.depth],[4,3,6]);
    }
    assert.notEqual(previews[0].ghost.getObjectByName('post_body').material,previews[1].ghost.getObjectByName('post_body').material);
    assert.equal(f.sourceMaterial.transparent,false);assert.equal(f.sourceMaterial.map,f.sourceTexture);
    ghosts.setGhostPending(100,450);core.runBeforeRender();
    assert.equal(ghosts._listeningPostGhostTarget,null);
    assert.ok(ghosts._buildGhost.position.distanceTo(new THREE.Vector3(-30,0,15))<1e-6);
    assert.ok(ghosts._buildFootprint.position.distanceTo(new THREE.Vector3(-28,1.5,14))<1e-6);
    core.runBeforeRender();
    assert.deepEqual(ghosts._listeningPostPointPreviews.get(f.near).ghost.position.toArray(),[10,7.5,0]);
    assert.deepEqual(ghosts._listeningPostPointPreviews.get(f.far).ghost.position.toArray(),[20,2,0]);
    ghosts.setGhostPending(610,310);core.runBeforeRender();
    assert.equal(ghosts._listeningPostGhostTarget,f.far);
    assert.deepEqual(ghosts._buildGhost.position.toArray(),[20,2,0],'nearby cursor ghost snaps to the exact point center and height');
    assert.deepEqual(ghosts._buildFootprint.position.toArray(),[22,3.5,-1]);
    ghosts.setGhostPending(660,300);core.runBeforeRender();
    assert.equal(ghosts._listeningPostGhostTarget,null,'moving beyond the snap radius releases the cursor');
    assert.ok(ghosts._buildGhost.position.distanceTo(new THREE.Vector3(26,0,0))<1e-6);
    assert.deepEqual(ghosts._listeningPostPointPreviews.get(f.far).ghost.position.toArray(),[20,2,0]);
    assert.equal(ghosts._listeningPostPointPreviews.get(f.near),previews[0],'frame updates reuse the previews');
    const cursor=ghosts._buildGhost,box=ghosts._buildFootprint;
    ghosts.cancelBuild();core.runBeforeRender();
    assert.equal(ghosts._listeningPostPointPreviews.size,0);assert.equal(cursor.parent,null);assert.equal(box.parent,null);
    for(const preview of previews){assert.equal(preview.ghost.parent,null);assert.equal(preview.footprint.parent,null);}
    assert.equal(ghosts._buildGhostMeshes.length,0);assert.equal(core.buildMode,null);
  }finally{f.restore();}
});

test('without eligible points only the cursor preview remains visible',()=>{
  const f=fixture();try{
    f.world.get(f.near,'strategicPoint').owner='red';f.world.get(f.far,'strategicPoint').hasListeningPost=true;
    ghosts.startBuild('listening_post');
    assert.equal(ghosts._listeningPostPointPreviews.size,0);assert.equal(ghosts._buildGhost.visible,true);assert.equal(ghosts._buildFootprint.visible,true);
    ghosts.setGhostPending(200,200);core.runBeforeRender();
    assert.ok(ghosts._buildGhost.position.distanceTo(new THREE.Vector3(-20,0,-10))<1e-6);
    assert.ok(ghosts._buildFootprint.position.distanceTo(new THREE.Vector3(-18,1.5,-11))<1e-6);
  }finally{f.restore();}
});

test('point previews track capture, lost ownership, existing construction, and completed posts without leaking old meshes',()=>{
  const f=fixture();try{
    ghosts.startBuild('listening_post');
    const near=ghosts._listeningPostPointPreviews.get(f.near),far=ghosts._listeningPostPointPreviews.get(f.far);
    f.world.get(f.near,'strategicPoint').owner='red';core.runBeforeRender();
    assert.equal(ghosts._listeningPostPointPreviews.size,1);assert.equal(near.ghost.parent,null);assert.equal(near.footprint.parent,null);
    for(const mesh of near.meshes)assert.equal(ghosts._buildGhostMeshes.includes(mesh),false);
    f.world.get(f.far,'strategicPoint').listeningPostEntityId=999;core.runBeforeRender();
    assert.equal(ghosts._listeningPostPointPreviews.size,0);assert.equal(far.ghost.parent,null);
    f.world.get(f.near,'strategicPoint').owner='blue';core.runBeforeRender();
    const restored=ghosts._listeningPostPointPreviews.get(f.near);assert.ok(restored);assert.notEqual(restored,near);
    const captured=f.point(-10,8,'blue',false,4);core.runBeforeRender();
    assert.equal(ghosts._listeningPostPointPreviews.size,2);
    assert.deepEqual(ghosts._listeningPostPointPreviews.get(captured).ghost.position.toArray(),[-10,4,8]);
    f.world.get(captured,'strategicPoint').hasListeningPost=true;core.runBeforeRender();assert.equal(ghosts._listeningPostPointPreviews.has(captured),false);
    const cursor=ghosts._buildGhost;ghosts.startBuild('listening_post');
    assert.equal(cursor.parent,null);assert.equal(restored.ghost.parent,null);assert.equal(restored.footprint.parent,null);
    assert.equal(ghosts._listeningPostPointPreviews.size,1);
  }finally{f.restore();}
});

test('snapping ignores enemy and occupied points and releases a lost target without another mouse event',()=>{
  const f=fixture();try{
    ghosts.startBuild('listening_post');
    assert.equal(ghosts._listeningPostGhostTarget,f.near);
    f.world.get(f.near,'strategicPoint').owner='red';core.runBeforeRender();
    assert.equal(ghosts._listeningPostGhostTarget,null);
    assert.ok(ghosts._buildGhost.position.distanceTo(new THREE.Vector3(10,0,0))<1e-6);
    ghosts.setGhostPending(610,310);core.runBeforeRender();assert.equal(ghosts._listeningPostGhostTarget,f.far);
    f.world.get(f.far,'strategicPoint').listeningPostEntityId=999;core.runBeforeRender();
    assert.equal(ghosts._listeningPostGhostTarget,null);
    assert.ok(ghosts._buildGhost.position.distanceTo(new THREE.Vector3(21,0,1))<1e-6);
    assert.equal(ghosts._listeningPostPointPreviews.size,0);
  }finally{f.restore();}
});
