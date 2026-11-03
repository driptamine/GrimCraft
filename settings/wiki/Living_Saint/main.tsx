import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Living_SaintArticle } from '../../../src/wiki/articles/Living_SaintData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Living_SaintArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Living_SaintArticle} />);
}
