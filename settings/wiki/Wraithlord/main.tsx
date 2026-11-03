import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { WraithlordArticle } from '../../../src/wiki/articles/WraithlordData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `WraithlordArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={WraithlordArticle} />);
}
