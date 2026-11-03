import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Wych_Cult_ArenaArticle } from '../../../src/wiki/articles/Wych-Cult_ArenaData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Wych_Cult_ArenaArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Wych_Cult_ArenaArticle} />);
}
