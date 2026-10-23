import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// The HUD minimap is mirrored left-to-right and flipped top-to-bottom
// (world +X at the left, world +Z at the top). Draw and click mappings
// must use the same mirror or clicks land mirrored.
describe('minimap mirror flip', () => {
  it('draw maps +X left and +Z top', () => {
    const src = fs.readFileSync(path.join(root, 'src/hud/components/Minimap.jsx'), 'utf8');
    assert.ok(src.includes('const wx = (x) => Math.round(((HALF - x) / (HALF * 2)) * W);'), 'mirrored draw X');
    assert.ok(src.includes('const wy = (z) => Math.round(((HALF - z) / (HALF * 2)) * H);'), 'flipped draw Y');
  });

  it('click maps back with the same mirror', () => {
    const src = fs.readFileSync(path.join(root, 'src/hud/components/Minimap.jsx'), 'utf8');
    assert.ok(
      src.includes('currentBounds() - normalizedX * currentBounds() * 2'),
      'click x uses the mirrored mapping',
    );
    assert.ok(
      src.includes('currentBounds() - normalizedY * currentBounds() * 2'),
      'click z uses the flipped mapping',
    );
  });
});
