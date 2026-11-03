import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { OrkamungusArticle } from '../../../src/wiki/articles/OrkamungusData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `OrkamungusArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={OrkamungusArticle} />);
}
