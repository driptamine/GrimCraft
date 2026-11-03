#!/usr/bin/env python3
"""Generate one directory page per wiki article: settings/wiki/<slug>/.

Each page mounts the shared React wiki viewer, which resolves the slug from
the URL path (case-insensitive via manifest). Guardsmen keeps its own page.
Usage: python3 scripts/generate-wiki-pages.py
"""
import json
import os
import re

DATA_RE = re.compile(r'= (\{.*\});\s*$', re.S)

def ident(slug):
    name = re.sub(r'[^A-Za-z0-9_]', '_', slug)
    if re.match(r'^[0-9]', name):
        name = '_' + name
    return name


def main_tsx(slug, export):
    return f"""import {{ createRoot }} from 'react-dom/client';
import {{ WikiArticlePage }} from '../../../src/wiki/article.jsx';
import {{ {export} }} from '../../../src/wiki/articles/{slug}Data.js';

const el = document.getElementById('wiki-root');
if (el) {{
  document.title = `{export}.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={{{export}}} />);
}}
"""

INDEX_HTML = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title} — Grimcraft Wiki</title>
</head>
<body>
<div id="wiki-root"></div>
<script type="module" src="./main.tsx"></script>
</body>
</html>
"""


def title_of(path):
    h = open(path, encoding='utf-8').read()
    m = DATA_RE.search(h)
    return json.loads(m.group(1)).get('title', '')


def main():
    made = 0
    for fname in sorted(os.listdir('src/wiki/articles')):
        if not fname.endswith('Data.ts'):
            continue
        slug = fname[:-len('Data.ts')]
        if slug == 'manifest':
            continue
        d = os.path.join('settings/wiki', slug)
        os.makedirs(d, exist_ok=True)
        title = title_of(os.path.join('src/wiki/articles', fname)) or slug.replace('_', ' ')
        with open(os.path.join(d, 'index.html'), 'w', encoding='utf-8') as f:
            f.write(INDEX_HTML.format(title=title.replace('&', '&amp;').replace('<', '&lt;')))
        with open(os.path.join(d, 'main.tsx'), 'w', encoding='utf-8') as f:
            f.write(main_tsx(slug, ident(slug) + 'Article'))
        made += 1
    print(f'wiki pages: {made}')


if __name__ == '__main__':
    main()
