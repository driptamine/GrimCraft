import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

function dataFiles() {
  const dir = path.join(root, 'src/wiki/articles');
  const files = fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((f) => f.endsWith('Data.ts')).map((f) => path.join('src/wiki/articles', f))
    : [];
  return [...files, 'src/wiki/guardsmenSquadData.ts'];
}

function loadData(rel) {
  const text = fs.readFileSync(path.join(root, rel), 'utf8');
  const m = text.match(/= (\{.*\});\s*$/s);
  assert.ok(m, `${rel} contains a data literal`);
  return JSON.parse(m[1]);
}

function collectLinks(node, out) {
  if (Array.isArray(node)) {
    node.forEach((v) => collectLinks(v, out));
  } else if (node && typeof node === 'object') {
    if (typeof node.link === 'string') out.push(node.link);
    if (typeof node.href === 'string') out.push(node.href);
    Object.values(node).forEach((v) => collectLinks(v, out));
  }
}

describe('wiki link closure', () => {
  it('every article link resolves to a local React page', () => {
    const manifestPath = path.join(root, 'src/wiki/articles/manifest.ts');
    assert.ok(fs.existsSync(manifestPath), 'article manifest exists');
    const manifestSrc = fs.readFileSync(manifestPath, 'utf8');
    const manifest = {};
    for (const m of manifestSrc.matchAll(/"([^"]+)": "([^"]+)"/g)) {
      manifest[m[1]] = m[2];
    }
    assert.ok(Object.keys(manifest).length > 200, 'manifest covers all articles');
    const missing = [];
    for (const rel of dataFiles()) {
      const links = [];
      collectLinks(loadData(rel), links);
      for (const href of links) {
        const m = href.match(/^\/settings\/wiki\/([A-Za-z0-9_.\-']+)\/(#[^#]*)?$/);
        if (m) {
          const dir = path.join(root, 'settings/wiki', m[1]);
          if (!fs.existsSync(path.join(dir, 'index.html'))) missing.push(`${rel}: ${href}`);
          continue;
        }
        const g = href.match(/^\/settings\/wiki\/guardsmen_squad\//);
        if (g && !fs.existsSync(path.join(root, 'settings/wiki/guardsmen_squad/index.html'))) {
          missing.push(`${rel}: ${href} (no guardsmen page)`);
        }
        if (/^[A-Za-z0-9_.\-']+\.html(#[^#]*)?$/.test(href)) missing.push(`${rel}: ${href}`);
      }
    }
    assert.deepEqual(missing, []);
  });

  it('every wiki page statically imports its article data', () => {
    const dirs = fs.readdirSync(path.join(root, 'settings/wiki')).filter((n) => {
      const p = path.join(root, 'settings/wiki', n);
      return fs.statSync(p).isDirectory() && fs.existsSync(path.join(p, 'main.tsx'));
    });
    assert.ok(dirs.length > 200, 'all article pages generated');
    const checked = [];
    for (const dir of dirs) {
      if (dir === 'article' || dir === 'guardsmen_squad') continue;
      const mount = fs.readFileSync(path.join(root, 'settings/wiki', dir, 'main.tsx'), 'utf8');
      const m = mount.match(/import \{ ([\w$]+) \} from '\.\.\/\.\.\/\.\.\/src\/wiki\/articles\/([\w\-.']+)Data\.js';/);
      assert.ok(m, `${dir}/main.tsx statically imports its data`);
      const dataPath = path.join(root, 'src/wiki/articles', `${m[2]}Data.ts`);
      assert.ok(fs.existsSync(dataPath), `${dir} data module exists`);
      const dataSrc = fs.readFileSync(dataPath, 'utf8');
      assert.ok(
        dataSrc.includes(`export const ${m[1]}:`) || dataSrc.includes(`export const ${m[1]} `),
        `${dir} exports ${m[1]}`,
      );
      checked.push(dir);
    }
    assert.ok(checked.length > 200, 'all mounts verified');
  });

  it('every fetched article parses as data with sections', () => {
    for (const rel of dataFiles()) {
      const data = loadData(rel);
      assert.ok(data.title, `${rel} has a title`);
      assert.ok(Array.isArray(data.sections) && data.sections.length > 0, `${rel} has sections`);
    }
  });
});
