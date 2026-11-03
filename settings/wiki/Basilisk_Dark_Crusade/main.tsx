import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Basilisk_Dark_CrusadeArticle } from '../../../src/wiki/articles/Basilisk_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Basilisk_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Basilisk_Dark_CrusadeArticle} />);
}
