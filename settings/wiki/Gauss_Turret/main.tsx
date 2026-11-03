import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Gauss_TurretArticle } from '../../../src/wiki/articles/Gauss_TurretData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Gauss_TurretArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Gauss_TurretArticle} />);
}
