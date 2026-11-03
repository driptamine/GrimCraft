import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Titan_DominatusArticle } from '../../../src/wiki/articles/Titan_DominatusData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Titan_DominatusArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Titan_DominatusArticle} />);
}
