import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Priest___Command_SquadArticle } from '../../../src/wiki/articles/Priest_-_Command_SquadData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Priest___Command_SquadArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Priest___Command_SquadArticle} />);
}
