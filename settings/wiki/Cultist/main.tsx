import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { CultistArticle } from '../../../src/wiki/articles/CultistData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `CultistArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={CultistArticle} />);
}
