import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Summoning_Core_Dark_CrusadeArticle } from '../../../src/wiki/articles/Summoning_Core_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Summoning_Core_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Summoning_Core_Dark_CrusadeArticle} />);
}
