import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Listening_Post_Space_MarinesArticle } from '../../../src/wiki/articles/Listening_Post_Space_MarinesData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Listening_Post_Space_MarinesArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Listening_Post_Space_MarinesArticle} />);
}
