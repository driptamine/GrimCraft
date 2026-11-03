import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Fire_DragonArticle } from '../../../src/wiki/articles/Fire_DragonData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Fire_DragonArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Fire_DragonArticle} />);
}
