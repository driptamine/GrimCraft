import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { BasiliskArticle } from '../../../src/wiki/articles/BasiliskData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `BasiliskArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={BasiliskArticle} />);
}
