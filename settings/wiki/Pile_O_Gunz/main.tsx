import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Pile_O_GunzArticle } from '../../../src/wiki/articles/Pile_O_GunzData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Pile_O_GunzArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Pile_O_GunzArticle} />);
}
