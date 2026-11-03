import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Vance_StubbsArticle } from '../../../src/wiki/articles/Vance_StubbsData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Vance_StubbsArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Vance_StubbsArticle} />);
}
