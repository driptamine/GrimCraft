import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Archon_TahrilArticle } from '../../../src/wiki/articles/Archon_TahrilData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Archon_TahrilArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Archon_TahrilArticle} />);
}
