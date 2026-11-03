import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Space_Marine_Squad_Dark_CrusadeArticle } from '../../../src/wiki/articles/Space_Marine_Squad_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Space_Marine_Squad_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Space_Marine_Squad_Dark_CrusadeArticle} />);
}
