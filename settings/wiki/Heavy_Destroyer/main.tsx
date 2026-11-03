import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Heavy_DestroyerArticle } from '../../../src/wiki/articles/Heavy_DestroyerData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Heavy_DestroyerArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Heavy_DestroyerArticle} />);
}
