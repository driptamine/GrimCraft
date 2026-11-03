import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Sister_Repentia_SquadArticle } from '../../../src/wiki/articles/Sister_Repentia_SquadData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Sister_Repentia_SquadArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Sister_Repentia_SquadArticle} />);
}
