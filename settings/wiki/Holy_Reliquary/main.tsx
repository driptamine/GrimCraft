import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Holy_ReliquaryArticle } from '../../../src/wiki/articles/Holy_ReliquaryData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Holy_ReliquaryArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Holy_ReliquaryArticle} />);
}
