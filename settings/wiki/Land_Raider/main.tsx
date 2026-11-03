import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Land_RaiderArticle } from '../../../src/wiki/articles/Land_RaiderData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Land_RaiderArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Land_RaiderArticle} />);
}
