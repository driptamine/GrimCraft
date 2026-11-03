import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { ServitorArticle } from '../../../src/wiki/articles/ServitorData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `ServitorArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={ServitorArticle} />);
}
