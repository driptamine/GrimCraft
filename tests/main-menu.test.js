import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MENU_ITEMS, screenFor } from '../src/main-menu.js';

describe('startup main menu', () => {
  it('lists the six sections in order', () => {
    assert.deepEqual(
      MENU_ITEMS.map((item) => item.label),
      ['Campaign', 'Skirmish', 'Multi-player', 'Army Painter', 'Settings', 'Credits'],
    );
  });

  it('routes skirmish and multi-player to live screens, the rest to stubs', () => {
    assert.equal(screenFor('skirmish'), 'skirmish');
    assert.equal(screenFor('multiplayer'), 'multiplayer');
    for (const id of ['campaign', 'army-painter', 'settings', 'credits']) {
      assert.equal(screenFor(id), 'stub');
    }
  });

  it('renders each credits name on its own line', () => {
    const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
    const src = fs.readFileSync(path.join(root, 'src/main-menu.js'), 'utf8');
    assert.ok(src.includes("for (const name of ['Driptamine', 'Alexander Morgun'])"), 'both names listed');
    assert.ok(src.includes("line.className = 'main-menu-stub-note'"), 'each name gets its own line element');
    assert.ok(src.includes("item.id === 'credits'"), 'credits opens its own screen, not the stub');
  });
});
