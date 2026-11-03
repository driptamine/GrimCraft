import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Farseer_CaerysArticle } from '../../../src/wiki/articles/Farseer_CaerysData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Farseer_CaerysArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Farseer_CaerysArticle} />);
}
