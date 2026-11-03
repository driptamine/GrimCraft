import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { _2006Article } from '../../../src/wiki/articles/2006Data.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `_2006Article.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={_2006Article} />);
}
