import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { RelicArticle } from '../../../src/wiki/articles/RelicData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `RelicArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={RelicArticle} />);
}
