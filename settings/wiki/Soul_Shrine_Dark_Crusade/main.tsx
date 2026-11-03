import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Soul_Shrine_Dark_CrusadeArticle } from '../../../src/wiki/articles/Soul_Shrine_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Soul_Shrine_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Soul_Shrine_Dark_CrusadeArticle} />);
}
