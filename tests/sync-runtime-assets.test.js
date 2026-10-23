import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  excludeMaps,
  excludeModels,
  syncDir,
  syncRuntimeAssets,
} from '../scripts/sync-runtime-assets.mjs';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

function makeRoots() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'grim-sync-'));
  const src = path.join(tmp, 'src');
  const dest = path.join(tmp, 'dest');
  fs.mkdirSync(src, { recursive: true });
  return { tmp, src, dest };
}

function write(root, rel, content) {
  const full = path.join(root, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
  return full;
}

function touchMtime(full, ms) {
  const date = new Date(ms);
  fs.utimesSync(full, date, date);
}

describe('sync-runtime-assets', () => {
  it('copies new files including nested dirs', () => {
    const { src, dest } = makeRoots();
    write(src, 'a.glb', 'aaa');
    write(src, 'sub/b.glb', 'bbb');
    const stats = syncDir(src, dest, excludeModels);
    assert.equal(stats.copied, 2);
    assert.equal(stats.skipped, 0);
    assert.equal(fs.readFileSync(path.join(dest, 'a.glb'), 'utf8'), 'aaa');
    assert.equal(fs.readFileSync(path.join(dest, 'sub/b.glb'), 'utf8'), 'bbb');
  });

  it('skips up-to-date files on the second run (no rewrite)', () => {
    const { src, dest } = makeRoots();
    write(src, 'a.glb', 'aaa');
    syncDir(src, dest, excludeModels);
    const destFile = path.join(dest, 'a.glb');
    const mtimeBefore = fs.statSync(destFile).mtimeMs;
    const stats = syncDir(src, dest, excludeModels);
    assert.equal(stats.copied, 0);
    assert.equal(stats.skipped, 1);
    assert.equal(fs.statSync(destFile).mtimeMs, mtimeBefore);
  });

  it('recopies when src size changes', () => {
    const { src, dest } = makeRoots();
    write(src, 'a.glb', 'aaa');
    syncDir(src, dest, excludeModels);
    write(src, 'a.glb', 'aaaa');
    const stats = syncDir(src, dest, excludeModels);
    assert.equal(stats.copied, 1);
    assert.equal(fs.readFileSync(path.join(dest, 'a.glb'), 'utf8'), 'aaaa');
  });

  it('recopies when src is newer with identical size', () => {
    const { src, dest } = makeRoots();
    const srcFile = write(src, 'a.glb', 'aaa');
    syncDir(src, dest, excludeModels);
    const destFile = path.join(dest, 'a.glb');
    touchMtime(srcFile, fs.statSync(destFile).mtimeMs + 5000);
    const stats = syncDir(src, dest, excludeModels);
    assert.equal(stats.copied, 1);
  });

  it('excludes models junk: .tga, .zip, .DS_Store, hidden files', () => {
    const { src, dest } = makeRoots();
    write(src, 'keep.glb', 'x');
    write(src, 'tex.tga', 'x');
    write(src, 'pack.ZIP', 'x');
    write(src, '.DS_Store', 'x');
    write(src, '.hidden.glb', 'x');
    write(src, 'sub/nested.TGA', 'x');
    const stats = syncDir(src, dest, excludeModels);
    assert.equal(stats.excluded, 5);
    assert.equal(stats.copied, 1);
    assert.ok(fs.existsSync(path.join(dest, 'keep.glb')));
    assert.ok(!fs.existsSync(path.join(dest, 'tex.tga')));
    assert.ok(!fs.existsSync(path.join(dest, 'pack.ZIP')));
  });

  it('keeps maps .tga/.dds decals (only common junk excluded)', () => {
    const { src, dest } = makeRoots();
    write(src, 'decals/d.tga', 'x');
    write(src, 'decals/e.dds', 'x');
    write(src, '.DS_Store', 'x');
    const stats = syncDir(src, dest, excludeMaps);
    assert.equal(stats.excluded, 1);
    assert.equal(stats.copied, 2);
    assert.ok(fs.existsSync(path.join(dest, 'decals/d.tga')));
    assert.ok(fs.existsSync(path.join(dest, 'decals/e.dds')));
  });

  it('prunes dest files deleted from src', () => {
    const { src, dest } = makeRoots();
    write(src, 'keep.glb', 'x');
    write(src, 'gone.glb', 'x');
    syncDir(src, dest, excludeModels);
    fs.unlinkSync(path.join(src, 'gone.glb'));
    const stats = syncDir(src, dest, excludeModels);
    assert.equal(stats.pruned, 1);
    assert.ok(!fs.existsSync(path.join(dest, 'gone.glb')));
    assert.ok(fs.existsSync(path.join(dest, 'keep.glb')));
  });

  it('prunes newly excluded files from dest', () => {
    const { src, dest } = makeRoots();
    const destFile = write(dest, 'stale.tga', 'x');
    assert.ok(fs.existsSync(destFile));
    write(src, 'keep.glb', 'x');
    const stats = syncDir(src, dest, excludeModels);
    assert.equal(stats.pruned, 1);
    assert.ok(!fs.existsSync(destFile));
  });

  it('never wipes dest when src root is missing', () => {
    const { tmp, dest } = makeRoots();
    const victim = write(dest, 'keep.glb', 'x');
    const stats = syncDir(path.join(tmp, 'no-such-dir'), dest, excludeModels);
    assert.equal(stats.copied, 0);
    assert.equal(stats.pruned, 0);
    assert.ok(fs.existsSync(victim));
  });

  it('syncRuntimeAssets syncs multiple roots', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'grim-sync-multi-'));
    const mapsSrc = path.join(tmp, 'maps');
    const modelsSrc = path.join(tmp, 'models');
    write(mapsSrc, 'm.sgb', 'x');
    write(modelsSrc, 'u.glb', 'x');
    syncRuntimeAssets([
      { src: mapsSrc, dest: path.join(tmp, 'out/maps'), exclude: excludeMaps },
      { src: modelsSrc, dest: path.join(tmp, 'out/models'), exclude: excludeModels },
    ]);
    assert.ok(fs.existsSync(path.join(tmp, 'out/maps/m.sgb')));
    assert.ok(fs.existsSync(path.join(tmp, 'out/models/u.glb')));
  });

  it('vite build reads the R2 base from process env for CI', () => {
    const src = fs.readFileSync(path.join(ROOT, 'vite.config.js'), 'utf8');
    assert.ok(
      src.includes('process.env.R2_ENDPOINT_URL || env.R2_ENDPOINT_URL'),
      'CI secrets (process env) win over the gitignored .env file',
    );
  });

  it('vite build skips models unless GRIM_SYNC_MODELS=1, maps always sync', () => {
    const src = fs.readFileSync(path.join(ROOT, 'vite.config.js'), 'utf8');
    const plugin = src.slice(src.indexOf("name: 'sync-runtime-assets'"), src.indexOf('define:'));
    assert.ok(plugin.includes("dest: 'dist/maps'"), 'maps always sync');
    assert.ok(plugin.includes("GRIM_SYNC_MODELS === '1'"), 'models gated behind env');
    assert.ok(
      plugin.indexOf("dest: 'dist/models'") > plugin.indexOf('if (syncModels)'),
      'models root is only added inside the gated branch',
    );
  });

  it('manual CLI sync copies both trees into dist/', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'grim-sync-cli-'));
    write(path.join(tmp, 'maps'), 'm.sgb', 'x');
    write(path.join(tmp, 'models'), 'u.glb', 'x');
    write(path.join(tmp, 'models'), 'junk.tga', 'x');
    execFileSync(process.execPath, [path.join(ROOT, 'scripts/sync-runtime-assets.mjs')], {
      cwd: tmp,
      stdio: 'pipe',
    });
    assert.ok(fs.existsSync(path.join(tmp, 'dist/maps/m.sgb')), 'maps synced');
    assert.ok(fs.existsSync(path.join(tmp, 'dist/models/u.glb')), 'models synced');
    assert.ok(!fs.existsSync(path.join(tmp, 'dist/models/junk.tga')), 'model junk still excluded');
  });
});
