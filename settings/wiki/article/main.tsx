import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { wikiArticleFiles } from '../../../src/wiki/articles/manifest.js';

const SAFE_SLUG = /^[A-Za-z0-9_.\-']+$/;

async function boot(): Promise<void> {
  const el = document.getElementById('wiki-root');
  if (!el) {
    return;
  }
  const root = createRoot(el);
  const slug = new URLSearchParams(window.location.search).get('page') || '';
  const file = SAFE_SLUG.test(slug) ? wikiArticleFiles[slug.toLowerCase()] : undefined;
  if (!file) {
    root.render(<WikiArticlePage article={{ title: 'Unknown article', subtitle: '', sections: [] }} />);
    return;
  }
  try {
    const mod = await import(`../../../src/wiki/articles/${file}Data.js`);
    const key = Object.keys(mod).find((k) => k.endsWith('Article'));
    if (!key) {
      throw new Error('no article export');
    }
    root.render(<WikiArticlePage article={mod[key]} />);
  } catch (_) {
    root.render(
      <WikiArticlePage
        article={{ title: slug.replace(/_/g, ' '), subtitle: '', sections: [] }}
        footer="This article has not been mirrored yet."
      />,
    );
  }
}

void boot();
