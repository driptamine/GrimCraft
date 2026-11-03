import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Mandrake_SquadArticle } from '../../../src/wiki/articles/Mandrake_SquadData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Mandrake_SquadArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Mandrake_SquadArticle} />);
}
