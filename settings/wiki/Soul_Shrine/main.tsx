import { createRoot } from 'react-dom/client';
import { WikiArticlePage } from '../../../src/wiki/article.jsx';
import { Soul_ShrineArticle } from '../../../src/wiki/articles/Soul_ShrineData.js';

const el = document.getElementById('wiki-root');
if (el) {
  document.title = `Soul_ShrineArticle.title — Grimcraft Wiki`;
  createRoot(el).render(<WikiArticlePage article={Soul_ShrineArticle} />);
}
