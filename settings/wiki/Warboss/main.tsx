import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { WarbossArticle } from '../../../src/wiki/articles/WarbossData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `WarbossArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={WarbossArticle} />);
}
