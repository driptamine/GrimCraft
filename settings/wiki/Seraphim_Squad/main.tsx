import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Seraphim_SquadArticle } from '../../../src/wiki/articles/Seraphim_SquadData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Seraphim_SquadArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Seraphim_SquadArticle} />);
}
