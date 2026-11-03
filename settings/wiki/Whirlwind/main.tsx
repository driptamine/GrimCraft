import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { WhirlwindArticle } from '../../../src/wiki/articles/WhirlwindData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `WhirlwindArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={WhirlwindArticle} />);
}
