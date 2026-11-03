import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Fire_PrismArticle } from '../../../src/wiki/articles/Fire_PrismData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Fire_PrismArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Fire_PrismArticle} />);
}
