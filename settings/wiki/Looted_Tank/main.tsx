import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Looted_TankArticle } from '../../../src/wiki/articles/Looted_TankData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Looted_TankArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Looted_TankArticle} />);
}
