import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Coalition_CenterArticle } from '../../../src/wiki/articles/Coalition_CenterData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Coalition_CenterArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Coalition_CenterArticle} />);
}
