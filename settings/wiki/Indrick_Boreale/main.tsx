import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Indrick_BorealeArticle } from '../../../src/wiki/articles/Indrick_BorealeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Indrick_BorealeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Indrick_BorealeArticle} />);
}
