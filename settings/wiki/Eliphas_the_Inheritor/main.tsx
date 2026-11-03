import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Eliphas_the_InheritorArticle } from '../../../src/wiki/articles/Eliphas_the_InheritorData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Eliphas_the_InheritorArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Eliphas_the_InheritorArticle} />);
}
