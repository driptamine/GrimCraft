import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Machine_CultArticle } from '../../../src/wiki/articles/Machine_CultData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Machine_CultArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Machine_CultArticle} />);
}
