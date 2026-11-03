import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { ImmortalsArticle } from '../../../src/wiki/articles/ImmortalsData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `ImmortalsArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={ImmortalsArticle} />);
}
