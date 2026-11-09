import { it, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { clampStepToRoute, findSquadPath, setRoutingMode } from '../pathfinding/astar-integrated.js';
import { sgbPassBlockedAt } from '../pathfinding/avoid.js';

globalThis.window = {};
afterEach(() => { delete window.__sgbPassGrid; setRoutingMode('astar'); });
function grid(rows) {
  const doc = { grid: { originX: 0, originZ: 0, sizeX: rows[0].length, sizeZ: rows.length, cellWorld: 2 }, rows };
  window.__sgbPassGrid = doc;
  return doc;
}
it('allows 2 and refuses 7 and 3 even without an active route', () => {
  grid([[2, 2, 7, 3]]);
  assert.deepEqual(clampStepToRoute({}, 1, 1, 2, 0), [2, 0]);
  assert.deepEqual(clampStepToRoute({}, 3, 1, 2, 0), [0, 0]);
  assert.deepEqual(clampStepToRoute({}, 3, 1, 4, 0), [0, 0]);
});
it('cannot tunnel across a 7 cell to a free endpoint during a long frame', () => {
  grid([[2, 7, 2]]);
  assert.deepEqual(clampStepToRoute({}, 1, 1, 4, 0), [0, 0]);
});
it('slides on the free axis beside a closed cell', () => {
  const doc = grid([[2, 2], [7, 2]]);
  const delta = clampStepToRoute({}, 3, 1, -2, 2);
  assert.deepEqual(delta, [-2, 0]);
  assert.equal(sgbPassBlockedAt(doc, 3 + delta[0], 1 + delta[1]), false);
});
it('does not enter a sealed wall when routing returns no path', () => {
  const doc = grid([[2, 7, 2], [2, 7, 2], [2, 7, 2]]);
  assert.equal(findSquadPath({ x: 1, z: 3 }, { x: 5, z: 3 }, { passGrid: doc }), null);
  assert.deepEqual(clampStepToRoute({}, 1, 3, 2, 0), [0, 0]);
});
it('keeps painted walls closed in straight routing mode and near an arrival target', () => {
  grid([[2, 7, 2]]);
  setRoutingMode('straight');
  assert.deepEqual(clampStepToRoute({}, 1.99, 1, 0.02, 0), [0, 0]);
});
it('preserves flat-map movement without a passability grid', () => {
  assert.deepEqual(clampStepToRoute({}, 1, 1, 4, 2), [4, 2]);
});
