import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Big_MekArticle } from '../../../src/wiki/articles/Big_MekData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Big_MekArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Big_MekArticle} />);
}
