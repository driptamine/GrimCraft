import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Aspiring_Champion_Dark_CrusadeArticle } from '../../../src/wiki/articles/Aspiring_Champion_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Aspiring_Champion_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Aspiring_Champion_Dark_CrusadeArticle} />);
}
