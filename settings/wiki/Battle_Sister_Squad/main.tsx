import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Battle_Sister_SquadArticle } from '../../../src/wiki/articles/Battle_Sister_SquadData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Battle_Sister_SquadArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Battle_Sister_SquadArticle} />);
}
