import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { THQArticle } from '../../../src/wiki/articles/THQData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `THQArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={THQArticle} />);
}
