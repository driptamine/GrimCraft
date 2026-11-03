import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Machine_Cult_Dark_CrusadeArticle } from '../../../src/wiki/articles/Machine_Cult_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Machine_Cult_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Machine_Cult_Dark_CrusadeArticle} />);
}
