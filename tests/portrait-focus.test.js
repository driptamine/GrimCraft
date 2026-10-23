import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import * as THREE from 'three';

register('./node-esm-hooks.mjs', import.meta.url);
globalThis.document = { getElementById: () => null };
const { getPortraitFocusPosition } = await import('../src/hud/data.js');

function makeWorld(entries) {
  const comps = new Map();
  const key = (id, type) => `${id}:${type}`;
  for (const [id, byType] of entries) {
    for (const [type, data] of Object.entries(byType)) {
      comps.set(key(id, type), data);
    }
  }
  return {
    has(id, type) { return comps.has(key(id, type)); },
    get(id, type) { return comps.get(key(id, type)); },
  };
}

function meshAt(x, z) {
  const root = new THREE.Group();
  root.position.set(x, 0, z);
  return { root };
}

const emptySel = {
  builderId: null,
  buildingIds: [],
  squads: [],
  apcs: [],
  vehicles: [],
  jets: [],
  hoveredEnemySquad: null,
  listeningPostId: null,
};

describe('portrait click camera focus', () => {
  it('resolves unit views to entity positions', () => {
    const world = makeWorld([
      [7, { builder: { position: new THREE.Vector3(1, 0, 2) }, mesh: meshAt(3, 4) }],
      [9, { squad: { position: new THREE.Vector3(10, 0, 20) } }],
      [11, { jet: { position: new THREE.Vector3(30, 0, 40) } }],
      [12, { vehicle: { position: new THREE.Vector3(50, 0, 60) } }],
      [13, { apc: { position: new THREE.Vector3(70, 0, 80) } }],
    ]);
    // rendered mesh position wins over the stored component position
    assert.deepEqual(getPortraitFocusPosition(world, 'builder', { ...emptySel, builderId: 7 }), { x: 3, z: 4 });
    assert.deepEqual(getPortraitFocusPosition(world, 'squad', { ...emptySel, squads: [9] }), { x: 10, z: 20 });
    assert.deepEqual(getPortraitFocusPosition(world, 'squads', { ...emptySel, squads: [999, 9] }), { x: 10, z: 20 });
    assert.deepEqual(getPortraitFocusPosition(world, 'jet', { ...emptySel, jets: [11] }), { x: 30, z: 40 });
    assert.deepEqual(getPortraitFocusPosition(world, 'vehicle', { ...emptySel, vehicles: [12] }), { x: 50, z: 60 });
    assert.deepEqual(getPortraitFocusPosition(world, 'apc', { ...emptySel, apcs: [13] }), { x: 70, z: 80 });
  });

  it('resolves building and structure views', () => {
    const world = makeWorld([
      [21, { building: {}, mesh: meshAt(5, 6) }],
      [22, { structure: {}, mesh: meshAt(7, 8) }],
      [23, { airfield: { position: new THREE.Vector3(9, 0, 10) } }],
      [24, { strategicPoint: { position: new THREE.Vector3(11, 0, 12) } }],
    ]);
    assert.deepEqual(getPortraitFocusPosition(world, 'building', { ...emptySel, buildingIds: [21] }), { x: 5, z: 6 });
    assert.deepEqual(getPortraitFocusPosition(world, 'buildings', { ...emptySel, buildingIds: [999, 22] }), { x: 7, z: 8 });
    assert.deepEqual(getPortraitFocusPosition(world, 'airfield', { ...emptySel, buildingIds: [23] }), { x: 9, z: 10 });
    assert.deepEqual(getPortraitFocusPosition(world, 'listening_post', { ...emptySel, listeningPostId: 24 }), { x: 11, z: 12 });
  });

  it('follows hovered enemy squads and returns null when idle', () => {
    const world = makeWorld([
      [31, { squad: { position: new THREE.Vector3(1, 0, 2) } }],
    ]);
    assert.deepEqual(
      getPortraitFocusPosition(world, 'default', { ...emptySel, hoveredEnemySquad: 31 }),
      { x: 1, z: 2 },
    );
    assert.equal(getPortraitFocusPosition(world, 'default', emptySel), null);
    assert.equal(getPortraitFocusPosition(world, 'none', emptySel), null);
    assert.equal(getPortraitFocusPosition(world, 'squad', emptySel), null);
    assert.equal(getPortraitFocusPosition(world, 'squad', { ...emptySel, squads: [999] }), null);
    assert.equal(getPortraitFocusPosition(null, 'squad', { ...emptySel, squads: [31] }), null);
    assert.equal(getPortraitFocusPosition(world, 'squad', null), null);
  });
});
