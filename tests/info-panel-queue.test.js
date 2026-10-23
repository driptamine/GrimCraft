import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

describe('info panel production queue', () => {
  const src = fs.readFileSync(path.join(ROOT, 'src/hud/components/InfoPanel.jsx'), 'utf8');
  const view = src.slice(src.indexOf("view === 'building'"), src.indexOf("view === 'listening_post'"));

  it('shows the queue for any training building, not just IG types', () => {
    assert.ok(view.includes('if (building && building.queue) {'), 'any building with a queue shows it');
    assert.ok(!view.includes('isHQ || isBarracks || isMechanized'), 'no IG type gate on the queue block');
    assert.ok(view.includes('queue = <ProductionQueue items={building.queue} />;'), 'queue items render');
  });

  it('queue items render progress generically', () => {
    assert.ok(src.includes('(item.progress / item.total) * 100'), 'progress bar from item fields');
  });

  it('hides the animation list', () => {
    assert.ok(!src.includes('AnimList'), 'no AnimList import or render');
  });

  it('shows values without labels for single squads, icons in MEL/MEN/DPS/UPG order', () => {
    const squad = src.slice(src.indexOf("view === 'squad'"), src.indexOf("view === 'squads'"));
    assert.ok(!/label="[A-Z]+"/.test(squad), 'no text labels in the squad block');
    const icons = [...squad.matchAll(/taskbarIconUrl\('(\w+)'\)/g)].map((m) => m[1]);
    assert.deepEqual(icons, ['meleedamage', 'squadsize', 'rangedamage', 'numberofupgrades']);
  });
});
