import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { General_Vance_StubbsArticle } from '../../../src/wiki/articles/General_Vance_StubbsData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `General_Vance_StubbsArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={General_Vance_StubbsArticle} />);
}
