import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

register('./node-esm-hooks.mjs', import.meta.url);

const { assetUrl } = await import('../src/assets.js');

describe('asset url', () => {
  it('leaves emoji, absolute and remote urls untouched', () => {
    assert.equal(assetUrl('⚔'), '⚔');
    assert.equal(assetUrl('/maps/a/b.png'), '/maps/a/b.png');
    assert.equal(assetUrl('https://cdn.example.com/x.png'), 'https://cdn.example.com/x.png');
    assert.equal(assetUrl('data:image/png;base64,AAA'), 'data:image/png;base64,AAA');
    assert.equal(assetUrl(null), null);
  });

  it('keeps relative paths local without an asset base', () => {
    // No VITE_ASSET_BASE in this process: dev behavior, unchanged paths.
    assert.equal(assetUrl('assets/icons/x.png'), 'assets/icons/x.png');
  });

  it('routes HUD image points through assetUrl', () => {
    const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
    const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
    assert.ok(read('src/hud/bits.jsx').includes("import { assetUrl } from '../assets.js'"), 'bits imports assetUrl');
    assert.ok(read('src/hud/bits.jsx').includes('<img src={assetUrl(src)}'), 'Icon renders through assetUrl');
    assert.ok(read('src/hud/bits.jsx').includes('<img src={assetUrl(icon)}'), 'StatRow renders through assetUrl');
    assert.ok(read('src/hud/components/Portrait.jsx').includes('<PortraitImg src={assetUrl(icon)}'), 'portrait renders through assetUrl');
    assert.ok(read('src/hud/components/TopBar.jsx').includes("assetUrl('assets/Resource_requisition.gif')"), 'topbar req glyph routed');
    assert.ok(read('src/hud/components/ReinforceBtnPanel.jsx').includes('assetUrl('), 'reinforce icon routed');
    const vite = read('vite.config.js');
    assert.ok(vite.includes('VITE_ASSET_BASE'), 'production build defines an asset base');
    assert.ok(vite.includes('R2_ASSET_BASE'), 'asset base is overridable');
  });
});
