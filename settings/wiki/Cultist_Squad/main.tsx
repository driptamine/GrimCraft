import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Cultist_SquadArticle } from '../../../src/wiki/articles/Cultist_SquadData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Cultist_SquadArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Cultist_SquadArticle} />);
}
