import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Command_SquadArticle } from '../../../src/wiki/articles/Command_SquadData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Command_SquadArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Command_SquadArticle} />);
}
