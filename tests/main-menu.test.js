import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
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
});
