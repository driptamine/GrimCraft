import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { NobzArticle } from '../../../src/wiki/articles/NobzData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `NobzArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={NobzArticle} />);
}
