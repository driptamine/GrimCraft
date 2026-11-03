import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Celestian_SquadArticle } from '../../../src/wiki/articles/Celestian_SquadData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Celestian_SquadArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Celestian_SquadArticle} />);
}
