import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { BanebladeArticle } from '../../../src/wiki/articles/BanebladeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `BanebladeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={BanebladeArticle} />);
}
