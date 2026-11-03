import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { ShasVre_Dark_CrusadeArticle } from '../../../src/wiki/articles/ShasVre_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `ShasVre_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={ShasVre_Dark_CrusadeArticle} />);
}
