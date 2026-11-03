import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Dark_ReapersArticle } from '../../../src/wiki/articles/Dark_ReapersData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Dark_ReapersArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Dark_ReapersArticle} />);
}
