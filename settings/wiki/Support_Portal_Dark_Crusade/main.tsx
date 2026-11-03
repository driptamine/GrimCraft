import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Support_Portal_Dark_CrusadeArticle } from '../../../src/wiki/articles/Support_Portal_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Support_Portal_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Support_Portal_Dark_CrusadeArticle} />);
}
