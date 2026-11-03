import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Flash_GitzArticle } from '../../../src/wiki/articles/Flash_GitzData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Flash_GitzArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Flash_GitzArticle} />);
}
