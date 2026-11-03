import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Fire_Dragon_SquadArticle } from '../../../src/wiki/articles/Fire_Dragon_SquadData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Fire_Dragon_SquadArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Fire_Dragon_SquadArticle} />);
}
