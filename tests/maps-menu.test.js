import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { displayName, playersFor, previewFor, listBuiltinMaps, entryLabel, previewState, skirmishMapCards, defaultSkirmishMap } from '../src/maps-menu.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

describe('map selection menu', () => {
  it('displayName uses the file base name without extension or separators', () => {
    assert.equal(displayName('/maps/6p_alvarus/6p_alvarus.sgb'), '6p alvarus');
    assert.equal(displayName('/maps/duel/my-cool_map.SGB'), 'my cool map');
  });

  it('playersFor parses the Np prefix', () => {
    assert.equal(playersFor('/maps/6p_alvarus/6p_alvarus.sgb'), 6);
    assert.equal(playersFor('/maps/duel/2p_duel.sgb'), 2);
    assert.equal(playersFor('/maps/6p_alvarus/alvarus.sgb'), null);
  });

  it('previewFor pairs the _preview.png file in the same folder', () => {
    const previews = { '/maps/6p_alvarus/6p_alvarus_preview.png': '/assets/6p_alvarus_preview.png' };
    assert.equal(previewFor('/maps/6p_alvarus/6p_alvarus.sgb', previews), '/assets/6p_alvarus_preview.png');
    assert.equal(previewFor('/maps/other/other.sgb', previews), null);
  });

  it('entryLabel appends the player count when known', () => {
    assert.equal(entryLabel({ name: '4p doom spiral', players: 4 }), '4p doom spiral (4P)');
    assert.equal(entryLabel({ name: '6p alvarus', players: 6 }), '6p alvarus (6P)');
    assert.equal(entryLabel({ name: 'b', players: null }), 'b');
  });

  it('listBuiltinMaps lists per-map folders in path order', () => {
    const glob = {
      '/maps/6p_alvarus/6p_alvarus.sgb': 'alvarus-url',
      '/maps/8p_burial_grounds/8p_burial_grounds.sgb': 'burial-url',
      '/maps/4p_doom_spiral/4p_doom_spiral.sgb': 'doom-url',
    };
    const entries = listBuiltinMaps(glob, {});
    assert.deepEqual(entries.map((e) => e.path), [
      '/maps/4p_doom_spiral/4p_doom_spiral.sgb',
      '/maps/6p_alvarus/6p_alvarus.sgb',
      '/maps/8p_burial_grounds/8p_burial_grounds.sgb',
    ]);
    assert.deepEqual(entries.map((e) => entryLabel(e)), [
      '4p doom spiral (4P)',
      '6p alvarus (6P)',
      '8p burial grounds (8P)',
    ]);
  });

  it('previewState maps entries to image or empty preview', () => {
    assert.deepEqual(previewState({ previewUrl: 'a-img' }), { kind: 'image', url: 'a-img' });
    assert.deepEqual(previewState({ previewUrl: null }), { kind: 'empty' });
    assert.deepEqual(previewState(null), { kind: 'empty' });
  });

  it('skirmishMapCards leads with Default Arena then builtins', () => {
    const builtin = [{ path: '/maps/a.sgb', url: 'u', name: 'a', players: 4, previewUrl: null }];
    const cards = skirmishMapCards(builtin);
    assert.equal(cards.length, 2);
    assert.deepEqual(cards[0], { path: null, url: null, name: 'Default Arena', players: null, previewUrl: null });
    assert.equal(cards[1], builtin[0]);
  });

  it('skirmishMapCards defaults to arena alone when no maps resolve', () => {
    assert.deepEqual(skirmishMapCards([]), [
      { path: null, url: null, name: 'Default Arena', players: null, previewUrl: null },
    ]);
  });

  it('defaultSkirmishMap preselects 6p_alvarus when shipped', () => {
    const cards = skirmishMapCards([
      { path: '/maps/4p_doom_spiral/4p_doom_spiral.sgb', url: 'd', name: 'doom', players: 4, previewUrl: null },
      { path: '/maps/6p_alvarus/6p_alvarus.sgb', url: 'a', name: 'alvarus', players: 6, previewUrl: null },
    ]);
    assert.equal(defaultSkirmishMap(cards)?.path, '/maps/6p_alvarus/6p_alvarus.sgb');
    assert.equal(defaultSkirmishMap(skirmishMapCards([])), null);
    assert.equal(defaultSkirmishMap([]), null);
  });

  it('skirmish grid defaults the selection to alvarus', () => {
    const src = fs.readFileSync(path.join(root, 'src/multiplayer.js'), 'utf8');
    const grid = src.slice(src.indexOf('function _buildMapGrid'), src.indexOf('function _setConnectOverlay'));
    assert.ok(grid.includes('defaultSkirmishMap(cards)'), 'grid consults the default');
    assert.ok(grid.includes('_selectedMap = { path: def.path, url: def.url, name: def.name };'), 'default becomes the selection');
  });

  it('listBuiltinMaps sorts entries and attaches meta', () => {
    const glob = { '/maps/b/b.sgb': 'b-url', '/maps/a/6p_a.sgb': 'a-url' };
    const previews = { '/maps/a/6p_a_preview.png': 'a-img' };
    assert.deepEqual(listBuiltinMaps(glob, previews), [
      { path: '/maps/a/6p_a.sgb', url: 'a-url', name: '6p a', players: 6, previewUrl: 'a-img' },
      { path: '/maps/b/b.sgb', url: 'b-url', name: 'b', players: null, previewUrl: null },
    ]);
  });
});

describe('alvarus ground sheet', () => {
  it('uses the DDS-derived PNG, and the file is a real 256x256 PNG', () => {
    const src = fs.readFileSync(path.join(root, 'src/maps-menu.js'), 'utf8');
    assert.match(src, /loadTerrainTextureUrl\('\/maps\/6p_alvarus\/decals\/terrain\/chaos_taint_02_dds\.png', '6P ALVARUS'\)/);
    const buf = fs.readFileSync(path.join(root, 'maps/6p_alvarus/decals/terrain/chaos_taint_02_dds.png'));
    assert.equal(buf.subarray(1, 4).toString(), 'PNG');
    assert.equal(buf.readUInt32BE(16), 256);
    assert.equal(buf.readUInt32BE(20), 256);
  });
});
