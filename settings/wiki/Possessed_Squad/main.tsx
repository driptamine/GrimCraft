import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Possessed_SquadArticle } from '../../../src/wiki/articles/Possessed_SquadData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Possessed_SquadArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Possessed_SquadArticle} />);
}
