import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { OgrynsArticle } from '../../../src/wiki/articles/OgrynsData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `OgrynsArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={OgrynsArticle} />);
}
