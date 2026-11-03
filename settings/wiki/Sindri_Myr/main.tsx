import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Sindri_MyrArticle } from '../../../src/wiki/articles/Sindri_MyrData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Sindri_MyrArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Sindri_MyrArticle} />);
}
