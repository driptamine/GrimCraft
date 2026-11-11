import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {attachWarriorAurora,attachNecronStructureAurora,setNecronGlowMode,necronGlowMode,updateNecronAurora} from '../src/fx/necron-aurora.js';

test('warrior switches between preserved old aura, aurora and off without rebuilding',()=>{
 const scene=new THREE.Scene(),root=new THREE.Group();scene.add(root);
 const legacy=new THREE.Group();legacy.name='necron_aura';root.add(legacy);
 const shell=new THREE.Mesh();shell.name='body_gas';root.add(shell);
 attachWarriorAurora(root);const aurora=root.getObjectByName('necron_aurora');const count=root.children.length;
 setNecronGlowMode('new');assert.ok(aurora.visible);assert.equal(legacy.visible,false);assert.equal(shell.visible,false);
 setNecronGlowMode('current');assert.ok(legacy.visible&&shell.visible);assert.equal(aurora.visible,false);
 setNecronGlowMode('off');assert.equal(legacy.visible||shell.visible||aurora.visible,false);
 setNecronGlowMode('new');attachWarriorAurora(root);assert.equal(root.children.length,count);assert.equal(necronGlowMode(),'new');
 updateNecronAurora(3.5);assert.equal(aurora.children[0].material.uniforms.uTime.value,3.5);
 assert.equal(aurora.children[0].material.depthWrite,false);assert.equal(aurora.children[0].userData.pickable,false);
 assert.equal(aurora.getObjectByName('necron_aurora_wisp'),undefined,'warriors no longer have vertical ribbons');
 assert.equal(aurora.children.length,4);
 assert.ok(aurora.children.every(cloud=>cloud.name==='necron_warrior_gas_cloud'&&cloud.scale.y<=1.1&&cloud.position.y<2));
});
test('generators attach four lamps to model markers and a separate central energy glow',()=>{
 const root=new THREE.Group(),body=new THREE.Mesh(new THREE.BoxGeometry(4,4,4));body.position.y=2;root.add(body);root.position.set(27,3,-11);root.rotation.y=Math.PI/2;
 new THREE.Scene().add(root);
 const positions=[[-1.8,2.34,0],[0,2.34,-1.8],[1.8,2.34,0],[0,2.34,1.8]];
 for(const [index,position]of positions.entries()){const marker=new THREE.Object3D();marker.name=`marker_capture_light_${index+1}`;marker.position.fromArray(position);root.add(marker)}
 attachNecronStructureAurora(root,'plasma_generator');
 for(let index=0;index<4;index++){const lamp=root.getObjectByName(`necron_generator_light_${index+1}`);assert.ok(lamp);assert.ok(lamp.position.distanceTo(new THREE.Vector3().fromArray(positions[index]))<1e-6)}
 assert.ok(root.getObjectByName('necron_generator_center'));
 assert.ok(root.getObjectByName('necron_generator_energy_pool'));
 assert.equal(root.getObjectByName('necron_generator_center_needle'),undefined,'no beam or tentacle in the well');
 assert.ok(root.getObjectByName('necron_generator_gas_cloud'));
 const clouds=[];root.traverse(node=>{if(node.name==='necron_generator_gas_cloud')clouds.push(node)});
 assert.equal(clouds.length,3);assert.ok(clouds.every(cloud=>cloud.scale.y<1));
 updateNecronAurora(6);assert.ok(clouds.every(cloud=>cloud.material.uniforms.uTime.value===6));
 assert.equal(root.getObjectByName('necron_aurora_wisp'),undefined,'generators use compact lamps and a luminous well instead of tall wisps');
 const before=root.children.length;attachNecronStructureAurora(root,'plasma_generator');assert.equal(root.children.length,before);
 assert.equal(body.material.opacity,1);
 setNecronGlowMode('current');assert.equal(root.getObjectByName('necron_aurora').visible,true,'generator replacement is independent of warrior A/B mode');
 setNecronGlowMode('off');assert.equal(root.getObjectByName('necron_aurora').visible,false);setNecronGlowMode('new');
});
test('obelisk gets tall aurora curtains and unrelated buildings are untouched',()=>{
 const root=new THREE.Group();const shaft=new THREE.Mesh(new THREE.BoxGeometry(2,9,2));shaft.position.y=4.5;root.add(shaft);
 attachNecronStructureAurora(root,'obelisk');const glow=root.getObjectByName('necron_aurora');assert.ok(glow);assert.ok(glow.getObjectByName('necron_aurora_wisp').scale.y>8);
 const unrelated=new THREE.Group();unrelated.add(shaft.clone());attachNecronStructureAurora(unrelated,'barracks');assert.equal(unrelated.getObjectByName('necron_aurora'),undefined);
});
