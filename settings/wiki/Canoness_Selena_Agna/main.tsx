import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Canoness_Selena_AgnaArticle } from '../../../src/wiki/articles/Canoness_Selena_AgnaData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Canoness_Selena_AgnaArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Canoness_Selena_AgnaArticle} />);
}
