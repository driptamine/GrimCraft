import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { ObliteratorsArticle } from '../../../src/wiki/articles/ObliteratorsData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `ObliteratorsArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={ObliteratorsArticle} />);
}
