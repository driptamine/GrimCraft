import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Dark_EldarArticle } from '../../../src/wiki/articles/Dark_EldarData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Dark_EldarArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Dark_EldarArticle} />);
}
