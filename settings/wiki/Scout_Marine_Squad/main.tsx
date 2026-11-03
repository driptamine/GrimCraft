import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Scout_Marine_SquadArticle } from '../../../src/wiki/articles/Scout_Marine_SquadData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Scout_Marine_SquadArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Scout_Marine_SquadArticle} />);
}
