import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const { guardsmenSquadArticle } = await import('../src/wiki/guardsmenSquadData.js');

const html = fs.readFileSync(path.join(root, 'settings/wiki/guardsmen_squad.html'), 'utf8');
const body = html.split('<div class="wrap">')[1].split('<div class="foot">')[0];

function stripTags(s) {
  return s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

describe('guardsmen wiki article data', () => {
  it('matches the static page title', () => {
    const h1 = body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
    assert.ok(h1, 'static page has a title');
    assert.equal(guardsmenSquadArticle.title, stripTags(h1[1]));
  });

  it('keeps every section heading in order', () => {
    // siteSub subtitle and the toc heading live in dedicated data fields
    const headings = [...body.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/g)]
      .map((m) => stripTags(m[1]))
      .filter((h) => h !== 'From RelicWiki' && h !== 'Contents');
    const dataHeadings = guardsmenSquadArticle.sections.filter((s) => s.h).map((s) => s.h);
    assert.deepEqual(dataHeadings, headings);
  });

  it('keeps every table of the static page', () => {
    const htmlTables = (body.match(/<table[\s>]/g) || []).length;
    const dataTables = guardsmenSquadArticle.sections.flatMap((s) => s.blocks)
      .filter((b) => b.block === 'table' || b.block === 'toc').length;
    assert.equal(dataTables, htmlTables);
  });

  it('keeps the full table of contents', () => {
    const tocHtml = body.match(/<table id="toc"[\s\S]*?<\/table>/);
    assert.ok(tocHtml, 'static page has a toc');
    const entries = [...tocHtml[0].matchAll(/<a href="([^"]+)"><span class="tocnumber">/g)].map((m) => m[1]);
    const dataToc = guardsmenSquadArticle.sections.flatMap((s) => s.blocks)
      .find((b) => b.block === 'toc');
    assert.ok(dataToc, 'data has a toc');
    assert.deepEqual(dataToc.items.map((i) => i.href), entries);
  });

  it('contains the key article content', () => {
    const dump = JSON.stringify(guardsmenSquadArticle);
    for (const needle of ['Damage Per Second Values', 'Sergeant', 'Plasma Gun', 'Battle Command', 'Thought of the day']) {
      assert.ok(dump.includes(needle), `article mentions ${needle}`);
    }
  });
});
