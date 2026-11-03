import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Kroot_Shaping_CenterArticle } from '../../../src/wiki/articles/Kroot_Shaping_CenterData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Kroot_Shaping_CenterArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Kroot_Shaping_CenterArticle} />);
}
