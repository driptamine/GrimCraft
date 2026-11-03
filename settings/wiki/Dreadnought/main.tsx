import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { DreadnoughtArticle } from '../../../src/wiki/articles/DreadnoughtData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `DreadnoughtArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={DreadnoughtArticle} />);
}
