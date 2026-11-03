import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Vehicle_Beacon_Dark_CrusadeArticle } from '../../../src/wiki/articles/Vehicle_Beacon_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Vehicle_Beacon_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Vehicle_Beacon_Dark_CrusadeArticle} />);
}
