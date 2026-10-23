import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import { readInputSource } from './input-src.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

register('./node-esm-hooks.mjs', import.meta.url);
globalThis.document = { getElementById: () => null };
const { canPlaceListeningPost, ghostUsesConfigModel } = await import('../src/meshes.js');

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readSrc = (p) => fs.readFileSync(path.join(root, p), 'utf8');

describe('listening post placement', () => {
  it('routes the ghost through the real listening_post.glb model', () => {
    assert.equal(ghostUsesConfigModel('listening_post'), true);
  });

  it('allows only player-owned points and relics without a post', () => {
    assert.equal(canPlaceListeningPost(null, 'blue'), false);
    assert.equal(canPlaceListeningPost(undefined, 'blue'), false);
    assert.equal(canPlaceListeningPost({ owner: null, hasListeningPost: false }, 'blue'), false);
    assert.equal(canPlaceListeningPost({ owner: 'red', hasListeningPost: false }, 'blue'), false);
    assert.equal(canPlaceListeningPost({ owner: 'blue', hasListeningPost: true }, 'blue'), false);
    assert.equal(canPlaceListeningPost({ owner: 'blue', hasListeningPost: false }, 'blue'), true);
    assert.equal(
      canPlaceListeningPost({ kind: 'relic', owner: 'blue', hasListeningPost: false }, 'blue'),
      true,
    );
  });

  it('keeps the r1c3 button clickable whenever affordable', () => {
    const src = readSrc('src/hud/components/ActionsGrid.jsx');
    assert.ok(!src.includes('lpTargetExists'), 'no owned-target gate on the button');
    assert.ok(!src.includes("type === 'listening_post'"), 'no listening-post-only branch');
  });

  it('still rejects invalid targets at placement time', () => {
    const src = readInputSource();
    assert.ok(
      src.includes('if (!canPlaceListeningPost(sp, builder?.team) || !builder)'),
      'placeListeningPost validates the clicked point',
    );
  });
});
