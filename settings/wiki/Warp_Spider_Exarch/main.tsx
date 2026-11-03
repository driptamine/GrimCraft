import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Warp_Spider_ExarchArticle } from '../../../src/wiki/articles/Warp_Spider_ExarchData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Warp_Spider_ExarchArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Warp_Spider_ExarchArticle} />);
}
