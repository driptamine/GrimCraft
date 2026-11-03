import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Horror_SquadArticle } from '../../../src/wiki/articles/Horror_SquadData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Horror_SquadArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Horror_SquadArticle} />);
}
