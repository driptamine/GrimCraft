import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Dormant_Monolith_Dark_CrusadeArticle } from '../../../src/wiki/articles/Dormant_Monolith_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Dormant_Monolith_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Dormant_Monolith_Dark_CrusadeArticle} />);
}
