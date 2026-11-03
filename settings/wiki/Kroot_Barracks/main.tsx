import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Kroot_BarracksArticle } from '../../../src/wiki/articles/Kroot_BarracksData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Kroot_BarracksArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Kroot_BarracksArticle} />);
}
