import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { PriestArticle } from '../../../src/wiki/articles/PriestData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `PriestArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={PriestArticle} />);
}
