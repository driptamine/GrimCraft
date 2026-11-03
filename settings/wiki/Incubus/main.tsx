import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { IncubusArticle } from '../../../src/wiki/articles/IncubusData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `IncubusArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={IncubusArticle} />);
}
