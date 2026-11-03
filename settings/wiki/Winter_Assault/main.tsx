import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Winter_AssaultArticle } from '../../../src/wiki/articles/Winter_AssaultData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Winter_AssaultArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Winter_AssaultArticle} />);
}
