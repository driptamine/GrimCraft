import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Firaeveus_CarronArticle } from '../../../src/wiki/articles/Firaeveus_CarronData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Firaeveus_CarronArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Firaeveus_CarronArticle} />);
}
