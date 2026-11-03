import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { RavagerArticle } from '../../../src/wiki/articles/RavagerData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `RavagerArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={RavagerArticle} />);
}
