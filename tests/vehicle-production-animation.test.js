import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { attachVehicleProductionAnimation } from '../src/render/vehicle-production-animation.js';

function fixture() {
    const root = new THREE.Group();
    const body = new THREE.Object3D();body.name = 'bunker';body.position.y = 3;
    const aircraft = new THREE.Object3D();aircraft.name = 'valkyrie';aircraft.position.y = 40;
    const crate = new THREE.Object3D();crate.name = 'crate_01';crate.visible = false;
    root.add(body, aircraft, crate);
    const mixer = new THREE.AnimationMixer(root);root._instanceData = { mixer };
    const source = new THREE.AnimationClip('research_dropoff', 10, [
        new THREE.VectorKeyframeTrack('bunker.position', [0, 10], [0, -20, 0, 0, -20, 0]),
        new THREE.VectorKeyframeTrack('valkyrie.position', [0, 5, 10], [0, 40, 0, 0, 5, 0, 0, 40, 0]),
    ]);
    attachVehicleProductionAnimation(root, [source], 'research_dropoff');
    return { root, body, aircraft, crate, mixer, source, update: root._vehicleProductionAnimation.update };
}

test('vehicle orders animate the drop-off without resetting the completed building or showing scaffolds', () => {
    const { body, aircraft, crate, mixer, source, update } = fixture();
    assert.equal(aircraft.visible, false);
    update([{ progress: 5, total: 10 }]);
    assert.equal(aircraft.visible, true);assert.equal(aircraft.position.y, 5);
    assert.equal(body.position.y, 3);assert.equal(crate.visible, false);
    mixer.update(20);
    assert.equal(aircraft.position.y, 5, 'global mixers cannot advance production twice');
    assert.equal(source.tracks.length, 2, 'source clips remain intact');
    update([]);
    assert.equal(aircraft.visible, false);assert.equal(aircraft.position.y, 40);
    assert.equal(body.position.y, 3);
});

test('replica progress interpolates, repeated snapshots do not restart delivery, and the next identical order restarts', () => {
    const { aircraft, update } = fixture();
    update([{ type: 'chimera', progress: 4, total: 10 }], 1);
    assert.equal(aircraft.position.y, 5);
    update([{ type: 'chimera', progress: 4, total: 10 }], 1);
    assert.equal(aircraft.position.y, 5);
    update([{ type: 'chimera', progress: 0, total: 10 }]);
    assert.equal(aircraft.position.y, 40);
    update([{ type: 'chimera', progress: 5, total: 10 }]);
    assert.equal(aircraft.position.y, 5);
    update([]);update([]);
    assert.equal(aircraft.visible, false);
    update([{ type: 'chimera', progress: 5, total: 10 }]);
    assert.equal(aircraft.visible, true);assert.equal(aircraft.position.y, 5);
});

test('models without the configured animation retain their normal mesh', () => {
    const root = new THREE.Group();
    attachVehicleProductionAnimation(root, [], 'research_dropoff');
    assert.equal(root._vehicleProductionAnimation, undefined);
});
