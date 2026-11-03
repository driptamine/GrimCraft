import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { GretchinArticle } from '../../../src/wiki/articles/GretchinData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `GretchinArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={GretchinArticle} />);
}
