import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Warrior_SquadArticle } from '../../../src/wiki/articles/Warrior_SquadData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Warrior_SquadArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Warrior_SquadArticle} />);
}
