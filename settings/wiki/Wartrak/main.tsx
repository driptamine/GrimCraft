import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { WartrakArticle } from '../../../src/wiki/articles/WartrakData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `WartrakArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={WartrakArticle} />);
}
