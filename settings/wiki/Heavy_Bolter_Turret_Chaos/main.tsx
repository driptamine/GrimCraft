import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Heavy_Bolter_Turret_ChaosArticle } from '../../../src/wiki/articles/Heavy_Bolter_Turret_ChaosData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Heavy_Bolter_Turret_ChaosArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Heavy_Bolter_Turret_ChaosArticle} />);
}
