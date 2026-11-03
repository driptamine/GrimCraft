#!/usr/bin/env python3
"""Fetch every warhammer-guide article linked from the wiki data, transplant
it with the same rules as the Guardsmen article, and extract structured data.

Usage: python3 scripts/fetch-wiki-articles.py [--limit N]
Writes src/wiki/articles/<Slug>Data.ts. Skips slugs that fail to fetch.
"""
import importlib.util
import json
import re
import subprocess
import sys


def _load_extract():
    spec = importlib.util.spec_from_file_location('extract_wiki_article', 'scripts/extract-wiki-article.py')
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


_extract = _load_extract()
P = _extract.P
runs = _extract.runs
cell_of = _extract.cell_of
table_of = _extract.table_of
toc_of = _extract.toc_of
emit_table = _extract.emit_table
txt = _extract.txt
cls = _extract.cls

BASE = 'https://warhammer-guide.ru/wiki/'
DATA_RE = re.compile(r'= (\{.*\});\s*$', re.S)


def collect_slugs():
    h = open('src/wiki/guardsmenSquadData.ts').read()
    d = json.loads(DATA_RE.search(h).group(1))
    urls = set()

    def walk(r):
        if isinstance(r, dict):
            if 'link' in r:
                urls.add(r['link'])
            for v in r.values():
                if isinstance(v, (dict, list)):
                    walk(v)
        elif isinstance(r, list):
            for v in r:
                walk(v)

    walk(d)
    slugs = set()
    for u in urls:
        if not u.startswith(BASE):
            continue
        rest = u[len(BASE):]
        if '/' in rest or not rest.endswith('.html'):
            continue
        slug = rest[:-len('.html')].split('#')[0].split('?')[0]
        if not slug or slug == 'Guardsmen_Squad':
            continue
        if not re.match(r"^[A-Za-z0-9_.\-']+$", slug):
            print(f'skip odd slug: {u}')
            continue
        slugs.add(slug)
    return sorted(slugs), d


def ident(slug):
    name = re.sub(r'[^A-Za-z0-9_]', '_', slug)
    if re.match(r'^[0-9]', name):
        name = '_' + name
    return name


def transplant(html):
    """Clean article HTML: drop ads/counters, keep content. Returns body HTML."""
    p = P()
    p.feed(html)
    p.close()
    root = p.r

    def find(n, pred):
        if n.t and pred(n):
            return n
        for c in n.k:
            if c.t:
                r = find(c, pred)
                if r:
                    return r
        return None

    body = find(root, lambda n: n.t == 'div' and n.a.get('id') == 'bodyContent')
    if not body:
        raise ValueError('no bodyContent')

    def has_cls(n, *names):
        return any(c in cls(n).split() for c in names)

    def prune(n):
        href = n.a.get('href', '')
        src = n.a.get('src', '')
        if ('metrika.yandex.ru' in href or 'liveinternet' in href or 'counter.yadro' in src
                or 'developer.android.com' in href or 'en_app_rgb' in src
                or has_cls(n, 'editsection', 'printfooter', 'catlinks')
                or n.a.get('id', '').startswith('yandex_rtb_')):
            return True
        n.k = [c for c in n.k if not (c.t and prune(c))]
        return False

    prune(body)
    return body


def emit_blocks(body):
    sections = []
    cur = {'h': '', 'level': 0, 'blocks': []}

    def flush():
        if cur['h'] or cur['blocks']:
            sections.append({'h': cur['h'], 'level': cur['level'],
                             'anchor': cur.get('anchor', ''), 'blocks': cur['blocks']})
        cur['h'] = ''
        cur['level'] = 0
        cur['anchor'] = ''
        cur['blocks'] = []

    title = ''
    subtitle = ''

    def emit(n):
        nonlocal title, subtitle
        if n.t is None:
            if n.a['d'].strip():
                cur['blocks'].append({'block': 'p', 'runs': [{'text': n.a['d']}]})
            return
        if n.t in ('script', 'ins') or n.a.get('id', '').startswith('yandex_rtb_'):
            return
        if n.t == 'h1':
            title = txt(n).strip()
            return
        if n.t == 'h3' and n.a.get('id') == 'siteSub':
            subtitle = txt(n).strip()
            return
        if n.t in ('h2', 'h3'):
            flush()
            cur['h'] = txt(n).strip()
            cur['level'] = 2 if n.t == 'h2' else 3
            cur['anchor'] = next((c.a.get('id', '') for c in n.k if c.t == 'span' and c.a.get('id')), '')
            return
        if n.t == 'table' and 'toc' in cls(n).split():
            cur['blocks'].append(toc_of(n))
            return
        if n.t == 'table':
            emit_table(n, cur['blocks'])
            return
        if n.t == 'div':
            for c in n.k:
                emit(c)
            return
        r = runs(n, {})
        if any((('text' in x and x['text'].strip()) or ('link' in x) or ('image' in x)) for x in r):
            if n.t == 'p':
                cur['blocks'].append({'block': 'p', 'runs': r})
            else:
                cur['blocks'].append({'block': 'p', 'runs': r})

    for c in body.k:
        emit(c)
    flush()
    return title, subtitle, sections


TYPES = ('export interface WikiRun {\n'
         '  text?: string;\n'
         '  bold?: boolean;\n'
         '  italic?: boolean;\n'
         '  link?: string;\n'
         '  runs?: WikiRun[];\n'
         '  image?: string;\n'
         '  alt?: string;\n'
         '  br?: boolean;\n'
         '}\n'
         'export interface WikiCell {\n'
         '  header: boolean;\n'
         '  colspan?: number;\n'
         '  rowspan?: number;\n'
         '  bg?: string;\n'
         '  runs: WikiRun[];\n'
         '}\n'
         'export type WikiBlock =\n'
         "  | { block: 'p'; runs: WikiRun[] }\n"
         "  | { block: 'table'; cls?: string; width?: string; rows: WikiCell[][] }\n"
         "  | { block: 'toc'; items: { level: number; n: string; text: string; href: string }[] };\n"
         'export interface WikiSection {\n'
         '  h: string;\n'
         '  level: number;\n'
         '  anchor?: string;\n'
         '  blocks: WikiBlock[];\n'
         '}\n')


def fetch(slug):
    r = subprocess.run(['curl', '-sL', '--max-time', '25', '-w', '\n%{http_code}', BASE + slug + '.html'],
                       capture_output=True, text=True)
    out, _, code = r.stdout.rpartition('\n')
    if code.strip() != '200' or 'mw-headline' not in out and 'bodyContent' not in out:
        return None
    return out


def all_data_files():
    import glob
    files = glob.glob('src/wiki/articles/*Data.ts')
    files.append('src/wiki/guardsmenSquadData.ts')
    return files


def unresolved_slugs(paths):
    import glob as _g  # noqa: F401
    have = set()
    for f in _g.glob('src/wiki/articles/*Data.ts'):
        have.add(f.split('/')[-1][:-len('Data.ts')])
    have.add('Guardsmen_Squad')
    wanted = set()
    for path in paths:
        try:
            h = open(path).read()
        except FileNotFoundError:
            continue
        m = DATA_RE.search(h)
        if not m:
            continue
        data = json.loads(m.group(1))

        def walk(r):
            if isinstance(r, dict):
                if 'link' in r and isinstance(r['link'], str):
                    yield r['link']
                if 'href' in r and isinstance(r['href'], str):
                    yield r['href']
                for v in r.values():
                    if isinstance(v, (dict, list)):
                        yield from walk(v)
            elif isinstance(r, list):
                for v in r:
                    yield from walk(v)

        for href in walk(data):
            if href.startswith(BASE):
                rest = href[len(BASE):]
            elif re.match(r"^[A-Za-z0-9_.\-']+\.html(#[^#]*)?$", href):
                rest = href
            else:
                continue
            if '/' in rest:
                continue
            page = rest.split('#')[0]
            if not page.endswith('.html'):
                continue
            slug = page[:-len('.html')]
            if slug and slug not in have and re.match(r"^[A-Za-z0-9_.\-']+$", slug):
                wanted.add(slug)
    return sorted(wanted - have)


def main():
    limit = None
    if '--limit' in sys.argv:
        limit = int(sys.argv[sys.argv.index('--limit') + 1])
    closure = '--closure' in sys.argv
    max_pages = 900
    if '--max-pages' in sys.argv:
        max_pages = int(sys.argv[sys.argv.index('--max-pages') + 1])
    if closure:
        slugs = unresolved_slugs(all_data_files())
        print(f'closure wave targets: {len(slugs)}')
    else:
        slugs, _ = collect_slugs()
        print(f'targets: {len(slugs)}')
    if limit:
        slugs = slugs[:limit]
    import glob as _glob
    seen_lower = set()
    for f in _glob.glob('src/wiki/articles/*Data.ts'):
        seen_lower.add(f.split('/')[-1][:-len('Data.ts')].lower())
    ok, failed, fetched_total = 0, [], 0
    wave = 0
    while True:
        wave += 1
        for slug in slugs:
            if fetched_total >= max_pages:
                break
            if slug.lower() in seen_lower:
                failed.append((slug, 'case-dup'))
                continue
            seen_lower.add(slug.lower())
            try:
                html = fetch(slug)
                if not html:
                    failed.append((slug, 'fetch'))
                    continue
                body = transplant(html)
                title, subtitle, sections = emit_blocks(body)
                if not sections:
                    failed.append((slug, 'empty'))
                    continue
                name = ident(slug)
                data = {'title': title or slug.replace('_', ' '), 'subtitle': subtitle, 'sections': sections}
                ts = (f'// Auto-generated from {BASE + slug}.html — do not edit by hand.\n'
                      f'// Regenerate: python3 scripts/fetch-wiki-articles.py\n' + TYPES
                      + f'export const {name}Article: {{ title: string; subtitle: string; sections: WikiSection[] }} = '
                      + json.dumps(data, ensure_ascii=False, indent=2) + ';\n')
                open(f'src/wiki/articles/{slug}Data.ts', 'w').write(ts)
                ok += 1
                fetched_total += 1
            except Exception as e:  # noqa: BLE001 - batch must continue
                failed.append((slug, str(e)[:100]))
        print(f'wave {wave} done: {ok} ok, {len(failed)} failed')
        if not closure:
            break
        slugs = unresolved_slugs(all_data_files())
        slugs = [s for s in slugs if s not in [f[0] for f in failed]]
        if not slugs or fetched_total >= max_pages:
            print('closure complete' if not slugs else 'page cap reached')
            break
        print(f'next wave targets: {len(slugs)}')
        if limit:
            slugs = slugs[:limit]
    for slug, why in failed:
        print(f'  FAIL {slug}: {why}')


if __name__ == '__main__':
    main()
