import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createBootTimer, formatBootTime } from '../src/boot-timer.js';

describe('boot timer', () => {
  it('measures elapsed wall time with an injectable clock', () => {
    let now = 1000;
    const timer = createBootTimer(() => now);
    assert.equal(timer.running(), false);
    assert.equal(timer.elapsedMs(), 0);
    timer.start();
    assert.equal(timer.running(), true);
    now += 250;
    assert.equal(timer.elapsedMs(), 250);
    now += 9750;
    assert.equal(timer.stop(), 10000);
    assert.equal(timer.running(), false);
    now += 5000;
    assert.equal(timer.elapsedMs(), 10000, 'frozen after stop');
  });

  it('formats seconds and minutes', () => {
    assert.equal(formatBootTime(0), '0.0s');
    assert.equal(formatBootTime(12400), '12.4s');
    assert.equal(formatBootTime(75400), '1m 15s');
    assert.equal(formatBootTime(-50), '0.0s');
  });

  it('ticks in the loading panel and reports the total', () => {
    const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
    const src = fs.readFileSync(path.join(root, 'src/multiplayer.js'), 'utf8');
    assert.ok(src.includes("getElementById('webTransport-load-timer')"), 'timer element exists');
    assert.ok(src.includes('setInterval(_tickBootTimer, 100)'), 'timer ticks live');
    assert.ok(src.includes('[BOOT] game loaded in'), 'total logged to console');
    assert.ok(src.includes('window._lastBootMs'), 'total kept for the HUD');
    assert.ok(src.includes('boot ${formatBootTime(lastBootMs)}'), 'net HUD shows the total');
  });
});
