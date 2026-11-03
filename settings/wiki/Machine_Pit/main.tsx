import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Machine_PitArticle } from '../../../src/wiki/articles/Machine_PitData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Machine_PitArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Machine_PitArticle} />);
}
