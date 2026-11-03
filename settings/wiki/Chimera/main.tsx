import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { ChimeraArticle } from '../../../src/wiki/articles/ChimeraData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `ChimeraArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={ChimeraArticle} />);
}
