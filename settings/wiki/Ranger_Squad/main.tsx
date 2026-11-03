import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Ranger_SquadArticle } from '../../../src/wiki/articles/Ranger_SquadData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Ranger_SquadArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Ranger_SquadArticle} />);
}
