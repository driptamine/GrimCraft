import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { MachaArticle } from '../../../src/wiki/articles/MachaData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `MachaArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={MachaArticle} />);
}
