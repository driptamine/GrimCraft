import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { hudDue } from '../src/hud/store.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

describe('hud refresh cadence', () => {
  it('fires every 3rd frame', () => {
    assert.equal(hudDue(1), false);
    assert.equal(hudDue(2), false);
    assert.equal(hudDue(3), true);
    assert.equal(hudDue(6), true);
    assert.equal(hudDue(7), false);
  });

  it('gates the queue-driven HUD bump on the cadence, not every frame', () => {
    const src = fs.readFileSync(path.join(root, 'src/game.js'), 'utf8');
    const block = src.slice(src.indexOf('// Queue bars animate'), src.indexOf('systemWinCheck(world);'));
    assert.ok(block.includes('hudDue(_frameNo)'), 'queue bump gated on hudDue');
    assert.ok(block.includes('if (hasQueue || hasReinforce)'), 'still bumps while queues run');
  });
});
