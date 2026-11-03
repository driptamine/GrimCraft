import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Celestian_Veteran_SuperiorArticle } from '../../../src/wiki/articles/Celestian_Veteran_SuperiorData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Celestian_Veteran_SuperiorArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Celestian_Veteran_SuperiorArticle} />);
}
