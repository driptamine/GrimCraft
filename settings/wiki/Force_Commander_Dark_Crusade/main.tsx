import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Force_Commander_Dark_CrusadeArticle } from '../../../src/wiki/articles/Force_Commander_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Force_Commander_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Force_Commander_Dark_CrusadeArticle} />);
}
