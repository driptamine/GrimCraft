import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Listening_Post_Imperial_Guard_Dark_CrusadeArticle } from '../../../src/wiki/articles/Listening_Post_Imperial_Guard_Dark_CrusadeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Listening_Post_Imperial_Guard_Dark_CrusadeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Listening_Post_Imperial_Guard_Dark_CrusadeArticle} />);
}
