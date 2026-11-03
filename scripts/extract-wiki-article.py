#!/usr/bin/env python3
"""Extract settings/wiki/guardsmen_squad.html into src/wiki/guardsmenSquadData.ts.

Re-runnable: re-parse the static page and rewrite the data module.
Usage: python3 scripts/extract-wiki-article.py
"""
import json
import re
from html.parser import HTMLParser

VOID = {'img', 'br', 'hr', 'meta', 'link', 'input', 'wbr'}


class N:
    __slots__ = ('t', 'a', 'k')

    def __init__(self, t, a):
        self.t = t
        self.a = dict(a)
        self.k = []


class P(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.r = N('root', [])
        self.st = [self.r]

    def handle_starttag(self, t, a):
        n = N(t, a)
        self.st[-1].k.append(n)
        if t not in VOID:
            self.st.append(n)

    def handle_startendtag(self, t, a):
        self.st[-1].k.append(N(t, a))

    def handle_endtag(self, t):
        for i in range(len(self.st) - 1, 0, -1):
            if self.st[i].t == t:
                del self.st[i:]
                break

    def handle_data(self, d):
        if d:
            n = N(None, {})
            n.a['d'] = d
            self.st[-1].k.append(n)


def txt(n):
    if n.t is None:
        return n.a['d']
    return ''.join(txt(c) for c in n.k)


def cls(n):
    return n.a.get('class', '')


def bg_of(style):
    m = re.search(r'background\s*:\s*([^;}]+)', style or '')
    return m.group(1).strip() if m else None


def width_of(style):
    m = re.search(r'width\s*:\s*([^;}]+)', style or '')
    return m.group(1).strip() if m else None


BLOCK_TAGS = ('p', 'div', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre')


def runs(n, flags=None):
    """Inline content of n as WikiRun list."""
    flags = flags or {}
    out = []
    if n.t == 'table':
        return out
    if n.t is None:
        if n.a['d']:
            r = {'text': n.a['d']}
            r.update(flags)
            out.append(r)
        return out
    if n.t in ('b', 'strong'):
        flags = {**flags, 'bold': True}
    if n.t in ('i', 'em'):
        flags = {**flags, 'italic': True}
    if n.t == 'br':
        out.append({'br': True})
        return out
    if n.t in BLOCK_TAGS:
        before = len(out)
        for c in n.k:
            out.extend(runs(c, flags))
        if len(out) > before:
            out.append({'br': True})
        return out
    if n.t == 'img':
        out.append({'image': n.a.get('src') or '', 'alt': n.a.get('alt') or ''})
        return out
    if n.t == 'a':
        inner = []
        for c in n.k:
            inner.extend(runs(c, {}))
        out.append({'link': n.a.get('href') or '', 'runs': inner})
        return out
    for c in n.k:
        out.extend(runs(c, flags))
    return out


def cell_of(n):
    cell = {'header': n.t == 'th', 'runs': []}
    if n.a.get('colspan'):
        cell['colspan'] = int(n.a['colspan'])
    if n.a.get('rowspan'):
        cell['rowspan'] = int(n.a['rowspan'])
    bg = bg_of(n.a.get('style', ''))
    if bg:
        cell['bg'] = bg
    for c in n.k:
        cell['runs'].extend(runs(c, {}))
    while cell['runs'] and cell['runs'][-1].get('br'):
        cell['runs'].pop()
    # drop pure-whitespace text runs
    cell['runs'] = [r for r in cell['runs'] if not (('text' in r) and not r['text'].strip() and len(r) == 1)]
    return cell


def table_of(n):
    rows = []

    def walk(rn):
        for c in rn.k:
            if c.t == 'tr':
                row = [cell_of(x) for x in c.k if x.t in ('th', 'td')]
                if row and any(c2['runs'] for c2 in row):
                    rows.append(row)
            elif c.t in ('thead', 'tbody', 'tfoot', 'table'):
                walk(c)

    walk(n)
    t = {'block': 'table', 'rows': rows}
    if cls(n):
        t['cls'] = cls(n)
    w = width_of(n.a.get('style', ''))
    if w:
        t['width'] = w
    return t


def emit_table(n, blocks):
    """Append n as a block, lifting nested tables into following blocks."""
    nested = []

    def strip(rn):
        for c in list(rn.k):
            if c.t == 'table':
                nested.append(c)
                rn.k.remove(c)
            elif c.t:
                strip(c)

    for c in list(n.k):
        if c.t == 'table':
            nested.append(c)
            n.k.remove(c)
        elif c.t:
            strip(c)
    b = table_of(n)
    if b['rows']:
        blocks.append(b)
    for sub in nested:
        emit_table(sub, blocks)


def toc_of(n):
    items = []

    def walk(ul, level):
        for li in [c for c in ul.k if c.t == 'li']:
            link = next((c for c in li.k if c.t == 'a'), None)
            if link is not None:
                num = ''.join(txt(c) for c in link.k if c.t == 'span' and 'tocnumber' in cls(c).split())
                label = ''.join(txt(c) for c in link.k if c.t == 'span' and 'toctext' in cls(c).split())
                items.append({'level': level, 'n': num or '', 'text': label or txt(link).strip(),
                              'href': link.a.get('href', '')})
            for sub in [c for c in li.k if c.t == 'ul']:
                walk(sub, level + 1)

    for ul in [c for c in n.k if c.t == 'ul']:
        # toc markup: table > tr > td > div > ul, or direct ul
        walk(ul, 0)
    # fallback: find ul anywhere inside
    if not items:
        def find_ul(rn):
            if rn.t == 'ul':
                walk(rn, 0)
                return True
            return any(c.t and find_ul(c) for c in rn.k)
        find_ul(n)
    return {'block': 'toc', 'items': items}


DROP_IDS = ('yandex_rtb_R-A-1611237-1', 'yandex_rtb_R-A-1611237-2', 'yandex_rtb_R-A-1611237-3')


def main():
    h = open('settings/wiki/guardsmen_squad.html').read()
    body = h.split('<div class="wrap">')[1].split('<div class="foot">')[0]
    p = P()
    p.feed(body)
    p.close()
    root = p.r

    title = ''
    subtitle = ''
    sections = []
    cur = {'h': '', 'level': 0, 'blocks': []}

    def flush():
        if cur['h'] or cur['blocks']:
            sections.append(cur.copy())
            cur['h'] = ''
            cur['level'] = 0
            cur['blocks'] = []

    def emit(n):
        nonlocal title, subtitle
        if n.t is None:
            if n.a['d'].strip():
                cur['blocks'].append({'block': 'p', 'runs': [{'text': n.a['d']}]})
            return
        if n.t in ('script', 'ins') or n.a.get('id') in DROP_IDS or cls(n) == 'clr' or cls(n) == 'crumbs':
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
        if n.t == 'p':
            r = []
            for c in n.k:
                r.extend(runs(c, {}))
            if any((('text' in x and x['text'].strip()) or ('link' in x) or ('image' in x)) for x in r):
                cur['blocks'].append({'block': 'p', 'runs': r})
            return
        if n.t == 'div':
            for c in n.k:
                emit(c)
            return
        # any other inline-level node at top: treat children as paragraph
        r = runs(n, {})
        if any((('text' in x and x['text'].strip()) or ('link' in x) or ('image' in x)) for x in r):
            cur['blocks'].append({'block': 'p', 'runs': r})

    for c in root.k:
        emit(c)
    flush()

    data = {'title': title, 'subtitle': subtitle, 'sections': sections}
    ts = ('// Guardsmen Squad wiki article, extracted from settings/wiki/guardsmen_squad.html.\n'
          '// Regenerate: python3 scripts/extract-wiki-article.py\n'
          'export interface WikiRun {\n'
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
          '}\n'
          'export const guardsmenSquadArticle: { title: string; subtitle: string; sections: WikiSection[] } = ')
    ts += json.dumps(data, ensure_ascii=False, indent=2) + ';\n'
    open('src/wiki/guardsmenSquadData.ts', 'w').write(ts)
    n_blocks = sum(len(s['blocks']) for s in sections)
    print(f'sections: {len(sections)}, blocks: {n_blocks}, title: {title!r}')


if __name__ == '__main__':
    main()
