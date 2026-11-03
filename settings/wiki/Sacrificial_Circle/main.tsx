import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Sacrificial_CircleArticle } from '../../../src/wiki/articles/Sacrificial_CircleData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Sacrificial_CircleArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Sacrificial_CircleArticle} />);
}
