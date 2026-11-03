import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Kroot_HoundsArticle } from '../../../src/wiki/articles/Kroot_HoundsData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Kroot_HoundsArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Kroot_HoundsArticle} />);
}
