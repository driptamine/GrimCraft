import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = join(root, 'public', 'manifest.json');
const swPath = join(root, 'public', 'service-worker.js');

describe('pwa', () => {
  it('ships a valid manifest with installable icons', () => {
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    assert.ok(manifest.name && manifest.short_name);
    assert.ok(manifest.start_url);
    assert.equal(manifest.display, 'standalone');
    assert.ok(manifest.icons.length >= 2);
    for (const icon of manifest.icons) {
      assert.ok(icon.sizes && icon.type === 'image/png');
      assert.ok(existsSync(join(root, 'public', icon.src)), `${icon.src} exists`);
    }
  });

  it('uses the soulstorm icon as favicon', () => {
    const html = readFileSync(join(root, 'index.html'), 'utf8');
    assert.ok(
      html.includes('<link rel="icon" type="image/png" href="soulstorm_icon.png">'),
      'index.html links the soulstorm favicon',
    );
    assert.ok(existsSync(join(root, 'public', 'soulstorm_icon.png')), 'favicon file exists in public/');
  });

  it('ships a service worker with versioned app + models caches', () => {
    const sw = readFileSync(swPath, 'utf8');
    for (const snippet of [
      'grimcraft-app-v',
      'grimcraft-models-v',
      "addEventListener('install'",
      "addEventListener('activate'",
      "addEventListener('fetch'",
      'skipWaiting',
    ]) {
      assert.ok(sw.includes(snippet), `sw contains ${snippet}`);
    }
    execFileSync(process.execPath, ['--check', swPath]);
  });
});
