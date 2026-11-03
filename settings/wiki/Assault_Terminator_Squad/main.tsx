import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Assault_Terminator_SquadArticle } from '../../../src/wiki/articles/Assault_Terminator_SquadData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Assault_Terminator_SquadArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Assault_Terminator_SquadArticle} />);
}
