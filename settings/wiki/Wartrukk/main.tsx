import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { WartrukkArticle } from '../../../src/wiki/articles/WartrukkData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `WartrukkArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={WartrukkArticle} />);
}
