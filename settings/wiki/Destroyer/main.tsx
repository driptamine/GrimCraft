import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { DestroyerArticle } from '../../../src/wiki/articles/DestroyerData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `DestroyerArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={DestroyerArticle} />);
}
