import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Inferno_TurretArticle } from '../../../src/wiki/articles/Inferno_TurretData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Inferno_TurretArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Inferno_TurretArticle} />);
}
