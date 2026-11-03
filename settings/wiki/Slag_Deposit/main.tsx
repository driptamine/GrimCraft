import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Slag_DepositArticle } from '../../../src/wiki/articles/Slag_DepositData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Slag_DepositArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Slag_DepositArticle} />);
}
