import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Infantry_CommandArticle } from '../../../src/wiki/articles/Infantry_CommandData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Infantry_CommandArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Infantry_CommandArticle} />);
}
