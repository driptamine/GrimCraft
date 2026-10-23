import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MAX_UPGRADES_PER_SQUAD, numberOfUpgrades } from '../src/soldier-aim.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readSrc = (p) => fs.readFileSync(path.join(root, p), 'utf8');

const plain = { isGrenadier: false };
const grenadier = { isGrenadier: true };

describe('squad numberOfUpgrades', () => {
  it('caps at 5 per squad', () => {
    assert.equal(MAX_UPGRADES_PER_SQUAD, 5);
  });

  it('counts grenade launchers', () => {
    assert.equal(numberOfUpgrades([plain, grenadier, grenadier], 'beam'), 2);
    assert.equal(numberOfUpgrades([plain, plain], 'beam'), 0);
  });

  it('counts plasma pistols/guns for non-grenadiers on plasma squads', () => {
    assert.equal(numberOfUpgrades([plain, plain, plain], 'plasma'), 3);
    assert.equal(numberOfUpgrades([plain, grenadier], 'plasma'), 2);
    assert.equal(numberOfUpgrades([plain, plain], 'beam'), 0);
  });

  it('counts plasma-final as a plasma upgrade', () => {
    assert.equal(numberOfUpgrades([plain, plain, plain], 'plasma-final'), 3);
    assert.equal(numberOfUpgrades([plain, grenadier], 'plasma-final'), 2);
  });

  it('never exceeds the cap', () => {
    const six = [grenadier, grenadier, grenadier, plain, plain, plain];
    assert.equal(numberOfUpgrades(six, 'plasma'), 5);
    assert.equal(numberOfUpgrades(six, 'beam'), 3);
  });

  it('tolerates empty and missing input', () => {
    assert.equal(numberOfUpgrades([], 'plasma'), 0);
    assert.equal(numberOfUpgrades(null, 'plasma'), 0);
    assert.equal(numberOfUpgrades([null, undefined], 'beam'), 0);
  });

  it('shows the UPG row with the upgrades icon in the squad view', () => {
    const src = readSrc('src/hud/components/InfoPanel.jsx');
    assert.ok(src.includes('numberOfUpgrades('), 'squad view computes upgrades');
    assert.ok(src.includes("taskbarIconUrl('numberofupgrades') || '⬆️'"), 'UPG row uses the icon');
    assert.ok(src.includes('label={null} value={`${upgrades}'), 'UPG row shows the value, no label');
  });
});
