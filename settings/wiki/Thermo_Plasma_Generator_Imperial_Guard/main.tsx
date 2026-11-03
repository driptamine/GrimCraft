import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Thermo_Plasma_Generator_Imperial_GuardArticle } from '../../../src/wiki/articles/Thermo_Plasma_Generator_Imperial_GuardData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Thermo_Plasma_Generator_Imperial_GuardArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Thermo_Plasma_Generator_Imperial_GuardArticle} />);
}
