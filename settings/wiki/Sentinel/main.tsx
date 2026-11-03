import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { SentinelArticle } from '../../../src/wiki/articles/SentinelData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `SentinelArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={SentinelArticle} />);
}
