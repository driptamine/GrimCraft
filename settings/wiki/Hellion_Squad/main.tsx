import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Hellion_SquadArticle } from '../../../src/wiki/articles/Hellion_SquadData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Hellion_SquadArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Hellion_SquadArticle} />);
}
