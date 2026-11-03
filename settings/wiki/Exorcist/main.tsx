import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { ExorcistArticle } from '../../../src/wiki/articles/ExorcistData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `ExorcistArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={ExorcistArticle} />);
}
