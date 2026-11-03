import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Tortured_SlaveArticle } from '../../../src/wiki/articles/Tortured_SlaveData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Tortured_SlaveArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Tortured_SlaveArticle} />);
}
