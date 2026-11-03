import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { BaleArticle } from '../../../src/wiki/articles/BaleData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `BaleArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={BaleArticle} />);
}
