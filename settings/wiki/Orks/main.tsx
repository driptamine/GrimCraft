import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { OrksArticle } from '../../../src/wiki/articles/OrksData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `OrksArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={OrksArticle} />);
}
