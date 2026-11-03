import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { CommissarArticle } from '../../../src/wiki/articles/CommissarData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `CommissarArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={CommissarArticle} />);
}
