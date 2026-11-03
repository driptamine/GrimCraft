import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Path_to_EnlightenmentArticle } from '../../../src/wiki/articles/Path_to_EnlightenmentData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Path_to_EnlightenmentArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Path_to_EnlightenmentArticle} />);
}
