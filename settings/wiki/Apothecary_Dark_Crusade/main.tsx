import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Apothecary_Dark_CrusadeArticle } from '../../../src/wiki/articles/Apothecary_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Apothecary_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Apothecary_Dark_CrusadeArticle} />);
}
