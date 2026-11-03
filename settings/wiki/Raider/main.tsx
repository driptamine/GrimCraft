import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { RaiderArticle } from '../../../src/wiki/articles/RaiderData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `RaiderArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={RaiderArticle} />);
}
