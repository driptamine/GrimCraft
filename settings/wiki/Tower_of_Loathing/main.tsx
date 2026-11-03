import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Tower_of_LoathingArticle } from '../../../src/wiki/articles/Tower_of_LoathingData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Tower_of_LoathingArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Tower_of_LoathingArticle} />);
}
