import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import * as THREE from 'three';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

register('./node-esm-hooks.mjs', import.meta.url);
globalThis.window = {};
globalThis.document = { getElementById: () => null };
const sceneMod = await import('../src/scene.js');
{
  const headless = new THREE.Scene();
  headless._registerShadows = () => {};
  sceneMod.__setSceneCameraForTests(headless, { target: new THREE.Vector3() });
}
const { World } = await import('../src/ecs.js');
const systems = await import('../src/systems.js');
const entities = await import('../src/entities.js');
const { sgbPassBlockedAt } = await import('../pathfinding/avoid.js');
const { snapOrderToFree } = await import('../pathfinding/astar-integrated.js');

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const grid = JSON.parse(
  fs.readFileSync(path.join(root, 'maps/6p_alvarus/6p_alvarus_path.json'), 'utf8'),
);

// Closed wall on row 88 (world z=98): cells 69..90. Straight WEST->EAST
// drills through it on local avoidance alone; A* must route around.
const WEST = new THREE.Vector3(10, 0, 98);
const EAST = new THREE.Vector3(118, 0, 98);
const DT = 1 / 60;
const TICKS = 2400;

function crossings(positions) {
  return positions.filter(([x, z]) => sgbPassBlockedAt(grid, x, z)).length;
}

describe('movers respect closed paint', () => {
  it('squad walks around the wall and arrives', () => {
    window.__sgbPassGrid = grid;
    const world = new World();
    const id = entities.createSquadEntity(world, 'blue', WEST.x, WEST.z, 2, null, 'ig');
    const squad = world.get(id, 'squad');
    squad.moveOrder = EAST.clone();
    squad.stopped = false;
    const trail = [];
    for (let t = 0; t < TICKS && squad.moveOrder; t++) {
      systems.systemSquad(world, DT);
      trail.push([squad.position.x, squad.position.z]);
    }
    assert.equal(squad.moveOrder, null, 'order completes');
    assert.equal(crossings(trail), 0, 'no blocked cells stepped on');
  });

  it('apc walks around the wall and arrives', () => {
    window.__sgbPassGrid = grid;
    const world = new World();
    const id = entities.createApcEntity(world, WEST.clone(), 'ig');
    const apc = world.get(id, 'apc');
    apc.moveOrder = EAST.clone();
    const trail = [];
    for (let t = 0; t < TICKS * 3 && apc.moveOrder; t++) {
      systems.systemApc(world, DT);
      trail.push([apc.position.x, apc.position.z]);
    }
    assert.equal(apc.moveOrder, null, 'order completes');
    assert.equal(crossings(trail), 0, 'no blocked cells stepped on');
  });

  it('order onto closed paint stops at its edge instead of climbing on', () => {
    window.__sgbPassGrid = grid;
    const world = new World();
    const id = entities.createSquadEntity(world, 'blue', WEST.x, WEST.z, 2, null, 'ig');
    const squad = world.get(id, 'squad');
    // Raw click just inside the block edge (cell 72,88); same path as
    // issueRightClick: snap before assigning.
    const raw = new THREE.Vector3(-256 + 72.5 * 4, 0, -256 + 88.5 * 4);
    assert.equal(sgbPassBlockedAt(grid, raw.x, raw.z), true, 'fixture sits on closed paint');
    const snapped = snapOrderToFree(raw.x, raw.z, grid);
    assert.ok(snapped, 'snapped to the edge');
    squad.moveOrder = new THREE.Vector3(snapped.x, 0, snapped.z);
    squad.stopped = false;
    const trail = [];
    for (let t = 0; t < TICKS && squad.moveOrder; t++) {
      systems.systemSquad(world, DT);
      trail.push([squad.position.x, squad.position.z]);
    }
    assert.equal(squad.moveOrder, null, 'order completes');
    assert.equal(crossings(trail), 0, 'never steps on closed paint');
  });

  it('pursuit around the wall closes to firing range without crossing', () => {
    window.__sgbPassGrid = grid;
    const world = new World();
    const blue = entities.createSquadEntity(world, 'blue', WEST.x, WEST.z, 2, null, 'ig');
    const red = entities.createSquadEntity(world, 'red', EAST.x, EAST.z, 1, null, 'ig');
    const hunter = world.get(blue, 'squad');
    hunter.forcedTarget = red;
    hunter.stopped = false;
    const trail = [];
    let closed = false;
    for (let t = 0; t < TICKS * 2 && !closed; t++) {
      systems.systemSquad(world, DT);
      const bp = world.get(blue, 'squad').position;
      const rp = world.get(red, 'squad').position;
      trail.push([bp.x, bp.z]);
      if (Math.hypot(bp.x - rp.x, bp.z - rp.z) <= hunter.attackRange) closed = true;
    }
    assert.ok(closed, 'pursuit reaches firing range');
    assert.equal(crossings(trail), 0, 'never steps on closed paint');
  });

  it('builder walks around the wall and arrives', () => {
    window.__sgbPassGrid = grid;
    const world = new World();
    const id = entities.createBuilderEntity(world, WEST.x, WEST.z, 'blue', 'ig');
    const builder = world.get(id, 'builder');
    builder.moveTarget = EAST.clone();
    const trail = [];
    for (let t = 0; t < TICKS && builder.moveTarget; t++) {
      systems.systemBuilder(world, DT);
      const p = world.get(id, 'mesh').root.position;
      trail.push([p.x, p.z]);
    }
    assert.equal(builder.moveTarget, null, 'order completes');
    assert.equal(crossings(trail), 0, 'no blocked cells stepped on');
  });
});
