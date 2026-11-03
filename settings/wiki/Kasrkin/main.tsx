import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { KasrkinArticle } from '../../../src/wiki/articles/KasrkinData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `KasrkinArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={KasrkinArticle} />);
}
