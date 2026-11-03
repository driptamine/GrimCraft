import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { FarseerArticle } from '../../../src/wiki/articles/FarseerData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `FarseerArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={FarseerArticle} />);
}
