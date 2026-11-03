import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Mordecai_TothArticle } from '../../../src/wiki/articles/Mordecai_TothData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Mordecai_TothArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Mordecai_TothArticle} />);
}
