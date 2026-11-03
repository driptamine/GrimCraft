import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Raptor_SquadArticle } from '../../../src/wiki/articles/Raptor_SquadData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Raptor_SquadArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Raptor_SquadArticle} />);
}
