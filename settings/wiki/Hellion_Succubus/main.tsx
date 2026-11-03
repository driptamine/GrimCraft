import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Hellion_SuccubusArticle } from '../../../src/wiki/articles/Hellion_SuccubusData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Hellion_SuccubusArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Hellion_SuccubusArticle} />);
}
