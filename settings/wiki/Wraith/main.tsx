import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { WraithArticle } from '../../../src/wiki/articles/WraithData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `WraithArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={WraithArticle} />);
}
