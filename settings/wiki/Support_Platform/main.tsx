import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Support_PlatformArticle } from '../../../src/wiki/articles/Support_PlatformData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Support_PlatformArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Support_PlatformArticle} />);
}
