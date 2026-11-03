import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Farseer_TaldeerArticle } from '../../../src/wiki/articles/Farseer_TaldeerData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Farseer_TaldeerArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Farseer_TaldeerArticle} />);
}
