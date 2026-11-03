import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Sentinel_Dark_CrusadeArticle } from '../../../src/wiki/articles/Sentinel_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Sentinel_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Sentinel_Dark_CrusadeArticle} />);
}
