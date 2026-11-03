import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Ork_SettlementArticle } from '../../../src/wiki/articles/Ork_SettlementData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Ork_SettlementArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Ork_SettlementArticle} />);
}
