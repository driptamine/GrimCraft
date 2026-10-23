// Classic A* on a 2D grid. Pure: no engine imports so plain `node --test`
// can cover it. Works on cell coords {x, y}; blocking and extra costs come
// from caller callbacks so the game can plug paint + slope pricing.
//
// Options:
//   isBlocked(x, y) -> bool          required
//   cost(x, y, px, py) -> number      extra enter-cost (parent coords last),
//                                     default 0
//   diagonalCost                      default Math.SQRT2
//   maxExpand                         expansion guard, default 20000
//
// Returns an array of {x, y} cells from start to goal (inclusive), or null
// when unreachable / the start is boxed in / the guard trips.
const DEFAULT_DIAGONAL = Math.SQRT2;

function _octile(dx, dy) {
  const min = Math.min(dx, dy);
  return (dx + dy) + (DEFAULT_DIAGONAL - 2) * min;
}

// Minimal binary min-heap keyed on f. Index map keeps decrease-key O(log n).
function _makeHeap() {
  const keys = [];
  const ids = [];
  const items = [];
  const indexById = new Map();
  const swap = (a, b) => {
    const tk = keys[a];
    keys[a] = keys[b];
    keys[b] = tk;
    const td = ids[a];
    ids[a] = ids[b];
    ids[b] = td;
    const ti = items[a];
    items[a] = items[b];
    items[b] = ti;
    indexById.set(ids[a], a);
    indexById.set(ids[b], b);
  };
  const siftUp = (i) => {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (keys[i] >= keys[parent]) break;
      swap(i, parent);
      i = parent;
    }
  };
  const siftDown = (i) => {
    for (;;) {
      const left = i * 2 + 1;
      const right = left + 1;
      let smallest = i;
      if (left < keys.length && keys[left] < keys[smallest]) smallest = left;
      if (right < keys.length && keys[right] < keys[smallest]) smallest = right;
      if (smallest === i) break;
      swap(i, smallest);
      i = smallest;
    }
  };
  return {
    get size() {
      return keys.length;
    },
    push(id, item, f) {
      const at = indexById.get(id);
      if (at !== undefined) {
        if (f >= keys[at]) return;
        keys[at] = f;
        items[at] = item;
        siftUp(at);
        return;
      }
      indexById.set(id, keys.length);
      keys.push(f);
      ids.push(id);
      items.push(item);
      siftUp(keys.length - 1);
    },
    pop() {
      const top = items[0];
      indexById.delete(ids[0]);
      const lastKey = keys.pop();
      const lastId = ids.pop();
      const lastItem = items.pop();
      if (keys.length) {
        keys[0] = lastKey;
        ids[0] = lastId;
        items[0] = lastItem;
        indexById.set(lastId, 0);
        siftDown(0);
      }
      return top;
    },
  };
}

const _NEIGHBORS = [
  [1, 0, 1],
  [-1, 0, 1],
  [0, 1, 1],
  [0, -1, 1],
  [1, 1, DEFAULT_DIAGONAL],
  [1, -1, DEFAULT_DIAGONAL],
  [-1, 1, DEFAULT_DIAGONAL],
  [-1, -1, DEFAULT_DIAGONAL],
];

export function astar(start, goal, { isBlocked, cost = null, maxExpand = 20000 } = {}) {
  if (typeof isBlocked !== 'function') {
    throw new Error('astar: isBlocked(x, y) is required');
  }
  const keyOf = (x, y) => x + ',' + y;
  if (isBlocked(start.x, start.y) || isBlocked(goal.x, goal.y)) {
    return null;
  }
  if (start.x === goal.x && start.y === goal.y) {
    return [{ x: start.x, y: start.y }];
  }
  const open = _makeHeap();
  const gScore = new Map();
  const cameFrom = new Map();
  const closed = new Set();
  const startKey = keyOf(start.x, start.y);
  gScore.set(startKey, 0);
  open.push(startKey, { x: start.x, y: start.y }, _octile(Math.abs(goal.x - start.x), Math.abs(goal.y - start.y)));
  let expanded = 0;
  while (open.size > 0) {
    if (++expanded > maxExpand) {
      return null;
    }
    const current = open.pop();
    const currentKey = keyOf(current.x, current.y);
    if (closed.has(currentKey)) {
      continue;
    }
    closed.add(currentKey);
    if (current.x === goal.x && current.y === goal.y) {
      const path = [{ x: current.x, y: current.y }];
      let key = currentKey;
      while (cameFrom.has(key)) {
        key = cameFrom.get(key);
        const [px, py] = key.split(',').map(Number);
        path.push({ x: px, y: py });
      }
      return path.reverse();
    }
    for (const [dx, dy, step] of _NEIGHBORS) {
      const nx = current.x + dx;
      const ny = current.y + dy;
      const nKey = keyOf(nx, ny);
      if (closed.has(nKey) || isBlocked(nx, ny)) {
        continue;
      }
      // No corner cutting: a diagonal needs both orthogonal sides free.
      if (dx !== 0 && dy !== 0 && (isBlocked(current.x + dx, current.y) || isBlocked(current.x, current.y + dy))) {
        continue;
      }
      const extra = cost ? cost(nx, ny, current.x, current.y) : 0;
      const tentative = gScore.get(currentKey) + step + extra;
      if (tentative >= (gScore.get(nKey) ?? Infinity)) {
        continue;
      }
      gScore.set(nKey, tentative);
      cameFrom.set(nKey, currentKey);
      open.push(nKey, { x: nx, y: ny }, tentative + _octile(Math.abs(goal.x - nx), Math.abs(goal.y - ny)));
    }
  }
  return null;
}
