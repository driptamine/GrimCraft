import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Heavy_Bolter_Turret_Imperial_GuardArticle } from '../../../src/wiki/articles/Heavy_Bolter_Turret_Imperial_GuardData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Heavy_Bolter_Turret_Imperial_GuardArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Heavy_Bolter_Turret_Imperial_GuardArticle} />);
}
