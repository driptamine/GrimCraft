import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Brightlance_Grav_PlatformArticle } from '../../../src/wiki/articles/Brightlance_Grav_PlatformData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Brightlance_Grav_PlatformArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Brightlance_Grav_PlatformArticle} />);
}
