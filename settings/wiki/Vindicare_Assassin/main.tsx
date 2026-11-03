import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Vindicare_AssassinArticle } from '../../../src/wiki/articles/Vindicare_AssassinData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Vindicare_AssassinArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Vindicare_AssassinArticle} />);
}
