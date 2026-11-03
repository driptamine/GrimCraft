import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Psyker___Command_SquadArticle } from '../../../src/wiki/articles/Psyker_-_Command_SquadData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Psyker___Command_SquadArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Psyker___Command_SquadArticle} />);
}
