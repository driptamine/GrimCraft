import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Da_Boyz_HutArticle } from '../../../src/wiki/articles/Da_Boyz_HutData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Da_Boyz_HutArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Da_Boyz_HutArticle} />);
}
