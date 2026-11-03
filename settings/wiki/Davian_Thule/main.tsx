import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Davian_ThuleArticle } from '../../../src/wiki/articles/Davian_ThuleData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Davian_ThuleArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Davian_ThuleArticle} />);
}
