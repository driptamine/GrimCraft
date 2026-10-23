import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { astar } from '../pathfinding/astar.js';

const open = () => false;

function pathCost(path) {
  let total = 0;
  for (let i = 1; i < path.length; i += 1) {
    const dx = Math.abs(path[i].x - path[i - 1].x);
    const dy = Math.abs(path[i].y - path[i - 1].y);
    total += dx && dy ? Math.SQRT2 : 1;
  }
  return total;
}

describe('classic astar', () => {
  it('walks the octile-optimal diagonal on open ground', () => {
    const path = astar({ x: 0, y: 0 }, { x: 3, y: 4 }, { isBlocked: open });
    assert.deepEqual(path[0], { x: 0, y: 0 });
    assert.deepEqual(path[path.length - 1], { x: 3, y: 4 });
    assert.equal(path.length, 5);
    assert.ok(Math.abs(pathCost(path) - (4 + (Math.SQRT2 - 1) * 3)) < 1e-9);
  });

  it('detours through the gap in a wall', () => {
    const blocked = (x, y) => x === 2 && y !== 3;
    const path = astar({ x: 0, y: 0 }, { x: 4, y: 0 }, { isBlocked: blocked });
    assert.ok(path);
    assert.ok(path.some((c) => c.x === 2 && c.y === 3), 'uses the gap');
    assert.ok(path.every((c) => !blocked(c.x, c.y)), 'never steps on the wall');
  });

  it('returns null when the goal is walled in', () => {
    // Closed perimeter at Chebyshev distance 2: no orthogonal or diagonal entry.
    const ring = (x, y) => (Math.abs(x - 5) === 2 && Math.abs(y - 5) <= 2)
      || (Math.abs(y - 5) === 2 && Math.abs(x - 5) <= 2);
    const path = astar({ x: 0, y: 0 }, { x: 5, y: 5 }, { isBlocked: ring });
    assert.equal(path, null);
  });

  it('never cuts corners through blocked diagonals', () => {
    const blocked = (x, y) => (x === 1 && y === 0) || (x === 0 && y === 1);
    const path = astar({ x: 0, y: 0 }, { x: 1, y: 1 }, { isBlocked: blocked });
    assert.ok(path);
    assert.ok(path.length > 2, 'goes around instead of stepping diagonally');
    for (let i = 1; i < path.length; i += 1) {
      const dx = path[i].x - path[i - 1].x;
      const dy = path[i].y - path[i - 1].y;
      if (dx !== 0 && dy !== 0) {
        assert.ok(!blocked(path[i - 1].x + dx, path[i - 1].y), 'side A free');
        assert.ok(!blocked(path[i - 1].x, path[i - 1].y + dy), 'side B free');
      }
    }
  });

  it('handles start==goal and blocked endpoints', () => {
    assert.deepEqual(astar({ x: 2, y: 2 }, { x: 2, y: 2 }, { isBlocked: open }), [{ x: 2, y: 2 }]);
    assert.equal(astar({ x: 0, y: 0 }, { x: 1, y: 0 }, { isBlocked: (x) => x === 0 }), null);
    assert.equal(astar({ x: 0, y: 0 }, { x: 1, y: 0 }, { isBlocked: (x) => x === 1 }), null);
  });

  it('honors the expansion guard and the cost callback', () => {
    const path = astar({ x: 0, y: 0 }, { x: 50, y: 0 }, { isBlocked: open, maxExpand: 5 });
    assert.equal(path, null);
    const lava = (x, y) => (x === 1 && y === 0 ? 100 : 0);
    const routed = astar({ x: 0, y: 0 }, { x: 2, y: 0 }, { isBlocked: open, cost: lava });
    assert.ok(routed);
    assert.ok(!routed.some((c) => c.x === 1 && c.y === 0), 'walks around the expensive cell');
  });
});
