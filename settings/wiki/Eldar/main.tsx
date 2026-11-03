import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { EldarArticle } from '../../../src/wiki/articles/EldarData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `EldarArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={EldarArticle} />);
}
