import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Ecclesiarchal_ChapelArticle } from '../../../src/wiki/articles/Ecclesiarchal_ChapelData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Ecclesiarchal_ChapelArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Ecclesiarchal_ChapelArticle} />);
}
