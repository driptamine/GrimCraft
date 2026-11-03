import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Vespid_Stingwing_StrainArticle } from '../../../src/wiki/articles/Vespid_Stingwing_StrainData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Vespid_Stingwing_StrainArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Vespid_Stingwing_StrainArticle} />);
}
