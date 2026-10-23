import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  resetR2Progress,
  subscribeR2Progress,
  reportR2Progress,
  r2ProgressSnapshot,
} from '../src/r2-progress.js';

describe('r2 download progress', () => {
  it('aggregates bytes and percent across urls', () => {
    resetR2Progress();
    reportR2Progress('https://r2/a.glb', { loaded: 50, total: 100 });
    reportR2Progress('https://r2/b.glb', { loaded: 150, total: 300 });
    const snap = r2ProgressSnapshot();
    assert.equal(snap.loadedBytes, 200);
    assert.equal(snap.totalBytes, 400);
    assert.equal(snap.percent, 50);
    assert.equal(snap.doneFiles, 0);
    assert.equal(snap.totalFiles, 2);
    assert.equal(snap.complete, false);
  });

  it('caps percent at 100 and counts finished files', () => {
    resetR2Progress();
    reportR2Progress('https://r2/a.glb', { loaded: 100, total: 100, done: true });
    const snap = r2ProgressSnapshot();
    assert.equal(snap.percent, 100);
    assert.equal(snap.doneFiles, 1);
    assert.equal(snap.complete, true);
  });

  it('falls back to file counts when totals are unknown', () => {
    resetR2Progress();
    reportR2Progress('https://r2/a.glb', { loaded: 500 });
    let snap = r2ProgressSnapshot();
    assert.equal(snap.totalBytes, 0);
    assert.equal(snap.percent, 0);
    assert.equal(snap.unknownTotals, 1);
    reportR2Progress('https://r2/a.glb', { done: true });
    snap = r2ProgressSnapshot();
    assert.equal(snap.totalBytes, 500);
    assert.equal(snap.percent, 100);
    assert.equal(snap.complete, true);
  });

  it('restarts the entry when a finished url downloads again', () => {
    resetR2Progress();
    reportR2Progress('https://r2/a.glb', { loaded: 100, total: 100, done: true });
    reportR2Progress('https://r2/a.glb', { loaded: 10, total: 100 });
    const snap = r2ProgressSnapshot();
    assert.equal(snap.loadedBytes, 10);
    assert.equal(snap.doneFiles, 0);
    assert.equal(snap.complete, false);
  });

  it('counts failed downloads without sticking the bar', () => {
    resetR2Progress();
    reportR2Progress('https://r2/a.glb', { done: true, failed: true });
    const snap = r2ProgressSnapshot();
    assert.equal(snap.doneFiles, 1);
    assert.equal(snap.failedFiles, 1);
    assert.equal(snap.complete, true);
    assert.equal(snap.percent, 100);
  });

  it('notifies subscribers and stops after unsubscribe', () => {
    resetR2Progress();
    let calls = 0;
    const unsub = subscribeR2Progress(() => { calls += 1; });
    reportR2Progress('https://r2/a.glb', { loaded: 10, total: 100 });
    assert.equal(calls, 1);
    unsub();
    reportR2Progress('https://r2/a.glb', { loaded: 20, total: 100 });
    assert.equal(calls, 1);
  });

  it('r2 bar is wired into the START BATTLE loading flow', () => {
    const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
    const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
    const gltf = read('src/gltf-models.js');
    assert.ok(gltf.includes("from './r2-progress.js'"), 'loadGltf reports bytes');
    assert.ok(gltf.includes('loadAsync(url, onByteProgress)'), 'loader passes progress events');
    const helpers = read('src/three-helpers.js');
    assert.ok(helpers.includes('reportR2Progress(url,'), 'textures report completion');
    const mp = read('src/multiplayer.js');
    assert.ok(mp.includes('resetR2Progress()'), 'START BATTLE resets the bar');
    assert.ok(mp.includes('subscribeR2Progress(_renderR2Bar)'), 'loading UI subscribes to bytes');
    assert.ok(mp.includes("getElementById('r2-progress')"), 'standalone R2 overlay exists');
    assert.ok(mp.includes('R2 DOWNLOAD'), 'overlay is titled');
    assert.ok(mp.includes('files${failed}'), 'bar renders files and failures');
  });

  it('ignores empty urls and resets everything', () => {
    resetR2Progress();
    reportR2Progress('', { loaded: 10, total: 10 });
    assert.equal(r2ProgressSnapshot().totalFiles, 0);
    reportR2Progress('https://r2/a.glb', { loaded: 10, total: 10, done: true });
    resetR2Progress();
    const snap = r2ProgressSnapshot();
    assert.equal(snap.totalFiles, 0);
    assert.equal(snap.loadedBytes, 0);
    assert.equal(snap.complete, false);
  });
});
