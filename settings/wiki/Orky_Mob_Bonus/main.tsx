import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Orky_Mob_BonusArticle } from '../../../src/wiki/articles/Orky_Mob_BonusData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Orky_Mob_BonusArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Orky_Mob_BonusArticle} />);
}
