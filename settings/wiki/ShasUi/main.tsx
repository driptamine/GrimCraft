import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { ShasUiArticle } from '../../../src/wiki/articles/ShasUiData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `ShasUiArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={ShasUiArticle} />);
}
