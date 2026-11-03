import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { HellhoundArticle } from '../../../src/wiki/articles/HellhoundData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `HellhoundArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={HellhoundArticle} />);
}
