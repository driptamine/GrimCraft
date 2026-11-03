import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Kroot_ShaperArticle } from '../../../src/wiki/articles/Kroot_ShaperData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Kroot_ShaperArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Kroot_ShaperArticle} />);
}
