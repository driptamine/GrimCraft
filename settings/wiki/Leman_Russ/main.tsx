import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Leman_RussArticle } from '../../../src/wiki/articles/Leman_RussData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Leman_RussArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Leman_RussArticle} />);
}
