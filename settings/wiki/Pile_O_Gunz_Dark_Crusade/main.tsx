import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Pile_O_Gunz_Dark_CrusadeArticle } from '../../../src/wiki/articles/Pile_O_Gunz_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Pile_O_Gunz_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Pile_O_Gunz_Dark_CrusadeArticle} />);
}
