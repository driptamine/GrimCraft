import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Wych_SuccubusArticle } from '../../../src/wiki/articles/Wych_SuccubusData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Wych_SuccubusArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Wych_SuccubusArticle} />);
}
