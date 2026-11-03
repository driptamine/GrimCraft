import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { HarlequinArticle } from '../../../src/wiki/articles/HarlequinData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `HarlequinArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={HarlequinArticle} />);
}
