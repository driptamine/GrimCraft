import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { PariahsArticle } from '../../../src/wiki/articles/PariahsData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `PariahsArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={PariahsArticle} />);
}
