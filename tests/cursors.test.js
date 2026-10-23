import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { CURSOR_FILES, cursorAssetUrl, parseTga, resolveCursor, withinHoverRadius } from '../src/cursors.js';

function makeTga(width, height, topDown, rowsTopFirst) {
  const header = Buffer.alloc(18);
  header[2] = 2;
  header.writeUInt16LE(width, 12);
  header.writeUInt16LE(height, 14);
  header[16] = 32;
  header[17] = 0x08 | (topDown ? 0x20 : 0);
  const stored = topDown ? rowsTopFirst : [...rowsTopFirst].reverse();
  const data = Buffer.alloc(width * height * 4);
  stored.flat().forEach(([r, g, b, a], i) => {
    data[i * 4] = b;
    data[i * 4 + 1] = g;
    data[i * 4 + 2] = r;
    data[i * 4 + 3] = a;
  });
  return Buffer.concat([header, data]);
}

describe('cursors', () => {
  it('maps the six requested cursors to their tga files', () => {
    assert.deepEqual(CURSOR_FILES, {
      default: 'default.tga',
      capture: 'modal_capturepoint.tga',
      repair: 'modal_repair.tga',
      teleport: 'modal_teleport.tga',
      droppod: 'modal_droppod.tga',
      load: 'modal_load.tga',
    });
    assert.equal(cursorAssetUrl('default.tga'), null);
  });

  it('parses every requested cursor tga (32x32, real alpha)', () => {
    for (const file of Object.values(CURSOR_FILES)) {
      const parsed = parseTga(readFileSync(new URL(`../assets/cursor_icons/${file}`, import.meta.url)));
      assert.equal(parsed.width, 32, file);
      assert.equal(parsed.height, 32, file);
      let minA = 255;
      let maxA = 0;
      for (let i = 3; i < parsed.rgba.length; i += 4) {
        minA = Math.min(minA, parsed.rgba[i]);
        maxA = Math.max(maxA, parsed.rgba[i]);
      }
      assert.ok(minA < maxA, `${file} has varying alpha`);
    }
  });

  it('returns top-down RGBA regardless of tga origin', () => {
    const red = [255, 0, 0, 255];
    const blue = [0, 0, 255, 128];
    for (const topDown of [false, true]) {
      const parsed = parseTga(makeTga(1, 2, topDown, [[red], [blue]]));
      assert.deepEqual([...parsed.rgba.slice(0, 4)], red);
      assert.deepEqual([...parsed.rgba.slice(4, 8)], blue);
    }
  });

  it('rejects unsupported tga variants', () => {
    assert.throws(() => parseTga(Buffer.alloc(10)), /too short/);
    const colormapped = makeTga(1, 1, true, [[[0, 0, 0, 255]]]);
    colormapped[1] = 1;
    assert.throws(() => parseTga(colormapped), /unsupported/);
    const tiny = makeTga(1, 1, true, [[[0, 0, 0, 255]]]);
    tiny[16] = 16;
    assert.throws(() => parseTga(tiny), /unsupported/);
  });

  it('resolves hover cursors with modal and command modes winning', () => {
    assert.equal(resolveCursor({}), 'default');
    assert.equal(resolveCursor({ hover: { kind: 'sp' } }), 'capture');
    assert.equal(resolveCursor({ hover: { kind: 'loadable' }, infantrySelected: true }), 'load');
    assert.equal(resolveCursor({ hover: { kind: 'loadable' }, infantrySelected: false }), 'default');
    assert.equal(resolveCursor({ hover: { kind: 'repairable', damaged: true } }), 'default');
    assert.equal(
      resolveCursor({ pendingCommand: 'repair', hover: { kind: 'repairable', damaged: true } }),
      'repair',
    );
    assert.equal(
      resolveCursor({ pendingCommand: 'repair', hover: { kind: 'repairable', damaged: false } }),
      null,
    );
    assert.equal(resolveCursor({ pendingCommand: 'repair', hover: { kind: 'sp' } }), null);
    assert.equal(resolveCursor({ pendingCommand: 'move', hover: { kind: 'sp' } }), null);
    assert.equal(resolveCursor({ buildMode: 'hq', hover: { kind: 'sp' } }), null);
    assert.equal(resolveCursor({ modal: 'teleport', hover: { kind: 'sp' } }), 'teleport');
    assert.equal(resolveCursor({ modal: 'droppod' }), 'droppod');
    assert.equal(resolveCursor({ modal: 'bogus', hover: { kind: 'sp' } }), 'capture');
  });

  it('detects the ground point entering a point hover circle', () => {
    assert.equal(withinHoverRadius(0, 0, 10, 0, 3.5), false);
    assert.equal(withinHoverRadius(9, 0, 10, 0, 3.5), true);
    assert.equal(withinHoverRadius(10, 0, 10, 0, 3.5), true);
    assert.equal(withinHoverRadius(6.5, 0, 10, 0, 3.5), true);
    assert.equal(withinHoverRadius(6.4, 0, 10, 0, 3.5), false);
    assert.equal(withinHoverRadius(12, 2, 10, 0, 3.5), true);
    assert.equal(withinHoverRadius(12, 3, 10, 0, 3.5), false);
  });
});
