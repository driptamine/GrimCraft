import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { GuardsmenArticle } from '../../../src/wiki/articles/GuardsmenData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `GuardsmenArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={GuardsmenArticle} />);
}
