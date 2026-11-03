import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { DPSArticle } from '../../../src/wiki/articles/DPSData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `DPSArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={DPSArticle} />);
}
