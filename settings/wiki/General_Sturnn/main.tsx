import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { General_SturnnArticle } from '../../../src/wiki/articles/General_SturnnData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `General_SturnnArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={General_SturnnArticle} />);
}
