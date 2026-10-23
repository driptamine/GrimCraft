import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseTeamcolour, teamcolorHex, loadTeamcolour } from '../src/teamcolour.js';
import * as THREE from 'three';
import { register } from 'node:module';

register('./node-esm-hooks.mjs', import.meta.url);
const {
  FACTIONS, factionContainers, getFactionTeamcolor, getFactionTeamcolourScheme, getFactionTeamcolourSchemes,
  loadFactionModels, setFactionTeamcolourScheme, toggleFactionTeamcolourScheme,
} = await import('../src/factions.js');

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

describe('teamcolour', () => {
  it('parses the committed Cadian 31st scheme', () => {
    const text = fs.readFileSync(path.join(root, 'models/ig/color/cadian31.teamcolour'), 'utf8');
    const tc = parseTeamcolour(text);
    assert.ok(tc);
    assert.equal(tc.associatedRace, 'guard_race');
    assert.equal(tc.forceName, '31st Harakoni Warhawks');
    assert.deepEqual(tc.primary, { r: 151, g: 144, b: 130 });
    assert.deepEqual(tc.trim, { r: 212, g: 212, b: 212 });
    assert.deepEqual(tc.secondary, { r: 35, g: 35, b: 35 });
    assert.deepEqual(tc.eyes, { r: 35, g: 35, b: 35 });
    assert.deepEqual(tc.weapons, { r: 35, g: 35, b: 35 });
  });

  it('each IG .json mirrors its .teamcolour parse (no drift)', () => {
    const dir = path.join(root, 'models/ig/color');
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.teamcolour'));
    assert.equal(files.length, 8);
    for (const f of files) {
      const tc = parseTeamcolour(fs.readFileSync(path.join(dir, f), 'utf8'));
      const jf = f.replace(/\.teamcolour$/, '.json');
      const json = JSON.parse(fs.readFileSync(path.join(dir, jf), 'utf8'));
      assert.deepEqual(json, {
        associated_race: tc.associatedRace,
        badge_name: tc.badgeName,
        banner_name: tc.bannerName,
        pattern_name: tc.patternName,
        force_name: tc.forceName,
        eyes: tc.eyes,
        weapons: tc.weapons,
        primary: tc.primary,
        trim: tc.trim,
        secondary: tc.secondary,
      }, jf);
    }
  });

  it('converts slots to hex', () => {
    assert.equal(teamcolorHex({ r: 151, g: 144, b: 130 }), 0x979082);
    assert.equal(teamcolorHex({ r: 212, g: 212, b: 212 }), 0xd4d4d4);
    assert.equal(teamcolorHex(null), null);
  });

  it('tolerates channel reorder and clamps range', () => {
    const tc = parseTeamcolour('UnitCustomization = { Primary = { r = 300, b = 1, g = 2, }, }');
    assert.deepEqual(tc.primary, { r: 255, g: 2, b: 1 });
  });

  it('returns null for missing/garbage input', () => {
    assert.equal(parseTeamcolour(''), null);
    assert.equal(parseTeamcolour(null), null);
    assert.equal(parseTeamcolour('LocalInfo = { associated_race = "x", }'), null);
    assert.equal(parseTeamcolour('UnitCustomization = { pattern_name = "default", }'), null);
  });

  it('loadTeamcolour resolves null on fetch failure, parses on success', async () => {
    const fail = await loadTeamcolour('http://x/missing.teamcolour', async () => { throw new Error('down'); });
    assert.equal(fail, null);
    const notFound = await loadTeamcolour('http://x/404', async () => ({ ok: false }));
    assert.equal(notFound, null);
    const ok = await loadTeamcolour('http://x/ok', async () => ({
      ok: true,
      text: async () => 'UnitCustomization = { Primary = { r = 1, g = 2, b = 3, }, }',
    }));
    assert.deepEqual(ok.primary, { r: 1, g: 2, b: 3 });
    assert.equal(await loadTeamcolour(null), null);
  });

  it('IG declares the Cadian scheme and starts on default (no fetch)', async () => {
    assert.equal(FACTIONS.ig.teamcolours.cadian31, 'models/ig/color/cadian31.teamcolour');
    const realFetch = globalThis.fetch;
    let calls = 0;
    globalThis.fetch = async () => { calls += 1; return { ok: true, text: async () => '' }; };
    try {
      await loadFactionModels(null, ['ig'], { loadModel: async () => null });
    } finally {
      globalThis.fetch = realFetch;
    }
    assert.equal(calls, 0);
    assert.equal(getFactionTeamcolourScheme('ig'), 'default');
    assert.equal(getFactionTeamcolor('ig'), null);
    assert.equal(getFactionTeamcolor('chaos'), null);
  });

  it('switching to cadian31 loads and parses the scheme', async () => {
    const text = fs.readFileSync(path.join(root, FACTIONS.ig.teamcolours.cadian31), 'utf8');
    const realFetch = globalThis.fetch;
    const seen = [];
    globalThis.fetch = async (url) => {
      seen.push(String(url));
      return { ok: true, text: async () => text };
    };
    try {
      await setFactionTeamcolourScheme('ig', 'cadian31');
    } finally {
      globalThis.fetch = realFetch;
    }
    assert.deepEqual(seen, ['models/ig/color/cadian31.teamcolour']);
    assert.equal(getFactionTeamcolourScheme('ig'), 'cadian31');
    assert.deepEqual(getFactionTeamcolor('ig')?.primary, { r: 151, g: 144, b: 130 });
    assert.equal(getFactionTeamcolor('ig')?.forceName, '31st Harakoni Warhawks');
  });

  it('switching back to default clears without refetch, re-activation uses cache', async () => {
    const realFetch = globalThis.fetch;
    let calls = 0;
    globalThis.fetch = async () => { calls += 1; return { ok: true, text: async () => '' }; };
    try {
      await setFactionTeamcolourScheme('ig', 'default');
      assert.equal(getFactionTeamcolourScheme('ig'), 'default');
      assert.equal(getFactionTeamcolor('ig'), null);
      await setFactionTeamcolourScheme('ig', 'cadian31');
      assert.deepEqual(getFactionTeamcolor('ig')?.primary, { r: 151, g: 144, b: 130 });
    } finally {
      globalThis.fetch = realFetch;
    }
    assert.equal(calls, 0);
  });

  it('toggle walks the IG scheme order, unknown faction is a safe no-op', async () => {
    const realFetch = globalThis.fetch;
    globalThis.fetch = async (url) => ({
      ok: true, text: async () => fs.readFileSync(path.join(root, String(url)), 'utf8'),
    });
    try {
      await setFactionTeamcolourScheme('ig', 'default');
      assert.equal(await toggleFactionTeamcolourScheme('ig'), 'cadian8');
      assert.equal(getFactionTeamcolor('ig')?.forceName, '8th Cadian');
      assert.equal(await toggleFactionTeamcolourScheme('ig'), 'cadian31');
      assert.equal(getFactionTeamcolor('ig')?.forceName, '31st Harakoni Warhawks');
      await setFactionTeamcolourScheme('ig', 'default');
      assert.equal(getFactionTeamcolor('ig'), null);
    } finally {
      globalThis.fetch = realFetch;
    }
    assert.equal(await toggleFactionTeamcolourScheme('chaos'), 'default');
    assert.equal(getFactionTeamcolor('chaos'), null);
    assert.equal(getFactionTeamcolourScheme('chaos'), 'default');
  });

  it('cadian31 desaturates the shared guardsmen body toward Trim grey, default restores', async () => {
    const bodyMat = new THREE.MeshStandardMaterial({ name: 'ig_guardsmen' });
    const flagMat = new THREE.MeshStandardMaterial({ name: 'ig_strategicpflag' });
    const scene = new THREE.Group();
    scene.add(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), bodyMat));
    scene.add(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), flagMat));
    const prevSoldier = factionContainers.ig.soldier;
    factionContainers.ig.soldier = { scene, animations: [] };
    const text = fs.readFileSync(path.join(root, FACTIONS.ig.teamcolours.cadian31), 'utf8');
    const realFetch = globalThis.fetch;
    globalThis.fetch = async () => ({ ok: true, text: async () => text });
    try {
      await setFactionTeamcolourScheme('ig', 'cadian31');
      assert.equal(bodyMat.userData._teamPatched, true);
      assert.equal(flagMat.userData._teamPatched, undefined);
      assert.equal(bodyMat.userData._uTeamColor.value.getHex(), 0xd4d4d4);
      assert.equal(bodyMat.userData._uTeamMix.value, 0.85);
      await setFactionTeamcolourScheme('ig', 'default');
      assert.equal(bodyMat.userData._uTeamMix.value, 0);
    } finally {
      globalThis.fetch = realFetch;
      factionContainers.ig.soldier = prevSoldier;
    }
  });

  it('patched body material injects the desaturation chunk', async () => {
    const bodyMat = new THREE.MeshStandardMaterial({ name: 'ig_guardsmen' });
    const scene = new THREE.Group();
    scene.add(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), bodyMat));
    const prevSoldier = factionContainers.ig.soldier;
    factionContainers.ig.soldier = { scene, animations: [] };
    try {
      await setFactionTeamcolourScheme('ig', 'default');
      const fake = { fragmentShader: 'void main() { #include <map_fragment> }', uniforms: {} };
      bodyMat.onBeforeCompile(fake, null);
      assert.match(fake.fragmentShader, /uniform vec3 uTeamColor;/);
      assert.match(fake.fragmentShader, /uniform float uTeamMix;/);
      assert.match(fake.fragmentShader, /uTeamMix \* \(1\.0 - teamSkin/);
      assert.equal(fake.uniforms.uTeamMix, bodyMat.userData._uTeamMix);
      assert.equal(typeof bodyMat.customProgramCacheKey, 'function');
    } finally {
      factionContainers.ig.soldier = prevSoldier;
    }
  });

  it('parses all 8 Space Marine chapter schemes', () => {
    const dir = path.join(root, 'models/space marines/team_colors');
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.teamcolour')).sort();
    assert.deepEqual(files, [
      'bloodangels.teamcolour',
      'bloodravens.teamcolour',
      'darkangels.teamcolour',
      'imperialfists.teamcolour',
      'ravenguard.teamcolour',
      'spacewolves.teamcolour',
      'ultramarines.teamcolour',
      'whitescars.teamcolour',
    ]);
    for (const f of files) {
      const tc = parseTeamcolour(fs.readFileSync(path.join(dir, f), 'utf8'));
      assert.ok(tc?.primary, f);
      assert.equal(tc.associatedRace, 'space_marine_race', f);
    }
  });

  it('parses Blood Ravens values', () => {
    const text = fs.readFileSync(path.join(root, 'models/space marines/team_colors/bloodravens.teamcolour'), 'utf8');
    const tc = parseTeamcolour(text);
    assert.equal(tc.forceName, 'Blood Ravens');
    assert.deepEqual(tc.primary, { r: 110, g: 20, b: 0 });
    assert.deepEqual(tc.trim, { r: 55, g: 42, b: 42 });
    assert.deepEqual(tc.secondary, { r: 160, g: 134, b: 97 });
  });

  it('parses all 8 IG schemes', () => {
    const dir = path.join(root, 'models/ig/color');
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.teamcolour')).sort();
    assert.deepEqual(files, [
      'cadian101.teamcolour',
      'cadian110.teamcolour',
      'cadian180.teamcolour',
      'cadian31.teamcolour',
      'cadian412.teamcolour',
      'cadian51.teamcolour',
      'cadian8.teamcolour',
      'kauravaconservator252.teamcolour',
    ]);
    for (const f of files) {
      const tc = parseTeamcolour(fs.readFileSync(path.join(dir, f), 'utf8'));
      assert.ok(tc?.primary, f);
      assert.equal(tc.associatedRace, 'guard_race', f);
    }
  });

  it('exposes scheme lists for the dropdowns', () => {
    assert.deepEqual(getFactionTeamcolourSchemes('ig'), [
      'default', 'cadian8', 'cadian31', 'cadian51', 'cadian101',
      'cadian110', 'cadian180', 'cadian412', 'kauravaconservator252',
    ]);
    assert.deepEqual(getFactionTeamcolourSchemes('space marines'), [
      'default', 'bloodravens', 'bloodangels', 'darkangels', 'imperialfists',
      'ravenguard', 'spacewolves', 'ultramarines', 'whitescars',
    ]);
    assert.deepEqual(getFactionTeamcolourSchemes('chaos'), ['default']);
  });

  it('SM toggle cycles default -> chapters, loading each scheme file', async () => {
    const schemes = FACTIONS['space marines'].teamcolours;
    assert.deepEqual(Object.keys(schemes), [
      'bloodravens', 'bloodangels', 'darkangels', 'imperialfists',
      'ravenguard', 'spacewolves', 'ultramarines', 'whitescars',
    ]);
    const realFetch = globalThis.fetch;
    const seen = [];
    globalThis.fetch = async (url) => {
      seen.push(String(url));
      return { ok: true, text: async () => fs.readFileSync(path.join(root, String(url)), 'utf8') };
    };
    try {
      await setFactionTeamcolourScheme('space marines', 'default');
      assert.equal(await toggleFactionTeamcolourScheme('space marines'), 'bloodravens');
      assert.equal(getFactionTeamcolor('space marines')?.forceName, 'Blood Ravens');
      assert.equal(await toggleFactionTeamcolourScheme('space marines'), 'bloodangels');
    } finally {
      globalThis.fetch = realFetch;
    }
    assert.deepEqual(seen, [
      'models/space marines/team_colors/bloodravens.teamcolour',
      'models/space marines/team_colors/bloodangels.teamcolour',
    ]);
    await setFactionTeamcolourScheme('space marines', 'default');
  });

  it('SM chapters colorize the shared marine body with Primary, banner untouched', async () => {
    const bodyMat = new THREE.MeshStandardMaterial({ name: 'space_marine_unit' });
    const flagMat = new THREE.MeshStandardMaterial({ name: 'sm_banner' });
    const scene = new THREE.Group();
    scene.add(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), bodyMat));
    scene.add(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), flagMat));
    const bucket = factionContainers['space marines'];
    const prevSoldier = bucket.soldier;
    bucket.soldier = { scene, animations: [] };
    const realFetch = globalThis.fetch;
    globalThis.fetch = async (url) => ({
      ok: true, text: async () => fs.readFileSync(path.join(root, String(url)), 'utf8'),
    });
    try {
      await setFactionTeamcolourScheme('space marines', 'bloodravens');
      assert.equal(bodyMat.userData._teamPatched, true);
      assert.equal(flagMat.userData._teamPatched, undefined);
      assert.equal(bodyMat.userData._uTeamColor.value.getHex(), 0x6e1400);
      assert.equal(bodyMat.userData._uTeamMix.value, 0.85);
      await setFactionTeamcolourScheme('space marines', 'default');
      assert.equal(bodyMat.userData._uTeamMix.value, 0);
    } finally {
      globalThis.fetch = realFetch;
      bucket.soldier = prevSoldier;
    }
  });
});
