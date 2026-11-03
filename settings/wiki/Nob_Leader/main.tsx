import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Nob_LeaderArticle } from '../../../src/wiki/articles/Nob_LeaderData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Nob_LeaderArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Nob_LeaderArticle} />);
}
