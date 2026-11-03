import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Shaso_KaisArticle } from '../../../src/wiki/articles/Shaso_KaisData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Shaso_KaisArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Shaso_KaisArticle} />);
}
