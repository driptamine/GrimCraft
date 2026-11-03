import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Baneblade_Dark_CrusadeArticle } from '../../../src/wiki/articles/Baneblade_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Baneblade_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Baneblade_Dark_CrusadeArticle} />);
}
