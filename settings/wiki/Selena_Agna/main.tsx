import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Selena_AgnaArticle } from '../../../src/wiki/articles/Selena_AgnaData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Selena_AgnaArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Selena_AgnaArticle} />);
}
