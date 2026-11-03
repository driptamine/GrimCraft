import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Ecclesiarchal_ServitorArticle } from '../../../src/wiki/articles/Ecclesiarchal_ServitorData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Ecclesiarchal_ServitorArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Ecclesiarchal_ServitorArticle} />);
}
