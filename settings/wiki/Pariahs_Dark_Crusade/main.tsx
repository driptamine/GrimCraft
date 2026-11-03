import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Pariahs_Dark_CrusadeArticle } from '../../../src/wiki/articles/Pariahs_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Pariahs_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Pariahs_Dark_CrusadeArticle} />);
}
