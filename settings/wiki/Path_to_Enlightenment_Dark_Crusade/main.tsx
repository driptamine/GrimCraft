import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Path_to_Enlightenment_Dark_CrusadeArticle } from '../../../src/wiki/articles/Path_to_Enlightenment_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Path_to_Enlightenment_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Path_to_Enlightenment_Dark_CrusadeArticle} />);
}
