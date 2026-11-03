import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

describe('settings wiki', () => {
  it('routes Settings clicks to a wiki screen, not the stub', () => {
    const menu = read('src/ui/main-menu.ts');
    const onClick = menu.slice(
      menu.indexOf('function _onItemClick'),
      menu.indexOf('function renderMenuList'),
    );
    assert.ok(onClick.includes('renderSettings()'), 'settings opens its own screen');
    assert.match(
      onClick,
      /if \(item\.id === 'settings'\) \{[\s\S]*?renderSettings\(\)[\s\S]*?return;/,
      'settings returns before the stub',
    );
  });

  it('settings wiki screen links both guide pages that exist on disk', () => {
    const menu = read('src/ui/main-menu.ts');
    for (const page of ['settings/wiki/players_guide.html', 'settings/wiki/guardsmen_squad/']) {
      assert.ok(menu.includes(page), `settings links ${page}`);
      assert.ok(fs.existsSync(path.join(root, page)), `${page} exists`);
    }
  });

  it('guardsmen squad page is a React entry mounting the wiki components', () => {
    const entry = read('settings/wiki/guardsmen_squad/index.html');
    assert.ok(entry.includes('id="wiki-root"'), 'entry has a mount node');
    assert.ok(entry.includes('./main.tsx'), 'entry loads the React mount script');
    const mount = read('settings/wiki/guardsmen_squad/main.tsx');
    assert.ok(mount.includes('GuardsmenSquadPage'), 'mount renders GuardsmenSquadPage');
    assert.ok(
      fs.existsSync(path.join(root, 'settings/wiki/guardsmen_squad.html')),
      'static guardsmen_squad.html stays in place',
    );
  });
});
