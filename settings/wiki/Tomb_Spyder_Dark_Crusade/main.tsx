import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Tomb_Spyder_Dark_CrusadeArticle } from '../../../src/wiki/articles/Tomb_Spyder_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Tomb_Spyder_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Tomb_Spyder_Dark_CrusadeArticle} />);
}
