import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Obelisk_Dark_CrusadeArticle } from '../../../src/wiki/articles/Obelisk_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Obelisk_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Obelisk_Dark_CrusadeArticle} />);
}
