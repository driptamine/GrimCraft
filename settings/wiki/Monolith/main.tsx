import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { MonolithArticle } from '../../../src/wiki/articles/MonolithData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `MonolithArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={MonolithArticle} />);
}
