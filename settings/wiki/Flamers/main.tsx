import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { FlamersArticle } from '../../../src/wiki/articles/FlamersData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `FlamersArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={FlamersArticle} />);
}
