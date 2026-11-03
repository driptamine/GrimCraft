import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Scourge_SquadArticle } from '../../../src/wiki/articles/Scourge_SquadData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Scourge_SquadArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Scourge_SquadArticle} />);
}
