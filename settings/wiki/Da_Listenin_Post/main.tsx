import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Da_Listenin_PostArticle } from '../../../src/wiki/articles/Da_Listenin_PostData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Da_Listenin_PostArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Da_Listenin_PostArticle} />);
}
