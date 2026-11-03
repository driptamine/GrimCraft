import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Warp_Beast_PackArticle } from '../../../src/wiki/articles/Warp_Beast_PackData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Warp_Beast_PackArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Warp_Beast_PackArticle} />);
}
