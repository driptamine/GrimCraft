import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { OrkArticle } from '../../../src/wiki/articles/OrkData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `OrkArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={OrkArticle} />);
}
