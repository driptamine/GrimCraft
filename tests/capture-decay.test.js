import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import * as THREE from 'three';

register('./node-esm-hooks.mjs', import.meta.url);
globalThis.window = {};
globalThis.document = { getElementById: () => null };
const systems = await import('../src/systems.js');
const { CAPTURE_PROGRESS_RATE } = await import('../src/soldier-aim.js');

const DT = 1 / 60;

function makeWorld() {
  const comps = new Map();
  let nextId = 1;
  return {
    createEntity() {
      const id = nextId++;
      comps.set(id, new Map());
      return id;
    },
    add(id, type, data) {
      comps.get(id).set(type, data);
    },
    get(id, type) {
      return comps.get(id)?.get(type);
    },
    query(...types) {
      const out = [];
      for (const [id, m] of comps) {
        if (types.every((t) => m.has(t))) out.push(id);
      }
      return out;
    },
  };
}

function addPoint(world, captureProgress, owner = null) {
  const id = world.createEntity();
  world.add(id, 'strategicPoint', {
    kind: 'point', position: new THREE.Vector3(0, 0, 0), owner, faction: null,
    captureProgress, captureRadius: 4.5, hasListeningPost: false, hasTowerBase: false,
    lpTier: 0, researchQueue: [], reqTimer: 0, lpMesh: null,
  });
  world.add(id, 'mesh', { root: new THREE.Group(), model: null });
  return id;
}

// Abandoned progress must drain on the very first frame after capping stops:
// no grace period, no idle clock.
describe('capture decay', () => {
  it('drains abandoned progress on the first idle frame', () => {
    const world = makeWorld();
    const spId = addPoint(world, 0.5);
    systems.systemStrategicPoint(world, DT);
    const got = world.get(spId, 'strategicPoint').captureProgress;
    assert.equal(got, 0.5 - CAPTURE_PROGRESS_RATE * DT);
  });

  it('drains abandoned enemy progress toward 0 without crossing sides', () => {
    const world = makeWorld();
    const spId = addPoint(world, -0.5);
    systems.systemStrategicPoint(world, DT);
    const got = world.get(spId, 'strategicPoint').captureProgress;
    assert.equal(got, -0.5 + CAPTURE_PROGRESS_RATE * DT);
  });

  it('never decays owned points', () => {
    const world = makeWorld();
    const blue = addPoint(world, 1, 'blue');
    const red = addPoint(world, -1, 'red');
    for (let tick = 0; tick < 600; tick++) {
      systems.systemStrategicPoint(world, DT);
    }
    assert.equal(world.get(blue, 'strategicPoint').captureProgress, 1);
    assert.equal(world.get(red, 'strategicPoint').captureProgress, -1);
  });

  it('holds progress on the tick frame itself, then drains', () => {
    const world = makeWorld();
    const spId = addPoint(world, 0.5);
    world.get(spId, 'strategicPoint')._capTicked = true;
    systems.systemStrategicPoint(world, DT);
    assert.equal(world.get(spId, 'strategicPoint').captureProgress, 0.5);
    systems.systemStrategicPoint(world, DT);
    assert.ok(world.get(spId, 'strategicPoint').captureProgress < 0.5);
  });
});
