import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { CanonessArticle } from '../../../src/wiki/articles/CanonessData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `CanonessArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={CanonessArticle} />);
}
