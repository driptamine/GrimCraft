import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { ChaosArticle } from '../../../src/wiki/articles/ChaosData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `ChaosArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={ChaosArticle} />);
}
