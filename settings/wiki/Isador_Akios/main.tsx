import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Isador_AkiosArticle } from '../../../src/wiki/articles/Isador_AkiosData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Isador_AkiosArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Isador_AkiosArticle} />);
}
