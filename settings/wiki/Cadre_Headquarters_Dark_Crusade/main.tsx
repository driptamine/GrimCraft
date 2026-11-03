import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Cadre_Headquarters_Dark_CrusadeArticle } from '../../../src/wiki/articles/Cadre_Headquarters_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Cadre_Headquarters_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Cadre_Headquarters_Dark_CrusadeArticle} />);
}
