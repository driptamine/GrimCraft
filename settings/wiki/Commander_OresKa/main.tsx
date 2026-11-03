import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Commander_OresKaArticle } from '../../../src/wiki/articles/Commander_OresKaData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Commander_OresKaArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Commander_OresKaArticle} />);
}
