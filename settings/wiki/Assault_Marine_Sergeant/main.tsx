import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Assault_Marine_SergeantArticle } from '../../../src/wiki/articles/Assault_Marine_SergeantData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Assault_Marine_SergeantArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Assault_Marine_SergeantArticle} />);
}
