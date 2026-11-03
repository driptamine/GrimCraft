import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Dark_Reaper_SquadArticle } from '../../../src/wiki/articles/Dark_Reaper_SquadData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Dark_Reaper_SquadArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Dark_Reaper_SquadArticle} />);
}
