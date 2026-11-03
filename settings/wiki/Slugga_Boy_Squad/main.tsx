import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Slugga_Boy_SquadArticle } from '../../../src/wiki/articles/Slugga_Boy_SquadData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Slugga_Boy_SquadArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Slugga_Boy_SquadArticle} />);
}
