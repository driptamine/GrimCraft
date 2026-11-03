import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Imperial_GuardArticle } from '../../../src/wiki/articles/Imperial_GuardData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Imperial_GuardArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Imperial_GuardArticle} />);
}
