import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Guardian_SquadsArticle } from '../../../src/wiki/articles/Guardian_SquadsData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Guardian_SquadsArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Guardian_SquadsArticle} />);
}
