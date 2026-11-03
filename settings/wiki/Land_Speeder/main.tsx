import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Land_SpeederArticle } from '../../../src/wiki/articles/Land_SpeederData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Land_SpeederArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Land_SpeederArticle} />);
}
