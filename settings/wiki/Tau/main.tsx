import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { TauArticle } from '../../../src/wiki/articles/TauData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `TauArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={TauArticle} />);
}
