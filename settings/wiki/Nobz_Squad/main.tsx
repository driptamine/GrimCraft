import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Nobz_SquadArticle } from '../../../src/wiki/articles/Nobz_SquadData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Nobz_SquadArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Nobz_SquadArticle} />);
}
