import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseTga } from '../src/cursors.js';
import { TASKBAR_ICON_FILES, taskbarAssetUrl, taskbarIconUrl } from '../src/taskbar-icons.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readSrc = (p) => fs.readFileSync(path.join(root, p), 'utf8');

describe('taskbar stat icons', () => {
  it('maps squad size and range damage to their tga files', () => {
    assert.deepEqual(TASKBAR_ICON_FILES, {
      squadsize: 'icon_squadsize.tga',
      rangedamage: 'icon_rangedamage.tga',
      numberofupgrades: 'icon_numberofupgrades.tga',
      meleedamage: 'icon_meleedamage.tga',
    });
  });

  it('falls back to emoji until icons preload', () => {
    assert.equal(taskbarIconUrl('squadsize'), null);
    assert.equal(taskbarIconUrl('rangedamage'), null);
    assert.equal(taskbarIconUrl('nope'), null);
    assert.equal(taskbarAssetUrl('icon_squadsize.tga'), null);
  });

  it('parses the real icon files to 32x32 RGBA', () => {
    for (const file of Object.values(TASKBAR_ICON_FILES)) {
      const buf = fs.readFileSync(path.join(root, 'assets/taskbar_icons', file));
      const parsed = parseTga(buf);
      assert.equal(parsed.width, 32);
      assert.equal(parsed.height, 32);
      assert.equal(parsed.rgba.length, 32 * 32 * 4);
    }
  });

  it('wires the icons onto the MEN and DPS stat rows', () => {
    const src = readSrc('src/hud/components/InfoPanel.jsx');
    assert.ok(src.includes("taskbarIconUrl('squadsize') || '👥'"), 'MEN rows use the squad size icon');
    assert.ok(src.includes("taskbarIconUrl('rangedamage') || '⚡'"), 'squad DPS uses the range damage icon');
    assert.ok(src.includes("taskbarIconUrl('rangedamage') || '💥'"), 'vehicle DPS uses the range damage icon');
  });

  it('renders image glyphs in stat rows', () => {
    const src = readSrc('src/hud/bits.jsx');
    assert.ok(src.includes("icon.startsWith('data:')"), 'data-URL icons render as img');
    assert.ok(src.includes('width: 32, height: 32'), 'icons render at native 32x32');
  });

  it('preloads the icons at input boot', () => {
    const src = readSrc('src/input/events.js');
    assert.ok(src.includes('preloadTaskbarIcons();'), 'preloaded next to the cursors');
  });

  it('opts out of Chrome forced darkening so icons keep their colors', () => {
    const html = readSrc('index.html');
    assert.ok(html.includes('<meta name="color-scheme" content="dark">'), 'dark scheme declared');
  });
});
