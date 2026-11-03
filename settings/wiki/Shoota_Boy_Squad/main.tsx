import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Shoota_Boy_SquadArticle } from '../../../src/wiki/articles/Shoota_Boy_SquadData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Shoota_Boy_SquadArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Shoota_Boy_SquadArticle} />);
}
