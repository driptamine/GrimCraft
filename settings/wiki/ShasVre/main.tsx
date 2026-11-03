import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { ShasVreArticle } from '../../../src/wiki/articles/ShasVreData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `ShasVreArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={ShasVreArticle} />);
}
