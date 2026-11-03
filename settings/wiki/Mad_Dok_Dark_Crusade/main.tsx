import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Mad_Dok_Dark_CrusadeArticle } from '../../../src/wiki/articles/Mad_Dok_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Mad_Dok_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Mad_Dok_Dark_CrusadeArticle} />);
}
