import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Wych_SquadArticle } from '../../../src/wiki/articles/Wych_SquadData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Wych_SquadArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Wych_SquadArticle} />);
}
