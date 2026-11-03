import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Sisters_of_BattleArticle } from '../../../src/wiki/articles/Sisters_of_BattleData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Sisters_of_BattleArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Sisters_of_BattleArticle} />);
}
