import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Scout_Marine_Squad_Dark_CrusadeArticle } from '../../../src/wiki/articles/Scout_Marine_Squad_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Scout_Marine_Squad_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Scout_Marine_Squad_Dark_CrusadeArticle} />);
}
