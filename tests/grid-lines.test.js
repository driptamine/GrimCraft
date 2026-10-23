import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { macroLinePositions, microLinePositions } from '../src/grid-helper.js';

// Default Arena grid constants (src/scene.js buildGrid).
const HALF = 550;
const CELL = 15;
const MICRO = CELL / 5;

describe('arena grid lines', () => {
  it('centers macro ribbons on multiples of the cell size', () => {
    const macro = macroLinePositions(HALF, CELL);
    assert.equal(macro[0], -540);
    assert.ok(macro.every((u) => u % CELL === 0));
    assert.ok(macro.includes(0));
    assert.ok(macro[macro.length - 1] <= HALF);
  });

  it('skips micro lines exactly where macro ribbons sit', () => {
    const macro = new Set(macroLinePositions(HALF, CELL));
    const micro = microLinePositions(HALF, MICRO, CELL);
    assert.ok(micro.length > 0);
    for (const u of micro) {
      assert.ok(!macro.has(u), `no doubled line at ${u}`);
    }
    for (const u of macro) {
      assert.ok(!micro.includes(u), `no micro line under the ribbon at ${u}`);
    }
  });

  it('leaves uniform micro cells (no double-wide gaps)', () => {
    const lines = [
      ...macroLinePositions(HALF, CELL),
      ...microLinePositions(HALF, MICRO, CELL),
    ].filter((u) => u >= -540 && u <= 540).sort((a, b) => a - b);
    let maxGap = 0;
    for (let i = 1; i < lines.length; i++) {
      maxGap = Math.max(maxGap, lines[i] - lines[i - 1]);
    }
    assert.equal(maxGap, MICRO);
  });

  it('stays aligned for other whole cell sizes', () => {
    assert.deepEqual(macroLinePositions(10, 4), [-8, -4, 0, 4, 8]);
    const micro = microLinePositions(10, 1, 4);
    assert.ok(micro.every((u) => u % 4 !== 0));
    const lines = [-8, -4, 0, 4, 8, ...micro].filter((u) => u >= -8 && u <= 8).sort((a, b) => a - b);
    let maxGap = 0;
    for (let i = 1; i < lines.length; i++) {
      maxGap = Math.max(maxGap, lines[i] - lines[i - 1]);
    }
    assert.equal(maxGap, 1);
  });
});
