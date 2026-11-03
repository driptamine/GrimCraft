import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Avatar_of_KhaineArticle } from '../../../src/wiki/articles/Avatar_of_KhaineData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Avatar_of_KhaineArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Avatar_of_KhaineArticle} />);
}
