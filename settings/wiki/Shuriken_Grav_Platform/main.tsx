import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Shuriken_Grav_PlatformArticle } from '../../../src/wiki/articles/Shuriken_Grav_PlatformData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Shuriken_Grav_PlatformArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Shuriken_Grav_PlatformArticle} />);
}
