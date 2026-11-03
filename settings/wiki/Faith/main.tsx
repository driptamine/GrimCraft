import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { FaithArticle } from '../../../src/wiki/articles/FaithData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `FaithArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={FaithArticle} />);
}
