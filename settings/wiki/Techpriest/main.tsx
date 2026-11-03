import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { TechpriestArticle } from '../../../src/wiki/articles/TechpriestData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `TechpriestArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={TechpriestArticle} />);
}
