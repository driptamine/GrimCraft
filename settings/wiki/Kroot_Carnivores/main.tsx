import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Kroot_CarnivoresArticle } from '../../../src/wiki/articles/Kroot_CarnivoresData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Kroot_CarnivoresArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Kroot_CarnivoresArticle} />);
}
