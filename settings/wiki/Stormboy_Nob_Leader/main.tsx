import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Stormboy_Nob_LeaderArticle } from '../../../src/wiki/articles/Stormboy_Nob_LeaderData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Stormboy_Nob_LeaderArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Stormboy_Nob_LeaderArticle} />);
}
