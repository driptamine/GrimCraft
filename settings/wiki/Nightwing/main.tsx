import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { NightwingArticle } from '../../../src/wiki/articles/NightwingData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `NightwingArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={NightwingArticle} />);
}
