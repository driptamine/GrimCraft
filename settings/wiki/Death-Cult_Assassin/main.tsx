import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Death_Cult_AssassinArticle } from '../../../src/wiki/articles/Death-Cult_AssassinData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Death_Cult_AssassinArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Death_Cult_AssassinArticle} />);
}
