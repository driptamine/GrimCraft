import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Terminator_SquadArticle } from '../../../src/wiki/articles/Terminator_SquadData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Terminator_SquadArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Terminator_SquadArticle} />);
}
