import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { ApothecaryArticle } from '../../../src/wiki/articles/ApothecaryData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `ApothecaryArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={ApothecaryArticle} />);
}
