import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Kroot_Shaper_Dark_CrusadeArticle } from '../../../src/wiki/articles/Kroot_Shaper_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Kroot_Shaper_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Kroot_Shaper_Dark_CrusadeArticle} />);
}
