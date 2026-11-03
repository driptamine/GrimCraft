import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { BarracudaArticle } from '../../../src/wiki/articles/BarracudaData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `BarracudaArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={BarracudaArticle} />);
}
