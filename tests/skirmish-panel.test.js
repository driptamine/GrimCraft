import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

describe('skirmish entry', () => {
  it('routes Skirmish clicks to a dedicated skirmish panel, not the multiplayer overlay', () => {
    const menu = read('src/ui/main-menu.ts');
    const onClick = menu.slice(
      menu.indexOf('function _onItemClick'),
      menu.indexOf('function renderMenuList'),
    );
    assert.ok(onClick.includes('_showSkirmishPanel'), 'skirmish opens its own panel');
    assert.match(
      onClick,
      /if \(screen === 'skirmish'\) \{[\s\S]*?_showSkirmishPanel\(\)[\s\S]*?return;/,
      'skirmish returns before the multiplayer overlay call',
    );
  });

  it('battle start from skirmish hides the panel and reuses the skirmish loading screen', () => {
    const mp = read('src/net/multiplayer.ts');
    const playOffline = mp.slice(
      mp.indexOf('export async function webTransportPlayOffline'),
      mp.indexOf('window._injectConnectUI'),
    );
    assert.ok(playOffline.includes('hideSkirmishPanel()'), 'starting battle closes the skirmish panel');
    assert.ok(
      playOffline.includes("showConnectOverlay('skirmish')"),
      'loading progress shows on the skirmish screen, not the multiplayer one',
    );
  });

  it('menu screens hide the net badge; inject is re-runnable without duplicate overlays', () => {
    const mp = read('src/net/multiplayer.ts');
    const hideSkirmish = mp.slice(
      mp.indexOf('export function hideSkirmishPanel'),
      mp.indexOf('function _renderMapDetail'),
    );
    assert.ok(hideSkirmish.includes('_setNetHudVisible(false)'), 'skirmish close hides the badge');
    const hideConnect = mp.slice(
      mp.indexOf('export function hideConnectOverlay'),
      mp.indexOf('function _setSkirmishPanel'),
    );
    assert.ok(hideConnect.includes('_setNetHudVisible(false)'), 'menu return hides the badge');
    const inject = mp.slice(
      mp.indexOf('export function _injectConnectUI'),
      mp.indexOf('function _setLobbyView'),
    );
    assert.ok(
      inject.includes("getElementById('webTransport-connect-overlay')?.remove()"),
      're-inject removes the previous overlay instead of stacking a visible duplicate',
    );
  });

  it('skirmish panel lists maps and carries no multiplayer controls', () => {
    const mp = read('src/net/multiplayer.ts');
    assert.ok(mp.includes('export function showSkirmishPanel'), 'panel entry is exported');
    const builder = mp.slice(
      mp.indexOf('function _injectSkirmishUI'),
      mp.indexOf('export function showSkirmishPanel'),
    );
    assert.ok(builder.length > 0, 'skirmish markup lives in its own builder');
    assert.ok(builder.includes('skirmish-map-grid'), 'panel has a map list');
    assert.ok(builder.includes('START BATTLE'), 'panel starts the battle');
    for (const multiplayerControl of ['webTransport-server-list', 'wt-connect-btn', 'webTransport-url']) {
      assert.ok(
        !builder.includes(multiplayerControl),
        `skirmish panel must not contain ${multiplayerControl}`,
      );
    }
  });
});
