import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Fire_WarriorsArticle } from '../../../src/wiki/articles/Fire_WarriorsData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Fire_WarriorsArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Fire_WarriorsArticle} />);
}
