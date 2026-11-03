import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Falcon_Grav_TankArticle } from '../../../src/wiki/articles/Falcon_Grav_TankData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Falcon_Grav_TankArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Falcon_Grav_TankArticle} />);
}
