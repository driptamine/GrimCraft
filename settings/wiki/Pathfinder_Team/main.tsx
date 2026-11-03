import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Pathfinder_TeamArticle } from '../../../src/wiki/articles/Pathfinder_TeamData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Pathfinder_TeamArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Pathfinder_TeamArticle} />);
}
