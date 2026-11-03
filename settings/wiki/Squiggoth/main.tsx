import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { SquiggothArticle } from '../../../src/wiki/articles/SquiggothData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `SquiggothArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={SquiggothArticle} />);
}
