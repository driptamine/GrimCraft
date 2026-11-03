import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Commissar___Command_SquadArticle } from '../../../src/wiki/articles/Commissar_-_Command_SquadData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Commissar___Command_SquadArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Commissar___Command_SquadArticle} />);
}
