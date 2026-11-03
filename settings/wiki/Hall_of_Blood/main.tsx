import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Hall_of_BloodArticle } from '../../../src/wiki/articles/Hall_of_BloodData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Hall_of_BloodArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Hall_of_BloodArticle} />);
}
