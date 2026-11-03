import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { LibrarianArticle } from '../../../src/wiki/articles/LibrarianData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `LibrarianArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={LibrarianArticle} />);
}
