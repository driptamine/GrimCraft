import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { ConfessorArticle } from '../../../src/wiki/articles/ConfessorData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `ConfessorArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={ConfessorArticle} />);
}
