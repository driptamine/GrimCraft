import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { ObeliskArticle } from '../../../src/wiki/articles/ObeliskData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `ObeliskArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={ObeliskArticle} />);
}
