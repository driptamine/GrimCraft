import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Dark_Reaper_ExarchArticle } from '../../../src/wiki/articles/Dark_Reaper_ExarchData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Dark_Reaper_ExarchArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Dark_Reaper_ExarchArticle} />);
}
