import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Reaver_JetbikeArticle } from '../../../src/wiki/articles/Reaver_JetbikeData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Reaver_JetbikeArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Reaver_JetbikeArticle} />);
}
