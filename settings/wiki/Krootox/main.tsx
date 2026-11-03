import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { KrootoxArticle } from '../../../src/wiki/articles/KrootoxData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `KrootoxArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={KrootoxArticle} />);
}
