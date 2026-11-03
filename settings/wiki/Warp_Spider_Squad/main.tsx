import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Warp_Spider_SquadArticle } from '../../../src/wiki/articles/Warp_Spider_SquadData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Warp_Spider_SquadArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Warp_Spider_SquadArticle} />);
}
