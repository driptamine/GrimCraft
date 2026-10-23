import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MELEE_DAMAGE_BASE, meleeDamageEstimate } from '../src/soldier-aim.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readSrc = (p) => fs.readFileSync(path.join(root, p), 'utf8');

describe('squad melee estimate', () => {
  it('pins the melee base below the ranged baseline', () => {
    assert.equal(MELEE_DAMAGE_BASE, 8.0);
    assert.ok(MELEE_DAMAGE_BASE < 10.5);
  });

  it('scales with the average attack rate like the DPS readout', () => {
    assert.equal(meleeDamageEstimate([{ attackRate: 2 }, { attackRate: 3 }]), 8.0 * 2.5);
    assert.equal(meleeDamageEstimate([{ attackRate: 2 }]), 16.0);
  });

  it('tolerates empty and missing input', () => {
    assert.equal(meleeDamageEstimate([]), 0);
    assert.equal(meleeDamageEstimate(null), 0);
    assert.equal(meleeDamageEstimate([null, {}]), 0);
  });

  it('shows the MEL row with the melee icon in the squad view', () => {
    const src = readSrc('src/hud/components/InfoPanel.jsx');
    assert.ok(src.includes('meleeDamageEstimate('), 'squad view computes the estimate');
    assert.ok(src.includes("taskbarIconUrl('meleedamage') || '🗡️'"), 'MEL row uses the icon');
    assert.ok(src.includes("label={null} value={mel}"), 'MEL row shows the value, no label');
  });
});
