import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Veteran_SuperiorArticle } from '../../../src/wiki/articles/Veteran_SuperiorData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Veteran_SuperiorArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Veteran_SuperiorArticle} />);
}
