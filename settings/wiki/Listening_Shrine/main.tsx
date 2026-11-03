import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Listening_ShrineArticle } from '../../../src/wiki/articles/Listening_ShrineData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Listening_ShrineArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Listening_ShrineArticle} />);
}
