import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { VyperArticle } from '../../../src/wiki/articles/VyperData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `VyperArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={VyperArticle} />);
}
