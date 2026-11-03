import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { ShasUi_Dark_CrusadeArticle } from '../../../src/wiki/articles/ShasUi_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `ShasUi_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={ShasUi_Dark_CrusadeArticle} />);
}
