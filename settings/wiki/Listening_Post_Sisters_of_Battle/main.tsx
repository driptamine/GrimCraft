import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Listening_Post_Sisters_of_BattleArticle } from '../../../src/wiki/articles/Listening_Post_Sisters_of_BattleData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Listening_Post_Sisters_of_BattleArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Listening_Post_Sisters_of_BattleArticle} />);
}
