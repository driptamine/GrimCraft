import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { TranjArticle } from '../../../src/wiki/articles/TranjData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `TranjArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={TranjArticle} />);
}
