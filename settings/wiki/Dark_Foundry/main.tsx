import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Dark_FoundryArticle } from '../../../src/wiki/articles/Dark_FoundryData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Dark_FoundryArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Dark_FoundryArticle} />);
}
