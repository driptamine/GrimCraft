import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Seraphim_Veteran_SuperiorArticle } from '../../../src/wiki/articles/Seraphim_Veteran_SuperiorData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Seraphim_Veteran_SuperiorArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Seraphim_Veteran_SuperiorArticle} />);
}
