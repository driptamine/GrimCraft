import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Plasma_Generator_Sisters_of_BattleArticle } from '../../../src/wiki/articles/Plasma_Generator_Sisters_of_BattleData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Plasma_Generator_Sisters_of_BattleArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Plasma_Generator_Sisters_of_BattleArticle} />);
}
