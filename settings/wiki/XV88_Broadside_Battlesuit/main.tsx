import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { XV88_Broadside_BattlesuitArticle } from '../../../src/wiki/articles/XV88_Broadside_BattlesuitData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `XV88_Broadside_BattlesuitArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={XV88_Broadside_BattlesuitArticle} />);
}
