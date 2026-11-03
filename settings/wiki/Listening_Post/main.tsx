import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Listening_PostArticle } from '../../../src/wiki/articles/Listening_PostData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Listening_PostArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Listening_PostArticle} />);
}
